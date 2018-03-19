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
                <Text style={[ styles.label, styles.restriction, styles.texts ]}>RESTRICTION { key + 1 }</Text>
                <Text style={[ styles.expression, styles.restriction, styles.texts ]}>{ getRestriction(restriction) }</Text>
                <View style={[ styles.buttons ]}>
                  <View style={[ styles.buttonEdit ]}>
                    <Button
                      color='#F69C55'
                      onPress={
                        () => this.props.nav.navigate('EditRestriction', { restrictionKey: key, restriction: this.props.restriction })
                      }
                      title='✎'
                    />
                  </View>
                  <Button
                    color='#C04848'
                    onPress={
                      () => { this.props.callbacks.removeRestriction(key) }
                    }
                    title='✘'
                    disabled={ this.props.restrictions.length == 1 }
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
              title='ADD RESTRICTION'
              disabled={ this.props.restrictions.length > 4 }
            />
          </View>
        </View>
        <View style={ styles.options }>
          <View style={[ styles.mainButton ]}>
            <Button color='#0095FF' onPress={ this._onPress } title='SOLVE' />
          </View>
        </View>
      </View>
    );
  }
}