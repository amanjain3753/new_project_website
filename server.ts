import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// --- MongoDB Connection ---
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/couponswap";

mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- Schemas ---
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  wallet_balance: { type: Number, default: 0 },
  is_suspended: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

const couponSchema = new mongoose.Schema({
  seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  platform: String,
  discount_type: String,
  code: String,
  expiry_date: Date,
  price: Number,
  description: String,
  status: { type: String, default: 'available' },
  created_at: { type: Date, default: Date.now }
});

const transactionSchema = new mongoose.Schema({
  buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  coupon_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  amount: Number,
  commission: Number,
  seller_amount: Number,
  created_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Coupon = mongoose.model('Coupon', couponSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

app.use(express.json());

// --- API Routes ---

app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();
    res.json({ id: user._id, email, role: 'user' });
  } catch (e) {
    res.status(400).json({ error: "User already exists" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    if (user.is_suspended) return res.status(403).json({ error: "Account suspended" });
    res.json({ id: user._id, email: user.email, role: user.role });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.get("/api/coupons", async (req, res) => {
  const { platform, minPrice, maxPrice, search } = req.query;
  let filter: any = { status: 'available' };

  if (platform) filter.platform = platform;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const coupons = await Coupon.find(filter);
  res.json(coupons.map(c => ({ ...c.toObject(), id: c._id })));
});

app.post("/api/coupons", async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.json({ id: coupon._id });
  } catch (e) {
    res.status(400).json({ error: "Failed to list coupon" });
  }
});

app.post("/api/purchase", async (req, res) => {
  const { buyer_id, coupon_id } = req.body;
  
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const coupon = await Coupon.findOne({ _id: coupon_id, status: 'available' }).session(session);
    if (!coupon) throw new Error("Coupon not available");

    const amount = coupon.price;
    const commission = amount * 0.01;
    const seller_amount = amount - commission;

    coupon.status = 'sold';
    await coupon.save({ session });

    const transaction = new Transaction({
      buyer_id,
      seller_id: coupon.seller_id,
      coupon_id,
      amount,
      commission,
      seller_amount
    });
    await transaction.save({ session });

    await User.findByIdAndUpdate(coupon.seller_id, { $inc: { wallet_balance: seller_amount } }).session(session);

    await session.commitTransaction();
    res.json({ code: coupon.code });
  } catch (e: any) {
    await session.abortTransaction();
    res.status(400).json({ error: e.message });
  } finally {
    session.endSession();
  }
});

app.get("/api/users/:id/wallet", async (req, res) => {
  const user = await User.findById(req.params.id).select('wallet_balance');
  res.json(user);
});

app.get("/api/users/:id/transactions", async (req, res) => {
  const transactions = await Transaction.find({
    $or: [{ buyer_id: req.params.id }, { seller_id: req.params.id }]
  }).populate('coupon_id', 'title').sort({ created_at: -1 });
  
  res.json(transactions.map(t => ({
    ...t.toObject(),
    coupon_title: (t.coupon_id as any)?.title
  })));
});

app.get("/api/users/:id/coupons", async (req, res) => {
  const coupons = await Coupon.find({ seller_id: req.params.id });
  res.json(coupons);
});

// Admin
app.get("/api/admin/stats", async (req, res) => {
  const stats = await Transaction.aggregate([
    { $group: { _id: null, totalCommission: { $sum: "$commission" }, count: { $sum: 1 } } }
  ]);
  const userCount = await User.countDocuments();
  const couponCount = await Coupon.countDocuments();

  res.json({
    totalCommission: stats[0]?.totalCommission || 0,
    totalUsers: userCount,
    totalCoupons: couponCount,
    totalTransactions: stats[0]?.count || 0
  });
});

app.get("/api/admin/users", async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

app.post("/api/admin/users/:id/suspend", async (req, res) => {
  const { is_suspended } = req.body;
  await User.findByIdAndUpdate(req.params.id, { is_suspended });
  res.json({ success: true });
});

// --- SECRET EXPORT ROUTE (To get your data back) ---
app.get("/api/admin/backup-data-json", (req, res) => {
  try {
    const users = db.prepare("SELECT * FROM users").all();
    const coupons = db.prepare("SELECT * FROM coupons").all();
    const transactions = db.prepare("SELECT * FROM transactions").all();
    
    res.json({
      message: "Yahan tera saara data hai. Isse copy karke save kar le!",
      timestamp: new Date().toISOString(),
      data: {
        users,
        coupons,
        transactions
      }
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(process.cwd(), "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "dist", "index.html"));
  });
}

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
