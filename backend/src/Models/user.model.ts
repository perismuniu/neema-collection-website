// src\Model\user.model.ts
import mongoose from "mongoose";
import { Schema } from "mongoose";

export interface IUser {
    _id: mongoose.Schema.Types.ObjectId,
    username: string;
    email: string;
    phone: String;
    isAdmin: boolean;
    password: string;
    address: string;
    wallet: number;
    deliveryType: string;
    orders: Array<mongoose.Schema.Types.ObjectId>;
    // New admin-specific fields
    adminSettings: {
      showInactiveProducts: boolean;
      emailNotifications: boolean;
      pushNotifications: boolean;
      twoFactorAuth: boolean;
    };
  }
  
  export const UserSchema = new Schema<IUser>({
      username: {
          type: String,
          required: true,
          match: /^[a-zA-Z\s]*$/
      },
      email: {
          type: String,
          required: true,
          unique: true,
          match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      },
      password: {
          type: String,
          required: false,
      },
      isAdmin: {
          type: Boolean,
          default: false
      },
      orders: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order"
      }],
      phone: {type: String},
      deliveryType: {type: String},
      address: {type: String},
      adminSettings: {
          showInactiveProducts: { type: Boolean, default: true },
          emailNotifications: { type: Boolean, default: true },
          pushNotifications: { type: Boolean, default: true },
          twoFactorAuth: { type: Boolean, default: false }
      }
  }, { timestamps: true });
  
  export const UserModel = mongoose.model<IUser>("User", UserSchema);