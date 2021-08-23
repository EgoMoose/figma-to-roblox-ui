window.onmessage = async (event) => {
	if (!event.data.pluginMessage) return;

	const { sent } = event.data.pluginMessage;

	return new Promise(resolve => {
		console.log(sent);
		resolve(undefined);
	}).then(() => {
		window.parent.postMessage({ pluginMessage: "Done!" }, "*");
	})
}