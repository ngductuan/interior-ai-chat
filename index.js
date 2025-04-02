if (process.env.NODE_ENV == "production") {
  require("dotenv").config({ path: "./.env.production" });
} else {
  require("dotenv").config({ path: "./.env" });
}

const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const os = require("os");

// Create Express app
const app = express();

// Use bodyParser to parse JSON requests
app.use(bodyParser.json());

console.log(process.env.NODE_ENV);

// Create MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as ID " + connection.threadId);
});

// Define the API route to insert a task
app.post("/task", (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  // Insert the new task into the task table
  const query = "INSERT INTO task (title) VALUES (?)";
  connection.query(query, [title], (err, result) => {
    if (err) {
      console.error("Error inserting task: " + err.stack);
      return res.status(500).json({ error: "Failed to insert task" });
    }

    res.status(201).json({
      message: "Task created successfully",
      taskId: result.insertId,
    });
  });
});

// API route to get all tasks (GET)
app.get("/tasks", (req, res) => {
  const query = "SELECT * FROM task";

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching tasks: " + err.stack);
      return res.status(500).json({ error: "Failed to fetch tasks" });
    }

    res.status(200).json({
      message: "Tasks fetched successfully",
      tasks: results,
    });
  });
});

// API route to get all tasks (GET)
app.get("/", (req, res) => {
  const clientIp = req.header("x-forwarded-for");
  const elbIP = req.socket.remoteAddress;
  const containerIp = req.socket.localAddress;
  const containerName = os.hostname();

  console.log("Hello Amazon ECS!");

  res.status(200).json({
    serviceName: "ECS User Microservice",
    clientIp: clientIp,
    elbIP: elbIP,
    containerIp: containerIp,
    containerName: containerName,
  });
});

// Start the Express server
const port = process.env.HTTP_PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
