require('dotenv').config();

const mongoose = require('mongoose');


const DBURL = process.env.DBURL;
mongoose.connect(DBURL).then(() => console.log(`Connected to db: ${DBURL}`));