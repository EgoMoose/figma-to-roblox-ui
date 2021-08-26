import Frame from "./Frame";

export default function Vector(node) {
	let vector = Frame(node);

	vector.properties.Image = node.clone();

	return vector;
}