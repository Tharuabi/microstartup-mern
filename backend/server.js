const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const Project = require('./models/Project');
const Idea = require('./models/Idea');
const Order = require('./models/Order');
const Cart = require('./models/Cart');
const Scheme = require('./models/Scheme');
const Incubator = require('./models/Incubator');
const axios = require('axios');
require('dotenv').config();

// OpenAI API key configuration (fallback for urgent setup)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const OPENAI_TEMPERATURE = Number(process.env.OPENAI_TEMPERATURE || 0.6);
const CHAT_LOG_LEVEL = process.env.CHAT_LOG_LEVEL || 'warn'; // 'warn' | 'silent' | 'debug'
const logWarn = (...args) => { if (CHAT_LOG_LEVEL !== 'silent') console.warn(...args); };
const logDebug = (...args) => { if (CHAT_LOG_LEVEL === 'debug') console.log(...args); };
let OPENAI_DISABLED_UNTIL_MS = 0; // backoff after quota errors


// Stripe keys directly in code
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = Stripe(STRIPE_SECRET_KEY);
const JWT_SECRET_KEY = "tharanis2023it";

const app = express(); 


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));





// User schema and model
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String }, // URL or path to profile picture
  userType: { type: String, enum: ['admin', 'user'], default: 'user' }, // <-- add this
});
const User = mongoose.model('User', userSchema);



// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });



const allowedOrigins = [
  // 'https://frontend-startup-jfbo.vercel.app',
  // 'https://frontend-startup-jfbo-git-main-tharanis2023it-2939s-projects.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow requests like Postman
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error(`CORS not allowed from ${origin}`), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== FUNDING SCHEMES API =====
// List schemes with filters: ?type=Grant&search=seed&sort=deadline
app.get('/api/schemes', async (req, res) => {
  try {
    const { type, search, sort } = req.query;
    const query = {};
    if (type) query.type = new RegExp(`^${type}$`, 'i');
    if (search) {
      const s = new RegExp(search, 'i');
      query.$or = [
        { title: s },
        { description: s },
        { tags: s },
      ];
    }
    const sortMap = {
      deadline: { deadline: 1 },
      latest: { createdAt: -1 },
    };
    const sortObj = sortMap[sort] || { createdAt: -1 };
    const schemes = await Scheme.find(query).sort(sortObj).limit(100);
    res.json(schemes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching schemes.' });
  }
});

// Seed a few demo schemes (dev only)
app.post('/api/schemes/seed', async (_req, res) => {
  try {
    const count = await Scheme.countDocuments();
    if (count > 0) return res.json({ ok: true, message: 'Schemes already seeded' });
    await Scheme.insertMany([
      {
        title: 'NIDHI-PRAYAS',
        type: 'Grant',
        amount: 'Up to ₹10 Lakhs',
        audience: 'Innovators / Students',
        eligibility: 'Prototype stage, hosted by recognized incubators',
        agency: 'DST',
        description: 'Supports innovators to convert ideas into prototypes.',
        url: 'https://nidhi-prayas.org/',
        tags: ['prototype','hardware','student'],
        deadline: new Date(Date.now() + 90*24*60*60*1000),
        icon: '💡'
      },
      {
        title: 'TIDE 2.0',
        type: 'Grant',
        amount: 'Up to ₹7 Lakhs (Prototype)',
        audience: 'Electronics/IT Startups',
        eligibility: 'Early-stage startups under MeitY incubators',
        agency: 'MeitY',
        description: 'Funding support in electronics & IT through MeitY incubators.',
        url: 'https://www.meity.gov.in/tide-2.0',
        tags: ['electronics','iot','tech'],
        deadline: new Date(Date.now() + 150*24*60*60*1000),
        icon: '🧠'
      },
      {
        title: 'Startup India Seed Fund',
        type: 'Funding',
        amount: 'Up to ₹50 Lakhs',
        audience: 'Early-stage Startups',
        eligibility: 'DPIIT recognized startup with traction/innovation',
        agency: 'Startup India',
        description: 'Financial assistance for PoC, prototype, trials and market entry.',
        url: 'https://www.startupindia.gov.in/content/sih/en/seed-fund.html',
        tags: ['seed','early-stage','tech'],
        deadline: new Date(Date.now() + 210*24*60*60*1000),
        icon: '💰'
      },
    ]);
    res.json({ ok: true, seeded: true });
  } catch (err) {
    res.status(500).json({ message: 'Error seeding schemes.' });
  }
});

// ===== INCUBATORS API =====
// List incubators with optional filters: ?location=Hyderabad&search=lab&sort=latest
app.get('/api/incubators', async (req, res) => {
  try {
    const { location, search, sort } = req.query;
    const query = {};
    if (location) query.location = new RegExp(location, 'i');
    if (search) {
      const s = new RegExp(search, 'i');
      query.$or = [ { name: s }, { focus: s }, { tags: s } ];
    }
    const sortObj = sort === 'latest' ? { createdAt: -1 } : { name: 1 };
    const items = await Incubator.find(query).sort(sortObj).limit(100);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching incubators.' });
  }
});

// Seed incubators (dev only)
app.post('/api/incubators/seed', async (_req, res) => {
  try {
    const count = await Incubator.countDocuments();
    if (count > 0) return res.json({ ok: true, message: 'Incubators already seeded' });
    await Incubator.insertMany([
      { name: 'T-Hub', location: 'Hyderabad', focus: ['Mentorship','Workspace','Investor Connect'], url: 'https://t-hub.co/', icon: '🏢' },
      { name: 'IIT Madras Incubation Cell', location: 'Chennai', focus: ['Mentorship','Labs','Funding'], url: 'https://www.incubation.iitm.ac.in/', icon: '🎓' },
      { name: 'NSRCEL (IIM Bangalore)', location: 'Bengaluru', focus: ['Mentorship','Programs','Networking'], url: 'https://www.nsrcel.org/', icon: '📈' },
    ]);
    res.json({ ok: true, seeded: true });
  } catch (err) {
    res.status(500).json({ message: 'Error seeding incubators.' });
  }
});

// ===== SUBSCRIPTIONS (Notify Me) =====
const subscriptions = []; // in-memory placeholder; replace with DB if needed
app.post('/api/notify', (req, res) => {
  const { email, topic, meta } = req.body || {};
  if (!email) return res.status(400).json({ ok: false, message: 'Email required' });
  subscriptions.push({ email, topic: topic || 'schemes', meta: meta || {}, at: new Date() });
  res.json({ ok: true });
});

// ===== BOOKMARKS (My Grants) =====
const bookmarks = {}; // { userId: [{type:'scheme'|'incubator', id, data}] }
app.post('/api/bookmarks/:userId', (req, res) => {
  const { userId } = req.params;
  const { item } = req.body || {};
  if (!userId || !item) return res.status(400).json({ ok: false });
  if (!bookmarks[userId]) bookmarks[userId] = [];
  const exists = bookmarks[userId].some((b) => b.id === item.id && b.type === item.type);
  if (!exists) bookmarks[userId].push(item);
  res.json({ ok: true, items: bookmarks[userId] });
});
app.get('/api/bookmarks/:userId', (req, res) => {
  const { userId } = req.params;
  res.json({ ok: true, items: bookmarks[userId] || [] });
});

// Registration
app.post('/api/register', async (req, res) => {
  const { name, email, password, userType } = req.body; // <-- get userType
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already used.' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, userType }); // <-- store userType
    await user.save();
    console.log('✅ User registered successfully:', email);
    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    console.error('❌ Registration error:', err.message);
    res.status(500).json({ message: 'Error registering user: ' + err.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials.' });
    const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, userType: user.userType } }); // <-- return userType
  } catch (err) {
    res.status(500).json({ message: 'Login error.' });
  }
});

// Project upload
app.post('/api/projects', upload.single('image'), async (req, res) => {
  try {
    const { title, shortDescription, longDescription, category, techStack, price, githubUrl, demoUrl } = req.body;
    const techStackArray = typeof techStack === 'string' ? techStack.split(',').map(s => s.trim()) : [];
    const project = new Project({
      title, shortDescription, longDescription, category,
      techStack: techStackArray,
      price: Number(price),
      githubUrl, demoUrl,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null
    });
    await project.save();
    res.status(201).json({ message: 'Project uploaded successfully', project });
  } catch (err) {
    res.status(500).json({ message: 'Project upload error', error: err.message });
  }
});

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching projects.' });
  }
});

// Get single project by ID
app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching project.' });
  }
});

// Delete a project by ID
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Project not found.' });
    res.json({ message: 'Project deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting project.' });
  }
});

// Update a project by ID
app.put('/api/projects/:id', async (req, res) => {
  try {
    const { title, shortDescription, longDescription, category, techStack, price, githubUrl, demoUrl, imageUrl } = req.body;
    const update = {
      title,
      shortDescription,
      longDescription,
      category,
      techStack,
      price,
      githubUrl,
      demoUrl,
      imageUrl
    };
    const updated = await Project.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated) return res.status(404).json({ message: 'Project not found.' });
    res.json({ message: 'Project updated successfully.', project: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating project.' });
  }
});

// ===== IDEA ENDPOINTS =====

// Create new idea
app.post('/api/ideas', upload.single('image'), async (req, res) => {
  try {
    const { 
      title, description, category, problem, solution, targetMarket, 
      revenueModel, techStack, estimatedCost, timeline, difficulty, 
      author, tags 
    } = req.body;
    
    const techStackArray = typeof techStack === 'string' ? techStack.split(',').map(s => s.trim()) : [];
    const tagsArray = typeof tags === 'string' ? tags.split(',').map(s => s.trim()) : [];
    
    const idea = new Idea({
      title,
      description,
      category,
      problem,
      solution,
      targetMarket,
      revenueModel,
      techStack: techStackArray,
      estimatedCost: Number(estimatedCost),
      timeline,
      difficulty,
      author: author || 'Anonymous',
      tags: tagsArray,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null
    });
    
    await idea.save();
    res.status(201).json({ message: 'Idea submitted successfully', idea });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting idea', error: err.message });
  }
});

// Get all ideas
app.get('/api/ideas', async (req, res) => {
  try {
    const ideas = await Idea.find().sort({ dateAdded: -1 });
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching ideas.' });
  }
});

// Get trending ideas
app.get('/api/ideas/trending', async (req, res) => {
  try {
    const trendingIdeas = await Idea.find({ trending: true }).sort({ likes: -1 }).limit(5);
    res.json(trendingIdeas);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trending ideas.' });
  }
});

// Get single idea by ID
app.get('/api/ideas/:id', async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found.' });
    }
    res.json(idea);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching idea.' });
  }
});

// Update idea views (for tracking popularity)
app.put('/api/ideas/:id/view', async (req, res) => {
  try {
    const idea = await Idea.findByIdAndUpdate(
      req.params.id, 
      { $inc: { views: 1 } }, 
      { new: true }
    );
    if (!idea) return res.status(404).json({ message: 'Idea not found.' });
    res.json({ message: 'View counted', idea });
  } catch (err) {
    res.status(500).json({ message: 'Error updating view count.' });
  }
});

// Like an idea
app.put('/api/ideas/:id/like', async (req, res) => {
  try {
    const idea = await Idea.findByIdAndUpdate(
      req.params.id, 
      { $inc: { likes: 1 } }, 
      { new: true }
    );
    if (!idea) return res.status(404).json({ message: 'Idea not found.' });
    res.json({ message: 'Idea liked', idea });
  } catch (err) {
    res.status(500).json({ message: 'Error liking idea.' });
  }
});

// Delete an idea
app.delete('/api/ideas/:id', async (req, res) => {
  try {
    const deleted = await Idea.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Idea not found.' });
    res.json({ message: 'Idea deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting idea.' });
  }
});

// Update an idea
app.put('/api/ideas/:id', async (req, res) => {
  try {
    const { 
      title, description, category, problem, solution, targetMarket, 
      revenueModel, techStack, estimatedCost, timeline, difficulty, 
      author, tags, status 
    } = req.body;
    
    const update = {
      title, description, category, problem, solution, targetMarket,
      revenueModel, techStack, estimatedCost, timeline, difficulty,
      author, tags, status
    };
    
    const updated = await Idea.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated) return res.status(404).json({ message: 'Idea not found.' });
    res.json({ message: 'Idea updated successfully.', idea: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating idea.' });
  }
});

// Stripe payment intent endpoint
app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // in cents
      currency,
      automatic_payment_methods: { enabled: true },
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create payment intent directly (for custom payment page)
app.post('/api/create-payment-intent', async (req, res) => {
  const { title, amount, customerEmail, customerName, customerAddress, items } = req.body;
  
  try {
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'inr',
      metadata: {
        projectTitle: title,
        items: JSON.stringify(items || []),
        customerEmail: customerEmail,
        customerName: customerName
      },
      description: `Purchase from MicroStartupX - ${title}`,
      receipt_email: customerEmail,
      shipping: {
        name: customerName,
        address: customerAddress
      }
    });

    // Store order in database
    await Order.create({
      stripePaymentIntentId: paymentIntent.id,
      customerEmail: customerEmail,
      customerName: customerName,
      customerAddress: customerAddress,
      items: items || [],
      totalAmount: amount,
      currency: 'inr',
      paymentStatus: 'pending',
      createdAt: new Date(),
      projectTitle: title
    });

    res.json({ 
      success: true, 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (err) {
    console.error('Payment intent creation error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Enhanced checkout session creation
app.post('/api/create-checkout-session', async (req, res) => {
  const { title, amount, items, customerDetails, fromCart } = req.body;
  try {
    // Create line items for cart or single item
    const lineItems = fromCart 
      ? items.map(item => ({
          price_data: {
            currency: 'inr',
            product_data: {
              name: item.title,
              description: `Purchase from MicroStartupX - ${item.title}`
            },
            unit_amount: item.price * 100, // Convert to paise
          },
          quantity: item.quantity,
        }))
      : [{
          price_data: {
            currency: 'inr',
            product_data: {
              name: title,
              description: `Purchase from MicroStartupX - ${title}`
            },
            unit_amount: amount * 100, // Convert to paise
          },
          quantity: 1,
        }];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: 'http://localhost:5173/cancel',
      billing_address_collection: 'required',
      customer_creation: 'always',
      allow_promotion_codes: false,
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic'
        }
      },
      metadata: {
        items: JSON.stringify(items || []),
        projectTitle: title,
        fromCart: fromCart ? 'true' : 'false',
        customerDetails: JSON.stringify(customerDetails || {})
      },
      payment_intent_data: {
        metadata: {
          projectTitle: title,
          items: JSON.stringify(items || []),
          fromCart: fromCart ? 'true' : 'false',
          customerDetails: JSON.stringify(customerDetails || {})
        }
      }
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe session creation error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Cart endpoints
app.post('/api/cart/add', async (req, res) => {
  try {
    const { userId, projectId, title, price, imageUrl } = req.body;
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    
    // Check if item already exists in cart
    const existingItem = cart.items.find(item => item.projectId === projectId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        projectId,
        title,
        price,
        imageUrl,
        quantity: 1
      });
    }
    
    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/cart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });
    res.json({ success: true, cart: cart || { items: [], totalAmount: 0 } });
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/cart/:userId/:projectId', async (req, res) => {
  try {
    const { userId, projectId } = req.params;
    const cart = await Cart.findOne({ userId });
    
    if (cart) {
      cart.items = cart.items.filter(item => item.projectId !== projectId);
      await cart.save();
    }
    
    res.json({ success: true, cart });
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/cart/:userId/:projectId', async (req, res) => {
  try {
    const { userId, projectId } = req.params;
    const { quantity } = req.body;
    
    const cart = await Cart.findOne({ userId });
    
    if (cart) {
      const item = cart.items.find(item => item.projectId === projectId);
      if (item) {
        item.quantity = quantity;
        await cart.save();
      }
    }
    
    res.json({ success: true, cart });
  } catch (err) {
    console.error('Update cart error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Handle checkout success (placeholder - using enhanced version below)
// Manual payment storage endpoint (for immediate testing)
app.post('/api/store-payment-manual', async (req, res) => {
  try {
    const { sessionId, customerEmail, customerName, items, totalAmount, fromCart } = req.body;
    
    const order = await Order.create({
      stripeCheckoutSessionId: sessionId || 'manual-session-' + Date.now(),
      stripePaymentIntentId: 'manual-payment-' + Date.now(),
      customerEmail: customerEmail || 'manual@example.com',
      customerName: customerName || 'Manual Customer',
      customerPhone: '1234567890',
      items: items || [{ title: 'Manual Test Item', price: totalAmount || 1000, quantity: 1 }],
      totalAmount: totalAmount || 1000,
      currency: 'inr',
      paymentStatus: 'paid',
      paymentMethod: 'stripe',
      fromCart: fromCart || false,
      projectTitle: 'Manual Test Project',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Manual payment stored successfully:', order._id);
    res.json({ success: true, message: 'Payment stored manually!', orderId: order._id });
  } catch (err) {
    console.error('Error storing manual payment:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Test endpoint to manually store payment (for testing)
app.post('/api/test-payment-store', async (req, res) => {
  try {
    const { sessionId, customerEmail, customerName, items, totalAmount, fromCart } = req.body;
    
    await Order.create({
      stripeCheckoutSessionId: sessionId || 'test-session-' + Date.now(),
      stripePaymentIntentId: 'test-payment-' + Date.now(),
      customerEmail: customerEmail || 'test@example.com',
      customerName: customerName || 'Test Customer',
      customerPhone: '1234567890',
      items: items || [{ title: 'Test Item', price: 1000, quantity: 1 }],
      totalAmount: totalAmount || 1000,
      currency: 'inr',
      paymentStatus: 'paid',
      paymentMethod: 'stripe',
      fromCart: fromCart || false,
      projectTitle: 'Test Project',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Test payment stored successfully');
    res.json({ success: true, message: 'Test payment stored in database' });
  } catch (err) {
    console.error('Error storing test payment:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Enhanced webhook to store customer details
app.post('/api/stripe-webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  console.log('Webhook received:', req.headers['stripe-signature'] ? 'Has signature' : 'No signature');
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
    console.log('Webhook event type:', event.type);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    try {
      // Get customer details from Stripe
      const customer = await stripe.customers.retrieve(session.customer);
      
      // Parse metadata
      const items = JSON.parse(session.metadata.items || '[]');
      const fromCart = session.metadata.fromCart === 'true';
      const customerDetails = JSON.parse(session.metadata.customerDetails || '{}');
      
      // Store in payments collection with customer details
      await Order.create({
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: session.payment_intent,
        customerEmail: customer.email || customerDetails.customerEmail,
        customerName: customer.name || customerDetails.customerName || `${customer.address?.line1 || ''} ${customer.address?.line2 || ''}`.trim(),
        customerPhone: customerDetails.customerPhone,
        customerAddress: customer.address ? {
          line1: customer.address.line1,
          line2: customer.address.line2,
          city: customer.address.city,
          state: customer.address.state,
          postal_code: customer.address.postal_code,
          country: customer.address.country
        } : null,
        items: items,
        totalAmount: session.amount_total,
        currency: session.currency,
        paymentStatus: 'paid',
        paymentMethod: 'stripe',
        fromCart: fromCart,
        projectTitle: session.metadata.projectTitle,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('Payment stored successfully:', session.id, 'From cart:', fromCart, 'Items:', items.length);
      console.log('Order details:', {
        customerEmail: customer.email || customerDetails.customerEmail,
        customerName: customer.name || customerDetails.customerName,
        totalAmount: session.amount_total,
        items: items
      });
    } catch (err) {
      console.error('Error storing payment:', err);
      console.error('Session data:', session);
      console.error('Customer data:', customer);
    }
  }
  res.json({ received: true });
});

// Simple webhook endpoint for testing (no signature verification)
app.post('/api/stripe-webhook-test', async (req, res) => {
  console.log('Test webhook received:', req.body);
  
  if (req.body.type === 'checkout.session.completed') {
    const session = req.body.data.object;
    try {
      console.log('Processing checkout session:', session.id);
      
      // Store payment directly
      await Order.create({
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: session.payment_intent,
        customerEmail: 'webhook-test@example.com',
        customerName: 'Webhook Test Customer',
        customerPhone: '1234567890',
        items: [{ title: 'Webhook Test Item', price: session.amount_total, quantity: 1 }],
        totalAmount: session.amount_total,
        currency: session.currency,
        paymentStatus: 'paid',
        paymentMethod: 'stripe',
        fromCart: false,
        projectTitle: 'Webhook Test Project',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('Webhook test payment stored successfully:', session.id);
    } catch (err) {
      console.error('Error storing webhook test payment:', err);
    }
  }
  
  res.json({ received: true });
});

// Store payment details after successful payment
app.get('/api/checkout-success', async (req, res) => {
  const { session_id } = req.query;
  console.log('Verifying checkout session:', session_id);
  
  if (!session_id) {
    return res.status(400).json({ success: false, message: 'Session ID is required.' });
  }
  
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log('Stripe session status:', session.payment_status);
    
    if (session.payment_status === 'paid') {
      // Prevent duplicate order insertion
      const existingOrder = await Order.findOne({ stripeCheckoutSessionId: session_id });
      if (!existingOrder) {
        console.log('Creating new order for session:', session_id);
        // Extract metadata
        const metadata = session.metadata || {};
        const customerDetails = metadata.customerDetails ? JSON.parse(metadata.customerDetails) : {};
        const items = metadata.items ? JSON.parse(metadata.items) : [];
        
        await Order.create({
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: session.payment_intent,
          customerEmail: session.customer_details?.email || customerDetails.email || 'unknown@example.com',
          customerName: session.customer_details?.name || customerDetails.name || 'Unknown Customer',
          customerPhone: session.customer_details?.phone || customerDetails.phone || '',
          items: items.length > 0 ? items : [{
            title: metadata.projectTitle || 'Project Purchase',
            price: session.amount_total / 100,
            quantity: 1
          }],
          totalAmount: session.amount_total / 100,
          currency: session.currency,
          paymentStatus: 'paid',
          paymentMethod: 'stripe',
          fromCart: metadata.fromCart === 'true',
          projectTitle: metadata.projectTitle || 'MicroStartupX Purchase',
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log('Order created successfully');
      } else {
        console.log('Order already exists for session:', session_id);
      }
      
      res.json({ 
        success: true, 
        message: 'Payment successful and stored.', 
        amount: session.amount_total / 100,
        customerName: session.customer_details?.name,
        customerEmail: session.customer_details?.email
      });
    } else {
      console.log('Payment not completed for session:', session_id);
      res.status(400).json({ success: false, message: 'Payment not completed.' });
    }
  } catch (err) {
    console.error('Error in /api/checkout-success:', err);
    res.status(500).json({ success: false, error: err.message, message: 'Internal server error during verification' });
  }
});

// Upload and update user profile picture
app.post('/api/user/profile-pic', upload.single('profilePic'), async (req, res) => {
  const { userId } = req.body;
  if (!userId || !req.file) return res.status(400).json({ message: 'Missing userId or file.' });
  try {
    const user = await User.findByIdAndUpdate(userId, { profilePic: `/uploads/${req.file.filename}` }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ success: true, profilePic: user.profilePic });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile picture.' });
  }
});

// Track project view
app.put('/api/projects/:id/view', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, views: project.views });
  } catch (err) {
    console.error('Error tracking view:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Handle user rating
app.post('/api/projects/:id/rate', async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Invalid rating value' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Calculate new average rating
    const totalRatings = project.rating * (project.ratingCount || 0) + rating;
    const newRatingCount = (project.ratingCount || 0) + 1;
    const newRating = totalRatings / newRatingCount;

    // Update project with new rating
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { 
        rating: newRating,
        ratingCount: newRatingCount
      },
      { new: true }
    );

    res.json({ 
      success: true, 
      newRating: newRating,
      ratingCount: newRatingCount
    });
  } catch (err) {
    console.error('Error rating project:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get user profile (including profilePic)
app.get('/api/user/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic || null,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user profile.' });
  }
});

// Get all users (admin only, for dashboard)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, 'name email userType _id');
    res.json(users.map(u => ({ id: u._id, name: u.name, email: u.email, userType: u.userType })));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users.' });
  }
});

// Get all orders (for dashboard, mock for now)
app.get('/api/orders', async (req, res) => {
  try {
    // TODO: Replace with real order fetching logic
    res.json([]); // Return empty array for now
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders.' });
  }
});
// Fallback generator when OpenAI is unavailable or quota exceeded
async function generateChatFallback(message) {
  try {
    const text = String(message || '').toLowerCase();

    // Extract keywords and simple budget
    const words = text.replace(/[^a-z0-9₹\s.-]/g, ' ').split(/\s+/).filter(Boolean);
    const stop = new Set(['i','need','to','give','me','an','a','the','and','or','for','of','on','in','with','please','plz','ku','u','you','want','like','show','find','build','implement','make']);
    const keywords = words.filter(w => w.length > 2 && !stop.has(w));
    const numberMatch = text.match(/(\d[\d,]{2,9})/);
    const budget = numberMatch ? parseInt(numberMatch[1].replace(/,/g, ''), 10) : null;

    const categoryHints = ['saas','mobile','web3','ecommerce','ai','fintech','edtech','game','iot','content','domain','blog'];
    const hintedCategories = categoryHints.filter(c => text.includes(c));

    const wantsIdeas = text.includes('idea') || text.includes('ideas');
    const wantsProjects = text.includes('project') || (!wantsIdeas);

    // Fundraising quick guidance
    if (text.includes('fund') || text.includes('funding') || text.includes('investor') || text.includes('raise')) {
      return [
        'Fundraising playbook:',
        '1) Deck (12–15 slides): Problem, Solution, Market, Business Model, Traction, Product, GTM, Competition, Team, Roadmap, Financials, Ask.',
        '2) Traction: MAU/Revenue/Retention/Growth (even small but consistent metrics).',
        '3) Ask: e.g., ₹10–30L for 12–18 months runway with 3–4 key milestones.',
        '4) GTM: 2–3 scalable channels (SEO, partnerships, communities, ads).',
        '5) Data room: PnL, cohorts, pipeline, legal, demo video.',
        '6) Outreach: Warm intros > cold; target 30–50 angels/operators in your space.',
        '7) CTA: Book 15‑min demo; include a 90‑sec product video and concise one‑liner.',
        '',
        'Reply with your one‑liner + traction; I will generate a tight investor email and slide outline.'
      ].join('\n');
    }

    // If user asks to create/generate a new idea, synthesize a structured idea
    if (
      text.includes('create') ||
      text.includes('generate') ||
      text.includes('new idea') ||
      text.includes('start idea') ||
      text.includes('build idea')
    ) {
      const cat = (hintedCategories[0]) || (keywords.find(k => categoryHints.includes(k)) || 'saas');
      const categoryLabel = cat.toUpperCase();
      const focus = keywords.find(k => !categoryHints.includes(k)) || 'assistant';

      const techByCat = {
        saas: ['React', 'Node.js', 'Express', 'MongoDB'],
        mobile: ['Flutter', 'Firebase'],
        web3: ['Next.js', 'Solidity', 'Hardhat', 'IPFS'],
        ecommerce: ['Next.js', 'Stripe', 'PostgreSQL'],
        ai: ['Python', 'FastAPI', 'Transformers'],
        fintech: ['React', 'Node.js', 'Stripe', 'PostgreSQL'],
        edtech: ['React', 'Node.js', 'MongoDB'],
        game: ['Unity', 'C#'],
        iot: ['Arduino', 'BLE', 'Flutter']
      };
      const ts = techByCat[cat] || ['React', 'Node.js'];
      const title = `${focus.charAt(0).toUpperCase() + focus.slice(1)} ${categoryLabel} Idea`;
      const budgetText = budget ? `Estimated MVP budget: ₹${budget.toLocaleString('en-IN')}` : 'Estimated MVP budget: ₹40,000–₹80,000';

      return [
        `Here is a practical ${categoryLabel} idea you can build:`,
        '',
        `Title: ${title}`,
        `Problem: People struggle with ${focus} due to fragmented tools and manual workflows.`,
        `Solution: A ${categoryLabel} app that streamlines ${focus} with automation and smart recommendations.`,
        `Target users: Early-stage founders, students, and indie hackers.`,
        `Tech stack: ${ts.join(', ')}`,
        `Revenue model: Freemium + Pro (₹299/mo), lifetime deal (₹2,999)`,
        budgetText,
        'MVP features:',
        `- Onboarding wizard to capture user goals for ${focus}`,
        '- Core feature set (basic CRUD + search + sharing)',
        '- Analytics/insights dashboard',
        '- Export/share options',
        'Timeline:',
        '- Week 1: UI scaffold + auth + DB schema',
        '- Week 2: Core feature + list/detail + forms',
        '- Week 3: Payments + deploy + feedback loop',
        'Next step: Open /add-idea and paste these fields to create your idea record. I can also list related ideas if you type "show ideas".'
      ].join('\n');
    }

    // Helpers to score relevance
    const scoreProject = (p) => {
      let s = 0;
      const title = (p.title || '').toLowerCase();
      const desc = (p.shortDescription || p.longDescription || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      const techs = (p.techStack || []).map(t => String(t).toLowerCase());
      keywords.forEach(k => { if (title.includes(k) || desc.includes(k)) s += 3; if (techs.some(t => t.includes(k))) s += 2; });
      if (hintedCategories.length && hintedCategories.some(h => cat.includes(h))) s += 4;
      s += (p.rating || 0);
      s += Math.min(5, Math.floor((p.views || 0) / 100));
      if (budget && typeof p.price === 'number' && p.price <= budget) s += 3;
      return s;
    };

    const scoreIdea = (i) => {
      let s = 0;
      const title = (i.title || '').toLowerCase();
      const desc = (i.description || '').toLowerCase();
      const cat = (i.category || '').toLowerCase();
      const tags = (i.tags || []).map(t => String(t).toLowerCase());
      keywords.forEach(k => { if (title.includes(k) || desc.includes(k)) s += 3; if (tags.some(t => t.includes(k))) s += 2; });
      if (hintedCategories.length && hintedCategories.some(h => cat.includes(h))) s += 4;
      s += Math.min(5, Math.floor((i.likes || 0) / 20));
      s += Math.min(5, Math.floor((i.views || 0) / 100));
      return s;
    };

    // Direct help flows
    if (text.includes('pay') || text.includes('payment') || text.includes('buy') || text.includes('purchase')) {
      return 'To purchase: open a project and click Buy Now, or add multiple to cart and checkout at /cart. Payments use Stripe.';
    }
    if (text.includes('help') || text.includes('support')) {
      return "Ask me: 'projects under 50000', 'AI ideas', 'trending projects', or 'how to purchase'.";
    }

    // Idea cost queries like "top 1 idea how much" / "idea 2 price"
    if (wantsIdeas && (text.includes('how much') || text.includes('price') || text.includes('cost'))) {
      // Determine index (default 1)
      let idx = 1;
      const m = text.match(/(top\s*)?(\d+)/);
      if (m && m[2]) {
        idx = Math.max(1, parseInt(m[2], 10));
      } else if (text.includes('first')) {
        idx = 1;
      } else if (text.includes('second')) {
        idx = 2;
      } else if (text.includes('third')) {
        idx = 3;
      }
      const ideasAll = await Idea.find().sort({ likes: -1, views: -1 });
      if (!ideasAll.length) return 'No ideas available yet.';
      const target = ideasAll[idx - 1];
      if (!target) return `I only found ${ideasAll.length} ideas.`;
      const cost = typeof target.estimatedCost === 'number' ? `₹${target.estimatedCost.toLocaleString('en-IN')}` : 'not specified';
      return `Idea #${idx}: ${target.title}\nEstimated cost: ${cost}`;
    }

    // Ideas suggestion
    if (wantsIdeas) {
      const allIdeas = await Idea.find();
      const ranked = allIdeas
        .map(i => ({ i, s: scoreIdea(i) }))
        .sort((a, b) => b.s - a.s)
        .slice(0, 5)
        .map(({ i }, idx) => `${idx + 1}. ${i.title} — ${i.category} (likes: ${i.likes || 0})`);
      if (ranked.length) {
        return `Top ideas for you:\n${ranked.join('\n')}\n\nBrowse more on /projectpage`;
      }
      return 'No ideas found yet. Try again later.';
    }

    // Projects suggestion (default)
    if (wantsProjects) {
      const query = {};
      if (budget) query.price = { $lte: budget };
      const allProjects = await Project.find(query);
      const ranked = allProjects
        .map(p => ({ p, s: scoreProject(p) }))
        .sort((a, b) => b.s - a.s)
        .slice(0, 5)
        .map(({ p }, idx) => `${idx + 1}. ${p.title} — ₹${(p.price || 0).toLocaleString('en-IN')} (${p.category || 'Project'})`);
      if (ranked.length) {
        return `Suggestions for you:\n${ranked.join('\n')}\n\nOpen /projectpage to explore more.`;
      }
      return 'No matching projects found. Try a different keyword or budget.';
    }

    return "I'm here to help with Micro-startup. Try: 'projects under 50000', 'AI ideas', or 'trending projects'.";
  } catch (_err) {
    return "I'm having trouble fetching data right now. Please try again in a moment.";
  }
}

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    console.log('Received message:', message);

  // If no key or backoff active, immediately fallback
  if (!OPENAI_API_KEY || Date.now() < OPENAI_DISABLED_UNTIL_MS) {
    const reply = await generateChatFallback(message);
    return res.json({ reply });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: 'You are MicroStartupX assistant. Be concise, practical, and helpful. If user asks about ideas/projects, tailor based on keywords and budget. Avoid long paragraphs.' },
          { role: 'user', content: String(message || '') }
        ],
        temperature: OPENAI_TEMPERATURE,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    );
    const content = response?.data?.choices?.[0]?.message?.content;
    if (content) {
      return res.json({ reply: content });
    }
    // Fallback if unexpected shape
    const reply = await generateChatFallback(message);
    return res.json({ reply });
  } catch (error) {
    const code = error?.response?.data?.error?.code;
    const type = error?.response?.data?.error?.type;
    if (code === 'insufficient_quota' || type === 'insufficient_quota') {
      logWarn('OpenAI quota exceeded. Switching to local assistant temporarily.');
      // backoff for 30 minutes to avoid repeated errors
      OPENAI_DISABLED_UNTIL_MS = Date.now() + 30 * 60 * 1000;
      const reply = await generateChatFallback(message);
      return res.json({ reply });
    }
    logWarn('OpenAI error, using local assistant.', error?.response?.data || error.message);
    const reply = await generateChatFallback(message);
    return res.json({ reply });
  }
});
app.get('/', (req, res) => {
  res.send('Backend is running ✅');
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
