import type { Selectable } from "kysely";
import { arrayToDotSyntax, expand, flatten } from "lib/data";
import { db } from "lib/database";
import { contentIndexCount } from "lib/env";
import { Err, Ok } from "lib/result";
import type { Content } from "types/database";
import type { Visibility } from "types/enums";
import { Data, User } from "types/models";

export abstract class ContentService {
  static async create(
    user: User,
    name: string,
    data?: string | unknown,
    visibility?: Visibility,
    indexes?: string[]
  ): Promise<Result<Selectable<Content>>> {
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
    const newContent: any /* Insertable<Content> */ = {
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
        } else {
          return Err("Input error, gave an invalid index key.");
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
    select: (keyof Content | "all")[],
    flat: boolean = false,
    user?: User
  ): Promise<Result<any>> {
    let query = db.selectFrom("content").where("id", "=", id);
    if (select.includes("all")) {
      query = query.selectAll();
    } else {
      query = query.select(select as (keyof Content)[]);
    }
    if (user && user.id) {
      if (!user.groups.includes("admin")) {
        query = query.where((eb) =>
          eb.or([eb("visibility", "=", "public"), eb("ownerUserId", "=", user.id)])
        );
      }
    } else {
      query = query.where("visibility", "=", "public");
    }
    const contentRow = (await query.executeTakeFirst()) as any;
    if (!contentRow) {
      return Err(
        "Database returned no results. Content either does not exist or you do not have permission to access it."
      );
    }
    if (contentRow.data) {
      const data = JSON.parse(contentRow.data);
      contentRow.data = flat ? data : expand(data);
    }
    return Ok(contentRow);
  }

  static async deleteOne(id: string, user: User): Promise<Result> {
    let query = db.deleteFrom("content").where("id", "=", id);
    if (!user.groups.includes("admin")) {
      query = query.where("ownerUserId", "=", user.id);
    }
    const result = await query.returning("id").executeTakeFirst();
    if (result?.id) {
      return Ok();
    }
    return Err(
      "Nothing was deleted. Content either does not exist or you do not have permission to delete it."
    );
  }
}
