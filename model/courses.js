const mongoose = require('mongoose');
const { Schema } = mongoose;

const lessonSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    videos: [{
        type: String
    }],
    // You can add more fields as needed for each lesson
});

const courseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: [String],
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    file: {
        type: [String],
        required: true
    },
    price: {
        type: String
    },
    duration: {
        type: Number,
        default: 0
    },
    userWhoHasBought: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    qna: [{
        sender: {
            type: String
        },
        message: {
            type: String
        }
    }],
    lessons: [lessonSchema] // Array of lesson objects
});

module.exports = mongoose.model('Course', courseSchema);
