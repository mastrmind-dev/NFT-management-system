const express = require('express');
const cors = require('cors');

const NFTRouter = require('./routes/NFT.route');

require('dotenv').config();

const app = express();

// middleware
app.use(express.json());
app.use(cors({
    // origin: "http://er.webbackend.sample"
}))

// routes
app.use('/api/nft', NFTRouter);

try {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on http://localhost:${process.env.PORT}`);
    })
} catch (error) {
    console.log('error:', error.message);
}
