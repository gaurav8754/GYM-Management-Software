const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

app.use(cors({
    origin: [CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
require('./DBConn/conn');

const GymRoutes = require('./Routes/gym');
const MembershipRoutes = require('./Routes/membership');
const MemberRoutes = require('./Routes/member');

app.use('/auth', GymRoutes);
app.use('/plans', MembershipRoutes);
app.use('/members', MemberRoutes);

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'online',
        message: '🏋️ Gym Management API is live and operational!',
        endpoints: {
            health: '/health',
            auth: '/auth',
            plans: '/plans',
            members: '/members'
        }
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Gym Management API is operational', timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});
