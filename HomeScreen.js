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
    greater: false,
    less: true,
    result: 0,
    vars: [{ key: 1, value: 1 }],
  }],
};

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;
  }

  addRestriction() {
    this.state.restrictions.push({
      greater: false,
      less: true,
      result: 1,
      vars: [{ key: this.state.objective.vars[0].key, value: 1 }],
    });

    this.forceUpdate();
  }

  removeRestriction(restrictionKey) {
    this.state.restrictions.splice(restrictionKey, 1);

    this.forceUpdate();
  }

  solveSimplex() {
    firstRestriction = this.state.restrictions.shift();
    
    console.log(JSON.stringify(this.state));

    this.state.restrictions.unshift(firstRestriction);
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
              restrictionKey => { this.removeRestriction(restrictionKey) },
            solveSimplex:
              () => { this.solveSimplex() },
          }}
          nav={ nav }
          objective={ this.state.objective }
          restrictions={ this.state.restrictions }
        />
      </View>
    );
  }
}