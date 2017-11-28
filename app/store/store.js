import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import fetching from '../middlewares/fetching';
import rootReducer from '../reducers';

const middlewares = [thunk, fetching];

if (process.env.NODE_ENV !== 'production') {
	/* eslint-disable global-require */
	const { logger } = require('redux-logger');
	/* eslint-enable global-require */
	middlewares.push(logger);
}

export default function configureStore(initialState) {
	const store = createStore(
		rootReducer,
		initialState,
		applyMiddleware(...middlewares),
	);
	return store;
}
