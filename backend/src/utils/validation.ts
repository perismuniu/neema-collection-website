import { IProduct } from "../Models/product.model";

export const validateProduct = (product: Partial<IProduct>): string | null => {
    const { title, description, price, images, variants } = product;

    if (!title || !/^[a-zA-Z0-9\s]*$/.test(title)) {
        return "Title is required and must contain only letters, numbers, and spaces";
    }

    if (!description || !/^[a-zA-Z0-9\s]*$/.test(description)) {
        return "Description is required and must contain only letters, numbers, and spaces";
    }

    if (!price || isNaN(Number(price)) || Number(price) < 100) {
        return "Price is required and must be a number greater than or equal to 100";
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
        return "At least one image URL is required";
    }

    const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    if (!images.every(url => urlRegex.test(url))) {
        return "All image URLs must be valid";
    }

    if (!variants || !Array.isArray(variants) || variants.length === 0) {
        return "At least one variant is required";
    }

    for (const variant of variants) {
        if (!variant.color) {
            return "Each variant must have a color";
        }
        if (!variant.stock || !Array.isArray(variant.stock) || variant.stock.length === 0) {
            return "Each variant must have at least one stock item";
        }
        for (const stock of variant.stock) {
            if (!stock.size || !['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].includes(stock.size)) {
                return "Each stock item must have a valid size";
            }
            if (!stock.quantity || isNaN(Number(stock.quantity)) || Number(stock.quantity) < 0) {
                return "Each stock item must have a valid quantity (non-negative number)";
            }
        }
    }

    return null;
};