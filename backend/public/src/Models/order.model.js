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
exports.Order = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const OrderSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            product: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true },
            color: { type: String, required: true },
            size: { type: String, required: true },
            itemTotalPrice: { type: Number, required: true },
        },
    ],
    status: {
        type: String,
        enum: ['pending', 'pending_payment', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: { type: String, required: true, enum: ["mpesa", "payment on delivery"], default: "mpesa" },
    deliveryType: { type: String, enum: ["Shop pick-up", "Home delivery"], default: "Shop pick-up", required: true },
    total: { type: Number, required: true },
    shippingInfo: {
        address: { type: String },
        city: { type: String },
        postalCode: { type: String },
    },
    mpesaRequestId: { type: String },
    paymentDetails: { type: mongoose_1.Schema.Types.Mixed },
    mtnGhanaTransactionId: { type: String },
    mpesaCheckoutRequestId: { type: String },
}, { timestamps: true });
exports.Order = mongoose_1.default.model("Order", OrderSchema);
