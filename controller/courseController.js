const Course = require('../model/courses');
const User = require('../model/user');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');
const path = require('path');

const baseURL = process.env.BASE_URL;

const createCourse = async (req, res) => {
    const userId = req.user.userId;

    try {
        const { title, category, description, price, duration, lessons } = req.body;

        // Check if files are included in the request for videos
        if (!req.files || !req.files['videos'] || req.files['videos'].length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No video files uploaded' });
        }

        // Map uploaded video files to their URLs with base URL
        const videoFiles = req.files['videos'].map(file => baseURL + "/uploads/course/videos/" + file.filename);

        // Map lesson objects to include video URLs
        const lessonsWithVideos = lessons.map(lesson => ({
            title: lesson.title,
            content: lesson.content,
            videos: lesson.videos.map(video => baseURL + "/uploads/course/videos/" + video.filename)
            // You may add more fields if necessary
        }));

        // Create a new course object
        const course = new Course({
            title,
            category,
            description,
            file: videoFiles,
            price,
            duration,
            lessons: lessonsWithVideos,
            createdBy: userId
        });

        // Save the course to the database
        await course.save();

        // Send a success response
        res.status(StatusCodes.CREATED).json({ message: 'Course created successfully', course });
    } catch (error) {
        // Handle errors
        console.error('Error creating course:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

// Get all courses
const getAllCourses = async (req, res) => {
    try {
      const courses = await Course.find({});
      res.status(StatusCodes.OK).json(courses);
    } catch (error) {
      console.error('Error fetching all courses:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
  };
  
  // Get course by ID
  const getCourseById = async (req, res) => {
    try {
      const { id } = req.params;
      const course = await Course.findById(id);
  
      if (!course) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'Course not found' });
      }
  
      res.status(StatusCodes.OK).json(course);
    } catch (error) {
      console.error('Error fetching course by ID:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
  };
  const addToCart = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const { courseId } = req.params;
        const user = await User.findById(_id);
        user.cart.push(courseId);
        await user.save();
        const userRes = await User.findById(_id).populate('coursesCreated').populate('coursesBought').populate('cart');
        res.status(200).json({ message: userRes });
    } catch (err) {
        console.error("Error in addToCart:", err.message);
        res.status(400).json({ 'Error in addToCart': err.message });
    }
};

const userCourse = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const user = await User.findOne({ _id }).populate('coursesCreated').populate('coursesBought').populate('cart');
        return res.status(200).json({ message: user });
    } catch (err) {
        console.error("Error in userCourses:", err.message);
        res.status(400).json({ 'Error in userCourse': err.message });
    }
};

const updateCourseById = async (req, res) => {
    try {
      const { id } = req.params;
      let updatedCourse = await Course.findById(id);
  
      if (!updatedCourse) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Course not found" });
      }
  
      // Update course properties if available
      if (req.body.title) {
        updatedCourse.title = req.body.title;
      }
      if (req.body.category) {
        updatedCourse.category = req.body.category;
      }
      if (req.body.description) {
        updatedCourse.description = req.body.description;
      }
      if (req.body.price) {
        updatedCourse.price = req.body.price;
      }
      if (req.body.duration) {
        updatedCourse.duration = req.body.duration;
      }
  
      // Handle video update if available
      if (req.files && req.files['videos'] && req.files['videos'].length > 0) {
        // Delete previous videos
        if (updatedCourse.file && updatedCourse.file.length > 0) {
          updatedCourse.file.forEach((video) => {
            // Extract filename from the URL
            const filename = video.split("/").pop();
            const videoPath = path.join(__dirname, "..", "uploads", "course", "videos", filename);
            try {
              if (fs.existsSync(videoPath)) {
                fs.unlinkSync(videoPath);
                console.log(`Deleted previous video: ${videoPath}`);
              } else {
                console.log(`Previous video not found: ${videoPath}`);
              }
            } catch (error) {
              console.error(`Error deleting previous video: ${videoPath}`, error);
            }
          });
        }
  
        // Save new videos
        const videoFiles = req.files['videos'].map((file) => baseURL + "/uploads/course/videos/" + file.filename);
        updatedCourse.file = videoFiles;
      }
  
      await updatedCourse.save();
  
      res.status(StatusCodes.OK).json({ message: "Course updated successfully", course: updatedCourse });
    } catch (error) {
      console.error("Error updating course by ID:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
  };
  
  // Delete course by ID
  const deleteCourseById = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedCourse = await Course.findByIdAndDelete(id);
  
      if (!deletedCourse) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'Course not found' });
      }
  
      // Delete videos associated with the course
      if (deletedCourse.file && deletedCourse.file.length > 0) {
        deletedCourse.file.forEach((video) => {
          try {
            const filename = video.split('/').pop(); // Extract filename from URL
            const videoPath = path.join(__dirname, '..', 'uploads', 'course', 'videos', filename);
            if (fs.existsSync(videoPath)) {
              fs.unlinkSync(videoPath);
              console.log(`Video deleted successfully: ${filename}`);
            } else {
              console.log(`File not found: ${filename}`);
            }
          } catch (error) {
            console.error(`Error deleting video: ${error.message}`);
          }
        });
      }
  
      res.status(StatusCodes.OK).json({ message: 'Course deleted successfully', course: deletedCourse });
    } catch (error) {
      console.error('Error deleting course by ID:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
  };
module.exports = {
  createCourse,
  updateCourseById,
  deleteCourseById,
  getAllCourses,
  getCourseById,
  addToCart,
  userCourse
};
