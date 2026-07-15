import { Product } from "../models/product.model.js";
import { AppError, AppSuccess } from "../utils/responseHandler.js";
import { redis } from "../lib/redis.js";
import { categoryChecking } from "../utils/categoryChecking.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary.js";

export const getAllProduct = async (req, res, next) => {
  const { category } = req.query;
  try {
    const validatedCategories = await categoryChecking(category);
    const filter = validatedCategories
      ? { category: { $in: validatedCategories } }
      : {};

    const products = await Product.find(filter);
    if (products.length === 0) {
      return AppSuccess(res, 200, "No products found");
    } else {
      return AppSuccess(res, 200, products);
    }
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProduct = async (req, res, next) => {
  try {
    let featuredProducts = await redis.get("featured_products");

    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }

    featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (featuredProducts.length === 0) {
      return AppSuccess(res, 200, "No featured products found");
    } else {
      await redis.set("featured_products", JSON.stringify(featuredProducts));
      return AppSuccess(res, 200, featuredProducts);
    }
  } catch (error) {
    next(error);
  }
};

export const getRecommendationProduct = async (req, res, next) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 10 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          imageURL: 1,
        },
      },
    ]);
    return AppSuccess(res, 200, products);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  const { name, description, price, category, stock } = req.body;
  let imageUrl;
  try {
    if (!req.files?.imageFile) {
      throw new AppError("Image file is required", 400);
    }

    const validatedCategories = await categoryChecking(category);
    if (!validatedCategories) throw new AppError("Category is required", 400);

    imageUrl = await uploadToCloudinary(req.files.imageFile);

    const product = new Product({
      name,
      description,
      price,
      imageURL: imageUrl,
      category: validatedCategories,
      stock,
    });
    const uploadedProduct = await product.save();
    return AppSuccess(res, 201, uploadedProduct);
  } catch (error) {
    if (imageUrl) await deleteFromCloudinary(imageUrl);
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const { name, description, price, category, stock, featured } =
    req.body || {};
  let oldImageUrl;
  let newImageUrl;
  try {
    const product = await Product.findById(id);
    if (!product) throw new AppError("Product not found", 404);

    if (!req.body && !req.files?.imageFile)
      throw new AppError("You are not changing anything", 400);

    // name, desc, price, stock, featured update
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (featured !== undefined && featured === "true")
      product.isFeatured = true;
    if (featured !== undefined && featured === "false")
      product.isFeatured = false;

    //category update
    if (category !== undefined) {
      const validatedCategories = await categoryChecking(category);
      product.category = validatedCategories;
    }

    //Image Update
    if (req.files?.imageFile) {
      oldImageUrl = product.imageURL;
      newImageUrl = await uploadToCloudinary(req.files.imageFile);
      product.imageURL = newImageUrl;
    }

    const updatedProduct = await product.save();
    if (updatedProduct && oldImageUrl) await deleteFromCloudinary(oldImageUrl);
    await redis.del("featured_products");
    return AppSuccess(res, 200, updatedProduct);
  } catch (error) {
    if (newImageUrl) await deleteFromCloudinary(newImageUrl);
    console.log(error);
    next(error);
    F;
  }
};

export const deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new AppError("Product not found", 404);
    await deleteFromCloudinary(product.imageURL);
    return AppSuccess(res, 200);
  } catch (error) {
    next(error);
  }
};
