const express = require("express");
const multer = require("multer");
const { uploadFile, importData } = require("../controllers/fileController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), uploadFile);
router.post("/import", importData);

module.exports = router;
