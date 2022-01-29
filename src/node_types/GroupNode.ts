import Frame from "./FrameNode";

export default async function Group(node) {
	let group = await Frame(node);
	group.properties.BackgroundColor3 = null;
	group.properties.BackgroundTransparency = 1;
	group.properties.BorderSizePixel = null;
	return group;
}