export function getFillRGBA(node) {
	let fills = node.fills;

	if (fills && fills.length === 1) {
		let paint = fills[0];
		if (paint.type == "SOLID" && paint.blendMode == "NORMAL") {
			let rgb = paint.color;
			return [rgb.r, rgb.g, rgb.b, paint.opacity];
		}
	}

	// Default to white
	return [1, 1, 1, 1]
}

export function getStrokeRGBA(node) {
	let strokes = node.strokes;

	if (strokes && strokes.length === 1) {
		let paint = strokes[0];
		if (paint.type == "SOLID" && paint.blendMode == "NORMAL") {
			let rgb = paint.color;
			return [rgb.r, rgb.g, rgb.b, paint.opacity];
		}
	}

	return [1, 1, 1, 0]
}

export function getTextAlignment(property) {
	switch (property) {
		case "LEFT": return "Left";
		case "CENTER": return "Center";
		case "RIGHT": return "Right";
		case "TOP": return "Top";
		case "BOTTOM": return "Bottom";
		case "JUSTIFIED": return "Left";
	}
}

export function getPosition(node, offset = [0, 0]) {
	let rx = node.x;
	let ry = node.y;

	if (node.parent.type == "GROUP") {
		rx -= node.parent.x;
		ry -= node.parent.y;
	}

	let radians = node.rotation * (Math.PI / 180);
	let c = Math.cos(radians);
	let s = Math.sin(radians);
	let x = rx + offset[0]
	let y = ry + offset[1]

	return [x * c + y * s, y * c - x * s,]
}