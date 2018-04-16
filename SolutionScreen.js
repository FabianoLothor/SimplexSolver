import React, { Component } from 'react';
import {
	Button,
	ScrollView,
	StyleSheet,
	Text,
	View
} from 'react-native';

import styles from './Styles';
import Tableau from './Tableau';

export default class SolutionScreen extends Component {
	constructor(props) {
    super(props);

    this.state = this.props.navigation.state.params;
  }

	render() {
		const nav = this.props.navigation;

		return (
			<View style={ styles.container }>
        <View style={[ styles.highlights, { width: '100%' } ]}>
          <Text style={[ styles.results, styles.texts ]}>TABLEU SOLVED</Text>
          <View style={[ styles.buttons ]}>
            <View style={[ styles.buttonConfirm ]}>
              <Button
                color='#0095FF'
                onPress={
                  () => nav.navigate('Home')
                }
                title='«'
              />
            </View>
          </View>
        </View>
        <ScrollView style={[ { padding: 10, flexDirection: 'column' } ]}>
					{ this.state.allTableau.slice().map((tableau, key) => {
						return (
							<Tableau key={ key } tableau={ tableau } />
						);
					})}
				</ScrollView>
      </View>
		);
	}
}