import React, { Component } from 'react';
import {
  Button,
  Picker,
  Text,
  TextInput,
  View,
} from 'react-native';

import styles from './Styles';
import { getRestriction } from './Utils';

export default class EditRestrictionScreen extends Component {
  constructor(props) {
    super(props);

    this.state = this.props.navigation.state.params;
  }

  addVar() {
    this.state.restriction.vars.push({ key: this.getPossibleVars(-1)[0], value: 1 });
    
    this.forceUpdate();
  }

  removeVar(varKey) {
    this.state.restriction.vars.splice(varKey, 1);

    this.forceUpdate();
  }

  getRestrictionOperator() {
    return this.state.restriction.greater ? 'greater' : this.state.restriction.less ? 'less' : 'equal';
  }

  getPossibleVars(key) {
    possibleItens = this.state.possibleVars.slice();

    finalItems = [];

    for (var index = 0;index < this.state.restriction.vars.length;++index) {
      if(key < 0) {
        possibleItens = possibleItens.filter(e => e !== this.state.restriction.vars[index].key);
      } else {
        if(this.state.restriction.vars[key].key !== this.state.restriction.vars[index].key) {
          finded = possibleItens.indexOf(this.state.restriction.vars[index].key);
        
          if(finded > -1) {
            possibleItens.splice(finded, 1);
          }
        } else {
          finalItems.push(this.state.restriction.vars[key].key);
        }
      }
    }

    finalItems = key < 0 ? possibleItens : finalItems.concat(possibleItens.filter(item => !finalItems.includes(item)));

    return finalItems;
  }

  inputTextChanged(text, key) { 
    if(text.indexOf('-') > -1) {
      text = '-' + text.replace('-', '');
    }

    value = parseInt(text);

    if (isNaN(value)) {
      this.state.restriction.vars[key].value = 0;
    } else {
      this.state.restriction.vars[key].value = value;
    }

    this.forceUpdate();
  }

  inputResultChanged(text) { 
    if(text.indexOf('-') > -1) {
      text = '-' + text.replace('-', '');
    }

    value = parseInt(text);

    if (isNaN(value)) {
      this.state.restriction.result = 0;
    } else {
      this.state.restriction.result = value;
    }

    this.forceUpdate();
  }

  pickerChanged(picker, key) {
    this.state.restriction.vars[key].key = picker;

    this.forceUpdate();
  }

  pickerItens(key) {
    return (
      this.getPossibleVars(key).map((x) => {
        return (
          <Picker.Item key={ key } label={ 'x' + x } value={ x } />
        )
      })
    );
  }

  restrictionPickerChanged(picker) {
    this.state.restriction.greater = picker == 'greater';
    this.state.restriction.less = picker == 'less';

    this.setState({ picker });

    this.forceUpdate();
  }

  render() {
  	const nav = this.props.navigation;

    return (
      <View style={ styles.container }>
        <View style={ styles.expressions }>
          <View style={ styles.highlights }>
            <Text style={[ styles.label, styles.highlight, styles.texts ]}>RESTRICTION { this.state.restrictionKey + 1 }</Text>
            <Text style={[ styles.expression, styles.highlight, styles.texts ]}>
              { getRestriction(this.state.restriction) }
            </Text>
            <View style={[ styles.buttons ]}>
              <View style={[ styles.buttonConfirm ]}>
                <Button
                  color='#5FBA7D'
                  onPress={
                    () => nav.navigate('Home')
                  }
                  title='✔'
                />
              </View>
            </View>
          </View>
          <View style={ styles.informations }>
            { this.state.restriction.vars.map((x, key) => {
              return (
                <View key={ key } style={ styles.restrictions }>
                  <TextInput
                    maxLength={ 7 }
                    keyboardType='numeric'
                    style={ styles.inputsTextEdit }
                    value={ this.state.restriction.vars[key].value + '' }
                    onChangeText={ (text) => this.inputTextChanged(text, key) }
                  />
                  <Picker style={[ { width:'30%' } ]} onValueChange={ (picker) => this.pickerChanged(picker, key) } selectedValue={ this.state.restriction.vars[key].key }>
                     { this.pickerItens(key) }
                  </Picker>
                  <View style={[ styles.buttons ]}>
                    <Button
                      color='#C04848'
                      onPress={
                        () => { this.removeVar(key) }
                      }
                      title='✘'
                      disabled={ this.state.restriction.vars.length == 1 }
                    />
                  </View>
                </View>
              );
            })}

            <View style={ styles.restrictions }>
              <Picker style={[ { width:'70%', 'flexDirection':'row' } ]} onValueChange={ (picker) => this.restrictionPickerChanged(picker) } selectedValue={ this.getRestrictionOperator() }>
                <Picker.Item label='≥ GREATER OR EQUAL TO ' value={ 'greater' } />
                <Picker.Item label='≤ LESS OR EQUAL TO ' value={ 'less' } />
                <Picker.Item label='= EQUAL TO ' value={ 'equal' } />
              </Picker>

              <TextInput
                maxLength={ 7 }
                keyboardType='numeric'
                style={[ styles.inputsTextEdit, { width:'30%' } ]}
                value={ this.state.restriction.result + '' }
                onChangeText={ (text) => this.inputResultChanged(text) }
              />
            </View>

            <View style={ styles.options }>
              <View style={[ styles.mainButton ]}>
                <Button
                  color='#5FBA7D'
                  onPress={
                    () => { this.addVar() }
                  }
                  title='ADD VAR'
                  disabled={ this.state.restriction.vars.length === this.state.possibleVars.length }
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}