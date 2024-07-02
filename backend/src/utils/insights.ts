import _ from "lodash"
import { UserModel } from "../Models/user.model"
import { order } from "../Models/order.model"
import { Product } from "../Models/product.model"

const currentMonth = new Date()
const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)

export const getInsights = async () => {
    const products = await Product.find({})
    const orders = await order.find({})
    const users = await UserModel.find({})

    const currentMonthOrders = _.filter(orders, (order:any) => {
        const orderDate = new Date(order.createdAt)
        return orderDate.getFullYear() === currentMonth.getFullYear() && orderDate.getMonth() === currentMonth.getMonth()
    })

    const lastMonthOrders = _.filter(orders, (order:any) => {
        const orderDate = new Date(order.createdAt)
        return orderDate.getFullYear() === lastMonth.getFullYear() && orderDate.getMonth() === lastMonth.getMonth()
    })
    const currentMonthUsers = _.filter(users, (user:any) => {
        const userDate = new Date(user.createdAt)
        return userDate.getFullYear() === currentMonth.getFullYear() && userDate.getMonth() === currentMonth.getMonth()
    })

    const lastMonthUsers = _.filter(users, (user:any) => {
        const userDate = new Date(user.createdAt)
        return userDate.getFullYear() === lastMonth.getFullYear() && userDate.getMonth() === lastMonth.getMonth()
    })

    const currentMonthProducts = _.filter(products, (product:any) => {
        const productDate = new Date(product.createdAt)
        return productDate.getFullYear() === currentMonth.getFullYear() && productDate.getMonth() === currentMonth.getMonth()
    })

    const lastMonthProducts = _.filter(products, (product:any) => {
        const productDate = new Date(product.createdAt)
        return productDate.getFullYear() === lastMonth.getFullYear() && productDate.getMonth() === lastMonth.getMonth()
    })

    const currentMonthTotalOrders = _.size(currentMonthOrders)
    const lastMonthTotalOrders = _.size(lastMonthOrders)
    const currentMonthTotalUsers = _.size(currentMonthUsers)
    const lastMonthTotalUsers = _.size(lastMonthUsers)
    const currentMonthTotalProducts = _.size(currentMonthProducts)
    const lastMonthTotalProducts = _.size(lastMonthProducts)
    const currentMonthTotalSale = _.sumBy(currentMonthOrders, "total")
}