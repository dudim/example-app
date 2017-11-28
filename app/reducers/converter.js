import {
	GET_CONVERT_REQUEST,
	GET_CONVERT_SUCCESS,
} from '../constants/constants';

const initialState = {
	currencies: ['EUR', 'GBP', 'RUB'],
	from: 'EUR',
	to: 'GBP',
	rate: 0,
	isLoading: true,
};

export default function (state = initialState, action) {
	switch (action.type) {
		case GET_CONVERT_REQUEST:
			return {
				...state,
				isLoading: true,
			};

		case GET_CONVERT_SUCCESS: {
			const to = Object.keys(action.response.rates)[0];
			return {
				...state,
				from: action.response.base,
				to,
				rate: action.response.rates[to],
				isLoading: false,
			};
		}

		default:
			return state;
	}
}

