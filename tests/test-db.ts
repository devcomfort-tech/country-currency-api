import pool from "../src/config/database";

async function testConnection() {
  try {
    const connection = await pool.getConnection();

    console.log("MySQL database connected successfully!");

    connection.release();
    await pool.end();
  } catch (error) {
    console.error("MySQL connection failed:", error);
    process.exit(1);
  }
}

testConnection();
