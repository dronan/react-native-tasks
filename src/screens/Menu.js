import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {useRoute} from '@react-navigation/native';
import commonStyles from '../commonStyles';
import Avatar from '../components/Avatar';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

export default props => {
  const route = useRoute();
  const userData = route.params || {};
  const {avatarUrl, name, email} = userData;

  const logout = async () => {
    delete axios.defaults.headers.common['Authorization'];
    await AsyncStorage.removeItem('userData');
    props.navigation.navigate('AuthOrApp');
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{flex: 1}}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
      </View>

      <DrawerItemList {...props} />

      <View style={{flex: 1}} />

      <View style={styles.footer}>
        <Avatar size={40} name={name} source={{uri: avatarUrl}} />
        <View style={styles.footerTextContainer}>
          <Text style={styles.userName}>{name}</Text>
          <TouchableOpacity onPress={logout} style={styles.logout}>
            <Icon name="sign-out" style={styles.logoutIcon} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderColor: '#DDD',
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingBottom: 10,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#DDD',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  footerTextContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    color: commonStyles.colors.mainText,
    fontWeight: 'bold',
  },
  logout: {
    padding: 5,
  },
  logoutIcon: {
    color: '#AAA',
  },
});
