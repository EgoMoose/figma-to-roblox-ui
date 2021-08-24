export default class Color3 {
	r: number;
	g: number;
	b: number;

	constructor(r: number, g: number, b: number) {
		this.r = r;
		this.g = g;
		this.b = b;
	}

	toString(): string {
		return `Color3.new(${this.r}, ${this.g}, ${this.b})`;
	}
}