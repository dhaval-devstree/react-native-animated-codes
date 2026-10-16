// Global Imports
import { memo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';

// Screen Imports
import Initial from './src/Screens/Initial';
import Playground from './src/Screens/Playground';
import Showcase from './src/Screens/Showcase';
import Features from './src/Screens/Features';

export const navigationRef = createNavigationContainerRef();

export const currentRoute = () => {
  if (navigationRef.isReady()) return navigationRef.getCurrentRoute()?.name;
  return undefined;
};

export const navigateToPage = (name, params) => {
  if (navigationRef.isReady()) {
    if (params !== undefined) navigationRef.navigate(name, params);
    else navigationRef.navigate(name);
  };
};

export const goBack = () => {
  if (navigationRef.isReady() && navigationRef.canGoBack()) navigationRef.goBack();
};

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={'Initial'}
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="Initial" component={Initial} />
        <Stack.Screen name="Playground" component={Playground} />
        <Stack.Screen name="Showcase" component={Showcase} />
        <Stack.Screen name="Features" component={Features} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default memo(AppNavigator);
