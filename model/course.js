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
    files: {
        type: [
            {
                lesson: String,
                files: [String]
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
    pricetype:{
        type: String,
        enum: ['free', 'paid']

    },
    catagorie:{
        type: [String],
    },
    coverpage:{
        type: [String] // Assuming coverpage should contain URLs of cover page images
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
