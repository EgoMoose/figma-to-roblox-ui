import * as RbxTypes from "../rbx_types";

export default function Frame(node) {
	return new RbxTypes.Instance({
		"ClassName": "Frame",
		"Name": node.name,
		"Rotation": 0,
	})
}