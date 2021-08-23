async function main() {
	let sent = "This was sent through the grapevine!"

	figma.showUI(__html__, { visible: false });
	figma.ui.postMessage({ sent });

	return new Promise(resolve => {
		figma.ui.onmessage = () => resolve(undefined);
	})
}

main().then(() => figma.closePlugin());