require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const sharp = require('sharp');
const { z } = require('zod');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json({ limit: '15mb' }));

// --- CONFIG ---
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const ADMIN_KEY = process.env.ADMIN_KEY || 'mithila2026';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-change-me';
const JWT_EXPIRY = '12h';

// Hash the admin key once at startup so comparison is constant-time
const ADMIN_KEY_HASH = bcrypt.hashSync(ADMIN_KEY, 10);

// --- RATE LIMITERS ---
const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests. Please slow down.' }
});

const orderLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many orders from this address. Please wait a while.' }
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many login attempts. Please try again in 15 minutes.' }
});

app.use('/api/', publicLimiter);

// --- VALIDATION HELPER ---
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: result.error.flatten().fieldErrors
        });
    }
    req.body = result.data;
    next();
};

// --- SCHEMAS ---
const orderSchema = z.object({
    customer: z.object({
        fname: z.string().min(1).max(60),
        lname: z.string().min(1).max(60),
        email: z.string().email(),
        phone: z.string().regex(/^[0-9]{10}$/, 'Phone must be 10 digits'),
        street: z.string().min(3).max(300),
        pincode: z.string().regex(/^[0-9]{6}$/, 'Pincode must be 6 digits'),
        city: z.string().min(1).max(80),
        state: z.string().min(1).max(80)
    }),
    cart: z.array(z.object({
        id: z.union([z.string(), z.number()]),
        price: z.union([z.string(), z.number()]),
        quantity: z.number().int().positive()
    })).min(1),
    total: z.union([z.string(), z.number()]),
    paymentMethod: z.enum(['COD', 'UPI']).optional(),
    utr: z.string().optional().nullable()
});

const productSchema = z.object({
    name: z.string().min(1).max(200),
    price: z.union([z.string(), z.number()]),
    description: z.preprocess(v => v ?? '', z.string().max(2000)),
    image_url: z.preprocess(v => v ?? '', z.string()),
    image_base64: z.string().nullish(),
    image_gallery: z.preprocess(v => v ?? [], z.array(z.string())),
    gallery_uploads: z.preprocess(v => v ?? [], z.array(z.string())),
    stock: z.union([z.string(), z.number()]),
    category: z.preprocess(v => v ?? 'Makhana', z.string().max(80)),
    benefits: z.preprocess(v => v ?? [], z.union([z.string(), z.array(z.string())])),
    is_active: z.boolean().optional()
});

const isValidHttpUrl = (s) => typeof s === 'string' && /^https?:\/\//i.test(s);

const orderUpdateSchema = z.object({
    status: z.enum(['Pending', 'Shipped', 'Delivered', 'Cancelled']).optional(),
    tracking_url: z.string().optional().nullable()
});

const loginSchema = z.object({
    password: z.string().min(1)
});

// --- AUTH ---
const requireAdmin = (req, res, next) => {
    const header = req.headers['authorization'] || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.admin = payload;
        next();
    } catch {
        return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }
};

/**
 * Admin login: exchanges the admin password for a JWT.
 */
app.post('/api/admin/login', loginLimiter, validate(loginSchema), async (req, res) => {
    const { password } = req.body;
    const ok = await bcrypt.compare(password, ADMIN_KEY_HASH);

    if (!ok) {
        console.warn(`Failed admin login from IP: ${req.ip}`);
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    res.status(200).json({ token, expiresIn: JWT_EXPIRY });
});

// --- IMAGE UPLOAD HELPER (with sharp compression) ---
// Returns a public URL string on success, or null on any failure (with details logged).
async function uploadImage(base64Str) {
    if (!base64Str || typeof base64Str !== 'string' || !base64Str.startsWith('data:image')) {
        return null;
    }

    const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
        return null;
    }

    try {
        const rawBuffer = Buffer.from(matches[2], 'base64');

        const optimized = await sharp(rawBuffer)
            .rotate()
            .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 82 })
            .toBuffer();

        const fileName = `img_${Date.now()}_${Math.floor(Math.random() * 100000)}.webp`;

        const { error: storageError } = await supabase.storage
            .from('products')
            .upload(fileName, optimized, {
                contentType: 'image/webp',
                upsert: false
            });

        if (storageError) {
            console.error('uploadImage: Supabase Storage error:', storageError.message || storageError);
            return null;
        }

        const { data: urlData } = supabase.storage.from('products').getPublicUrl(fileName);
        return urlData?.publicUrl || null;
    } catch (err) {
        console.error('uploadImage: processing failed:', err.message);
        return null;
    }
}

// ==========================================
// STOREFRONT ROUTES
// ==========================================

app.get('/api/products', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('id', { ascending: true });

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        console.error('Catalog Fetch Error:', err.message);
        res.status(500).json({ message: 'Could not retrieve the product catalog.' });
    }
});

app.get('/api/orders/track', async (req, res) => {
    const { id, phone } = req.query;

    if (!id || !phone) {
        return res.status(400).json({ message: 'Order ID and Phone Number are required for tracking.' });
    }

    if (!/^[0-9]+$/.test(String(id)) || !/^[0-9]{10}$/.test(String(phone))) {
        return res.status(400).json({ message: 'Invalid order ID or phone format.' });
    }

    try {
        const { data, error } = await supabase
            .from('orders')
            .select('order_id, first_name, status, tracking_url, total_amount, created_at')
            .eq('order_id', Number(id))
            .eq('phone', phone)
            .single();

        if (error || !data) {
            return res.status(404).json({ message: 'Order not found. Please verify your details.' });
        }

        res.status(200).json(data);
    } catch (err) {
        console.error('Tracking Error:', err.message);
        res.status(500).json({ message: 'Tracking service is temporarily unavailable.' });
    }
});

app.post('/api/orders', orderLimiter, validate(orderSchema), async (req, res) => {
    const { customer, cart, total, paymentMethod, utr } = req.body;

    try {
        const fullAddress = `${customer.street}, ${customer.city}, ${customer.state} - ${customer.pincode}`;

        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert([{
                first_name: customer.fname,
                last_name: customer.lname,
                email: customer.email,
                phone: customer.phone,
                address: fullAddress,
                total_amount: Number(total),
                payment_method: paymentMethod || 'COD',
                utr_number: utr || null
            }])
            .select();

        if (orderError) throw orderError;
        const newOrderId = orderData[0].order_id;

        const itemsToInsert = cart.map(item => ({
            order_id: newOrderId,
            product_id: Number(item.id),
            price: Number(item.price),
            quantity: Number(item.quantity)
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(itemsToInsert);

        if (itemsError) throw itemsError;

        for (const item of cart) {
            await supabase.rpc('decrement_stock', {
                p_id: Number(item.id),
                p_qty: Number(item.quantity)
            });
        }

        res.status(201).json({
            message: 'Order Confirmed Successfully!',
            orderId: newOrderId
        });
    } catch (err) {
        console.error('Checkout Engine Failure:', err.message);
        res.status(500).json({ message: 'Failed to process checkout. Please contact support.' });
    }
});

// ==========================================
// ADMIN ROUTES
// ==========================================

app.get('/api/admin/orders', requireAdmin, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`*, order_items(*)`)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch the orders ledger.' });
    }
});

app.get('/api/admin/products', requireAdmin, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch administrative product list.' });
    }
});

app.patch('/api/admin/orders/:id', requireAdmin, validate(orderUpdateSchema), async (req, res) => {
    const { id } = req.params;
    const { status, tracking_url } = req.body;

    try {
        const updateData = {};
        if (status) updateData.status = status;
        if (tracking_url !== undefined) updateData.tracking_url = tracking_url;

        const { error } = await supabase
            .from('orders')
            .update(updateData)
            .eq('order_id', Number(id));

        if (error) throw error;
        res.status(200).json({ message: 'Order record synchronized.' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update order status.' });
    }
});

app.post('/api/admin/products', requireAdmin, validate(productSchema), async (req, res) => {
    try {
        // Seed image_url only if it's a real URL; never let a data URI leak into the DB.
        let mainImgUrl = isValidHttpUrl(req.body.image_url) ? req.body.image_url : null;

        if (req.body.image_base64) {
            const uploadedUrl = await uploadImage(req.body.image_base64);
            if (!uploadedUrl) {
                return res.status(502).json({ message: 'Main image upload failed. Verify the Supabase "products" bucket exists and is public.' });
            }
            mainImgUrl = uploadedUrl;
        }

        if (!mainImgUrl) mainImgUrl = 'https://via.placeholder.com/400';

        const galleryUrls = [];
        let galleryFailures = 0;
        for (const base64Image of req.body.gallery_uploads) {
            const url = await uploadImage(base64Image);
            if (url) galleryUrls.push(url);
            else galleryFailures++;
        }

        const benefitsArray = Array.isArray(req.body.benefits)
            ? req.body.benefits
            : String(req.body.benefits || '').split(',').map(b => b.trim()).filter(Boolean);

        const { data, error } = await supabase
            .from('products')
            .insert([{
                name: req.body.name,
                price: Number(req.body.price),
                description: req.body.description,
                image_url: mainImgUrl,
                image_gallery: galleryUrls,
                stock: Number(req.body.stock),
                category: req.body.category || 'Makhana',
                benefits: benefitsArray,
                is_active: true
            }])
            .select();

        if (error) throw error;
        res.status(201).json({ data, galleryFailures });
    } catch (err) {
        console.error('Product Creation Error:', err.message);
        res.status(500).json({ message: 'Failed to publish new product SKU: ' + err.message });
    }
});

app.put('/api/admin/products/:id', requireAdmin, validate(productSchema), async (req, res) => {
    const { id } = req.params;
    try {
        // Only keep image_url if it's a real http(s) URL; never persist data URIs.
        let mainImgUrl = isValidHttpUrl(req.body.image_url) ? req.body.image_url : null;

        if (req.body.image_base64) {
            const uploadedUrl = await uploadImage(req.body.image_base64);
            if (!uploadedUrl) {
                return res.status(502).json({ message: 'Main image upload failed. Verify the Supabase "products" bucket exists and is public.' });
            }
            mainImgUrl = uploadedUrl;
        }

        if (!mainImgUrl) mainImgUrl = 'https://via.placeholder.com/400';

        // Existing gallery: keep only valid URLs (drop any stray data URIs).
        const existingGallery = req.body.image_gallery.filter(isValidHttpUrl);
        const finalGalleryUrls = [...existingGallery];
        let galleryFailures = 0;
        for (const base64Image of req.body.gallery_uploads) {
            const url = await uploadImage(base64Image);
            if (url) finalGalleryUrls.push(url);
            else galleryFailures++;
        }

        const benefitsArray = Array.isArray(req.body.benefits)
            ? req.body.benefits
            : String(req.body.benefits || '').split(',').map(b => b.trim()).filter(Boolean);

        const { error } = await supabase
            .from('products')
            .update({
                name: req.body.name,
                price: Number(req.body.price),
                description: req.body.description,
                image_url: mainImgUrl,
                image_gallery: finalGalleryUrls,
                stock: Number(req.body.stock),
                category: req.body.category,
                benefits: benefitsArray,
                is_active: req.body.is_active
            })
            .eq('id', Number(id));

        if (error) throw error;
        res.status(200).json({ message: 'Product synchronized successfully.', galleryFailures });
    } catch (err) {
        console.error('Product Update Error:', err.message);
        res.status(500).json({ message: 'Failed to update product details: ' + err.message });
    }
});

app.delete('/api/admin/products/:id', requireAdmin, async (req, res) => {
    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', Number(req.params.id));

        if (error) throw error;
        res.status(200).json({ message: 'Record permanently deleted.' });
    } catch (err) {
        res.status(500).json({ message: 'Deletion failed.' });
    }
});

// --- SYSTEM ---
app.get('/', (req, res) => {
    res.send('Mithila Heritage Food Pvt Ltd API - Authentic Taste Of Mithila');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('--------------------------------------------------------');
    console.log('MITHILA HERITAGE ENGINE - STATUS: LIVE & SECURE');
    console.log(`Running on Port: ${PORT}`);
    console.log('Database: Supabase Connected');
    console.log('Auth: JWT (Bearer) | Rate limiting: Enabled');
    console.log('--------------------------------------------------------');
});
