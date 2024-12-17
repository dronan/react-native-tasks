import React, {Component} from 'react';
import {View, Text, ImageBackground, StyleSheet} from 'react-native';

import todayImage from '../../assets/imgs/today.jpg';

export default class TaskList extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={todayImage}
          style={styles.background}></ImageBackground>
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
});
