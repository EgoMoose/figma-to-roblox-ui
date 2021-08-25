export default class UDim {
	scale: number;
	offset: number;

	constructor(scale: number, offset: number) {
		this.scale = scale;
		this.offset = offset;
	}

	toString(): string {
		return `UDim.new(${this.scale}, ${this.offset})`;
	}
}