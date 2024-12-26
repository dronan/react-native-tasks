import {Alert, Platform} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const server =
  Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000';

function showError(err) {
  if (err.response.data == 'Unauthorized') {
    delete axios.defaults.headers.common['Authorization'];
    AsyncStorage.removeItem('userData');
  }

  if (err.response && err.response.data) {
    Alert.alert('Ops! An error occurred!', `${err.response.data}`);
  } else {
    Alert.alert('Ops! An error occurred!', `${err}`);
  }
}

function showSuccess(msg) {
  Alert.alert('Success!', msg);
}

export {server, showError, showSuccess};
