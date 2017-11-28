export default function fetching() {
	return next => (action) => {
		/* eslint-disable no-shadow */
		const { fetching, types, sequence, ...rest } = action;
		/* eslint-enable no-shadow */

		if (!fetching) {
			return next(action);
		}
		let promise = fetching;
		const sequenceResponses = [];

		if (Array.isArray(fetching)) {
			if (sequence) {
				promise = fetching.reduce((prevPromise, nextPromise) =>
					prevPromise.then(() => nextPromise().then((result) => {
						sequenceResponses.push(result);
					})),
				Promise.resolve([]));
			} else {
				promise = Promise.all(fetching.map(item => item()));
			}
		}

		const [REQUEST, SUCCESS, ERROR] = types;
		next({ ...rest, type: REQUEST });

		return promise
			.then((response) => {
				let nextResponse = response;
				if (sequence) {
					nextResponse = sequenceResponses;
				}
				next({ ...rest, response: nextResponse, type: SUCCESS });
			})
			.catch((error) => {
				next({ ...rest, error, type: ERROR });
			});
	};
}
