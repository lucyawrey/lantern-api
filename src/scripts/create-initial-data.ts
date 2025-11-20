import { Ruleset } from "entities/Ruleset";
import { User } from "entities/User";
import { generateId, hashPassword, verifyId } from "lib/auth";
import { db, Em } from "lib/db";
import { readdir } from "node:fs/promises";
import { findUserByRef } from "services/user";
import { parse } from "toml";

const entityTypeList = [
  { Entity: User, modifyData: modifyUserData },
  { Entity: Ruleset, modifyData: modifyDataWithOwner },
];

async function createInitialData() {
  const em = db.em.fork();
  const files = await readdir("content", { recursive: true });
  let tomlText = "";
  for (const file of files) {
    if (file.endsWith(".toml")) {
      tomlText += "\n" + (await Bun.file("content/" + file).text());
    }
  }

  const parsedDataFull = parse(tomlText);

  for (const { Entity, modifyData: dataAdder } of entityTypeList) {
    const dataList = parsedDataFull[Entity.name];
    if (dataList && Array.isArray(dataList) && dataList.length > 0) {
      for (let data of dataList) {
        if (
          typeof data !== "object" ||
          data.name === "template" ||
          (await em.findOne(Entity, { name: data.name }))
        ) {
          continue;
        }
        if (dataAdder && typeof dataAdder === "function") {
          data = await dataAdder(data, em);
        }
        const newEntity = new Entity({ ...data });
        if (newEntity && newEntity.id) {
          em.persist(newEntity);
        }
        console.log(`Created ${Entity.name}:`, {
          id: newEntity.id,
          name: newEntity.name,
        });
      }
    }
  }

  await em.flush();
}

async function modifyUserData(data: any, em: Em) {
  const password = generateId();
  const passwordHash = await hashPassword(password);
  data.passwordHash = passwordHash;

  const file = Bun.file(`user-credentials.csv`);
  let userCredentialsText = (await file.exists())
    ? await file.text()
    : "username, password\n";
  userCredentialsText += `${data.name}, ${password}\n`;
  file.write(userCredentialsText);

  return data;
}

async function modifyDataWithOwner(data: any, em: Em) {
  if (data.ownerUserRef) {
    const res = await findUserByRef(em, data.ownerUserRef);
    if (res.ok) {
      data.ownerUser = res.data;
    }
  }
  return data;
}

console.log("📝 Creating initial data...");
await createInitialData();
console.log("✅ Done.");
process.exit(0);
