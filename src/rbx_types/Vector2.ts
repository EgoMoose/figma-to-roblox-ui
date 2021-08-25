export default class Vector2 {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	toString(): string {
		return `Vector2.new(${this.x}, ${this.y})`;
	}
}