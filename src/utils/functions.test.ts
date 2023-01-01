import {
  decode_text,
  convert_ms_to_time,
  convert_ms_to_sec,
  pad_to_digits,
} from "./functions";
import { describe, expect, it } from "vitest";

describe("decode text", () => {
  it("should return string", () => {
    expect(decode_text("test")).toBe("test");
  });

  it("should covert code to character", () => {
    expect(decode_text("&amp;")).toBe("&");
    expect(decode_text("&lt;")).toBe("<");
    expect(decode_text("&euro;")).toBe("€");
  });
});

describe("ms to time", () => {
  it("should return string", () => {
    expect(convert_ms_to_time(0)).toBe("00:00:00");
  });

  it("should change ms to hours, minutes, seconds", () => {
    expect(convert_ms_to_time(100000)).toBe("00:01:40");
  });
});


describe("ms to sec", () => {
  it("empty should return string", () => {
    expect(convert_ms_to_sec(0)).toBe("0.000");
  });

  it("should change ms to seconds", () => {
    expect(convert_ms_to_sec(1000)).toBe("1.000");
    expect(convert_ms_to_sec(12050)).toBe("12.050");
  });
});

describe("pad to digits", () => {
  it("only one parameter should give 2 length digits", () => {
    expect(pad_to_digits(2)).toBe("02");
    expect(pad_to_digits(53)).toBe("53");
  })

  it("second parameter should change length of digits", () => {
    expect(pad_to_digits(2, 3)).toBe("002");
    expect(pad_to_digits(53, 4)).toBe("0053");
  })
})