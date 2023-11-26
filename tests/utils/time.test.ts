import { parseTimeToMilliseconds } from "../../src/utils/time";

describe("parseTimeToMilliseconds", () => {

  it("should parse time string in seconds", () => {
    const result = parseTimeToMilliseconds("10s");
    expect(result).toBe(10000);
  });

  it("should parse time string in minutes", () => {
    const result = parseTimeToMilliseconds("5m");
    expect(result).toBe(300000);
  });

  it("should parse time string in hours", () => {
    const result = parseTimeToMilliseconds("2h");
    expect(result).toBe(7200000);
  });

  it("should parse time string in days", () => {
    const result = parseTimeToMilliseconds("3d");
    expect(result).toBe(259200000);
  });

  it("should parse time string in months", () => {
    const result = parseTimeToMilliseconds("6M");
    expect(result).toBe(15552000000);
  });

  it("should parse time string in years", () => {
    const result = parseTimeToMilliseconds("1y");
    expect(result).toBe(31536000000);
  });

  it("should throw an error for invalid time string", () => {
    expect(() => parseTimeToMilliseconds("invalid")).toThrow("Invalid time string");
  });

  it("should throw an error for invalid time unit", () => {
    expect(() => parseTimeToMilliseconds("10x")).toThrow("Invalid time string");
  });

  it("should throw an error for invalid time value", () => {
    expect(() => parseTimeToMilliseconds("s10")).toThrow("Invalid time string");
  });
  it('should throw an error for an invalid time string', () => {
    const invalidTime = '10.0.0s';
    expect(() => parseTimeToMilliseconds(invalidTime)).toThrowError('Invalid time string');
  });
});