import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import styles from './Styles';
import { getRestriction } from './Utils';

export default class Resolution extends Component {
  render() {
    return (
      <View style={ styles.informations }>
          { this.props.restrictions.map((restriction, key) => {
            return (
              <View key={ key } style={ styles.restrictions }>
                <Text style={[ styles.label, styles.restriction, styles.texts ]}>CONSTRAINT { key + 1 }</Text>
                <Text style={[ styles.expression, styles.restriction, styles.texts ]}>{ key === 0 ? getRestriction(restriction, this.props.possibleVars) : getRestriction(restriction) }</Text>
                <View style={[ styles.buttons ]}>
                  <View style={[ styles.buttonEdit ]}>
                    <Button
                      color='#F69C55'
                      onPress={
                        () => this.props.nav.navigate('EditRestriction', { restrictionKey: key, restriction: restriction, possibleVars : this.props.possibleVars })
                      }
                      title='✎'
                      disabled={ key === 0 }
                    />
                  </View>
                  <Button
                    color='#C04848'
                    onPress={
                      () => { this.props.callbacks.removeRestriction(key) }
                    }
                    title='✘'
                    disabled={ key === 0 }
                  />
                </View>
              </View>
            );
          })}
        <View style={ styles.options }>
          <View style={[ styles.mainButton ]}>
            <Button
              color='#5FBA7D'
              onPress={
                () => { this.props.callbacks.addRestriction() }
              }
              title='ADD CONSTRAINT'
              disabled={ this.props.restrictions.length > 6 }
            />
          </View>
        </View>
        <View style={ styles.options }>
          <View style={[ styles.mainButton ]}>
            <Button
              color='#0095FF'
              onPress={
                () => { this.props.callbacks.solveSimplex() }
              }
              title='SOLVE'
              disabled={ this.props.restrictions.length < 2 }
            />
          </View>
        </View>
      </View>
    );
  }
}