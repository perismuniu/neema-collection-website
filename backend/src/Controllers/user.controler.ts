import { Request, Response } from "express";
import { UserModel } from "../Models/user.model";
import bcrypt from 'bcrypt'

export const updateUserSettings = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const updates = req.body;

        // Validate that only allowed settings are being updated
        const allowedSettings = ['showInactiveProducts', 'emailNotifications', 'pushNotifications', 'twoFactorAuth'];
        const updatesObj = {};
        
        console.log('user.controller line 13',  Object.entries(updates))


        for (const [key, value] of Object.entries(updates)) {
            if (allowedSettings.includes(key)) {
                (updatesObj as any)[`adminSettings.${key}`] = value ;
            }
        }

        const user = await UserModel.findByIdAndUpdate(
            userId,
            { $set: updatesObj },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Settings updated successfully', adminSettings: user.adminSettings });
    } catch (error) {
        console.error('Error updating user settings:', error);
        res.status(500).json({ message: 'Error updating settings' });
    }
};

export const getUserSettings = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const user = await UserModel.findById(userId).select('adminSettings isAdmin');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        res.json({
            isAdmin: user.isAdmin,
            adminSettings: user.adminSettings
        });
    } catch (error) {
        console.error('Error fetching user settings:', error);
        res.status(500).json({ message: 'Error fetching settings' });
    }
};

export const getUsers = async (req: any, res: Response) => {
    try {
      const users = await UserModel.aggregate([
        {
          $match: { isAdmin: false },
        },
        {
          $lookup: {
            from: "orders",
            localField: "_id",
            foreignField: "user",
            as: "orders",
          },
        },
        {
          $addFields: {
            totalSpent: {
              $sum: "$orders.total",
            },
          },
        },
        {
          $project: {
            _id: 1,
            username: 1,
            email: 1,
            phone: 1,
            avatar: 1,
            totalSpent: 1,
          },
        },
      ]);
  
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Error fetching users" });
    }
  };



export const updateProfile = async (req:any, res:Response) => {
  try {
    const updates = req.body;
    const userId = req.user._id; 

    // If email is being updated, check if it's already in use
    if (updates.email) {
      const emailExists = await UserModel.findOne({ email: updates.email, _id: { $ne: userId } });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // If phone is being updated, check if it's already in use
    if (updates.phone) {
      const phoneExists = await UserModel.findOne({ phone: updates.phone, _id: { $ne: userId } });
      if (phoneExists) {
        return res.status(400).json({ message: 'Phone number already in use' });
      }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password -adminSettings');

    res.json(updatedUser);
  } catch (error:any) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePassword = async (req:any, res:Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user = await UserModel.findById(userId);
    const isMatch = await bcrypt.compare(currentPassword, user?.password as any);

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.findByIdAndUpdate(userId, { password: hashedPassword });

    res.json({ message: 'Password updated successfully' });
  } catch (error:any) {
    res.status(400).json({ message: error.message });
  }
};
