const express = require('express');
const router = express.Router();
const multer = require('multer');
const courseController = require('../controller/courseController');
const path = require('path');
const {
  authenticateUser,
  authorizePermissions,
} = require('../middelware/authentication');

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/course/');
  },
  filename: function (req, file, cb) {
    // Rename the file to include the fieldname and timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Route to create a new course
router.post('/', upload.fields([{ name: 'images', maxCount: 6 }, { name: 'coverpage', maxCount: 1 }]), courseController.createCourse);

module.exports = router;

// Route to create a new course
router.post('/', upload.fields([{ name: 'images', maxCount: 6 }, { name: 'coverpage', maxCount: 1 }]), courseController.createCourse);

module.exports = router;

// Route to create a new course
router.post('/', upload.array('images', 6), courseController.createCourse);

module.exports = router;

// Route to create a new course
router.post(
  '/',

  upload.array('images', 6),
  courseController.createCourse
);

// Route to get all courses
router.get('/', courseController.getAllCourses);

// Route to get a single course by ID
router.get('/:id', courseController.getCourseById);

// Route to update a course by ID
router.put(
  '/:id',
  upload.array('images', 6),
  authenticateUser,

  courseController.updateCourseById
);

// Route to delete a course by ID
router.delete(
  '/:id',
authenticateUser,
  courseController.deleteCourseById
);

module.exports = router;
