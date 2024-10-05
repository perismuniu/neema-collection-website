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
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitNotification = exports.setupNotificationHandlers = exports.NotificationTypes = exports.notificationEmitter = void 0;
const events_1 = require("events");
const notification_model_1 = require("../Models/notification.model");
// Create a notification event emitter
exports.notificationEmitter = new events_1.EventEmitter();
// Notification types
exports.NotificationTypes = {
    ORDER: 'order',
    WHATSAPP_CONTACT: 'whatsapp_contact',
    EMAIL_CONTACT: 'email_contact'
};
// Setup Socket.IO notification handling
function setupNotificationHandlers(io) {
    let adminSocket = null;
    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);
        socket.on('auth_admin', () => {
            adminSocket = socket;
            console.log('Admin authenticated');
        });
        socket.on('disconnect', () => {
            if (socket === adminSocket) {
                adminSocket = null;
                console.log('Admin disconnected');
            }
        });
    });
    // Listen for notification events
    exports.notificationEmitter.on('notification', (notificationData) => __awaiter(this, void 0, void 0, function* () {
        try {
            const notification = new notification_model_1.Notification(notificationData);
            yield notification.save();
            if (adminSocket) {
                adminSocket.emit('new_notification', Object.assign(Object.assign({}, notification.toObject()), { soundType: getSoundType(notification.type) }));
            }
        }
        catch (error) {
            console.error('Error handling notification:', error);
        }
    }));
}
exports.setupNotificationHandlers = setupNotificationHandlers;
// Helper function to determine sound type
function getSoundType(notificationType) {
    switch (notificationType) {
        case exports.NotificationTypes.ORDER:
            return 'order';
        case exports.NotificationTypes.WHATSAPP_CONTACT:
        case exports.NotificationTypes.EMAIL_CONTACT:
            return 'message';
        default:
            return 'default';
    }
}
// Export function to emit notifications
function emitNotification(notificationData) {
    exports.notificationEmitter.emit('notification', notificationData);
}
exports.emitNotification = emitNotification;
