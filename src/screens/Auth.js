import React, {Component} from 'react';
import {
  ImageBackground,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';

import backgroundImage from '../../assets/imgs/login.jpg';
import commonStyles from '../commonStyles';

const initialState = {
  email: '',
  password: '',
  name: '',
  confirmPassword: '',
  stageNew: false,
};

export default class Auth extends Component {
  state = {
    ...initialState,
  };

  render() {
    return (
      <ImageBackground source={backgroundImage} style={styles.background}>
        <Text style={styles.title}>Tasks</Text>

        <View style={styles.formContainer}>
          {this.state.stageNew && (
            <Text style={styles.subtitle}>Create your account</Text>
          )}
          {this.state.stageNew && (
            <TextInput
              placeholder="Name"
              value={this.state.name}
              style={styles.input}
              onChangeText={name => this.setState({name})}
            />
          )}
          <TextInput
            placeholder="E-mail"
            value={this.state.email}
            style={styles.input}
            onChangeText={email => this.setState({email})}
          />
          <TextInput
            placeholder="Password"
            value={this.state.password}
            secureTextEntry={true}
            style={styles.input}
            onChangeText={password => this.setState({password})}
          />
          {this.state.stageNew && (
            <TextInput
              placeholder="Confirm Password"
              value={this.state.confirmPassword}
              secureTextEntry={true}
              style={styles.input}
              onChangeText={confirmPassword => this.setState({confirmPassword})}
            />
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('Home')}>
            <Text style={styles.buttonText}>
              {this.state.stageNew ? 'Register' : 'Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    fontSize: 70,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: commonStyles.fontFamily,
    color: '#FFF',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    marginTop: 10,
    backgroundColor: '#FFF',
    padding: Platform.OS === 'ios' ? 15 : 10,
  },
  formContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    width: '90%',
  },
  button: {
    backgroundColor: '#080',
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    fontSize: 15,
  },
});
