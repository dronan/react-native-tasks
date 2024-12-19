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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import todayImage from '../../assets/imgs/today.jpg';
import commonStyles from '../commonStyles';
import moment from 'moment';

import Task from '../components/Task';

import Icon from 'react-native-vector-icons/FontAwesome';

import AddTask from './AddTask';

const initialState = {
  showDoneTasks: true,
  showAddTask: false,
  visibleTasks: [],
  tasks: [],
};
export default class TaskList extends Component {
  state = {
    ...initialState,
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
  };

  toggleAddTask = () => {
    this.setState({showAddTask: !this.state.showAddTask});
  };

  toggleFilter = () => {
    this.setState({showDoneTasks: !this.state.showDoneTasks}, this.filterTasks);
  };

  toggleTask = taskId => {
    const tasks = [...this.state.tasks];
    tasks.forEach(task => {
      if (task.id === taskId) {
        task.doneAt = task.doneAt ? null : new Date();
      }
    });
    this.setState({tasks}, this.filterTasks); // add callback to update list after state change
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

  addTask = newTask => {
    // Check for valid description before adding task
    if (!newTask.desc || !newTask.desc.trim()) {
      Alert.alert('Invalid Data', 'Description is required');
      return;
    }

    const tasks = [...this.state.tasks];
    tasks.push({
      id: Math.random(),
      desc: newTask.desc,
      estimateAt: newTask.date,
      doneAt: null,
    });
    this.setState({tasks, showAddTask: false}, this.filterTasks);
  };

  deleteTask = id => {
    const tasks = this.state.tasks.filter(task => task.id !== id);
    this.setState({tasks}, this.filterTasks); // update the list, add callback to update list after state change
  };

  render() {
    const today = moment().locale('en-US').format('ddd, D MMMM');

    return (
      <View style={styles.container}>
        <AddTask
          isVisible={this.state.showAddTask}
          onCancel={this.toggleAddTask}
          onSave={this.addTask}
        />
        <ImageBackground source={todayImage} style={styles.background}>
          <View style={styles.iconBar}>
            <TouchableOpacity onPress={this.toggleFilter}>
              <Icon
                name={this.state.showDoneTasks ? 'eye' : 'eye-slash'}
                size={20}
                color={commonStyles.colors.secondary}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.titleBar}>
            <Text style={styles.title}>Today</Text>
            <Text style={styles.subtitle}>{today}</Text>
          </View>
        </ImageBackground>
        <View style={styles.taskList}>
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
          style={styles.addButton}
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
  iconBar: {
    marginTop: Platform.OS === 'ios' ? 30 : 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: commonStyles.colors.today,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
