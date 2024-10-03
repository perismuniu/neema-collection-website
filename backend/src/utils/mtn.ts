import axios from 'axios';

const MTN_GHANA_API_URL = 'https://api.mtn.com/ghana/payments'; // Replace with the actual API URL

export const initiateMtnGhanaPayment = async (amount: number, phoneNumber: string) => {
  try {
    const response = await axios.post(MTN_GHANA_API_URL + '/initiate', {
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
  } catch (error) {
    console.error('Error initiating MTN Ghana payment:', error);
    throw error;
  }
};

export const checkMtnGhanaPaymentStatus = async (transactionId: string) => {
  try {
    const response = await axios.get(MTN_GHANA_API_URL + `/status/${transactionId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.MTN_GHANA_API_KEY}`,
      },
    });

    return response.data.status; // Assuming the API returns a status field
  } catch (error) {
    console.error('Error checking MTN Ghana payment status:', error);
    throw error;
  }
};