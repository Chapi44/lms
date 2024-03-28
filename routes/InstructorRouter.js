const express = require('express');
const router = express.Router();
const multer = require('multer');
const instructorController = require('../controller/InstructorController');
const path = require('path');

// Multer configuration for handling image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Check the fieldname to determine the destination folder
        if (file.fieldname === 'idCard') {
            cb(null, 'uploads/instructor/idcards');
        } else if (file.fieldname === 'instructorLicense') {
            cb(null, 'uploads/instructor/instructorlicense');
        } else {
            // Default destination if fieldname doesn't match
            cb(null, 'uploads/instructor');
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Routes for Instructor CRUD operations
router.post("/register", upload.fields([
    { name: 'idCard', maxCount: 6 },
    { name: 'instructorLicense', maxCount: 6 }
]), instructorController.createInstructor);

router.get("/", instructorController.getAllInstructors);

router.get("/:id", instructorController.getInstructorById);

router.post("/login", instructorController.loginInstructor);

router.put("/reject/:id", instructorController.rejectInstructorById);

router.put("/approve/:id", instructorController.approveInstructorById);

router.delete("/:id", instructorController.deleteInstructorById);

module.exports = router;
