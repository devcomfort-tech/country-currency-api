import dotenv from "dotenv";
import app from "./app";
import pool from "./config/database";

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    const connection = await pool.getConnection();

    console.log("MySQL database connected successfully!");

    connection.release();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();