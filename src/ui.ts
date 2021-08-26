import JSZip from "../node_modules/jszip/dist/jszip.min.js";

window.onmessage = async (event) => {
	if (!event.data.pluginMessage) return;

	const { serialized } = event.data.pluginMessage;

	return new Promise(resolve => {
		let zip = new JSZip();
		
		for (let ui of serialized) {
			zip.file(`${ui.name}.lua`, ui.lua);
			//console.log(ui.lua);
		}

		zip.generateAsync({ type: "blob" }).then((content: Blob) => {
			const blobURL = window.URL.createObjectURL(content);
			const link = document.createElement("a");
			link.className = "button button--primary";
			link.href = blobURL;
			link.download = "export.zip";
			//link.click();
			link.setAttribute("download", "export.zip");
			resolve(undefined);
		});
	}).then(() => {
		window.parent.postMessage({ pluginMessage: "Done!" }, "*");
	})
}