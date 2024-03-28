const express = require('express');
const router = express.Router();
const multer = require('multer');
const courseController= require('../controller/courseController');
const path = require('path');

const {
  authenticateUser,
  authorizePermissions,
} = require('../middelware/authentication');

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/lesson/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Route to create a new lesson
router.post('/', upload.array('videos', 6), courseController.createCourse);

// Route to get all courses
router.get('/', courseController.getAllCourses);

// Route to get a single course by ID
router.get('/:id', courseController.getCourseById);

// Route to update a course by ID
router.put('/:id', upload.array('file', 6), authenticateUser, authorizePermissions('admin', 'instructor'), courseController.updateCourseById);

// Route to delete a course by ID
router.delete('/:id', authenticateUser, authorizePermissions('admin', 'instructor'), courseController.deleteCourseById);

module.exports = router;