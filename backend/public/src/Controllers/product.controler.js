"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProduct = exports.getProductById = exports.deleteProduct = exports.updateProduct = exports.addProduct = exports.getAllProducts = void 0;
const product_model_1 = require("../Models/product.model");
const validation_1 = require("../utils/validation");
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = req.user;
        let query = {};
        console.log(user);
        // If user is not admin, only show active products
        if (!(user === null || user === void 0 ? void 0 : user.isAdmin)) {
            query = { active: true };
        }
        else if (((_a = user.adminSettings) === null || _a === void 0 ? void 0 : _a.showInactiveProducts) === false) {
            // If admin has chosen to hide inactive products
            query = { active: true };
        }
        const products = yield product_model_1.Product.find(query).lean();
        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }
        res.json(products);
    }
    catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).json({ message: 'Error retrieving products' });
    }
});
exports.getAllProducts = getAllProducts;
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, price, category, variants, images } = req.body;
    const validationError = (0, validation_1.validateProduct)(req.body);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }
    try {
        const existingProduct = yield product_model_1.Product.findOne({ title });
        if (existingProduct) {
            return res.status(409).json({ message: `Product with this title already exists. Please use a different title.` });
        }
        const newProduct = new product_model_1.Product({
            title, description, price, category, variants, images
        });
        yield newProduct.save();
        res.status(201).json({ message: `Product ${title} added successfully!`, product: newProduct });
    }
    catch (error) {
        console.error('Error saving product:', error);
        res.status(500).json({ message: `Error saving product ${title}!` });
    }
});
exports.addProduct = addProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const updateData = req.body;
    console.log('Updating product:', {
        productId,
        updateData,
        bodyKeys: Object.keys(updateData)
    });
    try {
        if (!productId) {
            console.error('No productId provided');
            return res.status(400).json({ message: 'Product ID is required' });
        }
        const product = yield product_model_1.Product.findById(productId);
        console.log('Found product:', product);
        if (!product) {
            console.error(`No product found with ID ${productId}`);
            return res.status(404).json({ message: 'Product not found' });
        }
        if ('active' in updateData) {
            console.log(`Updating active state from ${product.active} to ${updateData.active}`);
            product.active = updateData.active;
        }
        const updatedProduct = yield product.save();
        console.log('Product updated successfully:', updatedProduct);
        res.json({
            message: 'Product updated successfully',
            product: updatedProduct
        });
    }
    catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            message: 'Error updating product',
            error: error.message
        });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    try {
        const product = yield product_model_1.Product.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully', product });
    }
    catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product' });
    }
});
exports.deleteProduct = deleteProduct;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    // console.log(productId)
    try {
        const product = yield product_model_1.Product.findById(productId);
        if (!product) {
            res.json({ message: 'Product not found' });
        }
        else {
            res.json(product);
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error retrieving product' });
    }
});
exports.getProductById = getProductById;
const searchProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, category, minPrice, maxPrice } = req.query;
    try {
        let query = {};
        if (searchTerm) {
            query = { $or: [{ title: { $regex: searchTerm, $options: 'i' } }, { description: { $regex: searchTerm, $options: 'i' } }] };
        }
        if (category) {
            query.category = category;
        }
        if (minPrice && maxPrice) {
            query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
        }
        const products = yield product_model_1.Product.find(query);
        res.json(products);
    }
    catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.searchProduct = searchProduct;
