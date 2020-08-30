export function onError(error) {
	if (!error) return;

	let message = error.toString();

	// Auth errors
	if (!(error instanceof Error) && error.message) {
		message = error.message;
	}

	alert(message);
}
