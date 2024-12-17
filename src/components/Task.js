import React from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import commonStyles from '../commonStyles';
import moment from 'moment';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Reanimated, {useAnimatedStyle} from 'react-native-reanimated';

export default props => {
  const doneOrNotStyle =
    props.doneAt !== null ? {textDecorationLine: 'line-through'} : {};

  const formattedDate = moment(props.doneAt || props.estimateAt)
    .locale('en-US')
    .format('ddd, D MMMM');

  const getRightContent = (prog, drag) => {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{translateX: drag.value + 50}],
      };
    });

    return (
      <Reanimated.View style={styleAnimation}>
        <Icon name="trash" size={20} style={styles.right} color="#FFF" />
      </Reanimated.View>
    );
  };

  return (
    <GestureHandlerRootView>
      <ReanimatedSwipeable
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={getRightContent}>
        <View style={styles.contentContainer}>
          <TouchableWithoutFeedback onPress={() => props.toggleTask(props.id)}>
            <View style={styles.checkContainer}>
              {getCheckView(props.doneAt)}
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.line}>
            <Text style={[styles.desc, doneOrNotStyle]}>{props.desc}</Text>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>
        </View>
      </ReanimatedSwipeable>
    </GestureHandlerRootView>
  );
};

function getCheckView(doneAt) {
  if (doneAt !== null) {
    return (
      <View style={styles.done}>
        <Icon name="check" size={15} color="#FFF" />
      </View>
    );
  } else {
    return <View style={styles.pending}></View>;
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#AAA',
  },
  line: {
    width: '100%',
    paddingVertical: 10,
    marginLeft: 10,
  },
  checkContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pending: {
    width: 25,
    height: 25,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#555',
  },
  done: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: '#4D7031',
    alignItems: 'center',
    justifyContent: 'center',
  },
  desc: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.mainText,
    fontSize: 15,
  },
  date: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.subText,
    fontSize: 12,
  },
  right: {
    backgroundColor: '#B13B44',
    paddingTop: 15,
    paddingHorizontal: 15,
    height: '100%',
  },
});
