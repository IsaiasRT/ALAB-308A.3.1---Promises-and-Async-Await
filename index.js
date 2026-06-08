// Importing database functions. DO NOT MODIFY THIS LINE.
import { central, db1, db2, db3, vault } from "./databases.js";

async function getUserData(id) {
  //validate input

  if (typeof id !== "number") {
    return Promise.reject(new Error("Not a Number"));
  }
  if (id < 1 || id > 10) {
    return Promise.reject(new Error("Out of Range"));
  }

  const dbs = {
    db1: db1,
    db2: db2,
    db3: db3
  };

  //Ask central which DB to use
  try {
    const dbName = await central(id);

    const dbPromise = dbs[dbName](id).catch(() => {
      throw new Error(`${dbName} invalid`);
    });

    const vaultPromise = vault(id);

    const [dbData, vaultData] = await Promise.all([dbPromise, vaultPromise]);

    return {
      id,
      name: vaultData.name,
      username: dbData.username,
      email: vaultData.email,
      address: vaultData.address,
      phone: vaultData.phone,
      website: dbData.website,
      company: dbData.company
    }

  } catch (error) {
    return Promise.reject(error);
  }
}