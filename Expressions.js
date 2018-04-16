import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import Resolution from './Resolution';
import styles from './Styles';
import { getFunction, getPossibleVars } from './Utils';

export default class Expressions extends Component {
  render() {
    return (
      <View style={ styles.expressions }>
        <View style={ styles.highlights }>
          <Text style={[ styles.label, styles.highlight, styles.texts ]}>OBJECTIVE</Text>
          <Text style={[ styles.expression, styles.highlight, styles.texts ]}>
            { this.props.objective.maximize ? 'MAX' : 'MIN' } Z = { getFunction(this.props.objective.vars, 'key') }
          </Text>
          <View style={[ styles.buttons ]}>
            <View style={[ styles.buttonEdit ]}>
              <Button
                color='#F69C55'
                onPress={
                  () => this.props.nav.navigate('EditObjective', { objective: this.props.objective, restrictions: this.props.restrictions })
                }
                title='✎'
              />
            </View>
          </View>
        </View>
        <Resolution
          callbacks={ this.props.callbacks }
          nav={ this.props.nav }
          restrictions={ this.props.restrictions }
          possibleVars={ getPossibleVars(this.props.objective.vars) }
        />
      </View>
    );
  }
}