import foodModel from "../models/foodModel.js";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import fs from 'fs';

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

// Add food item
const addFood = async (req, res) => {
  const image_url = req.file.path;

  const food = new foodModel({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    category: req.body.category,
    image: image_url
  });

  try {
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error!" });
  }
};

// All food list
const listFood = async (req, res) => {
  try {
    const { sortBy, search } = req.query; // Nhận kiểu sắp xếp và từ khóa tìm kiếm từ query params
    const query = {};

    // Nếu có từ khóa tìm kiếm, thêm vào query
    if (search) {
      query.name = { $regex: search, $options: 'i' }; // Tìm kiếm không phân biệt chữ hoa chữ thường
    }

    const foods = await foodModel.find(query); // Lấy danh sách thực phẩm theo query

    // Sắp xếp danh sách thực phẩm theo kiểu được yêu cầu
    if (sortBy === "name") {
      foods.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "price") {
      foods.sort((a, b) => a.price - b.price);
    } else if (sortBy === "category") {
      foods.sort((a, b) => a.category.localeCompare(b.category));
    }

    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error!" });
  }
};

// Remove food item
const removeFood = async (req, res) => {
  try {
    const ids = req.body.ids; // Nhận danh sách id từ request
    const foods = await foodModel.find({ _id: { $in: ids } });

    // Xóa các hình ảnh từ Cloudinary
    for (const food of foods) {
      const public_id = food.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(public_id);
    }

    await foodModel.deleteMany({ _id: { $in: ids } }); // Xóa nhiều sản phẩm
    res.json({ success: true, message: "Foods removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error!" });
  }
};

// Update food item
const updateFood = async (req, res) => {
  try {
    const { id, name, price, description, category } = req.body;
    const food = await foodModel.findById(id);

    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found!" });
    }

    if (req.file) {
      const public_id = food.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(public_id);
      food.image = req.file.path;
    }
    food.name = name || food.name;
    food.price = price || food.price;
    food.description = description || food.description;
    food.category = category || food.category;

    await food.save();

    res.json({ success: true, message: "Food updated successfully", data: food });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating food!" });
  }
};

// Get food detail
const getFoodDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await foodModel.findById(id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found!" });
    }
    res.json({ success: true, data: food });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching food detail!" });
  }
};

export { addFood, listFood, removeFood, updateFood, getFoodDetail };