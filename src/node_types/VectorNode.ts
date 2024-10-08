import Frame from "./FrameNode";
import * as Utils from "./Utilities";
import * as RbxTypes from "../rbx_types";

export default async function Vector(node) {
	let vector = await Frame(node);
	let content = vector.content;

	let imageNode = node.clone();
	let imageRGBA = Utils.getFillRGBA(node);

	imageNode.fills = [{
		type: "SOLID",
		opacity: 1,
		color: { r: 1, g: 1, b: 1 },
	}]

	Object.assign(content.properties, {
		"ClassName": "ImageLabel",

		"Image": imageNode,
		"ImageColor3": new RbxTypes.Color3(imageRGBA[0], imageRGBA[1], imageRGBA[2]),
		"ImageTransparency": 1 - imageRGBA[3],

		"BackgroundTransparency": 1,
	});

	content.properties.BackgroundColor3 = null;

	return vector;
}