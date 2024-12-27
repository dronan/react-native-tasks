import React, {useState} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default props => {
  const [secureText, setSecureText] = useState(props.secureTextEntry);

  return (
    <View style={[styles.container, props.style]}>
      <Icon name={props.icon} size={20} style={styles.iconLeft} />
      <TextInput {...props} style={styles.input} secureTextEntry={secureText} />
      {props.secureTextEntry && (
        <Icon
          name={secureText ? 'eye-slash' : 'eye'}
          size={20}
          style={styles.iconRight}
          onPress={() => setSecureText(!secureText)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 40,
    backgroundColor: '#EEE',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  iconLeft: {
    color: '#333',
    marginLeft: 20,
  },
  iconRight: {
    color: '#333',
    position: 'absolute',
    float: 'right',
    right: 20,
  },
  input: {
    marginLeft: 20,
    width: '70%',
  },
});
