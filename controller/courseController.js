const Course = require('../model/course');
const { StatusCodes } = require('http-status-codes');
const baseURL = process.env.BASE_URL;

const createCourse = async (req, res) => {
    try {
        const {
            Coursename,
            description,
            price,
            youtubeVideo,
            contentText,
            duration,
            pricetype,
            catagorie,
            language,
            requirements,
            coursetags,
            lessons,
           
            coverpage // New field for cover page images
        } = req.body;

        const files = Array.isArray(lessons) ? lessons.map((lesson, index) => ({
            lesson: lesson,
            files: [baseURL + "/uploads/course/" + req.files[index].filename]
        })) : [];

        // Process cover page images
        const coverPageImages = Array.isArray(coverpage) ? 
            coverpage.map(image => baseURL + "/uploads/course/" + image.filename) : [];

        const newCourse = await Course.create({
            Coursename,
            description,
            price,
            youtubeVideo,
            files: files,
            contentText,
            averageRating: 0,
            numOfReviews: 0,
            duration,
            pricetype,
            catagorie,
          
            coverpage: coverPageImages, // Assign provided cover page images directly to the coverpage field
            language,
            requirements,
            coursetags,
        });

        res.status(StatusCodes.CREATED).json({ course: newCourse });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

module.exports = { createCourse };


const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(StatusCodes.OK).json({ courses });
    } catch (error) {
        console.error('Error getting courses:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);
        if (!course) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Course not found' });
        }
        res.status(StatusCodes.OK).json({ course });
    } catch (error) {
        console.error('Error getting course by ID:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

const updateCourseById = async (req, res) => {
    try {
     
    } catch (error) {
        console.error('Error updating course by ID:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

const deleteCourseById = async (req, res) => {
    try {
    
    } catch (error) {
        console.error('Error deleting course by ID:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

module.exports = { 
    createCourse, 
    getAllCourses,
    getCourseById,
    updateCourseById,
    deleteCourseById
};
