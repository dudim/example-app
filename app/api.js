import queryString from 'query-string';

const openexchangeratesAppId = 'c30ae2db900d418baa13cc5f6b545ec4';

/**
 * загрузка ставок
 * @param params
 * @returns {Promise.<T>|*}
 */
export function getRatesRequest(params) {
	// eslint-disable-next-line max-len
	return fetch(`https://openexchangerates.org/api/latest.json?${queryString.stringify(Object.assign(params, { app_id: openexchangeratesAppId }))}`,
		{ method: 'get' }).then(response => response.json());
}
