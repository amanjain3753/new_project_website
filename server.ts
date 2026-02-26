import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("coupons.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user',
    wallet_balance REAL DEFAULT 0,
    is_suspended INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS coupons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seller_id INTEGER,
    title TEXT,
    platform TEXT,
    discount_type TEXT,
    code TEXT,
    expiry_date DATE,
    price REAL,
    description TEXT,
    status TEXT DEFAULT 'available',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(seller_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    buyer_id INTEGER,
    seller_id INTEGER,
    coupon_id INTEGER,
    amount REAL,
    commission REAL,
    seller_amount REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(buyer_id) REFERENCES users(id),
    FOREIGN KEY(seller_id) REFERENCES users(id),
    FOREIGN KEY(coupon_id) REFERENCES coupons(id)
  );

  CREATE TABLE IF NOT EXISTS withdraw_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    amount REAL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Auth (Mock for now, using simple email/password)
  app.post("/api/auth/register", (req, res) => {
    const { email, password } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)");
      const result = stmt.run(email, password);
      res.json({ id: result.lastInsertRowid, email, role: 'user' });
    } catch (e) {
      res.status(400).json({ error: "User already exists" });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password);
    if (user) {
      if (user.is_suspended) return res.status(403).json({ error: "Account suspended" });
      res.json({ id: user.id, email: user.email, role: user.role });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Coupons
  app.get("/api/coupons", (req, res) => {
    const { platform, minPrice, maxPrice, search } = req.query;
    let query = "SELECT id, title, platform, discount_type, expiry_date, price, description, seller_id FROM coupons WHERE status = 'available'";
    const params: any[] = [];

    if (platform) {
      query += " AND platform = ?";
      params.push(platform);
    }
    if (minPrice) {
      query += " AND price >= ?";
      params.push(Number(minPrice));
    }
    if (maxPrice) {
      query += " AND price <= ?";
      params.push(Number(maxPrice));
    }
    if (search) {
      query += " AND (title LIKE ? OR description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    const coupons = db.prepare(query).all(...params);
    res.json(coupons);
  });

  app.post("/api/coupons", (req, res) => {
    const { seller_id, title, platform, discount_type, code, expiry_date, price, description } = req.body;
    const stmt = db.prepare(`
      INSERT INTO coupons (seller_id, title, platform, discount_type, code, expiry_date, price, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(seller_id, title, platform, discount_type, code, expiry_date, price, description);
    res.json({ id: result.lastInsertRowid });
  });

  // Buying
  app.post("/api/purchase", (req, res) => {
    const { buyer_id, coupon_id } = req.body;
    
    const dbTransaction = db.transaction(() => {
      const coupon = db.prepare("SELECT * FROM coupons WHERE id = ? AND status = 'available'").get(coupon_id);
      if (!coupon) throw new Error("Coupon not available");

      const amount = coupon.price;
      const commission = amount * 0.01;
      const seller_amount = amount - commission;

      // Update coupon status
      db.prepare("UPDATE coupons SET status = 'sold' WHERE id = ?").run(coupon_id);

      // Create transaction record
      db.prepare(`
        INSERT INTO transactions (buyer_id, seller_id, coupon_id, amount, commission, seller_amount)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(buyer_id, coupon.seller_id, coupon_id, amount, commission, seller_amount);

      // Update seller wallet
      db.prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?").run(seller_amount, coupon.seller_id);

      return { code: coupon.code };
    });

    try {
      const result = dbTransaction();
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // User Dashboard / Wallet
  app.get("/api/users/:id/wallet", (req, res) => {
    const user = db.prepare("SELECT wallet_balance FROM users WHERE id = ?").get(req.params.id);
    res.json(user);
  });

  app.get("/api/users/:id/transactions", (req, res) => {
    const transactions = db.prepare(`
      SELECT t.*, c.title as coupon_title 
      FROM transactions t 
      JOIN coupons c ON t.coupon_id = c.id 
      WHERE t.buyer_id = ? OR t.seller_id = ?
      ORDER BY t.created_at DESC
    `).all(req.params.id, req.params.id);
    res.json(transactions);
  });

  app.get("/api/users/:id/coupons", (req, res) => {
    const coupons = db.prepare("SELECT * FROM coupons WHERE seller_id = ?").all(req.params.id);
    res.json(coupons);
  });

  // Admin
  app.get("/api/admin/stats", (req, res) => {
    const totalCommission = db.prepare("SELECT SUM(commission) as total FROM transactions").get();
    const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users").get();
    const totalCoupons = db.prepare("SELECT COUNT(*) as count FROM coupons").get();
    const totalTransactions = db.prepare("SELECT COUNT(*) as count FROM transactions").get();
    res.json({
      totalCommission: totalCommission.total || 0,
      totalUsers: totalUsers.count,
      totalCoupons: totalCoupons.count,
      totalTransactions: totalTransactions.count
    });
  });

  app.get("/api/admin/users", (req, res) => {
    const users = db.prepare("SELECT id, email, role, wallet_balance, is_suspended, created_at FROM users").all();
    res.json(users);
  });

  app.post("/api/admin/users/:id/suspend", (req, res) => {
    const { is_suspended } = req.body;
    db.prepare("UPDATE users SET is_suspended = ? WHERE id = ?").run(is_suspended ? 1 : 0, req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
