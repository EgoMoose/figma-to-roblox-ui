import JSZip from "../node_modules/jszip/dist/jszip.min.js";

function typedArrayToBuffer(array) {
	return array.buffer.slice(array.byteOffset, array.byteLength + array.byteOffset)
}

async function decode(canvas, ctx, bytes) {
	const url = URL.createObjectURL(new Blob([bytes]))
	const image = await new Promise<HTMLImageElement>((resolve, reject) => {
		const img = new Image()
		img.onload = () => resolve(img)
		img.onerror = () => reject()
		img.src = url
	})

	canvas.width = image.width
	canvas.height = image.height
	ctx.drawImage(image, 0, 0)
	const imageData = ctx.getImageData(0, 0, image.width, image.height)
	return imageData
}

async function encode(canvas, ctx, imageData) {
	ctx.putImageData(imageData, 0, 0)

	return await new Promise((resolve, reject) => {
		canvas.toBlob(blob => {
			const reader = new FileReader()
			reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer))
			reader.onerror = () => reject(new Error('Could not read from blob'))
			reader.readAsArrayBuffer(blob)
		})
	})
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