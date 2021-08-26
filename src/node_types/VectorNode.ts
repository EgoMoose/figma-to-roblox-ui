import Frame from "./FrameNode";

export default function Vector(node) {
	let vector = Frame(node);
	let imageNode = node.clone();

	Object.assign(vector.properties, {
		"Image": imageNode,
	});

	return vector;
}