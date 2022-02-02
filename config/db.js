const mongoose = require('mongoose');
let conn;

const connectDB = async () => {
  conn = await mongoose.connect(process.env.MONGO_URI, {
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
