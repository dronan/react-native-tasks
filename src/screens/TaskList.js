import React, {Component} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import commonStyles from '../commonStyles';
import moment from 'moment';

import axios from 'axios';
import {server, showError} from '../common';

import Task from '../components/Task';

import Icon from '@react-native-vector-icons/fontawesome';

import AddTask from './AddTask';

import todayImage from '../../assets/imgs/today.jpg';
import tomorrowImage from '../../assets/imgs/tomorrow.jpg';
import weekImage from '../../assets/imgs/week.jpg';
import monthImage from '../../assets/imgs/month.jpg';

const initialState = {
  showDoneTasks: true,
  showAddTask: false,
  visibleTasks: [],
  tasks: [],
  isLandscape: false,
};

export default class TaskList extends Component {
  state = {
    ...initialState,
  };

  loadTasks = async () => {
    try {
      const maxDate = moment()
        .add({days: this.props.route.params.daysAhead})
        .format('YYYY-MM-DD 23:59:59');
      const res = await axios.get(`${server}/tasks?date=${maxDate}`);
      this.setState({tasks: res.data}, this.filterTasks);
    } catch (e) {
      showError(e);
    }
  };

  componentDidMount = async () => {
    const stateString = await AsyncStorage.getItem('tasksState');
    const savedState = JSON.parse(stateString) || initialState;
    this.setState(
      {
        showDoneTasks: savedState.showDoneTasks,
      },
      this.filterTasks,
    );
    this.loadTasks();
    this.handleOrientationChange();
    this.unsubscribe = Dimensions.addEventListener(
      'change',
      this.handleOrientationChange,
    );
  };

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe.remove();
    }
  }

  handleOrientationChange = () => {
    const {width, height} = Dimensions.get('window');
    const isLandscape = width > height;
    this.setState({isLandscape});
  };

  toggleAddTask = () => {
    this.setState({showAddTask: !this.state.showAddTask});
  };

  toggleFilter = () => {
    this.setState({showDoneTasks: !this.state.showDoneTasks}, this.filterTasks);
  };

  toggleTask = async taskId => {
    try {
      await axios.put(`${server}/tasks/${taskId}/toggle`);
      this.loadTasks();
    } catch (e) {
      showError(e);
    }
  };

  filterTasks = () => {
    let visibleTasks = null;
    if (this.state.showDoneTasks) {
      visibleTasks = [...this.state.tasks];
    } else {
      const pending = task => task.doneAt === null;
      visibleTasks = this.state.tasks.filter(pending);
    }

    this.setState({visibleTasks});
    AsyncStorage.setItem(
      'tasksState',
      JSON.stringify({
        showDoneTasks: this.state.showDoneTasks,
      }),
    );
  };

  addTask = async newTask => {
    // Check for valid description before adding task
    if (!newTask.desc || !newTask.desc.trim()) {
      Alert.alert('Invalid Data', 'Description is required');
      return;
    }

    try {
      await axios.post(`${server}/tasks`, {
        desc: newTask.desc,
        estimateAt: newTask.date,
      });

      this.setState({showAddTask: false}, this.loadTasks);
    } catch (e) {
      showError(e);
    }
  };

  deleteTask = async id => {
    try {
      await axios.delete(`${server}/tasks/${id}`);
      this.loadTasks();
    } catch (e) {
      showError(e);
    }
  };

  getImages = () => {
    switch (this.props.route.params.daysAhead) {
      case 0:
        return todayImage;
      case 1:
        return tomorrowImage;
      case 7:
        return weekImage;
      case 30:
        return monthImage;
    }
  };

  getColor = () => {
    switch (this.props.route.params.daysAhead) {
      case 0:
        return commonStyles.colors.today;
      case 1:
        return commonStyles.colors.tomorrow;
      case 7:
        return commonStyles.colors.week;
      case 30:
        return commonStyles.colors.month;
    }
  };

  render() {
    const today = moment().locale('en-US').format('ddd, D MMMM');
    const {isLandscape} = this.state;

    return (
      <View style={styles.container}>
        <AddTask
          isVisible={this.state.showAddTask}
          onCancel={this.toggleAddTask}
          onSave={this.addTask}
        />
        <ImageBackground
          source={this.getImages()}
          style={isLandscape ? styles.backgroundH : styles.backgroundV}>
          <View style={styles.iconBar}>
            <TouchableOpacity
              onPress={() => this.props.navigation.openDrawer()}>
              <Icon
                name="bars"
                size={20}
                color={commonStyles.colors.secondary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.toggleFilter}>
              <Icon
                name={this.state.showDoneTasks ? 'eye' : 'eye-slash'}
                size={20}
                color={commonStyles.colors.secondary}
              />
            </TouchableOpacity>
          </View>

          <View style={isLandscape ? styles.titleBarH : styles.titleBarV}>
            <Text style={styles.title}>{this.props.route.name}</Text>
            <Text style={styles.subtitle}>{today}</Text>
          </View>
        </ImageBackground>
        <View style={isLandscape ? styles.taskListH : styles.taskListV}>
          <FlatList
            data={this.state.visibleTasks}
            keyExtractor={item => `${item.id}`}
            renderItem={({item}) => (
              <Task
                {...item}
                addTaskOpen={this.state.showAddTask}
                onDelete={this.deleteTask}
                onToggleTask={this.toggleTask}
              />
            )}
          />
        </View>
        <TouchableOpacity
          style={[styles.addButton, {backgroundColor: this.getColor()}]}
          activeOpacity={0.7}
          onPress={this.toggleAddTask}>
          <Icon name="plus" size={20} color={commonStyles.colors.secondary} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Fill the entire screen
  },
  backgroundH: {
    flex: 5, // 50% of the screen
  },
  backgroundV: {
    flex: 2, // 30% of the screen
  },
  taskListH: {
    flex: 6, // 60% of the screen
  },
  taskListV: {
    flex: 7, // 70% of the screen
  },
  titleBarH: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  titleBarV: {
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
  iconBar: {
    marginTop: Platform.OS === 'ios' ? 30 : 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
