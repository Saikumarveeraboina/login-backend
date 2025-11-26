import express from "express";
import {connectToDatabase} from "../lib/db.js";
const router = express.Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Sample registration route

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    // Here, you would typically add code to save the user to your database
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }   
        const hashPassword = await bcrypt.hash(password, 10);

        await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashPassword]);

        return res.status(201).json({ message: "User registered successfully" });
        
    } catch (error) {
        console.error("Database connection error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    // Here, you would typically add code to save the user to your database
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(400).json({ message: "User not exists" });
        }   
        const isPasswordValid = await bcrypt.compare(password, rows[0].password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }   
        const token = jwt.sign({id:rows[0].id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        return res.status(200).json({ message: "Login successful", token: token });
        
    } catch (error) {
        console.error("Database connection error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(403).json({ message: "No Token Provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

router.get('/home', verifyToken, async (req, res) => {
    try{
        const db = await connectToDatabase();
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.userId])
        if (rows.length === 0) {
            return res.status(404).json({ message: "User not exists" });
        }   
        return res.status(201).json({ message: "User data fetched successfully", user: rows[0] });


    } catch(error){
        return res.status(500).json({ message: "Internal server error" });
    }
    

});

export default router;