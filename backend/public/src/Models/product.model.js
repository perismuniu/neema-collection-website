"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = exports.ProductSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Product Schema
exports.ProductSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        match: /^[0-9]*$/,
    },
    active: {
        type: Boolean,
        require: true,
        default: true
    },
    images: [
        {
            type: String,
            required: false,
            match: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        },
    ],
    category: {
        type: String,
        required: false,
    },
    variants: [
        {
            color: { type: String, required: true },
            stock: [{
                    size: {
                        type: String,
                        required: true,
                        enum: ["XS", "S", "X", "M", "L", "XL", "XXL", "XXXL"],
                    },
                    quantity: {
                        type: Number,
                        required: true,
                        match: /^[0-9]*$/,
                    },
                }],
        },
    ],
    discount: { type: Number, required: false },
    rating: { type: Number, required: false },
    reviews: [
        {
            rating: { type: Number, required: false },
            review: { type: String, required: false },
            username: { type: String, required: false },
        },
    ],
}, { timestamps: true });
// ProductSchema.virtual("stock").get(function () {
//   return this.colors.reduce((acc, color) => acc + color.stock.quantity, 0);
// });
exports.Product = mongoose_1.default.model("Product", exports.ProductSchema);
