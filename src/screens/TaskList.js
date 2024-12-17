import React, {Component} from 'react';
import {View, Text, ImageBackground, StyleSheet} from 'react-native';

import todayImage from '../../assets/imgs/today.jpg';
import commonStyles from '../commonStyles';

import moment from 'moment';

export default class TaskList extends Component {
  render() {
    const today = moment().locale('en-US').format('ddd, D MMMM');

    return (
      <View style={styles.container}>
        <ImageBackground source={todayImage} style={styles.background}>
          <View style={styles.titleBar}>
            <Text style={styles.title}>Today</Text>
            <Text style={styles.subtitle}>{today}</Text>
          </View>
        </ImageBackground>
        <View style={styles.taskList}>
          <Text>Task 1</Text>
          <Text>Task 2</Text>
          <Text>Task 3</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Fill the entire screen
  },
  background: {
    flex: 3, // 30% of the screen
  },
  taskList: {
    flex: 7, // 70% of the screen
  },
  titleBar: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    fontSize: 50,
    marginLeft: 20,
    marginBottom: 20,
  },
  subtitle: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    fontSize: 20,
    marginLeft: 20,
    marginBottom: 30,
  },
});
