import multer from "multer";
import path from "path";
import fs from "fs";

/* ─────────────────────────────────────────────────────────────
   Ensure all upload directories exist at startup
───────────────────────────────────────────────────────────── */
const dirs = [
    "uploads/job_seekers/resumes",
    "uploads/job_seekers/avatars",
    "uploads/recruiter/profile_images",
    "uploads/recruiter/company_logos",
];
dirs.forEach((dir) => fs.mkdirSync(dir, { recursive: true }));

/* ─────────────────────────────────────────────────────────────
   Disk Storage — routes to a folder based on the field name
───────────────────────────────────────────────────────────── */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folderMap = {
            resume: "uploads/job_seekers/resumes",
            avatar: "uploads/job_seekers/avatars",
            profileImage: "uploads/recruiter/profile_images",
            companyLogo: "uploads/recruiter/company_logos",
        };

        const dest = folderMap[file.fieldname];
        if (!dest) {
            return cb(new Error(`Unknown file field: ${file.fieldname}`), null);
        }
        cb(null, dest);
    },

    filename: function (req, file, cb) {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

/* ─────────────────────────────────────────────────────────────
   File-type filter
   - Resume: PDF, DOC, DOCX only
   - Images: JPEG, PNG, WEBP only
───────────────────────────────────────────────────────────── */
const fileFilter = (req, file, cb) => {
    const resumeTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const imageTypes = ["image/jpeg", "image/png", "image/webp"];

    if (file.fieldname === "resume") {
        if (!resumeTypes.includes(file.mimetype)) {
            return cb(new Error("Resume must be a PDF or Word document (.pdf, .doc, .docx)"), false);
        }
    } else {
        if (!imageTypes.includes(file.mimetype)) {
            return cb(new Error("Image must be JPEG, PNG, or WEBP"), false);
        }
    }

    cb(null, true);
};

/* ─────────────────────────────────────────────────────────────
   Multer instance
   - Max file size: 5 MB
───────────────────────────────────────────────────────────── */
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

export default upload;