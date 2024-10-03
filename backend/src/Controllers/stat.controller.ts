import { Request, Response } from "express";
import { Order } from "../Models/order.model";

export const getDashboardStats = async (req: any, res: Response) => {
  try {
    const user = req.user;
    
    // Get current date and last month's date
    const currentDate = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // Get all orders
    const allOrders = await Order.find({ user: user._id });
    
    // Get last month's orders
    const lastMonthOrders = await Order.find({
      user: user._id,
      createdAt: { $gte: lastMonth, $lte: currentDate }
    });

    // Get previous month's orders for comparison
    const previousMonth = new Date(lastMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    const previousMonthOrders = await Order.find({
      user: user._id,
      createdAt: { $gte: previousMonth, $lte: lastMonth }
    });

    // Calculate total sales
    const totalSales = allOrders.reduce((sum, order) => sum + order.total, 0);
    
    // Calculate last month's sales
    const lastMonthSales = lastMonthOrders.reduce((sum, order) => sum + order.total, 0);
    const previousMonthSales = previousMonthOrders.reduce((sum, order) => sum + order.total, 0);

    // Calculate percentage changes
    const salesChange = previousMonthSales === 0 
      ? 100 
      : Math.round(((lastMonthSales - previousMonthSales) / previousMonthSales) * 100);

    const ordersChange = previousMonthOrders.length === 0 
      ? 100 
      : Math.round(((lastMonthOrders.length - previousMonthOrders.length) / previousMonthOrders.length) * 100);

    res.status(200).json({
      userName: user.name || "User",
      totalSales,
      totalOrders: allOrders.length,
      salesChange,
      ordersChange
    });

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Error fetching dashboard statistics" });
  }
};

export const getTopProducts = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate('items.product');
    
    // Create a map to store product sales data
    const productSales = new Map();
    
    // Aggregate sales data
    orders.forEach(order => {
      order.items.forEach(item => {
        const productId = (item.product as any)._id.toString();
        if (!productSales.has(productId)) {
          productSales.set(productId, {
            _id: productId,
            title: (item.product as any).title,
            price: (item.product as any).price,
            soldCount: 0
          });
        }
        const product = productSales.get(productId);
        product.soldCount += item.quantity;
      });
    });
    
    // Convert map to array and sort by soldCount
    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.soldCount - a.soldCount)
      .slice(0, 5);
    
    res.status(200).json(topProducts);
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json({ message: "Error fetching top products" });
  }
};

export const getRevenueData = async (req: Request, res: Response) => {
  try {
    const { timeframe } = req.query;
    let startDate = new Date();
    let groupByFormat: { $dateToString: { format: string; date: string } };

    switch (timeframe) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        groupByFormat = {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        };
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        groupByFormat = {
          $dateToString: { format: "%Y-%m", date: "$createdAt" }
        };
        break;
      default: // month
        startDate.setMonth(startDate.getMonth() - 1);
        groupByFormat = {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        };
    }

    const revenueData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: groupByFormat,
          revenue: { $sum: "$total" },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Transform the data to match the frontend's expected format
    const formattedData = revenueData.map(item => ({
      name: item._id,
      revenue: item.revenue,
      orders: item.orders
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    res.status(500).json({ message: "Error fetching revenue data" });
  }
};