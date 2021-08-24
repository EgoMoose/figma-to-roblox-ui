window.onmessage = async (event) => {
	if (!event.data.pluginMessage) return;

	const { serialized } = event.data.pluginMessage;

	return new Promise(resolve => {
		for (let lua of serialized) {
			console.log(lua);
		}
		
		resolve(undefined);
	}).then(() => {
		window.parent.postMessage({ pluginMessage: "Done!" }, "*");
	})
}