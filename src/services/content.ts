import { flatten } from "lib/data";
import { db } from "lib/database";
import { contentIndexCount } from "lib/env";
import { Err, Ok } from "lib/result";
import { Data, NewContent, SelectContent, SelectUser, Visibility } from "types/database";

export abstract class ContentService {
  static async createContent(
    user: SelectUser,
    name: string,
    data?: string | unknown,
    visibility?: Visibility,
    indexes?: string[]
  ): Promise<Result<SelectContent>> {
    const flatenResult = flatten(data);
    if (!flatenResult.ok) {
      return flatenResult;
    }
    const flatData = flatenResult.data;
    const flatDataJson = JSON.stringify(flatData);
    const newContent: any /*NewContent*/ = {
      id: crypto.randomUUID(),
      ownerUserId: user.id,
      name,
      data: flatDataJson,
      visibility,
    };

    if (indexes) {
      if (indexes.length > contentIndexCount) {
        return Err("Input error, provided too many data indexes.");
      }
      let i = 1;
      for (const index of indexes) {
        const value = flatData[index];
        if (value) {
          // Forced to use `any` for newContent to insert these, need to find better way.
          newContent[`dataIndexKey${i}`] = index;
          newContent[`dataIndex${i}`] = String(value);
          i++;
        }
      }
    }

    const contentRow = await db
      .insertInto("content")
      .values(newContent)
      .returningAll()
      .executeTakeFirst();
    if (!contentRow) {
      return Err("Database error.");
    }
    return Ok(contentRow);
  }
}
