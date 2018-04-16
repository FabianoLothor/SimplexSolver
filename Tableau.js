import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';

import styles from './Styles';

export default class Tableau extends Component {
  render() {
  	this.props.tableau.rowTitle.unshift('-');

  	for(rowValue in this.props.tableau.rowValues[0]) {
  		this.props.tableau.rowValues[0][rowValue] = Math.round(this.props.tableau.rowValues[0][rowValue].value * 10) / 10 +
  			(this.props.tableau.rowValues[0][rowValue].m != 0 ? (
  				(this.props.tableau.rowValues[0][rowValue].m > 0 ? '+' + Math.round(this.props.tableau.rowValues[0][rowValue].m * 10) / 10 : Math.round(this.props.tableau.rowValues[0][rowValue].m * 10) / 10) + 'M'
				) : '');
  	}

    return (
      <ScrollView horizontal={true}  style={[ { paddingBottom: 25 } ]}>
      	<Table borderStyle={{ borderWidth: 1, borderColor: '#242729' }}>
          <Row data={this.props.tableau.rowTitle}
          	flexArr={ Array(this.props.tableau.rowTitle.length).fill(1)}
          	style={ tbStyles.head }
          	textStyle={ tbStyles.text }
          	widthArr={ Array(this.props.tableau.rowTitle.length).fill(100) }
        	/>
          <TableWrapper style={tbStyles.wrapper}>
            <Col data={ this.props.tableau.columnTitle }
            	style={ tbStyles.title }
            	textStyle={ tbStyles.text }
          	/>
            <Rows data={ this.props.tableau.rowValues }
            	flexArr={ Array(this.props.tableau.rowTitle.length - 1).fill(1) }
            	style={ tbStyles.row }
            	textStyle={ tbStyles.internalText }
            	widthArr={ Array(this.props.tableau.rowTitle.length - 1).fill(100) }
          	/>
          </TableWrapper>
        </Table>
      </ScrollView>
  	);
  }
}

const tbStyles = StyleSheet.create({
  head: {  height: 40,  backgroundColor: '#242729' },
  wrapper: { flexDirection: 'row' },
  title: { flex: 1, backgroundColor: '#242729', width: 100 },
  row: {  height: 25 },
  text: { textAlign: 'center', color: '#BBC0C4' },
  internalText: { textAlign: 'center', color: '#242729' }
});