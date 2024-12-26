import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import Menu from './screens/Menu';
import commonStyles from './commonStyles';

import AuthComponent from './screens/Auth';
import TaskListComponent from './screens/TaskList';
import AuthOrApp from './screens/AuthOrApp';
import UserEditComponent from './screens/UserEdit';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const menuConfig = {
  initialRouteName: 'Today',
  drawerContent: props => <Menu {...props} />,
  screenOptions: {
    drawerStyle: {
      backgroundColor: '#fff',
    },
    drawerItemStyle: {
      borderRadius: 12,
      marginVertical: 4,
    },
    drawerActiveBackgroundColor: '#f6f6f6',
    drawerActiveTintColor: '#000', // cor do texto
    drawerLabelStyle: {
      fontFamily: commonStyles.fontFamily,
      fontWeight: 'normal',
      fontSize: 18,
    },
    drawerActiveLabelStyle: {
      fontWeight: 'bold',
    },
  },
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator {...menuConfig}>
      <Drawer.Screen
        name="Today"
        component={TaskListComponent}
        initialParams={{daysAhead: 0}}
        options={{headerShown: false, title: 'Today'}}
      />
      <Drawer.Screen
        name="Tomorrow"
        component={TaskListComponent}
        initialParams={{daysAhead: 1}}
        options={{headerShown: false, title: 'Tomorrow'}}
      />
      <Drawer.Screen
        name="Week"
        component={TaskListComponent}
        initialParams={{daysAhead: 7}}
        options={{headerShown: false, title: 'Week'}}
      />
      <Drawer.Screen
        name="Month"
        component={TaskListComponent}
        initialParams={{daysAhead: 30}}
        options={{headerShown: false, title: 'Month'}}
      />
    </Drawer.Navigator>
  );
};

const Navigator = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="AuthOrApp"
              component={AuthOrApp}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Auth"
              component={AuthComponent}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Home"
              component={DrawerNavigator}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="UserEdit"
              component={UserEditComponent}
              options={{
                presentation: 'modal',
                animation: 'slide_from_left',
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default Navigator;
