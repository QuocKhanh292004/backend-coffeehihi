// server.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const db = require("./models");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const requestLogger = require("./middleware/requestLogger");
const correlationIdMiddleware = require("./middleware/correlationId");
const swaggerSpec = require("./config/swagger");
const ridUtil = require("./utils/ridUtil");
const imageUtil = require("./utils/imageUtil");

const cors = require("cors");
const os = require("os");

const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app); // dùng thay cho app.listen
const PORT = process.env.PORT || 3000;

// Get machine IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

const LOCAL_IP = getLocalIP();
const FRONTEND_PORT = process.env.FRONTEND_PORT || "5173";

// CORS config
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      `http://localhost:${FRONTEND_PORT}`,
      `http://127.0.0.1:${FRONTEND_PORT}`,
      `http://${LOCAL_IP}:${FRONTEND_PORT}`,
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

console.log(
  `✅ CORS enabled for: http://localhost:${FRONTEND_PORT}, http://${LOCAL_IP}:${FRONTEND_PORT}`,
);

// Middleware
app.use(express.json());
app.use(correlationIdMiddleware);
app.use(requestLogger);

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
imageUtil.ensureDirectories();

// Swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      url: "/api-docs/swagger.json",
    },
  }),
);

app.get("/api-docs/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// DB connect
db.sequelize
  .authenticate()
  .then(async () => {
    console.log("✅ Kết nối Database MySQL thành công.");
    await ridUtil.initializeCounters();
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối Database:", err);
    process.exit(1);
  });

// Base route
app.get("/", (req, res) => {
  res.json({
    message: "Restaurant Backend API đang chạy...",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    docs: `http://localhost:${PORT}/api-docs`,
  });
});

// Routes
const authRoutes = require("./routes/authRoutes");
const roleRoutes = require("./routes/roleRoutes");
const branchRoutes = require("./routes/branchRoutes");
const userRoutes = require("./routes/userRoutes");
const tableRoutes = require("./routes/tableRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);

// ================= SOCKET.IO =================
const io = new Server(httpServer, {
  cors: corsOptions, // dùng chung config
});

// gắn io vào app để gọi trong controller
app.set("io", io);

io.on("connection", (socket) => {
  console.log(`⚡ Socket connected: ${socket.id}`);

  // Join theo chi nhánh (admin/nhân viên)
  socket.on("join_branch", (branch_id) => {
    socket.join(`branch_${branch_id}`);
    console.log(`👉 Socket ${socket.id} joined branch_${branch_id}`);
  });

  // Join theo bàn (khách hàng nhận trạng thái đơn)
  socket.on("join_table", (table_id) => {
    socket.join(`table_${table_id}`);
    console.log(`👉 Socket ${socket.id} joined table_${table_id}`);
  });

  // Admin tổng
  socket.on("join_admin", () => {
    socket.join("admin_room");
    console.log(`👉 Socket ${socket.id} joined admin_room`);
  });

  socket.on("disconnect", (reason) => {
    console.log(`❌ Socket disconnected: ${socket.id} | Reason: ${reason}`);
  });
});
// ============================================

// 404
app.use(notFoundHandler);

// error handler
app.use(errorHandler);

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
  console.log(`📚 Swagger API Docs: http://localhost:${PORT}/api-docs`);
});
