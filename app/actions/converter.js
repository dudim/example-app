import {
	getRatesRequest,
} from '../api';

import {
	GET_CONVERT_REQUEST,
	GET_CONVERT_SUCCESS,
	GET_CONVERT_ERROR,
} from '../constants/constants';

/**
 * Получение курса конвертации
 * @returns {Function}
 */
export default function getRates(params) {
	return (dispatch) => {
		dispatch({
			types: [GET_CONVERT_REQUEST, GET_CONVERT_SUCCESS, GET_CONVERT_ERROR],
			fetching: getRatesRequest(params),
		});
	};
}

