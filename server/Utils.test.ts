import { assert } from "https://deno.land/std@0.74.0/_util/assert.ts";
import { shuffle } from "./Utils.ts";

Deno.test({
	name: "Shuffle",
	fn: () => {
		const array = ["A", "B", "C", "D", "E"];
		let same = true;
		for (let i = 0; i < 5; i++) {
			const shuffled = shuffle([...array]);
			same = array === shuffled;
			if (!same) break;
		}
		assert(!same);
	},
});
