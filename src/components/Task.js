import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import Icon from '@react-native-vector-icons/fontawesome';
import commonStyles from '../commonStyles';
import moment from 'moment';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
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
      <Reanimated.View style={[styleAnimation, styles.rightOptions]}>
        <TouchableOpacity
          onPress={() => props.onDelete && props.onDelete(props.id)}>
          <Icon name="trash" style={styles.iconSpace} size={20} color="#FFF" />
        </TouchableOpacity>
      </Reanimated.View>
    );
  };

  const getLeftContent = () => {
    return (
      <Reanimated.View style={styles.leftOptions}>
        <Icon name="trash" style={styles.iconSpace} size={20} color="#FFF" />
        <Text style={styles.excludeText}>Delete</Text>
      </Reanimated.View>
    );
  };

  const renderBody = () => (
    <View style={styles.contentContainer}>
      <TouchableWithoutFeedback onPress={() => props.onToggleTask(props.id)}>
        <View style={styles.checkContainer}>{getCheckView(props.doneAt)}</View>
      </TouchableWithoutFeedback>
      <View style={styles.line}>
        <Text style={[styles.desc, doneOrNotStyle]}>{props.desc}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
    </View>
  );

  return !props.addTaskOpen ? (
    <ReanimatedSwipeable
      containerStyle={styles.swipeableContainer}
      overshootRight={false}
      onSwipeableOpen={direction =>
        direction == 'right' && props.onDelete && props.onDelete(props.id)
      }
      renderRightActions={(prog, drag) => getRightContent(prog, drag)}
      renderLeftActions={getLeftContent}>
      {renderBody()}
    </ReanimatedSwipeable>
  ) : (
    renderBody()
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
    backgroundColor: '#FFF',
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
  iconSpace: {
    paddingHorizontal: 15,
  },
  excludeText: {
    fontFamily: commonStyles.fontFamily,
    color: '#FFF',
    fontSize: 20,
    margin: 10,
  },
  rightOptions: {
    flexDirection: 'row',
    backgroundColor: '#B13B44',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  leftOptions: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#B13B44',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
