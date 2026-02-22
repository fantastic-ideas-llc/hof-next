import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";
import { deskStructure } from "./src/sanity/desk-structure";

export default defineConfig({
  name: "hall-of-flowers",
  title: "Hall of Flowers",
  projectId: "dxevsfa3",
  dataset: "production",
  plugins: [structureTool({ structure: deskStructure }), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
