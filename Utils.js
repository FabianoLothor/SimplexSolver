export const sortByObjectKey = function(o, k) {
  o.sort(function (a, b) {
    if (a[k] > b[k]) {
      return 1;
    }
    
    if (a[k] < b[k]) {
      return -1;
    }
    
    return 0;
  });
}

export const getFunction = function(vars) {
  strFunction = '';

  sortByObjectKey(vars, 'key')

  for ( var key = 0;key < vars.length;++key ) {
    strFunction += 
      ( key > 0 && vars[key].value > -1 ? '+' : '') +
      ( vars[key].value != 1 ? vars[key].value : '' ) +
      ( 'x' + (vars[key].key) ) + '';
  }

  return strFunction;
}

export const getRestriction = function(restriction) {
  expression = '';

  expression += getFunction(restriction.vars) + ' ';

  if(!restriction.greater && !restriction.less) {
    expression += '=';
  } else if (restriction.greater) {
    expression += '≥';
  } else {
    expression += '≤';
  }

  expression += ' ' + restriction.result;

  return expression;
}