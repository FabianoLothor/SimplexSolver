import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { DrawerNavigator, StackNavigator, TabNavigator } from 'react-navigation';

import AppTitle from './AppTitle';
import HomeScreen from './HomeScreen';
import EditObjectiveScreen from './EditObjectiveScreen';
import EditRestrictionScreen from './EditRestrictionScreen';

AppRegistry.registerComponent('SimplexSolver', () => SimplexSolver);

const SimplexSolver = StackNavigator({
  Home: { screen: HomeScreen },
  EditObjective: { screen: EditObjectiveScreen },
  EditRestriction: { screen: EditRestrictionScreen },
}, {
	initialRouteName: 'Home',
	navigationOptions: {
		header: <AppTitle />
	},
});