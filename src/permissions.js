import {PermissionsAndroid, Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

export const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Permission to use the camera',
        message: 'The app needs access to your camera.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } else {
    const result = await check(PERMISSIONS.IOS.CAMERA);
    if (result === RESULTS.GRANTED) {
      return true;
    } else {
      const requestResult = await request(PERMISSIONS.IOS.CAMERA);
      return requestResult === RESULTS.GRANTED;
    }
  }
};

export const requestGalleryPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Permission to access the gallery',
        message: 'The app needs access to your gallery.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } else {
    const result = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
    if (result === RESULTS.GRANTED) {
      return true;
    } else {
      const requestResult = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      return requestResult === RESULTS.GRANTED;
    }
  }
};
