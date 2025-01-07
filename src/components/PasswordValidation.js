import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from '@react-native-vector-icons/fontawesome';

const PasswordValidation = ({
  password,
  confirmPassword,
  onValidationChange,
  contrast,
}) => {
  const validations = [
    {
      condition: password && password.length >= 6,
      label: 'Contains at least 6 characters',
    },
    {
      condition: /^(?=.*[0-9])/.test(password),
      label: 'Contains at least one number',
    },
    {
      condition: /^(?=.*[a-z])/.test(password),
      label: 'Contains at least one lowercase letter',
    },
    {
      condition: /^(?=.*[A-Z])/.test(password),
      label: 'Contains at least one uppercase letter',
    },
    {
      condition: /^(?=.*[!@#$%^&*])/.test(password),
      label: 'Contains at least one special character',
    },
    {
      condition: password === confirmPassword && password.length > 0,
      label: 'Passwords match',
    },
  ];

  // Verifica se todas as validações são verdadeiras
  const allValid = validations.every(item => item.condition);

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(allValid ? true : false);
    }
  }, [allValid, onValidationChange]);

  return (
    <View style={styles.container}>
      {validations.map((item, index) => (
        <View key={index} style={styles.validationItem}>
          <Icon
            name={item.condition ? 'check-circle' : 'circle-thin'}
            size={20}
            color={item.condition ? 'green' : 'gray'}
          />
          <Text
            style={[
              styles.validationText,
              {color: contrast ? '#000' : '#FFF'},
            ]}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default PasswordValidation;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  validationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  validationText: {
    marginLeft: 10,
    color: '#FFF',
  },
});
