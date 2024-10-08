import { Instance } from './rbx_types';
import * as NodeTypes from './node_types';

const DEFAULT_EXPORT = {
	format: "PNG", 
	suffix: '', 
	constraint: { 
		type: "SCALE", 
		value: 1 
	}, 
	contentsOnly: true
}

async function getInstance(node): Instance {
	let instance = null;
	let nodeType = node.type;

	if (node.fills && node.fills.length > 0 && (node.fills.length > 1 || node.fills[0].type != "SOLID")) {
		nodeType = "IMAGE";
	}

	if (NodeTypes[nodeType]) {
		instance = NodeTypes[nodeType](node);
	}
	
	return instance;
}

async function getInstanceWithChildren(node: SceneNode): Instance {
	let instance = await getInstance(node);

	if (instance && "children" in node) {
		for (let childNode of node.children) {
			let childInstance = await getInstanceWithChildren(childNode);
			if (childInstance) {
				instance.content.addChild(childInstance);
			}
		}
	}

	instance.children.reverse();

	return instance;
}

function getAllInstances(instance: Instance): Instance[] {
	let all = [instance];
	for (let child of instance.children) {
		all = all.concat(getAllInstances(child));
	}
	return all;
}

async function main(nodes: Array<SceneNode>) {
	let serialized = [];

	for (const node of nodes) {
		let instance = await getInstanceWithChildren(node);

		if (instance) {
			let images = [];

			for (let descendant of getAllInstances(instance)) {
				let imageNode = descendant.properties.Image
				if (imageNode) {
					let index = images.length;

					images.push({
						name: imageNode.name,
						index: index,
						bytes: await imageNode.exportAsync(),
					});

					imageNode.remove();
					// this is a non-existent roblox content protocol, but we'll replace it later
					descendant.properties.Image = `figma://${index}`;
				}
			}

			serialized.push({
				name: node.name,
				images: images,
				lua: "return " + instance.toLua(),
			});
		}
	}

	figma.showUI(__html__, { visible: false });
	figma.ui.postMessage({ serialized });

	return new Promise(resolve => {
		figma.ui.onmessage = () => resolve(undefined);
	})
}

main([figma.currentPage.selection[0]]).then(() => figma.closePlugin());