import { fetchPaymentSheetParams } from "./lib/paymentServiceCalls";
import { PlatformPay, PlatformPayButton, useStripe, usePlatformPay, usePaymentSheet } from '@stripe/stripe-react-native';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Alert } from 'react-native';
import {Picker} from '@react-native-picker/picker';

export default function PaymentScreen() {
  const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();
  const [loading, setLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const { isPlatformPaySupported, confirmPlatformPayPayment } = usePlatformPay();

  const initializePaymentSheet = async (amount) => {
    try {
      if (!(await isPlatformPaySupported({ googlePay: {testEnv: true} }))) {
        Alert.alert('Google Pay is not supported.');
        return;
      } else {
        console.log('google pay supported')
      }
      const {
        paymentIntent,
        ephemeralKey,
        customer,
        publishableKey,
      } = await fetchPaymentSheetParams(amount);
      console.log('got stuff');
      setClientSecret(paymentIntent);
      const { error, paymentOption } = await initPaymentSheet({
        merchantDisplayName: "Example, Inc",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        applePay: {
          merchantCountryCode: 'US',
        },
        googlePay: {
          merchantCountryCode: 'US',
          testEnv: true,
          currencyCode: 'usd',
        },
        // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
        //methods that complete payment after a delay, like SEPA Debit and Sofort.
        allowsDelayedPaymentMethods: true,

        defaultBillingDetails: {
          name: 'Jane Doe',
        },
      });
      if (!error) {
        console.log('payment option: ', paymentOption);
        setLoading(true);
      } else {
        console.log('INIT Error: ', error);
      }

    } catch(e) {
      console.log('caught error:' , e);
      Alert.alert('Failed', 'Your request could not be processed');
    }
  };

  useEffect(() => {
    console.log('selected amount: ', selectedAmount);
    if(selectedAmount != null) {
      initializePaymentSheet(selectedAmount);
    }    
  }, [selectedAmount]);

  const gpay = async() => {
    const { error } = await confirmPlatformPayPayment(
      clientSecret,
      {
        googlePay: {
          testEnv: true,
          merchantName: 'Example, Inc',
          merchantCountryCode: 'US',
          currencyCode: 'USD',
          billingAddressConfig: {
            format: PlatformPay.BillingAddressFormat.Full,
            isPhoneNumberRequired: true,
            isRequired: true,
          },
        },
      }
    );

    if (error) {
      Alert.alert(error.code, error.message);
      // Update UI to prompt user to retry payment (and possibly another payment method)
      return;
    }
    Alert.alert('Success', 'The payment was confirmed successfully.');
  }

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      // TODO: Update rewards
      Alert.alert('Success', 'Your purchase is successful!');
    }
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedAmount}
        onValueChange={(itemValue, itemIndex) => setSelectedAmount(itemValue)}
        style={styles.picker}
        itemStyle={styles.pickerItem}
        dropdownIconColor='black'
      >
        <Picker.Item label="Select an option" value={null} />
        <Picker.Item label="$2.50" value="2.50" />
        <Picker.Item label="$5" value="5" />
        <Picker.Item label="$10" value="10" />
        <Picker.Item label="$20" value="20" />
      </Picker>

      <Button
        title="Buy - Mobile Element"
        onPress={openPaymentSheet}
        disabled={!loading} // Disable the button if no option is selected
      />
      <PlatformPayButton
        type={PlatformPay.ButtonType.Pay}
        onPress={gpay}
        style={{
          width: '100%',
          height: 50,
        }}
        disabled={!loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    width: 200,
    height: 50,
    borderColor: 'black',
    borderWidth: 1,
    color: 'black',
  },
  pickerItem: {
    color: 'black', // Set the text color for items
  },
});