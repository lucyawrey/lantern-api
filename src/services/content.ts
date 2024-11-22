import { flatten } from "lib/data";
import { db } from "lib/database";
import { Err, Ok } from "lib/result";
import { Data, NewContent, SelectContent, SelectUser, Visibility } from "types/database";

export abstract class ContentService {
  static async createContent(
    user: SelectUser,
    name: string,
    data?: string | unknown,
    visibility?: Visibility
  ): Promise<Result<SelectContent>> {
    const flatenResult = flatten(data);
    if (!flatenResult.ok) {
      return flatenResult;
    }
    const flatDataJson = JSON.stringify(flatenResult.data);
    const newContent: NewContent = {
      id: crypto.randomUUID(),
      ownerUserId: user.id,
      name,
      data: flatDataJson,
      visibility,
    };
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
