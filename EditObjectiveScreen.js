import React, { Component } from 'react';
import {
	Button,
	Picker,
  Text,
  TextInput,
  View,
} from 'react-native';

import styles from './Styles';
import { getFunction } from './Utils';

export default class EditObjectiveScreen extends Component {
	constructor(props) {
    super(props);

    this.state = this.props.navigation.state.params;
  }

  addVar() {
    this.state.objective.vars.push({ key: this.getPossibleVars(-1)[0], value: 1 });

    this.forceUpdate();
  }

  removeVar(varKey) {
    this.state.objective.vars.splice(varKey, 1);

    this.forceUpdate();
  }

  getPossibleVars(key) {
		possibleItens = [1,2,3,4,5,6,7];
    finalItems = [];

  	for (var index = 0;index < this.state.objective.vars.length;++index) {
  		if(key < 0) {
        possibleItens = possibleItens.filter(e => e !== this.state.objective.vars[index].key);
  		} else {
        if(this.state.objective.vars[key].key !== this.state.objective.vars[index].key) {
          finded = possibleItens.indexOf(this.state.objective.vars[index].key);
        
          if(finded > -1) {
            possibleItens.splice(finded, 1);
          }
        } else {
          finalItems.push(this.state.objective.vars[key].key);
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
			this.state.objective.vars[key].value = 0;
  	} else {
  		this.state.objective.vars[key].value = value;
  	}

  	this.forceUpdate();
  }

  pickerChanged(picker, key) {
		this.state.objective.vars[key].key = picker;

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

  objectivePickerChanged(picker) {
  	this.state.objective.maximize = picker;

  	this.setState({ picker });
  }

  render() {
  	const nav = this.props.navigation;

    return (
    	<View style={ styles.container }>
    		<View style={ styles.expressions }>
	        <View style={ styles.highlights }>
	          <Text style={[ styles.label, styles.highlight, styles.texts ]}>OBJECTIVE</Text>
	          <Text style={[ styles.expression, styles.highlight, styles.texts ]}>
	            { this.state.objective.maximize ? 'MAX' : 'MIN' } Z = { getFunction(this.state.objective.vars, 'key') }
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
	        	<Picker onValueChange={ (picker) => this.objectivePickerChanged(picker) } selectedValue={ this.state.objective.maximize }>
              <Picker.Item label='MAXIMIZE' value={ true } />
              <Picker.Item label="MINIMIZE" value={ false } />
            </Picker>
            { this.state.objective.vars.map((x, key) => {
	            return (
	              <View key={ key } style={ styles.restrictions }>
	              	<TextInput
	              		maxLength={ 7 }
                    keyboardType='numeric'
	              		style={ styles.inputsTextEdit }
	              		value={ this.state.objective.vars[key].value + '' }
      		          onChangeText={ (text) => this.inputTextChanged(text, key) }
              		/>
              		<Picker style={[ { width:'30%' } ]} onValueChange={ (picker) => this.pickerChanged(picker, key) } selectedValue={ this.state.objective.vars[key].key }>
			               { this.pickerItens(key) }
			            </Picker>
                  <View style={[ styles.buttons ]}>
                    <Button
                      color='#C04848'
                      onPress={
                        () => { this.removeVar(key) }
                      }
                      title='✘'
                      disabled={ this.state.objective.vars.length == 1 }
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
		                () => { this.addVar() }
		              }
		              title='ADD VAR'
		              disabled={ this.state.objective.vars.length > 6 }
	              />
		          </View>
		        </View>
	        </View>
	      </View>
    	</View>
    );
  }
}
