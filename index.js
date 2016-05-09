'use strict';
const {createStore, applyMiddleware} = require('redux');
const reduxSaga = require('redux-saga');
const createSagaMiddleware = reduxSaga.default;
const {takeEvery, delay, effects} = reduxSaga;
const {put, take, select, fork} = effects;

function counter(state = 0, action) {
	switch (action.type) {
		case 'INCREMENT':
			return state + 1;
		case 'DECREMENT':
			return state - 1;
		default:
			return state;
	}
}

function * incrementAsync() {
	yield delay(1000);
	yield put({type: 'INCREMENT'});
}

function * watchIncrementAsync() {
	yield * takeEvery('INCREMENT_ASYNC', incrementAsync);
}

function * watchAndLog() {
	while (true) { // eslint-disable-line
		console.log('before state', yield select());
		const action = yield take('*');
		console.log('action', action);
		console.log('after state', yield select());
		console.log();
	}
}

function * rootSaga() {
	yield fork(watchAndLog);
	yield fork(watchIncrementAsync);
}

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
	counter,
	applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(rootSaga);

const action = type => store.dispatch({type});

action('INCREMENT');
action('INCREMENT_ASYNC');
action('INCREMENT');
action('INCREMENT');
action('INCREMENT_ASYNC');
action('DECREMENT');
action('INCREMENT_ASYNC');
