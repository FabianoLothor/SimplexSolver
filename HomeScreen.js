import React, { Component } from 'react';
import {
  Button,
  ScrollView,
  Text,
  View
} from 'react-native';

import Expressions from './Expressions';
import styles from './Styles';

const initialState = {
  objective: {
    maximize: true,
    vars: [{ key: 1, value: 1 }],
  },
  restrictions: [{
    bigger: false,
    less: true,
    result: 1,
    vars: [{ key: 1, value: 1 }],
  }],
};

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;
  }

  addRestriction() {
    console.log(this);
    this.state.restrictions.push({
      bigger: false,
      less: true,
      result: 1,
      vars: [{ key: 1, value: 1 }],
    });

    this.forceUpdate();
  }

  removeRestriction(restrictionKey) {
    this.state.restrictions.splice(restrictionKey, 1);

    this.forceUpdate();
  }

  render() {
    const nav = this.props.navigation;

    return (
      <View style={ styles.container }>
        <Expressions
          callbacks={{
            addRestriction:
            () => { this.addRestriction() },
            removeRestriction:
              restrictionKey => { this.removeRestriction(restrictionKey) }
          }}
          nav={ nav }
          objective={ this.state.objective }
          restrictions={ this.state.restrictions }
        />
      </View>
    );
  }
}