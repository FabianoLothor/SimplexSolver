import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';

import styles from './Styles';

export default class AppTitle extends Component {
  render() {
    return (
    	<View style={ styles.title }>
        <Text style={[ styles.appName, styles.texts ]}>SIMPLEX SOLVER</Text>
      </View>
    );
  }
}