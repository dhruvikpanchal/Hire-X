import multer from "multer";

// 1. Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        // 2. Filename format: Date.now() + original file name
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

// 3. File filter function for allowed types
const fileFilter = (req, file, cb) => {
    // Array of allowed MIME types
    const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
        "application/msword", // .doc
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPG, PNG, PDF, and DOC/DOCX files are allowed."), false);
    }
};

// 4. Initialize multer instance with constraints
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});

export default upload;
