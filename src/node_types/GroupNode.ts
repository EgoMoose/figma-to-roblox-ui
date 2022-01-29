import Frame from "./FrameNode";

export default async function Group(node) {
	let group = await Frame(node);
	let content = group.content
	content.properties.BackgroundColor3 = null;
	content.properties.BackgroundTransparency = 1;
	content.properties.BorderSizePixel = null;
	return group;
}