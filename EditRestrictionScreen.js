import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';

import styles from './Styles';

export default class EditRestrictionScreen extends Component {  
  render() {
  	const nav = this.props.navigation;
    const navParams = nav.state.params;

    return (
    	<View style={ styles.container }>
        <Text>ola</Text>
      </View>
    );
  }
}