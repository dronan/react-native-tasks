import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {useRoute} from '@react-navigation/native';
import commonStyles from '../commonStyles';
import Avatar from '../components/Avatar';

export default props => {
  const route = useRoute();
  const userData = route.params || {};
  const {avatarUrl, name, email} = userData;

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <View style={styles.avatar}>
          <Avatar size={60} name={name} source={{uri: avatarUrl}} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'column', // Alinha os itens na horizontal
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
  avatar: {
    flexDirection: 'row',
    paddingLeft: 10,
  },
  userName: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 20,
    color: commonStyles.colors.mainText,
    paddingLeft: 10,
  },
  userEmail: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 15,
    color: commonStyles.colors.subText,
    paddingLeft: 10,
  },
});
