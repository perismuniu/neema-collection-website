
import { AppDispatch } from "./store";
import { setError, setLoading, setIsSuccess, setUserCart } from "./dataSlice";
import { setUser, setCredentials } from "./userSlice";
import { getUserCart, initiatePayment, confirmPayment } from "./api";
import { PaymentInitiation } from "./types";

export const loginUser = (dispatch: AppDispatch, email: string, password: string) => {
  // Implement login logic here
  // On success, call dispatch(setUser(userData)) and dispatch(setCredentials(token))
};

export const registerUser = (dispatch: AppDispatch, userData: any) => {
  // Implement registration logic here
  // On success, call dispatch(setUser(userData)) and dispatch(setCredentials(token))
};

export const logoutUser = (dispatch: AppDispatch) => {
  dispatch(setUser(null));
  dispatch(setCredentials(null));
  dispatch(setUserCart({ items: [], totalQuantity: 0, buyingTotalPrice: 0, user: null }));
};

export const updateUserProfile = (dispatch: AppDispatch, token: string, userData: any) => {
  // Implement update profile logic here
  // On success, call dispatch(setUser(updatedUserData))
};

export const processPayment = async (
  dispatch: AppDispatch,
  token: string,
  paymentDetails: PaymentInitiation
) => {
  try {
    dispatch(setLoading(true));

    // Validate phone number
    if (!validatePhoneNumber(paymentDetails.phoneNumber)) {
      throw new Error("Invalid phone number");
    }

    // Initiate payment
    const transactionId = await initiatePayment(dispatch, token, paymentDetails);

    // Start polling for payment confirmation
    const confirmationResult = await pollPaymentConfirmation(dispatch, token, transactionId);

    if (confirmationResult) {
      dispatch(setIsSuccess(true));
      // Clear the cart or update order status
      getUserCart(dispatch, token)
    } else {
      throw new Error("Payment confirmation failed");
    }

    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};

const validatePhoneNumber = (phoneNumber: string): boolean => {
  // Implement phone number validation logic here
  // This is a simple example, adjust according to your specific requirements
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phoneNumber);
};

const pollPaymentConfirmation = async (
  dispatch: AppDispatch,
  token: string,
  transactionId: string,
  maxAttempts = 10,
  interval = 5000
): Promise<boolean> => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const result = await confirmPayment(dispatch, token, transactionId);
      if (result) {
        return true;
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  return false;
};
