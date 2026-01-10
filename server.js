// server.js
require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const db = require("./models");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const requestLogger = require("./middleware/requestLogger");
const correlationIdMiddleware = require("./middleware/correlationId");
const swaggerSpec = require("./config/swagger");
const ridUtil = require("./utils/ridUtil");

const app = express();
const PORT = process.env.PORT || 3000;

// Thiết lập CORS
const cors = require("cors");
app.use(cors());

// Middleware cơ bản
app.use(express.json());
app.use(correlationIdMiddleware); // Add correlation ID for request tracing
app.use(requestLogger);

// Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      url: "/api-docs/swagger.json",
    },
  })
);

// Swagger JSON endpoint
app.get("/api-docs/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Kiểm tra kết nối Database
db.sequelize
  .authenticate()
  .then(async () => {
    console.log("✅ Kết nối Database MySQL thành công.");
    // Initialize RID counters from database
    await ridUtil.initializeCounters();
    // Đồng bộ Models (CHỈ dùng trong môi trường Dev/Test)
    // db.sequelize.sync({ alter: true });
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối Database:", err);
    process.exit(1);
  });

// Định nghĩa Route API cơ bản
app.get("/", (req, res) => {
  res.json({
    message: "Restaurant Backend API đang chạy...",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    docs: "http://localhost:3000/api-docs",
  });
});

// Import các routes
const authRoutes = require("./routes/authRoutes");
const roleRoutes = require("./routes/roleRoutes");
const branchRoutes = require("./routes/branchRoutes");
const userRoutes = require("./routes/userRoutes");
const tableRoutes = require("./routes/tableRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Sử dụng các routes
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler (phải đặt cuối cùng)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
  console.log(`📚 Swagger API Docs: http://localhost:${PORT}/api-docs`);
});
