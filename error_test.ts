import {
  assert,
  assertEquals,
  assertInstanceOf,
  assertMatch,
} from "@std/assert";

import { BatchError } from "./error.ts";

Deno.test("BatchError", async (t) => {
  await t.step(".constructor()", async (t) => {
    await t.step("constructs an instance", () => {
      const actual = new BatchError("foo", ["bar", 1, true]);
      assertInstanceOf(actual, BatchError);
    });
  });
  await t.step(".name getter", async (t) => {
    await t.step("returns 'BatchError'", () => {
      const actual = new BatchError("foo", ["bar", 1, true]);
      assertEquals(actual.name, "BatchError");
    });
  });
  await t.step(".message getter", async (t) => {
    await t.step("returns an error message", () => {
      const actual = new BatchError("foo", ["bar", 1, true]);
      assertEquals(actual.message, "foo");
    });
  });
  await t.step(".stack getter", async (t) => {
    await t.step("returns an error stack trace", () => {
      const actual = new BatchError("foo", ["bar", 1, true]);
      assert(actual.stack);
      assertMatch(actual.stack, /\bat .*error_test\.ts:\d+:\d+\n/);
    });
  });
  await t.step(".results getter", async (t) => {
    await t.step("returns a results array", () => {
      const actual = new BatchError("foo", ["bar", 1, true]);
      assertEquals(actual.results, ["bar", 1, true]);
    });
  });
});
