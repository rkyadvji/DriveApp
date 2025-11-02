const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    path: {
        type: String,
        required: [true, 'Path is required']
    },
    originalname: {
        type: String,
        required: [true, 'Originalname is required']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'User is required'],
        ref: 'User' // Reference to the User model/collection
    },
    // Adding optional timestamps for creation/update tracking
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the Mongoose model from the schema
const File = mongoose.model('File', fileSchema);

// Export the model
module.exports = File;