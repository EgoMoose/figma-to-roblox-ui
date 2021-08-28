import * as RbxTypes from "../rbx_types";
import * as Utils from "./Utilities";

const ALIGN_OFFSETS = {
	"CENTER": 0.5,
	"OUTSIDE": 1,
	"INSIDE": 0,
}

const SUPPORTED_EFFECTS = {
	"DROP_SHADOW": true,
}

function getNonRoundedBorderInstance(node, strokeRGBA) {
	let offset = ALIGN_OFFSETS[node.strokeAlign];

	let container = new RbxTypes.Instance({
		"ClassName": "Frame",
		"Name": "Border",

		"AnchorPoint": new RbxTypes.Vector2(0.5, 0.5),
		"Position": new RbxTypes.UDim2(0.5, 0, 0.5, 0),
		"Size": new RbxTypes.UDim2(1, offset * node.strokeWeight * 2, 1, offset * node.strokeWeight * 2),
		"BackgroundTransparency": 1,
		"ClipsDescendants": true,
	})

	container.addChild(new RbxTypes.Instance({
		"ClassName": "Frame",
		"Name": "Left",
		"AnchorPoint": new RbxTypes.Vector2(0, 0.5),
		"Position": new RbxTypes.UDim2(0, 0, 0.5, 0),
		"Size": new RbxTypes.UDim2(0, node.strokeWeight, 1, -node.strokeWeight * 2),
		"BorderSizePixel": 0,
		"BackgroundTransparency": 1 - strokeRGBA[3],
		"BackgroundColor3": new RbxTypes.Color3(strokeRGBA[0], strokeRGBA[1], strokeRGBA[2]),
	}));

	container.addChild(new RbxTypes.Instance({
		"ClassName": "Frame",
		"Name": "Right",
		"AnchorPoint": new RbxTypes.Vector2(1, 0.5),
		"Position": new RbxTypes.UDim2(1, 0, 0.5, 0),
		"Size": new RbxTypes.UDim2(0, node.strokeWeight, 1, -node.strokeWeight * 2),
		"BorderSizePixel": 0,
		"BackgroundTransparency": 1 - strokeRGBA[3],
		"BackgroundColor3": new RbxTypes.Color3(strokeRGBA[0], strokeRGBA[1], strokeRGBA[2]),
	}));

	container.addChild(new RbxTypes.Instance({
		"ClassName": "Frame",
		"Name": "Top",
		"AnchorPoint": new RbxTypes.Vector2(0.5, 0),
		"Position": new RbxTypes.UDim2(0.5, 0, 0, 0),
		"Size": new RbxTypes.UDim2(1, 0, 0, node.strokeWeight),
		"BorderSizePixel": 0,
		"BackgroundTransparency": 1 - strokeRGBA[3],
		"BackgroundColor3": new RbxTypes.Color3(strokeRGBA[0], strokeRGBA[1], strokeRGBA[2]),
	}));

	container.addChild(new RbxTypes.Instance({
		"ClassName": "Frame",
		"Name": "Bottom",
		"AnchorPoint": new RbxTypes.Vector2(0.5, 1),
		"Position": new RbxTypes.UDim2(0.5, 0, 1, 0),
		"Size": new RbxTypes.UDim2(1, 0, 0, node.strokeWeight),
		"BorderSizePixel": 0,
		"BackgroundTransparency": 1 - strokeRGBA[3],
		"BackgroundColor3": new RbxTypes.Color3(strokeRGBA[0], strokeRGBA[1], strokeRGBA[2]),
	}));

	return container;
}

function getRoundedCornerInstance(node, strokeRGBA, name, x, y) {
	let corner = new RbxTypes.Instance({
		"ClassName": "Frame",
		"Name": name,

		"AnchorPoint": new RbxTypes.Vector2(x, y),
		"Position": new RbxTypes.UDim2(x, 0, y, 0),
		"Size": new RbxTypes.UDim2(0, node.strokeWeight, 0, node.strokeWeight),
		"BackgroundTransparency": 1,
		"ClipsDescendants": true,
	});

	let child = new RbxTypes.Instance({
		"ClassName": "Frame",
		"AnchorPoint": new RbxTypes.Vector2(x, y),
		"Position": new RbxTypes.UDim2(x, 0, y, 0),
		"Size": new RbxTypes.UDim2(node.width / node.strokeWeight, 0, node.height / node.strokeWeight, 0),
		"BorderSizePixel": 0,
		"BackgroundTransparency": 1 - strokeRGBA[3],
		"BackgroundColor3": new RbxTypes.Color3(strokeRGBA[0], strokeRGBA[1], strokeRGBA[2]),
	});

	let radius = new RbxTypes.Instance({
		"ClassName": "UICorner",
		"CornerRadius": new RbxTypes.UDim(0, node.cornerRadius),
	});

	child.addChild(radius);
	corner.addChild(child);

	return corner;
}

function getRoundedBorderInstance(node, strokeRGBA) {
	let offset = ALIGN_OFFSETS[node.strokeAlign];

	let container = new RbxTypes.Instance({
		"ClassName": "Frame",
		"Name": "Border",

		"AnchorPoint": new RbxTypes.Vector2(0.5, 0.5),
		"Position": new RbxTypes.UDim2(0.5, 0, 0.5, 0),
		"Size": new RbxTypes.UDim2(1, offset * node.strokeWeight * 2, 1, offset * node.strokeWeight * 2),
		"BackgroundTransparency": 1,
		"ClipsDescendants": true,
	})

	if (node.strokeAlign === "INSIDE") {
		container.addChild(new RbxTypes.Instance({
			"ClassName": "Frame",
			"Name": "Left",
			"AnchorPoint": new RbxTypes.Vector2(0, 0.5),
			"Position": new RbxTypes.UDim2(0, 0, 0.5, 0),
			"Size": new RbxTypes.UDim2(0, node.strokeWeight, 1, -node.strokeWeight * 2),
			"BorderSizePixel": 0,
			"BackgroundTransparency": 1 - strokeRGBA[3],
			"BackgroundColor3": new RbxTypes.Color3(strokeRGBA[0], strokeRGBA[1], strokeRGBA[2]),
		}));
	
		container.addChild(new RbxTypes.Instance({
			"ClassName": "Frame",
			"Name": "Right",
			"AnchorPoint": new RbxTypes.Vector2(1, 0.5),
			"Position": new RbxTypes.UDim2(1, 0, 0.5, 0),
			"Size": new RbxTypes.UDim2(0, node.strokeWeight, 1, -node.strokeWeight * 2),
			"BorderSizePixel": 0,
			"BackgroundTransparency": 1 - strokeRGBA[3],
			"BackgroundColor3": new RbxTypes.Color3(strokeRGBA[0], strokeRGBA[1], strokeRGBA[2]),
		}));
	
		container.addChild(new RbxTypes.Instance({
			"ClassName": "Frame",
			"Name": "Top",
			"AnchorPoint": new RbxTypes.Vector2(0.5, 0),
			"Position": new RbxTypes.UDim2(0.5, 0, 0, 0),
			"Size": new RbxTypes.UDim2(1, -node.strokeWeight * 2, 0, node.strokeWeight),
			"BorderSizePixel": 0,
			"BackgroundTransparency": 1 - strokeRGBA[3],
			"BackgroundColor3": new RbxTypes.Color3(strokeRGBA[0], strokeRGBA[1], strokeRGBA[2]),
		}));
	
		container.addChild(new RbxTypes.Instance({
			"ClassName": "Frame",
			"Name": "Bottom",
			"AnchorPoint": new RbxTypes.Vector2(0.5, 1),
			"Position": new RbxTypes.UDim2(0.5, 0, 1, 0),
			"Size": new RbxTypes.UDim2(1, -node.strokeWeight * 2, 0, node.strokeWeight),
			"BorderSizePixel": 0,
			"BackgroundTransparency": 1 - strokeRGBA[3],
			"BackgroundColor3": new RbxTypes.Color3(strokeRGBA[0], strokeRGBA[1], strokeRGBA[2]),
		}));

		container.addChild(getRoundedCornerInstance(node, strokeRGBA, "TopLeft", 0, 0));
		container.addChild(getRoundedCornerInstance(node, strokeRGBA, "TopRight", 1, 0));
		container.addChild(getRoundedCornerInstance(node, strokeRGBA, "BottomRight", 1, 1));
		container.addChild(getRoundedCornerInstance(node, strokeRGBA, "BottomLeft", 0, 1));
	} else {
		let cornerRadius = node.cornerRadius;
		if (node.strokeAlign === "CENTER") {
			cornerRadius /= 2;
		}

		let radius = new RbxTypes.Instance({
			"ClassName": "UICorner",
			"CornerRadius": new RbxTypes.UDim(0, cornerRadius),
		});

		let stroke = new RbxTypes.Instance({
			"ClassName": "UIStroke",
			"Thickness": node.strokeWeight,
			"Color": new RbxTypes.Color3(strokeRGBA[0], strokeRGBA[1], strokeRGBA[2]),
			"Transparency": 1 - strokeRGBA[3],
		})

		container.properties.Size = new RbxTypes.UDim2(1, (1 - offset) * node.strokeWeight * -2, 1, (1 - offset) * node.strokeWeight * -2);

		container.addChild(radius);
		container.addChild(stroke);
	}

	return container;
}

function createEffectFrame(node, effectIndex) {
	let imageNode = node.clone();
	let effect = imageNode.effects[effectIndex]

	imageNode.fills = [{
		visible: true,
		opacity: 1,
		blendMode: "LIGHTEN",

		type: "SOLID",
		color: {r: 1, g: 0, b: 0},
	}];

	imageNode.effects = [{
		type: effect.type,
		color: {r: 0, g: 1, b: 0, a: 1},
		blendMode: effect.blendMode,
		offset: effect.offset,
		radius: effect.radius,
		spread: effect.spread,
		visible: effect.visible,
		showShadowBehindNode: false,
	}];

	imageNode.strokes = [];

	return new RbxTypes.Instance({
		"ClassName": "ImageLabel",
		"BackgroundTransparency": 1,
		"Name": effect.type,

		"Image": imageNode,
		"IsEffect": true,
		"ImageTransparency": 1 - effect.color.a,
		"ImageColor": new RbxTypes.Color3(effect.color.r, effect.color.g, effect.color.b),
	});
}

export default function Frame(node) {
	let position = Utils.getPosition(node);
	let strokeRGBA = Utils.getStrokeRGBA(node);
	let backgroundRGBA = Utils.getFillRGBA(node);

	let frame = new RbxTypes.Instance({
		"ClassName": "Frame",
		"Name": node.name,
		"Visible": node.visible,
		"ClipsDescendants": !!node.clipsContent,

		"Position": new RbxTypes.UDim2(0, position[0], 0, position[1]),
		"Size": new RbxTypes.UDim2(0, node.width, 0, node.height),
		"Rotation": -node.rotation.toFixed(3),

		"BackgroundColor3": new RbxTypes.Color3(backgroundRGBA[0], backgroundRGBA[1], backgroundRGBA[2]),
		"BackgroundTransparency": 1 - backgroundRGBA[3],
		"BorderSizePixel": 0,
	})

	if (node.cornerRadius > 0) {
		let radius = new RbxTypes.Instance({
			"ClassName": "UICorner",
			"CornerRadius": new RbxTypes.UDim(0, node.cornerRadius),
		});

		frame.addChild(radius);
	}

	let hasBorder = (strokeRGBA[3] !== 0 && node.strokeWeight > 0);
	let validEffects = []
	
	for (let i = 0; i < node.effects.length; i++) {
		let effect = node.effects[i];
		if (SUPPORTED_EFFECTS[effect.type]) {
			validEffects.push(i);
		}
	}

	if (hasBorder || validEffects.length > 0) {
		let content = frame.clone();
		content.properties.Name = "Content";
		content.properties.Size = new RbxTypes.UDim2(1, 0, 1, 0);
		content.properties.Position = new RbxTypes.UDim2(0, 0, 0, 0);
		content.properties.Rotation = null;
		content.properties.ZIndex = 1;

		frame.clearChildren();
		frame.properties.ClipsDescendants = false;
		frame.properties.BackgroundTransparency = 1;
		frame.properties.BackgroundColor3 = null;
		frame.properties.ZIndex = 2;

		if (hasBorder) {
			let border = null;
			if (node.cornerRadius > 0) {
				border = getRoundedBorderInstance(node, strokeRGBA);
			} else {
				border = getNonRoundedBorderInstance(node, strokeRGBA);
			}
			frame.addChild(border);
		}

		for (let index of validEffects) {
			frame.addChild(createEffectFrame(node, index));
		}

		frame.addChild(content);
		frame.content = content;
	}

	return frame
}