import { EventEmitter } from 'events';
import { Server } from 'socket.io';
import { Notification, INotification } from '../Models/notification.model';

// Create a notification event emitter
export const notificationEmitter = new EventEmitter();

// Notification types
export const NotificationTypes = {
  ORDER: 'order',
  WHATSAPP_CONTACT: 'whatsapp_contact',
  EMAIL_CONTACT: 'email_contact'
} as const;

// Setup Socket.IO notification handling
export function setupNotificationHandlers(io: Server) {
  let adminSocket: any = null;

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
  notificationEmitter.on('notification', async (notificationData) => {
    try {
      const notification = new Notification(notificationData);
      await notification.save();
      
      if (adminSocket) {
        adminSocket.emit('new_notification', {
          ...notification.toObject(),
          soundType: getSoundType(notification.type)
        });
      }
    } catch (error) {
      console.error('Error handling notification:', error);
    }
  });
}

// Helper function to determine sound type
function getSoundType(notificationType: string): string {
  switch (notificationType) {
    case NotificationTypes.ORDER:
      return 'order';
    case NotificationTypes.WHATSAPP_CONTACT:
    case NotificationTypes.EMAIL_CONTACT:
      return 'message';
    default:
      return 'default';
  }
}

// Export function to emit notifications
export function emitNotification(notificationData: Partial<INotification>) {
  notificationEmitter.emit('notification', notificationData);
}