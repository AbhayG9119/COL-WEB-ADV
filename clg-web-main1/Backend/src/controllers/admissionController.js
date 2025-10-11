import AdmissionQuery from '../models/AdmissionQuery.js';

// Submit Admission Query
export const submitAdmissionQuery = async (req, res) => {
  try {
    const { name, email, phone, location, pincode, course, message } = req.body;

    const newQuery = new AdmissionQuery({
      name,
      email,
      phone,
      location,
      pincode,
      course,
      message
    });

    await newQuery.save();

    res.status(201).json({ message: 'Admission query submitted successfully', query: newQuery });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all Admission Queries for admin
export const getAdmissionQueries = async (req, res) => {
  try {
    const queries = await AdmissionQuery.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
