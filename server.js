// const express = require("express");
// const mysql = require("mysql2");
// const cors = require("cors");
// const jwt = require('jsonwebtoken');
// const secretKey = 'priyatham1@A'; // Use a

// const app = express();
// app.use(express.json());
// app.use(cors());

// // ✅ Create a MySQL connection (not pool)
// const db = mysql.createConnection({
//   host: "database-1.cx84e20u4106.eu-north-1.rds.amazonaws.com",
//   user: "admin",
//   password: "adityafoods", // Set your MySQL password
//   database: "food_app_admin",
//   port: 3306,
// });

// // ✅ Connect to database
// db.connect((err) => {
//   if (err) {
//     console.error("Database connection failed: " + err.stack);
//     return;
//   }
//   console.log("Connected to MySQL database");
// });

// app.get("/users/:user_id", (req, res) => {
//   const { user_id } = req.params;

//   const sql = "SELECT user_id, user_name, phone_number FROM users WHERE user_id = ?";
//   db.query(sql, [user_id], (err, results) => {
//     if (err) {
//       console.error("Error fetching user:", err.message);
//       return res.status(500).json({ error: "Database error" });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.status(200).json(results[0]); // return the single user record
//   });
// });

// app.get("/food-items/:restaurantId", (req, res) => {
//   const { restaurantId } = req.params;
//   const sql = "SELECT * FROM food_items WHERE admin_id = ?";
//   db.query(sql, [restaurantId], (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: "Database error" });
//     }
//     res.json(results);
//   });
// });

// app.get("/orders", (req, res) => {
//   db.query("SELECT * FROM orders", async (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });

//     const ordersWithItems = await Promise.all(
//       results.map(async (order) => {
//         const [items] = await db.promise().query(
//           "SELECT name, quantity FROM order_items WHERE order_id = ?",
//           [order.id]
//         );
//         return { ...order, items };
//       })
//     );

//     res.json(ordersWithItems);
//   });
// });

// app.get("/restaurants", (req, res) => {
//   db.query(
//     "SELECT * FROM admins",
//     (err, result) => {
//       if (err) {
//         console.error("Error fetching restaurants:", err.message);
//         return res.status(500).json({ error: "Internal server error" });
//       }
//       res.json(result);
//     }
//   );
// });

// // app.post("/create-jwt", (req, res) => {
// //   const { deviceId  }= req.body;
// //   if (!deviceId) {
// //     return res.status(400).json({ error: "deviceId is required" });
// //   }
// //   const token = jwt.sign({ deviceId }, secretKey, { expiresIn: "1h" });
// //   // console.log(token);
// //   res.json({ token });
// // });

// app.post("/register", (req, res) => {
//   const { user_id, user_name, password, phone_number } = req.body;

//   if (!user_id || !user_name || !password || !phone_number) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   const checkSql = "SELECT * FROM users WHERE user_id = ?";
//   db.query(checkSql, [user_id], (err, results) => {
//     if (err) {
//       console.error("Error checking user:", err.message);
//       return res.status(500).json({ error: "Database error" });
//     }

//     if (results.length > 0) {
//       return res.status(409).json({ error: "User ID already exists" });
//     }

//     const insertSql = "INSERT INTO users (user_id, user_name, password, phone_number) VALUES (?, ?, ?, ?)";

//     db.query(insertSql, [user_id, user_name, password, phone_number], (insertErr, result) => {
//       if (insertErr) {
//         console.error("Error inserting user:", insertErr.message);
//         return res.status(500).json({ error: "Failed to register user" });
//       }

//       res.status(201).json({ message: "User registered successfully", id: result.insertId });
//     });
//   });
// });

// app.post("/login", async (req, res) => {
//   const { user_id, password } = req.body;
//   try {
//     const [rows] = await db.promise().query(
//       "SELECT * FROM users WHERE user_id = ? AND password = ?",
//       [user_id, password]
//     );
//     if (rows.length > 0) {
//       res.json({ success: true});
//     } else {
//       res.json({ success: false, message: "Invalid credentials" });
//     }
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// });

// app.post("/verify-token", (req, res) => {
//   const { token } = req.body;
//   console.log(token ,"verifying");
//   db.query(
//     "SELECT user_id FROM user_tokens WHERE token = ? LIMIT 1",
//     [token],
//     (err, results) => {
//       if (err) {
//         console.error("💥 Error verifying token:", err);
//         return res.status(500).json({ valid: false, message: "Server error" });
//       }

//       if (results.length > 0) {
//         const user_id = results[0].user_id;
//         return res.json({ valid: true, user_id });
//       } else {
//         return res.status(401).json({ valid: false, message: "Invalid or expired token" });
//       }
//     }
//   );
// });

// app.post('/store-token', (req, res) => {
//   const { user_id, token } = req.body;
//   // console.log(token);
//   // Assuming `db.query` uses callback-based syntax
//   db.query(
//     'INSERT INTO user_tokens (user_id, token) VALUES (?, ?)',
//     [user_id, token],
//     (err, results) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ success: false, error: 'DB Error' });
//       }
//       res.json({ success: true });
//     }
//   );
// });

// app.delete('/delete-token', (req, res) => {
//   const { token } = req.body;

//   if (!token) {
//     return res.status(400).json({ success: false, message: "Token is required" });
//   }

//   db.query(
//     'DELETE FROM user_tokens WHERE token = ?',
//     [token],
//     (err, results) => {
//       if (err) {
//         console.error("DB error during token deletion:", err);
//         return res.status(500).json({ success: false, message: "Database error" });
//       }

//       res.json({ success: true });
//     }
//   );
// });

// app.get('/user-cart-items', (req, res) => {
//   const userId = req.query.userId;

//   const query = 'SELECT * FROM user_cart WHERE user_id = ?';
//   db.query(query, [userId], (err, results) => {
//     if (err) {
//       console.error('Database error:', err);
//       return res.status(500).send('Database error');
//     }
//     res.json(results);
//   });
// });

// app.get('/users', (req, res) => {
//   const userId = req.query.userId;
//   const query = 'SELECT * FROM users WHERE user_id = ?';
//   db.query(query, [userId], (err, results) => {
//     if (err) {
//       console.error('Database error:', err);
//       return res.status(500).send('Database error');
//     }
//     res.json(results[0]);
//   });
// });

// app.post('/usercart/add-item', (req, res) => {
//   const { userId, itemId, itemName, price, imageUrl, quantity, restaurantId} = req.body;
//   const checkQuery = 'SELECT * FROM user_cart WHERE user_id = ? AND item_id = ?';
//   db.query(checkQuery, [userId, itemId], (err, results) => {
//     if (err) {
//       console.error('Database error during SELECT:', err);
//       return res.status(500).send('Database error');
//     }
//     if (results.length > 0) {
//       // Item exists, update the quantity
//       const newQuantity = results[0].quantity + quantity;
//       const updateQuery = 'UPDATE user_cart SET quantity = ? WHERE user_id = ? AND item_id = ? AND restaurant_id = ?';
//       db.query(updateQuery, [newQuantity, userId, itemId,restaurantId], (err) => {
//         if (err) {
//           return res.status(500).send('Database error');
//         }
//         return res.status(200).send('Item quantity updated');
//       });
//     } else {
//       const insertQuery = 'INSERT INTO user_cart (user_id, item_id, item_name, price, image_url, quantity, restaurant_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
//       db.query(insertQuery, [userId, itemId, itemName, price, imageUrl, quantity, restaurantId], (err) => {
//         if (err) {
//           console.error('Database error during INSERT:', err);
//           return res.status(500).send('Database error');
//         }
//         return res.status(201).send('Item added to cart');
//       });
//     }
//   });
// });

// // Increment item quantity
// app.post('/usercart/increment-item', (req, res) => {
//   const { userId, itemId ,restaurantId} = req.body;

//   const checkQuery = 'SELECT * FROM user_cart WHERE user_id = ? AND id = ? AND restaurant_id = ?';
//   db.query(checkQuery, [userId, itemId, restaurantId], (err, results) => {
//     if (err) {
//       console.error('Database error during SELECT:', err);
//       return res.status(500).send('Database error');
//     }

//     if (results.length > 0) {
//       const newQuantity = results[0].quantity + 1;
//       const updateQuery = 'UPDATE user_cart SET quantity = ? WHERE user_id = ? AND id = ? AND restaurant_id = ?';
//       db.query(updateQuery, [newQuantity, userId, itemId, restaurantId], (err) => {
//         if (err) {
//           console.error('Database error during UPDATE:', err);
//           return res.status(500).send('Database error');
//         }
//         return res.status(200).send('Item quantity incremented');
//       });
//     } else {
//       return res.status(404).send('Item not found in cart');
//     }
//   });
// });

// // Decrement item quantity
// app.post('/usercart/decrement-item', (req, res) => {
//   const { userId, itemId, restaurantId } = req.body;

//   const checkQuery = 'SELECT * FROM user_cart WHERE user_id = ? AND id = ? AND restaurant_id = ?';
//   db.query(checkQuery, [userId, itemId, restaurantId], (err, results) => {
//     if (err) {
//       console.error('Database error during SELECT:', err);
//       return res.status(500).send('Database error');
//     }

//     if (results.length > 0) {
//       const currentQuantity = results[0].quantity;
//       const newQuantity = currentQuantity - 1;

//       if (currentQuantity > 1) {
//         // Update the quantity if it's greater than 1
//         const updateQuery = 'UPDATE user_cart SET quantity = ? WHERE user_id = ? AND id = ? AND restaurant_id = ?';
//         db.query(updateQuery, [newQuantity, userId, itemId, restaurantId], (err) => {
//           if (err) {
//             console.error('Database error during UPDATE:', err);
//             return res.status(500).send('Database error');
//           }
//           return res.status(200).send('Item quantity decremented');
//         });
//       } else {
//         // Delete the item if the current quantity is 1
//         const deleteQuery = 'DELETE FROM user_cart WHERE user_id = ? AND id = ? AND restaurant_id = ?';
//         db.query(deleteQuery, [userId, itemId, restaurantId], (err) => {
//           if (err) {
//             console.error('Database error during DELETE:', err);
//             return res.status(500).send('Database error');
//           }
//           return res.status(200).send('Item removed from cart');
//         });
//       }
//     } else {
//       return res.status(404).send('Item not found in cart');
//     }
//   });
// });

// app.post('/delete-items', (req, res) => {
//   const { userId, restaurantId } = req.body;
//   const deleteQuery = 'DELETE FROM user_cart WHERE user_id = ? AND restaurant_id = ?';

//   db.query(deleteQuery, [userId, restaurantId], (err) => {
//     if (err) {
//       console.error('Database error during DELETE:', err);
//       return res.status(500).send('Database error');
//     }
//     return res.status(200).send('All items removed from cart');
//   });
// });

// // GET /admin-tokens?adminId=1
// app.get('/admin-tokens', (req, res) => {
//   const { adminId } = req.query;
//   if (!adminId) {
//     return res.status(400).json({ error: 'adminId is required' });
//   }
//   const query = 'SELECT token FROM tokens WHERE admin_id = ?';
//   db.query(query, [adminId], (err, results) => {
//     if (err) {
//       console.error('Error fetching tokens:', err);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     const tokens = results.map(row => row.token);
//     res.json({ tokens });
//   });
// });

// app.post('/place-order', (req, res) => {
//   const { user_id, items, totalAmount, status ,admin_id} = req.body;

//   // Check if the user exists in the users table
//   const userQuery = 'SELECT * FROM users WHERE user_id = ?';
//   db.query(userQuery, [user_id], (err, userResult) => {
//     if (err) {
//       console.error('Database error during user lookup:', err);
//       return res.status(500).send('Database error');
//     }

//     if (userResult.length === 0) {
//       // User not found
//       return res.status(404).send('User not found');
//     }

//     // User exists, extract phone number
//     const phone_number = userResult[0].phone_number;

//     // Generate a six-digit random OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Insert order into orders table
//     const orderQuery = 'INSERT INTO orders (ordered_person_id, phone_number, otp, status, amount, admin_id) VALUES (?, ?, ?, ?, ?, ?)';
//     db.query(orderQuery, [user_id, phone_number, otp, status, totalAmount, admin_id], (err, orderResult) => {
//       if (err) {
//         console.error('Database error during order placement:', err);
//         return res.status(500).send('Database error');
//       }

//       const orderId = orderResult.insertId; // Get the newly created order ID

//       // Prepare order items for insertion
//       const orderItems = items.map(item => [orderId, item.name, item.quantity]);

//       // Insert order items into order_items table
//       const orderItemsQuery = 'INSERT INTO order_items (order_id, name, quantity) VALUES ?';
//       db.query(orderItemsQuery, [orderItems], (err) => {
//         if (err) {
//           console.error('Database error during order items insertion:', err);
//           return res.status(500).send('Database error');
//         }

//         return res.status(201).json({ orderId, message: 'Order placed successfully', otp });
//       });
//     });
//   });
// });

// // ✅ Start server
// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });
// const functions = require("firebase-functions");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const secretKey = "priyatham1@A";
const AutoIncrement = require("mongoose-sequence")(mongoose);

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://chintalajanardhan2004:admin@cluster0.dm083rc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
// const mongoose = require("mongoose");

// USERS
const UserSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  user_name: String,
  password: String,
  phone_number: String,
  email: String,
});
UserSchema.plugin(AutoIncrement, { inc_field: "id" });
const User = mongoose.model("User", UserSchema, "users");

// Sample insert

// ADMINS
const AdminSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  restaurant_name: { type: String, required: true },
  restaurant_location: { type: String, required: true },
  restaurant_image: { type: String },
});
const Admin = mongoose.model("Admin", AdminSchema, "admins");

// FOOD ITEMS
const FoodItemSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  admin_id: { type: Number },
  name: { type: String },
  description: { type: String },
  price: { type: mongoose.Decimal128 },
  image_url: { type: String },
  available: { type: Boolean, default: true },
});
const FoodItem = mongoose.model("FoodItem", FoodItemSchema, "food_items");

// ORDER ITEMS
const OrderItemSchema = new mongoose.Schema({
  // id: { type: Number, required: true, unique: true },
  order_id: {
    type: mongoose.Schema.Types.ObjectId, // <-- Change this
    required: true,
    ref: "Order",
  },
  name: { type: String },
  quantity: { type: Number },
});

const OrderItem = mongoose.model("OrderItem", OrderItemSchema, "order_items");
const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", CounterSchema, "counters");
const getNextSequence = async (sequenceName) => {
  const result = await Counter.findByIdAndUpdate(
    sequenceName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return result.seq;
};

// ORDERS
const OrderSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  ordered_person_id: { type: String },
  phone_number: { type: String },
  otp: { type: String },
  status: { type: String },
  admin_id: { type: Number },
  date: { type: Date, default: Date.now },
  amount: { type: Number },
});
// if (!mongoose.models.Counter) {
// OrderSchema.plugin(AutoIncrement, { inc_field: "id" });
// }

const Order = mongoose.model("Order", OrderSchema, "orders");

// TOKENS (Admin Tokens)
const AdminTokenSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  token: { type: String, required: true, unique: true },
  admin_id: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
});
const AdminToken = mongoose.model("AdminToken", AdminTokenSchema, "tokens");

// USER CART
const UserCartSchema = new mongoose.Schema({
  user_id: { type: String },
  item_id: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  item_name: { type: String },
  price: { type: Number },
  image_url: { type: String },
  restaurant_id: { type: Number },
});
const UserCart = mongoose.model("UserCart", UserCartSchema, "user_cart");

// USER TOKENS
const UserTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const UserToken = mongoose.model("UserToken", UserTokenSchema, "user_tokens");

/// ROUTES
app.get("/users/:user_id", async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.params.user_id });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({
      user_id: user.user_id,
      user_name: user.user_name,
      phone_number: user.phone_number,
    });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/food-items/:restaurantId", async (req, res) => {
  try {
    const items = await FoodItem.find({ admin_id: req.params.restaurantId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find({});
    const results = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.find({ order_id: order._id });
        return { ...order._doc, items };
      })
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/restaurants", async (req, res) => {
  try {
    const admins = await Admin.find({});
    // console.log(admins);
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/register", async (req, res) => {
  console.log("inside register ");
  const { user_id, user_name, password, phone_number } = req.body;
  if (!user_id || !user_name || !password || !phone_number)
    return res.status(400).json({ error: "All fields are required" });

  const exists = await User.findOne({ user_id });
  if (exists) return res.status(409).json({ error: "User ID already exists" });

  const newUser = new User({ user_id, user_name, password, phone_number });
  await newUser.save();
  res.status(201).json({ message: "User registered successfully" });
});

app.post("/login", async (req, res) => {
  const { user_id, password } = req.body;
  try {
    const user = await User.findOne({ user_id, password });
    res.json(
      user
        ? { success: true }
        : { success: false, message: "Invalid credentials" }
    );
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

app.post("/verify-token", async (req, res) => {
  const { user_id, token } = req.body; // Extract token from request body
  console.log("verifying token", token);
  if (!token) {
    return res.status(400).json({ valid: false, message: "Token is required" });
  }

  try {
    const result = await UserToken.findOne({ token }); // Search for the token in the database

    if (result) {
      // If the token is found, return a valid response
      return res.json({ valid: true, user_id: result.user_id });
    }

    // If no token is found, respond with invalid token
    res.status(401).json({ valid: false, message: "Invalid or expired token" });
  } catch (error) {
    console.error("Error during token verification:", error);
    res.status(500).json({ valid: false, message: "Internal server error" });
  }
});

app.post("/store-token", async (req, res) => {
  const { user_id, token } = req.body;
  console.log("inside of store token");

  try {
    await new UserToken({ user_id, token }).save();
    console.log("stored");
    res.json({ success: true });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ success: false, error: "DB Error" });
  }
});
app.delete("/delete-token", async (req, res) => {
  const { token } = req.body;
  try {
    await UserToken.deleteOne({ token });
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting token:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/user-cart-items", async (req, res) => {
  const items = await UserCart.find({ user_id: req.query.userId });
  res.json(items);
});

app.get("/users", async (req, res) => {
  const user = await User.findOne({ user_id: req.query.userId });
  res.json(user);
});

app.post("/usercart/add-item", async (req, res) => {
  const { userId, itemId, itemName, price, imageUrl, quantity, restaurantId } =
    req.body;
  // price = price.$numberDecimal;
  console.log(req.body);
  const existing = await UserCart.findOne({ user_id: userId, item_id: itemId });
  if (existing) {
    await UserCart.updateOne({ _id: existing._id }, { $inc: { quantity } });
    res.send("Item quantity updated");
  } else {
    await new UserCart({
      user_id: userId,
      item_id: itemId,
      item_name: itemName,
      price,
      image_url: imageUrl,
      quantity,
      restaurant_id: restaurantId,
    }).save();
    res.status(201).send("Item added to cart");
  }
});

app.post("/usercart/increment-item", async (req, res) => {
  const { userId, itemId, restaurantId } = req.body;
  const item = await UserCart.findOne({
    user_id: userId,
    item_id: itemId,
    restaurant_id: restaurantId,
  });
  if (!item) return res.status(404).send("Item not found in cart");

  await UserCart.updateOne({ item_id: itemId }, { $inc: { quantity: 1 } });
  res.send("Item quantity incremented");
});

app.post("/usercart/decrement-item", async (req, res) => {
  const { userId, itemId, restaurantId } = req.body;
  const item = await UserCart.findOne({
    user_id: userId,
    item_id: itemId,
    restaurant_id: restaurantId,
  });
  if (!item) return res.status(404).send("Item not found in cart");

  if (item.quantity > 1) {
    await UserCart.updateOne({ item_id: itemId }, { $inc: { quantity: -1 } });
    res.send("Item quantity decremented");
  } else {
    await UserCart.deleteOne({ item_id: itemId });
    res.send("Item removed from cart");
  }
});

app.post("/delete-items", async (req, res) => {
  const { userId, restaurantId } = req.body;
  await UserCart.deleteMany({ user_id: userId, restaurant_id: restaurantId });
  res.send("All items removed from cart");
});

app.get("/admin-tokens", async (req, res) => {
  const { adminId } = req.query;
  const tokens = await AdminToken.find({ admin_id: adminId });
  res.json({ tokens: tokens.map((t) => t.token) });
});

app.post("/place-order", async (req, res) => {
  try {
    const { user_id, items, totalAmount, status, admin_id } = req.body;

    const user = await User.findOne({ user_id });
    if (!user) return res.status(404).send("User not found");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const order = await new Order({
      id: await getNextSequence("orderId"),
      ordered_person_id: user_id,
      phone_number: user.phone_number,
      otp,
      status,
      amount: totalAmount,
      admin_id,
    }).save();

    const orderItems = items.map((item) => ({
      order_id: order._id, // Relate items to the created order
      name: item.name,
      quantity: item.quantity,
    }));

    await OrderItem.insertMany(orderItems);

    res.status(201).json({
      orderId: order._id,
      message: "Order placed successfully",
      otp,
    });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/", (req, res) => {
  res.send("hey hey ");
});
app.listen(5000, "0.0.0.0", () => {
  console.log("Server running");
});
// exports.api = functions.https.onRequest(app);
