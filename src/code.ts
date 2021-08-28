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

function getInstance(node: SceneNode): Instance {
	let instance = null;
	
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
				instance.content.addChild(childInstance);
			}
		}
	}

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
		let instance = getInstanceWithChildren(node);

		if (instance) {
			let images = [];

			for (let descendant of getAllInstances(instance)) {
				let imageNode = descendant.properties.Image
				if (imageNode) {
					let index = images.length;

					images.push({
						name: imageNode.name,
						index: index,
						bytes: await imageNode.exportAsync(DEFAULT_EXPORT),
						isEffect: !!descendant.properties.IsEffect,
					});

					// this is a non-existent protocol, but we'll replace it later
					imageNode.remove();
					descendant.properties.Image = `figma://${index}`;
					descendant.properties.IsEffect = null;
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