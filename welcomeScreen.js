import {StyleSheet, Text, View, Button} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/core';

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text color="black"> Welcome !! </Text>      
      <Button title="Pay" onPress={() => navigation.navigate('Payments')}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  },
});