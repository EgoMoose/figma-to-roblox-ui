export default class UDim2 {
	scaleX: number;
	scaleY: number;
	offsetX: number;
	offsetY: number;

	constructor(scaleX: number, offsetX: number, scaleY: number, offsetY: number) {
		this.scaleX = scaleX;
		this.scaleY = scaleY;
		this.offsetX = offsetX;
		this.offsetY = offsetY;
	}

	toString(): string {
		return `UDim2.new(${this.scaleX}, ${this.offsetX}, ${this.scaleY}, ${this.offsetY})`;
	}
}