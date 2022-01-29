import Frame from "./FrameNode";
import * as Utils from "./Utilities";
import * as RbxTypes from "../rbx_types";

export default async function ImageNode(node) {
	let vector = await Frame(node);
	let content = vector.content;

	let imageNode = node.clone();
	imageNode.effects = [];
	imageNode.strokes = [];

	Object.assign(content.properties, {
		"ClassName": "ImageLabel",

		"Image": imageNode,
		"ImageColor3": new RbxTypes.Color3(1, 1, 1),
		"ImageTransparency": 0,

		"BackgroundTransparency": 1,
	});

	content.properties.BackgroundColor3 = null;

	return vector;
}