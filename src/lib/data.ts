import type { Data } from "types/models";
import { Err, Ok } from "lib/result";

/**
 * Flattens an object of indeterminate depth into a Data object of depth-1 key-value pairs.
 * @param object - A JavaScript object of indeterminate depth. Example:
 * `{name: "Character", stats: {abilityScores: {strength: "12"}}}`.
 * @returns a flattened JavaScript object with keys that may be paths. Example:
 * `{name: "Character", "stats.abilityScores.strength": "12"}`.
 */
export function flatten(object: string | unknown, first: boolean = true): Result<Data, string> {
  if (object === undefined || object === null) {
    return Err("Failed to convert object to flat data format. Object is null or undefined.");
  }
  if (first && typeof object === "string") {
    try {
      object = JSON.parse(object);
    } catch (_e) {
      return Err("Failed to convert object to flat data format. Could not parse string as json.");
    }
  }
  if (typeof object !== "object") {
    return Err("Failed to convert object to flat data format. Not a valid javascript object.");
  }

  const result: Data = {};

  for (const key in object) {
    const value = object[key as keyof typeof object];
    // We call this function recursively to check if value is an object, and process it if so.
    const temp = flatten(value, false);
    if (temp.ok) {
      for (const key2 in temp.data) {
        // Store temp data in result
        result[key + "." + key2] = temp.data[key2];
      }
    } else {
      // Else store object[key] in result directly
      result[key] = value;
    }
  }
  return Ok(result as Data);
}

/**
 * Expands a flat Data object of key-value pairs some keys being JavaScript accessor paths into objects of indeterminate depth.
 * @param data - Flat JavaScript object with keys that may be paths. Example:
 * `{name: "Character", "stats.abilityScores.strength": "12"}`.
 * @returns a JavaScript object that has been expanded. Example:
 * `{name: "Character", stats: {abilityScores: {strength: "12"}}}`.
 */
export function expand(data: Data): object {
  const result: object = {};
  for (const key in data) {
    const splitKeys = key.split(".");
    // This code uses a reducer to convert an array of tokens split by the javascript accessor `.` from a `key`
    // into an object with a matching expanded structure, with the lowest-depth value being the matching value for said `key`.
    // The resulting expanded object from a single key-value pair is merged with the result object representing all expanded pairs.
    // This reducer needs to use the `any` type in order to build up these objects using string keys in a straightforward way.
    splitKeys.reduce((object: any, splitKey, splitKeyIndex) => {
      return (
        object[splitKey] ||
        (object[splitKey] = !isPositiveInteger(splitKeys[splitKeyIndex + 1])
          ? splitKeys.length - 1 == splitKeyIndex
            ? data[key]
            : {}
          : [])
      );
    }, result);
  }
  return result;
}

/**
 * Tests if a passed value is an integer, then tests if it is positive (including 0).
 * @param input - Number or string to check. Strings are parsed to numbers before checking.
 * @returns true if input value represents a positive integer, false otherwise.
 */
export function isPositiveInteger(input: string | number): boolean {
  const num = typeof input === "number" ? input : Number(input);
  return Number.isInteger(num) && num >= 0;
}

export function arrayToDotSyntax(arraySyntaxKey: string): string {
  return arraySyntaxKey.replace(/\[([^\[\]]+)\]/g, ".$1");
}
