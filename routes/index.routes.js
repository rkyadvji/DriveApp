const express = require("express");
const router = express.Router();
const upload = require('../config/multer.config');
const supabase = require('../config/supabase.config'); // <-- IMPORTANT

const File = require('../models/files.models');
const auth = require('../middlewares/authe.js');

// Render home page
router.get('/home', auth, async (req, res) => {

  try {
    const userFiles = await File.find({
      user: req.user.userId
    });
    console.log("User Files:", userFiles);
    // throw('error test');
    res.render('home', {
      files: userFiles
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }

});


// Upload file to Supabase
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    // console.log("Decoded user:", req.user);

    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    // 1️⃣ Generate unique filename
    const uniqueFileName = `${Date.now()}-${file.originalname}`;

    // 2️⃣ Upload to Supabase
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(`public/${uniqueFileName}`, file.buffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.mimetype,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return res.status(500).json({ error: error.message });
    }

    // 3️⃣ Get public URL
    const publicURL = supabase.storage
      .from('avatars')
      .getPublicUrl(`public/${uniqueFileName}`).data.publicUrl;

    // 4️⃣ **Save metadata in MongoDB here**
    const userId = req.user.userId; // from logged-in user (assuming you use auth middleware)
    const fileRecord = await File.create({
      path: publicURL,                // Supabase file URL
      originalname: file.originalname,
      user: userId,                    // Link to user
      createdAt: new Date()
    });

    // 5️⃣ Respond to frontend
    res.json({
      message: "File uploaded successfully",
      publicURL,
      fileId: fileRecord._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
// Download file from Supabase
router.get('/download/:id', auth, async (req, res) => {
  try {
    const loggedInUserId = req.user.userId;
    const fileId = req.params.id;

    const file = await File.findOne({
      _id: fileId,
      user: loggedInUserId
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found or unauthorized' });
    }

    // Redirect directly to Supabase public URL
    res.redirect(file.path);

  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: 'Something went wrong during download' });
  }
});

module.exports = router;
