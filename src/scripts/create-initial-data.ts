import { User } from "entities/User";
import { generateId, hashPassword } from "lib/auth";
import { db } from "lib/db";
import { readdir } from "node:fs/promises";
import { parse } from "toml";

const entityTypeList = [{ Entity: User, dataAdder: addUserData }];

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

  for (const { Entity, dataAdder } of entityTypeList) {
    const dataList = parsedDataFull[Entity.name];
    if (dataList && Array.isArray(dataList) && dataList.length > 0) {
      for (let data of dataList) {
        if (
          typeof data !== "object" ||
          (await em.findOne(User, { name: data.name }))
        ) {
          continue;
        }
        if (dataAdder && typeof dataAdder === "function") {
          data = await dataAdder(data);
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

async function addUserData(data: any) {
  const password = generateId();
  const passwordHash = await hashPassword(password);
  data.passwordHash = passwordHash;

  const file = Bun.file(`user-credentials.txt`);
  let userCredentialsText = (await file.exists()) ? await file.text() : "";
  userCredentialsText += `username = ${data.name}, password = ${password}\n`;
  file.write(userCredentialsText);

  return data;
}

console.log("📝 Creating initial data...");
await createInitialData();
console.log("✅ Done.");
process.exit(0);
