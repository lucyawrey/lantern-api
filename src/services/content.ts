import { arrayToDotSyntax, flatten } from "lib/data";
import { db } from "lib/database";
import { contentIndexCount } from "lib/env";
import { Err, Ok } from "lib/result";
import { Data, SelectContent, SelectUser, Visibility } from "types/database";

export abstract class ContentService {
  static async create(
    user: SelectUser,
    name: string,
    data?: string | unknown,
    visibility?: Visibility,
    indexes?: string[]
  ): Promise<Result<SelectContent>> {
    if (name === "") {
      return Err("`name` can't be an empty string.");
    }
    let flatData: Data | undefined, flatDataJson: string | undefined;
    if (data) {
      const flatenResult = flatten(data);
      if (!flatenResult.ok) {
        return flatenResult;
      }
      flatData = flatenResult.data;
      flatDataJson = JSON.stringify(flatData);
    }
    const newContent: any /*NewContent*/ = {
      id: crypto.randomUUID(),
      ownerUserId: user.id,
      name,
      data: flatDataJson,
      visibility,
    };

    if (flatData && indexes) {
      if (indexes.length > contentIndexCount) {
        return Err("Input error, provided too many data indexes.");
      }
      let i = 1;
      for (let index of indexes) {
        index = arrayToDotSyntax(index);
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

  static async readOne(
    id: string,
    select: [keyof SelectContent] | "all",
    user?: SelectUser,
    flat: boolean = false
  ): Promise<Result<any>> {
    let query = db.selectFrom("content").where("id", "=", id);
    if (select === "all") {
      query = query.selectAll();
    } else {
      query.select(select);
    }
    const contentRow = await query.executeTakeFirst();
    if (!contentRow) {
      return Err("Database error.");
    }
    return Ok(contentRow);
  }
}
