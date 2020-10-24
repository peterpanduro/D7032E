import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.74.0/testing/asserts.ts";
import Die from "./Die.ts";

Deno.test({
  name: "Die roll",
  fn: () => {
    const die = new Die(["A", "B", "C", "D", "E", "F"]);
    assertEquals(die.getUpSide(), "A");
    let newResult = false;
    for (let i = 0; i < 10; i++) {
      die.roll();
      if (die.getUpSide() !== "A") break;
    }
    assertNotEquals(die.getUpSide(), "A");
  },
});
