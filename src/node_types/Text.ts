import Frame from "./Frame";

export default function Text(node) {
	let frame = Frame(node);
	let label = frame.content;

	Object.assign(label.properties, {
		"ClassName": "TextLabel",
		"Text": node.characters,
		"BackgroundTransparency": 1,
	});

	label.properties.BackgroundColor3 = null;

	return frame;
}