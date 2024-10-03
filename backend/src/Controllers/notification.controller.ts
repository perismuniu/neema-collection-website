import { Request, Response } from "express";
import { Notification } from "../Models/notification.model";

export const getNotifications = async (req: any, res: Response) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};