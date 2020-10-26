import { shuffle } from "./Utils.ts";

export default class Die {
	private sides: [string, string, string, string, string, string];
	private upSide: string;

	public getUpSide(): string {
		return this.upSide;
	}

	constructor(sides: [string, string, string, string, string, string]) {
		this.sides = sides;
		this.upSide = sides[0];
	}

	public roll = (): string => {
		this.upSide = shuffle(this.sides)[0];
		return this.upSide;
	};
}
