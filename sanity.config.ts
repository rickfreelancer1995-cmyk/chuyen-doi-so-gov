"use client";

import { viVNLocale } from "@sanity/locale-vi-vn";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { SINGLETON_TYPES, structure } from "./src/sanity/structure";

export default defineConfig({
  basePath: "/studio",
  title: "Quản trị Cổng Chuyển đổi số",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Cấu hình chung chỉ có một bản, không cho tạo mới từ nút "+"
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETON_TYPES.has(schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      SINGLETON_TYPES.has(schemaType)
        ? actions.filter(
            ({ action }) =>
              action && ["publish", "discardChanges", "restore"].includes(action),
          )
        : actions,
  },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
    viVNLocale(),
  ],
});
