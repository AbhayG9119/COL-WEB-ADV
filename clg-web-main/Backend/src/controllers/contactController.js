import Contact from '../models/Contact.js';

export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, location, subject, message } = req.body;
    let imageUrl = null;
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    const contact = new Contact({ name, email, phone, location, subject, message, imageUrl });
    await contact.save();
    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Error submitting contact form:', error.message);
    res.status(500).json({ message: 'Failed to submit contact form' });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
