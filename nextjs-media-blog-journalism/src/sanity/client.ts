import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "irtwns5j",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});