import Frame from "./FrameNode";
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
	"getRangeFontSize": {
		format: function(property, text) {
			return text;
		},
		serialize: function(value) {
			return value;
		},

		multiTag: "font",
		formatTag: function(property) {
			return `size=\\"${property}\\"`;
		},
	},

	"getRangeFontName": {
		format: function(property, text) {
			let style = property.style;

			if (style === "Bold") {
				text = `<b>${text}</b>`;
			} else if (style == "Italic") {
				text = `<i>${text}</i>`;
			}

			return text;
		},
		serialize: function(value) {
			return value.family + value.style;
		},

		multiTag: "font",
		formatTag: function(property) {
			let family = property.family;
			let style = property.style;

			if (style === "Bold" || style === "Italic" || style === "Regular") {
				style = "";
			}

			let match = FONTS.find(font => font === family + style);

			if (match) {
				return `face=\\"${match}\\"`;
			}

			return "";
		},
	},

	"getRangeFills": {
		format: function(property, text) {
			return text;
		},
		serialize: function(value) {
			value = value[0];
			let rgb = value.color;
			return value.type + " " + [rgb.r, rgb.g, rgb.b].join(", ")
		},

		multiTag: "font",
		formatTag: function(property) {
			property = property[0];
			if (property.type == "SOLID") {
				let rgb = property.color;
				let r = Math.floor(rgb.r * 255), g = Math.floor(rgb.g * 255), b = Math.floor(rgb.b * 255);
				let hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

				return `color=\\"${hex}\\"`;
			}
			return "";
		},
	},

	"getRangeTextDecoration": {
		format: function(property, text) {
			if (property === "UNDERLINE") {
				return `<u>${text}</u>`
			} else if (property === "STRIKETHROUGH") {
				return `<s>${text}</s>`
			}
			return text;
		},
		serialize: function(value) {
			return value;
		},
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
			let serial = funcName + RICH_TEXT_FUNCS[funcName].serialize(value);

			if (!unique[serial] && unique[serial] !== 0) {
				unique[serial] = index;
				values[index] = value;
				funcs[index] = funcName;
				index++;
			}

			hash.push(unique[serial]);
		}

		hash = [...new Set(hash)];
		hash.sort();

		hashes.push(hash.join(""));
	}

	function getFormattedRichText(i, j) {
		let sliced = text.slice(i, j);
		let properties = hashes[i].split("").map(x => parseInt(x));

		sliced = sliced.replace("<", "&lt;")
						.replace(">", "&gt;")
						.replace('"', "&quot;")
						.replace("'", "&apos;")
						.replace("&", "&apm;")
						.replace("\n", "<br />");

		let tagGroups = {};
		for (let i of properties) {
			let richFuncs = RICH_TEXT_FUNCS[funcs[i]];
			sliced = richFuncs.format(values[i], sliced);

			if (richFuncs.multiTag) {
				if (!tagGroups[richFuncs.multiTag]) {
					tagGroups[richFuncs.multiTag] = [];
				}
				tagGroups[richFuncs.multiTag].push(richFuncs.formatTag(values[i]));
			}
		}

		for (let multiTag in tagGroups) {
			let tags = tagGroups[multiTag].filter(tag => tag.length > 0).join(" ");
			sliced = `<${multiTag} ${tags}>${sliced}</${multiTag}>`;
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

	return richTexts.join("").replace("\n", "");
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
		"BackgroundTransparency": 1,

		"TextColor3": new RbxTypes.Color3(textRGBA[0], textRGBA[1], textRGBA[2]),
		"TextTransparency": 1 - textRGBA[3],
		"TextStrokeColor3": new RbxTypes.Color3(strokeRGBA[0], strokeRGBA[1], strokeRGBA[2]),
		"TextStrokeTransparency": 1 - strokeRGBA[3],

		"Font": "Roboto",
		"TextSize": 10,

		"Text": getRichText(node),
		"RichText": true,

		"TextXAlignment": Utils.getTextAlignment(node.textAlignHorizontal),
		"TextYAlignment": Utils.getTextAlignment(node.textAlignVertical),
	});

	label.properties.BorderSizePixel = null;
	label.properties.BackgroundColor3 = null;

	return frame;
}