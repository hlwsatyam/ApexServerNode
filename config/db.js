const mongoose = require("mongoose");
// Connection URL
const url = "mongodb+srv://HeySatyam:20172522@cluster0.xqoozjj.mongodb.net/finanace?retryWrites=true&w=majority&appName=Cluster0";
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