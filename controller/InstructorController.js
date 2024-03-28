const Instructor = require('../model/instructor');
const { sign } = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');
const path = require('path');

const baseURL = process.env.BASE_URL;

const createInstructor = async (req, res) => {
  try {
    const { userName, firstName, lastName, phoneNumber, companyName, email, password, idCard, instructorLicense, status } = req.body;

    // Check if files are included in the request for ID cards
    if (!req.files || !req.files['idCard'] || req.files['idCard'].length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No ID card files uploaded' });
    }

    // Check if files are included in the request for instructor licenses
    if (!req.files || !req.files['instructorLicense'] || req.files['instructorLicense'].length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No instructor license files uploaded' });
    }

    // Map uploaded ID card image files to their URLs with base URL
    const idCardImages = req.files['idCard'].map(file => baseURL + "/uploads/instructor/idcards/" + file.filename);

    // Map uploaded instructor license image files to their URLs with base URL
    const instructorLicenseImages = req.files['instructorLicense'].map(file => baseURL + "/uploads/instructor/instructorlicense/" + file.filename);

    // Create a new instructor object
    const instructor = new Instructor({
      userName,
      firstName,
      lastName,
      phoneNumber,
      companyName,
      email,
      password,
      idCard: idCardImages,
      instructorLicense: instructorLicenseImages,
      status
    });

    // Save the instructor to the database
    await instructor.save();

    // Send a success response
    res.status(StatusCodes.CREATED).json({ message: 'Instructor created successfully', instructor });
  } catch (error) {
    // Handle errors
    console.error('Error creating instructor:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};

const getAllInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find({});
    res.status(StatusCodes.OK).json(instructors);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

const getInstructorById = async (req, res) => {
  try {
    const { id } = req.params;
    const instructor = await Instructor.findById(id);

    if (!instructor) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Instructor not found" });
    }

    res.status(StatusCodes.OK).json(instructor);
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

const loginInstructor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const instructor = await Instructor.findOne({ email });

    if (instructor && (await bcrypt.compare(password, instructor.password))) {
      const token = sign(
        { user_id: instructor._id, email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
      );
      return res.status(StatusCodes.OK).send({ message: "Instructor logged in", token, instructor });
    }

    res.status(StatusCodes.UNAUTHORIZED).send({ message: "Invalid credentials" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error.message });
  }
};

const updateInstructorById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedInstructor = await Instructor.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedInstructor) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Instructor not found" });
    }

    res.status(StatusCodes.OK).json({ instructor: updatedInstructor });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

const approveInstructorById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedInstructor = await Instructor.findByIdAndUpdate(id, { status: "Approved" }, { new: true });

    if (!updatedInstructor) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Instructor not found" });
    }

    res.status(StatusCodes.OK).json({ instructor: updatedInstructor, message: "Instructor approved successfully" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

const rejectInstructorById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedInstructor = await Instructor.findByIdAndUpdate(id, { status: "Rejected" }, { new: true });

    if (!updatedInstructor) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Instructor not found" });
    }

    res.status(StatusCodes.OK).json({ instructor: updatedInstructor, message: "Instructor rejected successfully" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

const deleteInstructorById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedInstructor = await Instructor.findByIdAndDelete(id);

    if (!deletedInstructor) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Instructor not found' });
    }

    // Delete images associated with the instructor
    await deleteInstructorImages(deletedInstructor.idCard, deletedInstructor.instructorLicense);

    res.status(StatusCodes.OK).json({ message: 'Instructor deleted successfully' });
  } catch (error) {
    console.error('Error deleting instructor by ID:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};

const deleteInstructorImages = async (idCardImages, instructorLicenseImages) => {
  try {
    const deleteImages = async (images, folder) => {
      images.forEach((image) => {
        const filename = path.basename(image);
        const imagePath = path.join(__dirname, '..', 'uploads', 'instructor', folder, filename);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    };

    await deleteImages(idCardImages, 'idcards');
    await deleteImages(instructorLicenseImages, 'instructorlicense');
  } catch (error) {
    console.error('Error deleting instructor images:', error);
  }
};

const getInstructorProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const instructor = await Instructor.findById(id);

    if (!instructor) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Instructor not found"});
    }
      res.status(200).json(vendor);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createInstructor,
    getAllInstructors,
    getInstructorById,
    loginInstructor,
    updateInstructorById,
    approveInstructorById,
    rejectInstructorById,
    deleteInstructorById,
    getInstructorProfile
}