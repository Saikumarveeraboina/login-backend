
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
app.use('/api', authRoutes);

const PORT = process.env.PORT || 5000;


app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
