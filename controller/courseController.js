const Course = require('../model/course');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');
const path = require('path');
const baseURL = process.env.BASE_URL;

const createCourse = async (req, res) => {
    // const userId = req.user.userId;
    
    try {
        const {
            Coursename,
            description,
            price,
            youtubeVideo,
            contentText,
            duration,
            language,
            requirements,
            coursetags
        } = req.body;
    
        const pictures = req.files.map(file => baseURL + "/uploads/course/" + file.filename);
    
        const newCourse = await Course.create({
            Coursename,
            description,
            price,
            youtubeVideo,
            images: pictures,
            contentText,
            duration,
            language,
            requirements,
            coursetags,
            // user: userId
        });
    
        // if (!userId) {
        //     return res.status(400).json({ error: "User ID is required" });
        // }
    
        res.status(StatusCodes.CREATED).json({ course: newCourse });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate("reviews");
        res.status(StatusCodes.OK).json({ courses });
    } catch (error) {
        console.error('Error getting courses:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id).populate("reviews");
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
        // Similar logic to updateBoatById
    } catch (error) {
        console.error('Error updating course by ID:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

const deleteCourseById = async (req, res) => {
    try {
        // Similar logic to deleteBoatById
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
