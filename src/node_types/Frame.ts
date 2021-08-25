import * as RbxTypes from "../rbx_types";
import * as Utils from "./Utilities";

const ALIGN_OFFSETS = {
	"CENTER": 0.5,
	"OUTSIDE": 1,
	"INSIDE": 0,
}

function getBorderInstance(node, strokeRGBA) {
	let offset = ALIGN_OFFSETS[node.strokeAlign];

	let container = new RbxTypes.Instance({
		"ClassName": "Frame",
		"Name": "Border",

		"AnchorPoint": new RbxTypes.Vector2(0.5, 0.5),
		"Position": new RbxTypes.UDim2(0.5, 0, 0.5, 0),
		"Size": new RbxTypes.UDim2(1, offset * node.strokeWeight * 2, 1, offset * node.strokeWeight * 2),
		"BackgroundTransparency": 1,
	})

	if (node.cornerRadius === 0) {
		container.addChild(new RbxTypes.Instance({
			"ClassName": "Frame",
			"Name": "Left",
			"AnchorPoint": new RbxTypes.Vector2(0, 0.5),
			"Position": new RbxTypes.UDim2(0, 0, 0.5, 0),
			"Size": new RbxTypes.UDim2(0, node.strokeWeight, 1, -node.strokeWeight * 2),
			"BorderSizePixel": 0,
			"BackgroundTransparency": 1 - strokeRGBA[3],
			"BackgroundColor3": new RbxTypes.Color3(strokeRGBA[0], strokeRGBA[1], strokeRGBA[2]),
		}))

		container.addChild(new RbxTypes.Instance({
			"ClassName": "Frame",
			"Name": "Right",
			"AnchorPoint": new RbxTypes.Vector2(1, 0.5),
			"Position": new RbxTypes.UDim2(1, 0, 0.5, 0),
			"Size": new RbxTypes.UDim2(0, node.strokeWeight, 1, -node.strokeWeight * 2),
			"BorderSizePixel": 0,
			"BackgroundTransparency": 1 - strokeRGBA[3],
			"BackgroundColor3": new RbxTypes.Color3(strokeRGBA[0], strokeRGBA[1], strokeRGBA[2]),
		}))

		container.addChild(new RbxTypes.Instance({
			"ClassName": "Frame",
			"Name": "Top",
			"AnchorPoint": new RbxTypes.Vector2(0.5, 0),
			"Position": new RbxTypes.UDim2(0.5, 0, 0, 0),
			"Size": new RbxTypes.UDim2(1, 0, 0, node.strokeWeight),
			"BorderSizePixel": 0,
			"BackgroundTransparency": 1 - strokeRGBA[3],
			"BackgroundColor3": new RbxTypes.Color3(strokeRGBA[0], strokeRGBA[1], strokeRGBA[2]),
		}))

		container.addChild(new RbxTypes.Instance({
			"ClassName": "Frame",
			"Name": "Bottom",
			"AnchorPoint": new RbxTypes.Vector2(0.5, 1),
			"Position": new RbxTypes.UDim2(0.5, 0, 1, 0),
			"Size": new RbxTypes.UDim2(1, 0, 0, node.strokeWeight),
			"BorderSizePixel": 0,
			"BackgroundTransparency": 1 - strokeRGBA[3],
			"BackgroundColor3": new RbxTypes.Color3(strokeRGBA[0], strokeRGBA[1], strokeRGBA[2]),
		}))
	} else {
		
	}

	return container;
}

export default function Frame(node) {
	let position = Utils.getPosition(node);
	let strokeRGBA = Utils.getStrokeRGBA(node);
	let backgroundRGBA = Utils.getBackgroundRGBA(node);

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
		})

		frame.addChild(radius);
	} 
	
	if (node.strokeWeight > 0) {
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

		frame.addChild(getBorderInstance(node, strokeRGBA));
		frame.addChild(content);

		frame.content = content;
	}

	return frame
}