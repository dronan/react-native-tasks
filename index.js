/**
 * @format
 */
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import {AppRegistry} from 'react-native';
import Navigator from './src/Navigator'; // Certifique-se de que o caminho está correto
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Navigator);
