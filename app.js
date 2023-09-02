const dotenv = require("dotenv");
const multer = require("multer");

const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
const User = require("./model/userSchema");
const app = express();
dotenv.config({ path: "./config.env" });
require("./db/conn");
const Media = require('./model/Media');

app.use(express.json());

app.use(require("./router/auth"));


const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Serve static files from the "uploads" directory
app.use("/uploads", express.static("uploads"));

// Handle file uploads
app.post("/upload-media", upload.single("media"), async (req, res) => {
  
  try {
    const { filename, mimetype, buffer } = req.file;
    
    const newMedia = new Media({
      filename,
      contentType: mimetype,
      data: buffer,
    });
    
    await newMedia.save(); // Save the media to MongoDB
    
    console.log('Media uploaded to MongoDB successfully');
    res.status(200).json({ message: 'Media uploaded successfully' });
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ error: 'Media upload failed' });
  }
});


// Basic route
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/signup", (req, res) => {
  res.send("hello Registration world");
});


// static files 
// app.use(express.static(path.join(__dirname,'./client/build')));

// app.get('*', (req,res) => {
//   res.sendFile(path.join(__dirname, './client/build/index.html'))
// });
const PORT = process.env.PORT  || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
