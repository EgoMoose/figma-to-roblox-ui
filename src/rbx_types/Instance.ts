const LUA_FLATTEN = true;
const NEW_LINE = "\n".repeat(+LUA_FLATTEN);

export default class Instance {
	properties: Object;
	content: Instance;
	children: Array<Instance>;

	constructor(properties: Object) {
		this.properties = properties;
		this.content = this;
		this.children = [];
	}

	clone(): Instance {
		let child: Instance;
		let copy = new Instance(Object.assign({}, this.properties));
		copy.content = copy;

		for (child of this.children) {
			let childCopy = child.clone();

			if (child === this.content) {
				copy.content = childCopy;
			}

			copy.children.push(childCopy);
		}

		return copy;
	}

	merge(other: Instance): Instance {
		return new Instance(Object.assign({}, this.properties, other.properties))
	}

	clearChildren() {
		this.children = [];
	}

	addChild(child: Instance): void {
		this.children.push(child);
	}

	toLua(depth: number = 0): string {
		const indentA = "\t".repeat((depth + 1) * +LUA_FLATTEN);
		const indentB = "\t".repeat((depth + 2) * +LUA_FLATTEN);
		const indentC = "\t".repeat(depth * +LUA_FLATTEN);

		let lua = `{${NEW_LINE}`;

		for (let property in this.properties) {
			let value = this.properties[property]
			if (value) {
				let stringified = typeof value === "string" ? `"${value}"` : `${value}`;
				lua += `${indentA}["${property}"] = ${stringified},${NEW_LINE}`;
			}
		}

		if (this.children.length > 0) {
			let children = "";
			for (let child of this.children.slice().reverse()) { // reverse array for proper z-index order
				children += `${NEW_LINE}${indentB}${child.toLua(depth + 2)},`;
			}

			lua += `${indentA}["Children"] = {${children}${NEW_LINE}${indentA}},${NEW_LINE}`;
		}

		return lua + `${indentC}}`;
	}
}