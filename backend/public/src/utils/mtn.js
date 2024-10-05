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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkMtnGhanaPaymentStatus = exports.initiateMtnGhanaPayment = void 0;
const axios_1 = __importDefault(require("axios"));
const MTN_GHANA_API_URL = 'https://api.mtn.com/ghana/payments'; // Replace with the actual API URL
const initiateMtnGhanaPayment = (amount, phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(MTN_GHANA_API_URL + '/initiate', {
            amount,
            phoneNumber,
            // Add other required parameters
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.MTN_GHANA_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data.transactionId;
    }
    catch (error) {
        console.error('Error initiating MTN Ghana payment:', error);
        throw error;
    }
});
exports.initiateMtnGhanaPayment = initiateMtnGhanaPayment;
const checkMtnGhanaPaymentStatus = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(MTN_GHANA_API_URL + `/status/${transactionId}`, {
            headers: {
                'Authorization': `Bearer ${process.env.MTN_GHANA_API_KEY}`,
            },
        });
        return response.data.status; // Assuming the API returns a status field
    }
    catch (error) {
        console.error('Error checking MTN Ghana payment status:', error);
        throw error;
    }
});
exports.checkMtnGhanaPaymentStatus = checkMtnGhanaPaymentStatus;
