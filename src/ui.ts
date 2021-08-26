import JSZip from "../node_modules/jszip/dist/jszip.min.js";

function typedArrayToBuffer(array) {
	return array.buffer.slice(array.byteOffset, array.byteLength + array.byteOffset)
}

window.onmessage = async (event) => {
	if (!event.data.pluginMessage) return;

	const { serialized } = event.data.pluginMessage;

	return new Promise(resolve => {
		let zip = new JSZip();
		
		for (let ui of serialized) {
			let count = 0;
			let processed = {};
			let lookup = [];

			for (let image of ui.images) {
				let hash = image.bytes.join("");
				if (!processed[hash] && processed[hash] !== 0) {
					processed[hash] = count;
					let cleanBytes = typedArrayToBuffer(image.bytes);
					let blob = new Blob([ cleanBytes ], { type: "image/png" });
					zip.file(`${ui.name}/${count}.png`, blob, {base64: true});
					count++;
				}

				lookup[image.index] = processed[hash];
			}

			let output = ui.lua;
			for (let i = 0; i < lookup.length; i++) {
				output = output.replace(`figma://${i}`, `figma://${lookup[i]}`);
			}

			zip.file(`${ui.name}/${ui.name}.lua`, output);
		}

		zip.generateAsync({ type: "blob" }).then((content: Blob) => {
			const blobURL = window.URL.createObjectURL(content);
			const link = document.createElement("a");
			link.className = "button button--primary";
			link.href = blobURL;
			link.download = "export.zip";
			link.click();
			link.setAttribute("download", "export.zip");
			resolve(undefined);
		});
	}).then(() => {
		window.parent.postMessage({ pluginMessage: "Done!" }, "*");
	})
}