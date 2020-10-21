import {
	assertEquals,
	assertNotEquals,
} from "https://deno.land/std@0.74.0/testing/asserts.ts";
import { printBoggle } from "./Utils.ts";

Deno.test({
	name: "4x4 Boggle",
	fn: () => {
		const boggle = [
			["1", "2", "3", "4"],
			["1", "2", "3", "4"],
			["1", "2", "3", "4"],
			["1", "2", "3", "4"],
		];
		const actual = printBoggle(boggle);
		const expected = "1  2  3  4  \n1  2  3  4  \n1  2  3  4  \n1  2  3  4  \n";
		assertEquals(actual, expected);
	},
});

Deno.test({
	name: "5x5 Boggle",
	fn: () => {
		const boggle = [
			["1", "2", "3", "4", "5"],
			["1", "2", "3", "4", "5"],
			["1", "2", "3", "4", "5"],
			["1", "2", "3", "4", "5"],
			["1", "2", "3", "4", "5"],
		];
		const actual = printBoggle(boggle);
		const expected =
			"1  2  3  4  5  \n1  2  3  4  5  \n1  2  3  4  5  \n1  2  3  4  5  \n1  2  3  4  5  \n";
		assertEquals(actual, expected);
	},
});

Deno.test({
	name: "6x6 Boggle",
	fn: () => {
		const boggle = [
			["1", "2", "3", "4", "5", "6"],
			["1", "2", "3", "4", "5", "6"],
			["1", "2", "3", "4", "5", "6"],
			["1", "2", "3", "4", "5", "6"],
			["1", "2", "3", "4", "5", "6"],
			["1", "2", "3", "4", "5", "6"],
		];
		const actual = printBoggle(boggle);
		const expected =
			"1  2  3  4  5  6  \n1  2  3  4  5  6  \n1  2  3  4  5  6  \n1  2  3  4  5  6  \n1  2  3  4  5  6  \n1  2  3  4  5  6  \n";
		assertEquals(actual, expected);
	},
});

Deno.test({
	name: "Qu chars",
	fn: () => {
		const boggle = [
			["A", "B", "C", "D"],
			["Qu", "E", "F", "G"],
			["H", "I", "J", "K"],
			["L", "M", "Qu", "N"],
		];
		const actual = printBoggle(boggle);
		const expected = "A  B  C  D  \nQu E  F  G  \nH  I  J  K  \nL  M  Qu N  \n";
		assertEquals(actual, expected);
	},
});
