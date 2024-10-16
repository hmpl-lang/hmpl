import { strict as assert } from "assert";
import { compile } from "../src/main";

describe("compile function", () => {
  it("should throw error if template is not a string", () => {
    assert.throws(() => compile(123 as any), {
      message:
        "Template was not found or the type of the passed value is not string"
    });
  });

  it("should throw error if template is empty", () => {
    assert.throws(() => compile(""), {
      message: "Template must not be a falsey value"
    });
  });

  it("should throw error if options is not an object", () => {
    assert.throws(() => compile("some template", "invalid options" as any), {
      message: "Options must be an object"
    });
  });
});
