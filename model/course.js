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
    images: {
        type: [String],
        default: [],
        required: [true, "Please provide at least 6 images"]
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
    // user: {
    //     type: mongoose.Types.ObjectId,
    //     ref: 'User',
    //     required: true,
    // },
}, { timestamps: true });

CourseSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "course",
    justOne: false,
});

module.exports = mongoose.model("Course", CourseSchema);
