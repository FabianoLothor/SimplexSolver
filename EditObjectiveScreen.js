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
    this.state.objective.vars.push({ key: 1, value: 1 });

    this.forceUpdate();
  }

  inputTextChanged(text, key) {
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
  	possibleItens = [1,2,3,4,5];
  	for (item in possibleItens ) {
  		if(item[possibleItens] != this.state.objective.vars[key].key) {
  			for (varObj in this.state.objective.vars) {
  				console.log(this.state.objective.vars[varObj].key);
  				if(item[possibleItens] == this.state.objective.vars[varObj].key) {
  					possibleItens.splice(item - 1, 1);
  				}
  			}
  		}

  		console.log(possibleItens);
  	}

  	return (
  		possibleItens.map((x) => {
	  		return (
	  			<Picker.Item label={ 'x' + x } value={ x } />
				)
  		})
		);
  }

  objectivePickerChanged(picker) {
  	this.state.objective.maximize = picker;

  	this.setState({ picker });
  }

  render() {
  	const maxVars = 5;
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
	                  () => nav.navigate('Home', { objective: this.state.objective })
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
	              		keyboardType='numeric'
	              		maxLength={ 7 }
	              		style={ styles.inputsTextEdit }
	              		value={ this.state.objective.vars[key].value + '' }
      		          onChangeText={ (text) => this.inputTextChanged(text, key) }
              		/>
              		<Picker style={[ { width:'25%' } ]} onValueChange={ (picker) => this.pickerChanged(picker, key) } selectedValue={ this.state.objective.vars[key].key }>
			               { this.pickerItens(key) }
			            </Picker>
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
		              disabled={ this.state.objective.vars.length > 4 }
	              />
		          </View>
		        </View>
	        </View>
	      </View>
    	</View>
    );
  }
}
