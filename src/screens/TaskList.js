import React, {Component} from 'react';
import {View, Text, ImageBackground, StyleSheet} from 'react-native';

import todayImage from '../../assets/imgs/today.jpg';

import moment from 'moment';

export default class TaskList extends Component {
  render() {
    const today = moment().locale('en-US').format('ddd, D MMMM');

    return (
      <View style={styles.container}>
        <ImageBackground source={todayImage} style={styles.background}>
          <View style={styles.titleBar}>
            <Text>Today</Text>
            <Text>{today}</Text>
          </View>
        </ImageBackground>
        <Text style={styles.taskList}>Task List</Text>
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
});
