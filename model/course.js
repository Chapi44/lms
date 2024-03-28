const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({
    Coursename: {
        type: String,
        required: [true, "Please enter the course name"]
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: [true, "Please enter the price"]
    },
    youtubeVideo: {
        type: String,
    }, 
    file: {
        type: [
            {
                lessonTitle: String,
                filePath: String,
            }
        ],
        default: [],
        required: [true, "Please provide file"]
    },
    contentText: {
        type: String,
        required: [true, "Please enter content text"]
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    duration: {
        type: Number,
    },
    language: {
        type: String,
    },
    requirements: {
        type: String,
    },
    coursetags: {
        type: String,
    },
}, { timestamps: true });

CourseSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "course",
    justOne: false,
});

module.exports = mongoose.model("Course", CourseSchema);
