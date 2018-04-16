// <= -> ADD A 'SLACK' VARIABLE
// = -> ADD AN 'ARTIFICIAL' VARIABLE
// >= -> ADD A 'SLACK' AND 'ARTIFICIAL' VARIABLE

var controller = {
	solverCount: 0,
	slacksCount: 0,
	slackIndexes: [],
	artificialsCount: 0,
	artificialIndexes: [],
};

getConstraintSign = function(constraint) {
	return constraint.greater ? '≥' : constraint.less ? '≤' : '=';
}

export const getTableauInitial = function(simplexObj) {
	var data = simplexObj;

	//console.log(data);

	var tableau = {
		columnTitle: [],
		rowTitle: [],
		rowValues: [],
	};

	// Objective

	tableau.columnTitle.push('MAX ' + (data.objective.maximize ? 'Z' : '-Z'));
	tableau.rowValues.push([]);

	for(var i in data.objective.vars) {
		tableau.rowTitle.push('x' + data.objective.vars[i].key);
		tableau.rowValues[0].push({
			value: data.objective.maximize ?
				data.objective.vars[i].value * -1: data.objective.vars[i].value,
			m: 0,
		});
	}

	// Restrictions

	for(var i in data.restrictions) {
		i = parseInt(i);

		tableau.rowValues.push([]);

		for(var j = 0;j < data.restrictions[i].vars.length;++j) {
			if(tableau.rowTitle.indexOf('x' + data.restrictions[i].vars[j].key) === j) {
				tableau.rowValues[i + 1].push(data.restrictions[i].vars[j].value);
			} else {
				if(tableau.rowTitle.indexOf('x' + data.restrictions[i].vars[j].key) !== -1) {
					data.restrictions[i].vars.unshift(0);
				}

				tableau.rowValues[i + 1].push(0);
			}

			// IF is the last restriction value:
			if((j + 1) == data.restrictions[i].vars.length) {
				// CREATE the Slack and the Artificial vars
				switch (getConstraintSign(data.restrictions[i])) {
					case '≥' :
						tableau.rowTitle.push('s' + (++controller.slacksCount));
						controller.slackIndexes.push([i + 1, tableau.rowTitle.length - 1, -1]);

						tableau.rowTitle.push('a' + (++controller.artificialsCount));
						controller.artificialIndexes.push([i + 1, tableau.rowTitle.length - 1, 1]);

						tableau.columnTitle.push(tableau.rowTitle[tableau.rowTitle.length - 1]);
					break;
					case '≤' :
						tableau.rowTitle.push('s' + (++controller.slacksCount));
						controller.slackIndexes.push([i + 1, tableau.rowTitle.length - 1, 1]);

						tableau.columnTitle.push(tableau.rowTitle[tableau.rowTitle.length - 1]);
					break;
					case '=' :
						tableau.rowTitle.push('a' + (++controller.artificialsCount));
						controller.artificialIndexes.push([i + 1, tableau.rowTitle.length - 1, 1]);

						tableau.columnTitle.push(tableau.rowTitle[tableau.rowTitle.length - 1]);
					break;
				}
				
				// SET slack and artificials vars with null value
				for(var l in tableau.rowValues) {
					l = parseInt(l);

					while(tableau.rowValues[l].length < tableau.rowTitle.length) {
						tableau.rowValues[l].push(l > 0 ? 0 : {
							value: 0,
							m: 0,
						});
					}
				}
			}
		}
	}

	// ADD the RHS value at the end of the objective row
	tableau.rowTitle.push('RHS');

	// SET slack and artificials vars at correct position
	for(var i = 0;i < tableau.rowValues.length;++i) {
		if(i > 0) {
			// ADD the RHS value at the end of the row
			if (typeof data.restrictions[i - 1] === 'undefined') {
				tableau.rowValues[i].push(0);
			} else {
				tableau.rowValues[i].push(data.restrictions[i - 1].result);
			}
		}

		if(typeof controller.slackIndexes[i] !== 'undefined') {
				tableau.rowValues[controller.slackIndexes[i][0]][controller.slackIndexes[i][1]] = controller.slackIndexes[i][2];
			}

		if(typeof controller.artificialIndexes[i] !== 'undefined') {
			tableau.rowValues[0][controller.artificialIndexes[i][1]].m = controller.artificialIndexes[i][2];
			tableau.rowValues[controller.artificialIndexes[i][0]][controller.artificialIndexes[i][1]] = controller.artificialIndexes[i][2];

			for(var j in tableau.rowValues[0]) {
				j = parseInt(j);
				
				if(typeof tableau.rowValues[0][j] !== 'undefined') {
					tableau.rowValues[0][j].m += (-1 * tableau.rowValues[controller.artificialIndexes[i][0]][j]);
				}
			}
		}

		if(i + 1 == tableau.rowValues.length) {
			tableau.rowValues[0].push({
				value: 0,
				m: 0,
			});
			
			for(j in controller.artificialIndexes) {
				tableau.rowValues[0][tableau.rowValues[0].length - 1].m += (-1 * (
					controller.artificialIndexes[j][2] *
					tableau.rowValues[controller.artificialIndexes[j][0]][tableau.rowValues[controller.artificialIndexes[j][0]].length - 1]
				));
			}
		}
	}

	// END function
	return tableau;
}

function getSmallerColumnIndex(tableauRow) {
	var smaller = {
		value: tableauRow[0].value,
		columnIndex: 0,
		hasM: false,
	};

	var mControl = tableauRow[0].m;

	for(i = 0;i < tableauRow.length - 1; ++i) {
		if(mControl == 0) {
			if(tableauRow[i].value != 0 && smaller.value > tableauRow[i].value) {
				smaller.value = tableauRow[i].value;
				smaller.columnIndex = i;
			}

			mControl = tableauRow[i].m;
		} else {
			if(!smaller.hasM) {
				smaller.value = mControl;
				smaller.columnIndex = i - 1 < 0 ? 0 : i - 1;
				smaller.hasM = true;
			}

			if(tableauRow[i].m != 0 && smaller.value > tableauRow[i].m) {
				smaller.value = tableauRow[i].m;
				smaller.columnIndex = i;
				smaller.hasM = true;
			}

			if(tableauRow[i].m != 0 && ((smaller.value - tableauRow[i].m > 0 && smaller.value - tableauRow[i].m < 0.01) || (smaller.value - tableauRow[i].m < 0 && smaller.value - tableauRow[i].m > -0.01))) {
				if(tableauRow[smaller.columnIndex].value > tableauRow[i].value) {
					smaller.value = tableauRow[i].m;
					smaller.columnIndex = i;
					smaller.hasM = true;
				}
			}
		}
	}

	return smaller.columnIndex;
}

function getSmallerRowIndex(tableauRows, columnIndex) {
	var smaller = {
		value: null,
		rowIndex: null,
	};

	for(i = 1;i < tableauRows.length; ++i) {
		if(tableauRows[i][columnIndex] != 0) {
			if(smaller.value === null || ((tableauRows[i][tableauRows[i].length - 1] / tableauRows[i][columnIndex]) > 0 && smaller.value > (tableauRows[i][tableauRows[i].length - 1] / tableauRows[i][columnIndex]))) {
				smaller.value = Math.round((tableauRows[i][tableauRows[i].length - 1] / tableauRows[i][columnIndex]) * 10000000000) / 10000000000;
				smaller.rowIndex = i;
			}
		}
	}

	return smaller.rowIndex;
}

function updateTableauRows(tableauRows, pivotRowIndex, pivotColumnIndex) {
	for(i = 0;i < tableauRows.length; ++i) {
		if(i != pivotRowIndex) {
			iV = isNaN(tableauRows[i][pivotColumnIndex]) ? 0 : tableauRows[i][pivotColumnIndex] * -1;
			iV0 = tableauRows[i][pivotColumnIndex].value * -1;
			iM0 = tableauRows[i][pivotColumnIndex].m * -1;

			for(j = 0;j < tableauRows[i].length; ++j) {
				if(i == 0) {
					tableauRows[i][j].value = Math.round(((iV0 * tableauRows[pivotRowIndex][j]) + tableauRows[i][j].value) * 100000) / 100000;
					tableauRows[i][j].m = Math.round(((iM0 * tableauRows[pivotRowIndex][j]) + tableauRows[i][j].m) * 100000) / 100000;
				} else {
					tableauRows[i][j] = Math.round(((iV * tableauRows[pivotRowIndex][j]) + tableauRows[i][j]) * 100000) / 100000;
				}
			}
		}
	}

	return tableauRows;
}

function getUpdatedPivotRow(pivotValue, pivotRow) {
	for(i = 0;i < pivotRow.length; ++i) {
		pivotRow[i] = Math.round((pivotRow[i] / pivotValue) * 100000) / 100000;
	}

	return pivotRow;
}

function tableauSolved(tableauRow) {
	for(i = 0;i < tableauRow.length - 1; ++i) {
		if(tableauRow[i].m == 0) {
			if(tableauRow[i].value < -0.01) {
				return false;
			}
		} else {
			if(tableauRow[i].m < -0.01) {
				return false;
			}
		}
	}

	return true;
}

export const solve = (tableau, allTableau) => {
	allTableau = JSON.parse(allTableau);
	allTableau.unshift(Object.assign({}, tableau));
	allTableau = JSON.stringify(allTableau);

	++controller.solverCount;

	var pivotColumnIndex = getSmallerColumnIndex(tableau.rowValues[0]);
	var pivotRowIndex = getSmallerRowIndex(tableau.rowValues, pivotColumnIndex);

	var pivotValue = tableau.rowValues[pivotRowIndex][pivotColumnIndex];

	//console.log('solving_' + controller.solverCount, pivotColumnIndex, pivotRowIndex, pivotValue);

	tableau.rowValues[pivotRowIndex] = getUpdatedPivotRow(pivotValue, tableau.rowValues[pivotRowIndex]);
	tableau.columnTitle[pivotRowIndex] = tableau.rowTitle[pivotColumnIndex];

	tableau.rowValues = updateTableauRows(tableau.rowValues, pivotRowIndex, pivotColumnIndex);
	
	if(tableauSolved(tableau.rowValues[0])) {
		allTableau = JSON.parse(allTableau);
		allTableau.unshift(Object.assign({}, tableau));

		return JSON.stringify(allTableau);
	} else {

		/*
		if(controller.solverCount == 1) {
			return allTableau;
		}
		//*/

		return solve(tableau, JSON.stringify(JSON.parse(allTableau)));
	}
}