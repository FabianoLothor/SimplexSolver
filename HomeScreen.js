// DONE -> EXIBIR OS VALORES ENCONTRADOS
// DONE -> ADICIONAR RESTRIÇÃO DE NÃO NEGATIVIDADE NAS RESTRIÇÕES *** OU *** ADICIONAR REGRA PARA MULTIPLICAR A LINHA POR -1
// TODO -> ADICIONAR CHECAGEM PARA SABER SE O PROBLEMA TEM SOLUÇÃO (VARIÁVEIS BÁSICAS SÃO POSITIVAS)

// DONE -> REMOVER POSSIBILIDADES DE VARIÁVEIS NAS RESTRIÇÕES QUE NÃO ESTIVEREM NA FUNÇÃO OBJETIVA
// DONE -> IMPOSSIBILITAR EXCLUSÃO E MUDANÇA DE VARIÁVEIS QUE ESTIVEREM SENDO UTILIZADAS NAS RESTRIÇÕES
// TODO -> RESOLVER O PROBLEMA DE RETORNO DAS PÁGINAS
// DONE -> DESABILITAR BOTÃO SOLVE QUANDO NÃO TIVER AO MENOS UMA RESTRIÇÃO

import React, { Component } from 'react';
import {
  Button,
  ScrollView,
  Text,
  View
} from 'react-native';

import Expressions from './Expressions';
import styles from './Styles';
import { getTableauInitial, solve } from './Solver';

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

    //var simplex = JSON.parse('{"objective":{"maximize":true,"vars":[{"key":1,"value":3},{"key":2,"value":5}]},"restrictions":[{"greater":false,"less":true,"result":4,"vars":[{"key":1,"value":1}]},{"greater":false,"less":true,"result":12,"vars":[{"key":2,"value":2}]},{"greater":false,"less":true,"result":18,"vars":[{"key":1,"value":3},{"key":2,"value":2}]}]}');
    //var simplex = JSON.parse('{"objective":{"maximize":true,"vars":[{"key":1,"value":3},{"key":2,"value":5}]},"restrictions":[{"greater":false,"less":true,"result":32,"vars":[{"key":1,"value":1}]},{"greater":false,"less":true,"result":36,"vars":[{"key":2,"value":2}]},{"greater":false,"less":false,"result":18,"vars":[{"key":1,"value":3},{"key":2,"value":2}]}]}');
    //var simplex = JSON.parse('{"objective":{"maximize":false,"vars":[{"key":1,"value":0.4},{"key":2,"value":0.5}]},"restrictions":[{"greater":false,"less":true,"result":2.7,"vars":[{"key":1,"value":0.3},{"key":2,"value":0.1}]},{"greater":false,"less":false,"result":6,"vars":[{"key":1,"value":0.5},{"key":2,"value":0.5}]},{"greater":true,"less":false,"result":6,"vars":[{"key":1,"value":0.6},{"key":2,"value":0.4}]}]}');

    // youtube sample
    //var simplex = JSON.parse('{"objective":{"maximize":true,"vars":[{"key":1,"value":1},{"key":2,"value":-1},{"key":3,"value":3}]},"restrictions":[{"greater":false,"less":true,"result":20,"vars":[{"key":1,"value":1},{"key":2,"value":1}]},{"greater":false,"less":false,"result":5,"vars":[{"key":1,"value":1},{"key":3,"value":1}]},{"greater":true,"less":false,"result":10,"vars":[{"key":2,"value":1},{"key":3,"value":1}]}]}');

    //initialTableau = getTableauInitial(simplex);
    initialTableau = getTableauInitial(this.state);

    // TODO: CHECK IF EXISTS A SOLUTION

    this.props.navigation.navigate('Solution', { allTableau: JSON.parse(solve(initialTableau, '[]')) });

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