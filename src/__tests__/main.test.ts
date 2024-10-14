import { compile } from "../main";

afterEach(() => {
  jest.clearAllMocks();
});

describe("compile function", () => {
  test("should throw error if template is not a string", () => {
    expect(() => compile(123 as any)).toThrow(
      "template was not found or the type of the passed value is not string"
    );
  });

  test("should throw error if template is empty", () => {
    expect(() => compile("")).toThrow("template empty");
  });

  test("should throw error if options is not an object", () => {
    expect(() => compile("some template", "invalid options" as any)).toThrow(
      "Options must be an object"
    );
  });
});
