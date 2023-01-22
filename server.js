require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const nftRouter = require('./routes/nft.route');
const { authorize } = require('./middleware/auth.middleware');

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/api/nft', nftRouter);

try {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on http://localhost:${process.env.PORT}`);
    })
} catch (error) {
    console.log('error:', error.message);
}
