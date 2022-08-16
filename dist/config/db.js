"use strict";
const mongoose = require('mongoose');
const { MONGO_URI } = require('.');
let conn;
const connectDB = async () => {
    conn = await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
};
const closeDB = async () => {
    await conn.close();
};
module.exports = { connectDB, closeDB };
//# sourceMappingURL=db.js.map