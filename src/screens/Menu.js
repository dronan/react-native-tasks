import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {useRoute} from '@react-navigation/native';
import commonStyles from '../commonStyles';
import Avatar from '../components/Avatar';

import Icon from 'react-native-vector-icons/FontAwesome';

export default props => {
  const route = useRoute();
  const userData = route.params || {};
  const {avatarUrl, name} = userData;

  const userEdit = () => {
    props.navigation.navigate('UserEdit', {userData});
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
          <TouchableOpacity onPress={userEdit}>
            <Text style={styles.userName}>{name}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={userEdit} style={styles.more}>
            <Icon name="ellipsis-h" style={styles.moreIcon} size={20} />
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
  more: {
    padding: 5,
  },
  moreIcon: {
    color: '#c1c1c1',
  },
});
