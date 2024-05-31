const mongoose = require("mongoose");
// Connection URL
const url = "mongodb+srv://satyampandit021:20172522@rvbmhotelbooking.9hfzkrx.mongodb.net/apex?retryWrites=true&w=majority";
async function connectToDatabase() {
  try {
    await mongoose.connect(url, {
    });
    console.log("Connected successfully to MongoDB with Mongoose");
  } catch (err) { 
    console.error("Error connecting to MongoDB", err);
  } 
}
module.exports = connectToDatabase;