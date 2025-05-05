// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// dotenv.config();

// const MONGO_URI = process.env.MONGO_URI || 'your-mongodb-uri-here';

// mongoose.connect(MONGO_URI)
//   .then(async () => {
//     console.log('Connected to MongoDB');

//     const result = await mongoose.connection.db.collection('usercoupons').indexes();
//     console.log('Current indexes:', result);

//     const dropResult = await mongoose.connection.db.collection('usercoupons').dropIndex('uniqueCode_1');
//     console.log('Dropped index:', dropResult);

//     process.exit();
//   })
//   .catch(err => {
//     console.error('Failed:', err);
//     process.exit(1);
//   });
