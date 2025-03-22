const express = require("express");
const redis = require("redis");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Redis Connection (Update with your Redis Cloud details)
const client = redis.createClient({
  url: "redis://default:VuxsJu4E8kGOBWCb4GCMpIMkwhZskJwc@redis-13036.c257.us-east-1-3.ec2.redns.redis-cloud.com:13036",
});
client.connect().catch(console.error);

// Check Redis Connection
client.on("connect", () => {
  console.log("Connected to Redis Cloud");
});

client.on("error", (err) => {
  console.error("Redis Error:", err);
});

// API to Register a User
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    await client.hSet(`user:${username}`, { email, password });
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
});

// API to Get User Data
app.get("/user/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const user = await client.hGetAll(`user:${username}`);
    if (!user.email) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving user" });
  }
});

// Start Server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
