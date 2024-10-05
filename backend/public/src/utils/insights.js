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
exports.getInsights = void 0;
const lodash_1 = __importDefault(require("lodash"));
const user_model_1 = require("../Models/user.model");
const order_model_1 = require("../Models/order.model");
const product_model_1 = require("../Models/product.model");
const currentMonth = new Date();
const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
const getInsights = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield product_model_1.Product.find({});
    const orders = yield order_model_1.Order.find({});
    const users = yield user_model_1.UserModel.find({});
    const currentMonthOrders = lodash_1.default.filter(orders, (order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getFullYear() === currentMonth.getFullYear() && orderDate.getMonth() === currentMonth.getMonth();
    });
    const lastMonthOrders = lodash_1.default.filter(orders, (order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getFullYear() === lastMonth.getFullYear() && orderDate.getMonth() === lastMonth.getMonth();
    });
    const currentMonthUsers = lodash_1.default.filter(users, (user) => {
        const userDate = new Date(user.createdAt);
        return userDate.getFullYear() === currentMonth.getFullYear() && userDate.getMonth() === currentMonth.getMonth();
    });
    const lastMonthUsers = lodash_1.default.filter(users, (user) => {
        const userDate = new Date(user.createdAt);
        return userDate.getFullYear() === lastMonth.getFullYear() && userDate.getMonth() === lastMonth.getMonth();
    });
    const currentMonthProducts = lodash_1.default.filter(products, (product) => {
        const productDate = new Date(product.createdAt);
        return productDate.getFullYear() === currentMonth.getFullYear() && productDate.getMonth() === currentMonth.getMonth();
    });
    const lastMonthProducts = lodash_1.default.filter(products, (product) => {
        const productDate = new Date(product.createdAt);
        return productDate.getFullYear() === lastMonth.getFullYear() && productDate.getMonth() === lastMonth.getMonth();
    });
    const currentMonthTotalOrders = lodash_1.default.size(currentMonthOrders);
    const lastMonthTotalOrders = lodash_1.default.size(lastMonthOrders);
    const currentMonthTotalUsers = lodash_1.default.size(currentMonthUsers);
    const lastMonthTotalUsers = lodash_1.default.size(lastMonthUsers);
    const currentMonthTotalProducts = lodash_1.default.size(currentMonthProducts);
    const lastMonthTotalProducts = lodash_1.default.size(lastMonthProducts);
    const currentMonthTotalSale = lodash_1.default.sumBy(currentMonthOrders, "total");
    const lastMonthTotalSales = lodash_1.default.sumBy(lastMonthOrders, "total");
    const totalOrderPercentageChange = ((currentMonthTotalOrders - lastMonthTotalOrders) / lastMonthTotalOrders) * 100;
    const totalUserPercentageChange = ((currentMonthTotalUsers - lastMonthTotalUsers) / lastMonthTotalUsers) * 100;
    const totalProductPercentageChange = ((currentMonthTotalProducts - lastMonthTotalProducts) / lastMonthTotalProducts) * 100;
    const totalSalePercentageChange = ((currentMonthTotalSale - lastMonthTotalSales) / lastMonthTotalSales) * 100;
    return {
        currentMonthTotalOrders,
        lastMonthTotalOrders,
        currentMonthTotalUsers,
        lastMonthTotalUsers,
        currentMonthTotalProducts,
        lastMonthTotalProducts,
        currentMonthTotalSale,
        lastMonthTotalSales,
        totalOrderPercentageChange,
        totalUserPercentageChange,
        totalProductPercentageChange,
        totalSalePercentageChange
    };
});
exports.getInsights = getInsights;
