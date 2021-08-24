import { Instance } from './rbx_types';
import * as NodeTypes from './node_types';

function getInstance(node: SceneNode): Instance {
	let instance = null;

	console.log(node.type);
	
	if (NodeTypes[node.type]) {
		instance = NodeTypes[node.type](node);
	}
	
	return instance;
}

function getInstanceWithChildren(node: SceneNode): Instance {
	let instance = getInstance(node);

	if (instance && "children" in node) {
		for (let childNode of node.children) {
			let childInstance = getInstanceWithChildren(childNode);
			if (childInstance) {
				instance.addChild(childInstance);
			}
		}
	}

	return instance;
}

async function main(nodes: Array<SceneNode>) {
	let serialized = [];

	for (const node of nodes) {
		let instance = getInstanceWithChildren(node);

		if (instance) {
			serialized.push({
				name: node.name,
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