import express from 'express';
import { addFood, listFood, removeFood, updateFood, getFoodDetail } from '../controllers/foodController.js';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer to use Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Folder name in Cloudinary
    format: async (req, file) => 'png', // Supports promises as well
    public_id: (req, file) => file.originalname,
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post('/add', upload.single('file'), addFood);
router.get('/list', listFood);
router.delete('/remove', removeFood);
router.put('/update', upload.single('file'), updateFood);
router.get('/:id', getFoodDetail);

export default router;