import { Client, Account, Databases } from "appwrite";
const endpoint = process.env.PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.PUBLIC_APPWRITE_PROJECT_ID;

console.log({
  endpoint: process.env.PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.PUBLIC_APPWRITE_PROJECT_ID,
});

if (!endpoint || !projectId) {
  throw new Error("Missing required environment variables");
}

const client = new Client().setEndpoint(endpoint).setProject(projectId);
export const account = new Account(client);
export const databases = new Databases(client);

export const APPWRITE_CLIENT = {
  account,
  databases,
};
