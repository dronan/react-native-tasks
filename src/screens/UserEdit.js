import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Button,
} from 'react-native';
import commonStyles from '../commonStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';
import {server, showError, showSuccess} from '../common';
import PasswordValidation from '../components/PasswordValidation';
import {launchImageLibrary} from 'react-native-image-picker';
import {Image, Platform} from 'react-native';

export default props => {
  const route = useRoute();
  const {userData = {}} = route.params || {};
  const {id, email, name, password} = userData;

  const [showValidation, setShowValidation] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [secureConfirmPass, setSecureConfirmPass] = useState(true);
  const [securePass, setSecurePass] = useState(true);

  const [validForm, setValidForm] = useState(false);

  const [newName, setNewName] = useState(name);
  const [newPassword, setNewPassord] = useState(password);
  const [newConfirmPassword, setNewConfirmPassword] = useState(password);

  const handleValidationChange = isValid => {
    if (isValid !== isPasswordValid) {
      setIsPasswordValid(isValid);
    }
  };

  useEffect(() => {
    const validations = [];
    validations.push(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    if (newPassword !== password) {
      validations.push(newPassword && newPassword.length >= 6);
      validations.push(newPassword === newConfirmPassword);
      validations.push(isPasswordValid);
    }
    setValidForm(validations.every(Boolean));
  }, [email, password, newPassword, newConfirmPassword, isPasswordValid]);

  const [avatar, setAvatar] = useState(null);

  const handleChoosePhoto = () => {
    const options = {
      mediaType: 'photo',
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('Usuário cancelou a seleção de imagem');
      } else if (response.errorMessage) {
        console.error('Erro na seleção de imagem: ', response.errorMessage);
      } else {
        const source = {uri: response.assets[0].uri};
        setAvatar(source);
        uploadAvatar(response.assets[0]);
      }
    });
  };

  const uploadAvatar = async photo => {
    const formData = new FormData();
    formData.append('avatar', {
      name: photo.fileName,
      type: photo.type,
      uri:
        Platform.OS === 'android'
          ? photo.uri
          : photo.uri.replace('file://', ''),
    });

    try {
      const response = await axios.put(
        `${server}/users/${id}/avatar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const userDataString = await AsyncStorage.getItem('userData');

      const userData = JSON.parse(userDataString);

      userData.avatarUrl = response.data.avatarUrl;

      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      showSuccess('Avatar updated!');
      props.navigation.navigate('Home', userData);
    } catch (error) {
      console.log('Erro no upload do avatar:', error);
      showError(error);
    }
  };

  const logout = async () => {
    delete axios.defaults.headers.common['Authorization'];
    await AsyncStorage.removeItem('userData');
    props.navigation.navigate('AuthOrApp');
  };

  const edit = async () => {
    if (!validForm) {
      showError('Invalid user data!');
      return;
    }

    const userUpdate = {};

    if (newName && newName.trim().length > 0) {
      userUpdate.name = newName.trim();
    }

    if (newPassword.trim().length > 0) {
      userUpdate.password = newPassword;
    }

    try {
      const res = await axios.put(`${server}/users/save/${id}`, userUpdate);
      showSuccess('User updated!');
      await AsyncStorage.setItem('userData', JSON.stringify(res.data));
      axios.defaults.headers.common[
        'Authorization'
      ] = `bearer ${res.data.token}`;
      props.navigation.navigate('Home', res.data);
    } catch (e) {
      showError(e);
    }
  };

  const remove = async () => {
    try {
      Alert.alert(
        'Delete account',
        'Do you really want to delete your account?',
        [
          {
            text: 'Yes',
            onPress: async () => {
              await axios.delete(`${server}/users/delete/${id}`, {});
              showSuccess('User deleted!');
              logout();
            },
          },
          {
            text: 'No',
          },
        ],
      );
    } catch (e) {
      showError(e);
    }
  };

  return (
    <View style={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Setup</Text>
          <TouchableOpacity
            onPress={() => props.navigation.goBack()}
            style={styles.close}>
            <Icon name="close" style={styles.closeIcon} size={10} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={[styles.accountContainer, {flex: 1}]}>
        <Text style={styles.headerTitle}>User information</Text>
        <View style={styles.dataContainer}>
          <View style={styles.dataLine}>
            <Icon name="user-o" style={styles.accountIcon} size={15} />
            <Text>Name</Text>
            <TextInput
              style={styles.dataInput}
              value={newName}
              onChangeText={nName => setNewName(nName)}
            />
          </View>
          <View style={styles.dataSeparator} />
          <View style={styles.dataLine}>
            <Icon name="envelope-o" style={styles.accountIcon} size={15} />
            <Text>Email</Text>
            <TextInput style={styles.dataInput} readOnly value={email} />
          </View>
          <View style={styles.dataSeparator} />
          <View style={styles.dataLine}>
            <Icon name="picture-o" style={styles.accountIcon} size={15} />
            <Text style={{flex: 1}}>Avatar</Text>
            <TouchableOpacity onPress={handleChoosePhoto}>
              <Icon name="upload" size={20} style={styles.iconShowPass} />
            </TouchableOpacity>
          </View>
        </View>
        {avatar && (
          <Text style={{width: '100%', textAlign: 'right'}}>
            Upload complete
          </Text>
        )}

        <View style={styles.accountContainer}>
          <Text style={styles.headerTitle}>Account security</Text>

          <View style={styles.dataContainer}>
            <View style={styles.dataLine}>
              <Icon name="lock" style={styles.accountIcon} size={15} />
              <Text>Password</Text>
              <TextInput
                style={styles.dataInput}
                secureTextEntry={securePass}
                value={newPassword}
                onChangeText={nPass => {
                  setShowValidation(true);
                  setNewPassord(nPass);
                }}
              />
              <Icon
                name={securePass ? 'eye-slash' : 'eye'}
                size={20}
                style={styles.iconShowPass}
                onPress={() => setSecurePass(!securePass)}
              />
            </View>
            <View style={styles.dataSeparator} />
            <View style={styles.dataLine}>
              <Icon name="asterisk" style={styles.accountIcon} size={15} />
              <Text>Confirm password</Text>
              <TextInput
                style={styles.dataInput}
                secureTextEntry={secureConfirmPass}
                value={newConfirmPassword}
                onChangeText={nPass => {
                  setShowValidation(true);
                  setNewConfirmPassword(nPass);
                }}
              />
              <Icon
                name={secureConfirmPass ? 'eye-slash' : 'eye'}
                size={20}
                style={styles.iconShowPass}
                onPress={() => setSecureConfirmPass(!secureConfirmPass)}
              />
            </View>
          </View>

          {showValidation && (
            <View style={[styles.dataContainer, styles.validationContainer]}>
              <PasswordValidation
                password={newPassword}
                confirmPassword={newConfirmPassword}
                onValidationChange={handleValidationChange}
                contrast={true}
              />
            </View>
          )}
        </View>

        <View style={styles.accountContainer}>
          <View style={styles.dataContainer}>
            <View style={styles.dataLine}>
              <TouchableOpacity onPress={logout} style={styles.logout}>
                <Icon name="sign-out" style={styles.logoutIcon} size={15} />
              </TouchableOpacity>
              <TouchableOpacity onPress={logout}>
                <Text>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottom}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={edit}
            style={[
              styles.saveButton,
              !validForm ? {backgroundColor: '#AAA'} : {},
            ]}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={remove} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Delete account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  accountContainer: {
    fontFamily: commonStyles.fontFamily,
    flexDirection: 'column',
    width: '100%',
    paddingTop: 10,
  },
  headerTitle: {
    fontFamily: commonStyles.fontFamily,
    color: '#85858b',
    textTransform: 'uppercase',
    flexWrap: 'wrap',
    width: '100%',
    paddingBottom: 4,
    paddingTop: 10,
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 17,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  close: {
    padding: 5,
    backgroundColor: '#d7d7dc',
    borderRadius: 100,
  },
  closeIcon: {
    color: '#85858b',
  },
  content: {
    flex: 1,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  accountIcon: {
    color: '#000',
    marginRight: 10,
  },
  dataContainer: {
    flexDirection: 'column',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 10,
    overflow: 'hidden',
  },
  dataLine: {
    flexDirection: 'row',
    alignItems: 'center',
    color: '#000',
    paddingHorizontal: 10,
    minHeight: 40,
  },
  dataInput: {
    width: '100%',
    flex: 1,
    color: '#85858b',
    textAlign: 'right',
  },
  dataSeparator: {
    borderBottomColor: '#c6c6c8',
    borderBottomWidth: 0.5,
    width: '100%',
    marginLeft: 20,
  },
  deleteText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    padding: 10,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#B13B44',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
  },
  logout: {
    padding: 5,
  },
  logoutIcon: {
    color: '#000',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4D7031',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
    marginBottom: 20,
  },
  saveText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    padding: 10,
  },
  validationContainer: {
    marginTop: 10,
  },
  bottom: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconShowPass: {
    color: '#c6c6c8',
    marginLeft: 10,
  },
});
