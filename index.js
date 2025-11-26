import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

const app = express();
dotenv.config();

app.use(express.json());

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// allow preflight
app.options("*", cors());

app.use('/api', authRoutes);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
