import Frame from "./Frame";
import * as Utils from "./Utilities";
import * as RbxTypes from "../rbx_types";

const FONTS = [
	"Legacy", "Arial", "ArialBold", "SourceSans", "SourceSansBold", 
	"SourceSansSemibold", "SourceSansLight", "SourceSansItalic", "Bodoni", 
	"Garamond", "Cartoon", "Code", "Highway", "SciFi", "Arcade", "Fantasy", 
	"Antique", "Gotham", "GothamSemibold", "GothamBold", "GothamBlack", 
	"AmaticSC", "Bangers", "Creepster", "DenkOne", "Fondamento", "FredokaOne", 
	"GrenzeGotisch", "IndieFlower", "JosefinSans", "Jura", "Kalam", "LuckiestGuy", 
	"Merriweather", "Michroma", "Nunito", "Oswald", "PatrickHand", "PermanentMarker", 
	"Roboto", "RobotoCondensed", "RobotoMono", "Sarpanch", "SpecialElite", 
	"TitilliumWeb", "Ubuntu"
];

const RICH_TEXT_FUNCS = {
	"getRangeFontSize": function(property, text) {
		return `<font size="${property}">${text}</font size>`;
	},


}

function getRichText(node) {
	let text = node.characters;

	let index = 0;
	let unique = {};
	let hashes = [], values = [], funcs = [];

	// color, stroke, font, font_type, font_size
	for (let i = 0; i < text.length; i++) {
		let hash = [];

		for (let funcName in RICH_TEXT_FUNCS) {
			let value = node[funcName](i, i + 1);

			if (!unique[value]) {
				index++;
				unique[value] = index;
				values[index] = value;
				funcs[index] = funcName;
			}

			hash.push(unique[value]);
		}

		hash.sort();
		hashes.push(hash.join(""));
	}

	function getFormattedRichText(i, j) {
		let sliced = text.slice(i, j);
		let properties = hashes[i].split("").map(x => parseInt(x));

		for (let i of properties) {
			sliced = RICH_TEXT_FUNCS[funcs[i]](values[i], sliced);
		}

		return sliced;
	}

	let start = 0;
	let prev = null;
	let richTexts = [];

	for (let i = 0; i < text.length; i++) {
		let hash = hashes[i]
		if (!(!prev || prev === hash)) {
			richTexts.push(getFormattedRichText(start, i));
			start = i;
		}
		prev = hash;
	}

	if (start < text.length - 1) {
		richTexts.push(getFormattedRichText(start, text.length));
	}

	return richTexts.join("");
}

export default function Text(node) {
	let modifiedNode = node.clone();
	modifiedNode.strokes = [];

	let frame = Frame(modifiedNode);
	let label = frame.content;

	modifiedNode.remove();

	let textRGBA = Utils.getFillRGBA(node);
	let strokeRGBA = Utils.getStrokeRGBA(node);

	Object.assign(label.properties, {
		"ClassName": "TextLabel",
		"Text": node.characters,
		"BackgroundTransparency": 1,

		"TextColor3": new RbxTypes.Color3(textRGBA[0], textRGBA[1], textRGBA[2]),
		"TextTransparency": 1 - textRGBA[3],
		"TextStrokeColor3": new RbxTypes.Color3(strokeRGBA[0], strokeRGBA[1], strokeRGBA[2]),
		"TextStrokeTransparency": 1 - strokeRGBA[3],

		"Font": "Roboto",
		"TextSize": 10,

		"TextXAlignment": Utils.getTextAlignment(node.textAlignHorizontal),
		"TextYAlignment": Utils.getTextAlignment(node.textAlignVertical),
	});

	label.properties.BorderSizePixel = null;
	label.properties.BackgroundColor3 = null;

	console.log(getRichText(node));

	return frame;
}