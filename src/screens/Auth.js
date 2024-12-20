import React, {Component} from 'react';
import {
  ImageBackground,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import backgroundImage from '../../assets/imgs/login.jpg';
import commonStyles from '../commonStyles';
import AuthInput from '../components/AuthInput';
import PasswordValidation from '../components/PasswordValidation';
import {server, showError, showSuccess} from '../common';

const initialState = {
  email: '',
  password: '',
  name: '',
  confirmPassword: '',
  stageNew: false,
  isPasswordValid: false,
};

export default class Auth extends Component {
  state = {
    ...initialState,
  };

  handleValidationChange = isValid => {
    if (isValid !== this.state.isPasswordValid) {
      this.setState({isPasswordValid: isValid});
    }
  };

  signInOrSignUp = () => {
    if (this.state.stageNew) {
      this.singUp();
    } else {
      this.signIn();
    }
  };

  singUp = async () => {
    try {
      await axios.post(`${server}/signup`, {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword,
      });

      showSuccess('User registered!');
      this.setState({...initialState});
    } catch (e) {
      showError(e);
    }
  };

  signIn = async () => {
    try {
      const res = await axios.post(`${server}/signin`, {
        email: this.state.email,
        password: this.state.password,
      });

      AsyncStorage.setItem('userData', JSON.stringify(res.data));

      axios.defaults.headers.common[
        'Authorization'
      ] = `bearer ${res.data.token}`;
      this.props.navigation.navigate('Home', res.data);
    } catch (e) {
      showError(e);
    }
  };

  render() {
    const validations = [];
    validations.push(
      this.state.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.state.email),
    );
    validations.push(this.state.password && this.state.password.length >= 6);
    if (this.state.stageNew) {
      validations.push(this.state.isPasswordValid);
    }
    const validForm = validations.reduce((all, v) => all && v, true);

    return (
      <ImageBackground source={backgroundImage} style={styles.background}>
        <Text style={styles.title}>Tasks</Text>

        <View style={styles.formContainer}>
          {this.state.stageNew && (
            <Text style={styles.subtitle}>Create your account</Text>
          )}
          {this.state.stageNew && (
            <AuthInput
              icon="user"
              placeholder="Name"
              value={this.state.name}
              style={styles.input}
              onChangeText={name => this.setState({name})}
            />
          )}
          <AuthInput
            icon="at"
            placeholder="E-mail"
            value={this.state.email}
            style={styles.input}
            onChangeText={email => this.setState({email})}
          />
          <AuthInput
            icon="lock"
            placeholder="Password"
            value={this.state.password}
            secureTextEntry={true}
            style={styles.input}
            onChangeText={password => this.setState({password})}
          />
          {this.state.stageNew && (
            <>
              <AuthInput
                icon="asterisk"
                placeholder="Confirm Password"
                value={this.state.confirmPassword}
                secureTextEntry={true}
                style={styles.input}
                onChangeText={confirmPassword =>
                  this.setState({confirmPassword})
                }
              />
              <PasswordValidation
                password={this.state.password}
                confirmPassword={this.state.confirmPassword}
                onValidationChange={this.handleValidationChange}
              />
            </>
          )}

          <TouchableOpacity
            disabled={!validForm}
            onPress={() => this.signInOrSignUp()}>
            <View
              style={[
                styles.button,
                !validForm ? {backgroundColor: '#AAA'} : {},
              ]}>
              <Text style={styles.buttonText}>
                {this.state.stageNew ? 'Register' : 'Login'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{padding: 10}}
          onPress={() => this.setState({stageNew: !this.state.stageNew})}>
          <Text style={styles.buttonText}>
            {this.state.stageNew
              ? 'Already have an account?'
              : 'Create an account'}
          </Text>
        </TouchableOpacity>
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
    borderRadius: 5,
  },
  buttonText: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    fontSize: 15,
  },
});
