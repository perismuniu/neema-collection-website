import { io } from 'socket.io-client';
import messageSound from '../../not-sound/message.mp3';
import orderSound from '../../not-sound/order.mp3';
import { useEffect, useState } from 'react';

const notificationSounds = {
  message: new Audio(messageSound),
  order: new Audio(orderSound)
};

const socketUrl = 'http://localhost:3002';
const socket = io(socketUrl);

const NotificationSoundManager = () => {
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      setIsSocketConnected(true);
    });

    socket.on('disconnect', () => {
      setIsSocketConnected(false);
    });

    const handleNewNotification = (notification) => {
      if (isSocketConnected) {
        const sound = notificationSounds[notification.soundType];
        if (sound) {
          sound.play().catch(error => console.error('Error playing sound:', error));
        }
      }
    };

    if (isSocketConnected) {
      socket.on('new_notification', handleNewNotification);
    }

    return () => {
      if (isSocketConnected) {
        socket.off('new_notification', handleNewNotification);
      }
    };
  }, [isSocketConnected]);

  return null; // This component doesn't render anything
};

export default NotificationSoundManager;