import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PaymentScreen from './paymentScreen';
import HomeScreen from './welcomeScreen';
import { StripeProvider } from '@stripe/stripe-react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StripeProvider publishableKey="pk_test_51OX6ADL9i6IIwBIYuightZazBQKlTJGJrV88vkyaRqMWrDHCy1XuA3DkB8cjK4nvyx2RfUN1N5kfIEytCjdJgdES00HV0ZtlE4">
        <Stack.Navigator>
          <Stack.Screen name="Welcome" component={HomeScreen} />
          <Stack.Screen name="Payments" component={PaymentScreen}/>
        </Stack.Navigator>
      </StripeProvider>
    </NavigationContainer>
  )
}
