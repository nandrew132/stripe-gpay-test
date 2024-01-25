// Dummy IP
const BACKEND_ROOT_URL = 'http://132.168.44.33:3000/api/';

export const fetchPaymentSheetParams = async (amount) => {
  try {
    const idToken = '123'
    console.log('Fetching payment sheet: ', amount);
    const response = await fetch(
      BACKEND_ROOT_URL + "payments/payment-sheet",
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          userId: "qer",
          amount: amount,
        }),
      });
      
    const { paymentIntent, ephemeralKey, customer } = await response.json();
    if(response.status != 200) {
      console.log('Error getting payment sheet info: Status not successful');
      throw new Error("Error getting payment sheet info");  
    }
    console.log('returning stuff: ', customer);
    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  } catch (e) {
    console.log('Error getting payment sheet info: ', e);
    throw new Error("Error getting payment sheet info");
  }
};