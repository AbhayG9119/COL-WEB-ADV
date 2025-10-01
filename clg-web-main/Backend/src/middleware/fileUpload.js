import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for document uploads (memory storage)
const documentStorage = multer.memoryStorage();

const documentFileFilter = (req, file, cb) => {
  // Allowed file types for documents
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, PDF, DOC, and DOCX files are allowed.'), false);
  }
};

const documentUpload = multer({
  storage: documentStorage,
  fileFilter: documentFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 7 // Allow up to 7 files total (1 idProof + 5 qualificationCertificates + 1 appointmentLetter)
  }
});

// Configure multer for image uploads only (disk storage)
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/admission-photos/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.params.studentId + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const imageFileFilter = (req, file, cb) => {
  // Only allow image types for admission photos
  const allowedImageTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];

  if (allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, and PNG image files are allowed for admission photos.'), false);
  }
};

const imageUpload = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit for images
    files: 1 // Only one file per upload
  }
});

// Configure multer for study material uploads (PDF only)
const studyMaterialStorage = multer.memoryStorage();

const studyMaterialFileFilter = (req, file, cb) => {
  // Only allow PDF files for study materials
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF files are allowed for study materials.'), false);
  }
};

const studyMaterialUpload = multer({
  storage: studyMaterialStorage,
  fileFilter: studyMaterialFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for study materials
    files: 1 // Only one file per upload
  }
});

// Middleware for handling document uploads (single)
export const uploadDocument = documentUpload.single('document');

// Middleware for handling multiple document uploads
export const uploadDocuments = documentUpload.fields([
  { name: 'idProof', maxCount: 1 },
  { name: 'qualificationCertificates', maxCount: 5 },
  { name: 'appointmentLetter', maxCount: 1 }
]);

// Middleware for handling study material uploads (PDF only)
export const uploadStudyMaterial = studyMaterialUpload.single('file');

// Configure multer for faculty profile picture uploads (disk storage, images only)
const facultyProfilePicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/profile-pictures/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.user._id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const facultyProfilePicUpload = multer({
  storage: facultyProfilePicStorage,
  fileFilter: imageFileFilter, // Reuse image filter (JPG, PNG)
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit for images
    files: 1 // Only one file per upload
  }
});

// Middleware for handling image uploads (admission photos)
export const uploadAdmissionPhoto = imageUpload.single('admissionPhoto');

// Middleware for handling faculty profile picture uploads
export const uploadFacultyProfilePic = facultyProfilePicUpload.single('profilePicture');

// Error handling middleware for multer
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB for documents, 2MB for images.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 7 files allowed (1 ID proof, 5 qualification certificates, 1 appointment letter).'
      });
    }
  }

  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  next(error);
};

export default uploadDocument;
