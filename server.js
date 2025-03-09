require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Define Schema & Model
const subscriberSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }
});
const Subscriber = mongoose.model("Subscriber", subscriberSchema);

// ✅ API Endpoint to Store Emails
app.post("/subscribe", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const existingUser = await Subscriber.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already subscribed" });

        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();
        res.status(201).json({ message: "Successfully subscribed!" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
