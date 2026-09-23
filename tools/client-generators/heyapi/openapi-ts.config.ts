import { defineConfig, OperationPath } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://localhost:5000/openapi/v1.json",
  output: {
    path: "../../frontend/src/api/generated",
    postProcess: ["prettier"],
  },
  plugins: [
    "@hey-api/schemas",
    {
      dates: true,
      name: "@hey-api/transformers",
    },
    {
      name: "valibot",
      responses: true,
    },
    {
      enums: "javascript",
      name: "@hey-api/typescript",
    },
    {
      name: "@hey-api/client-fetch",
      throwOnError: true,
    },
    {
      name: "@hey-api/sdk",
      transformer: true,
      operations: {
        strategy: "byTags",
        methodName: (name) => name + "Async",
        nesting: (operation) => {
          console.dir(operation, { depth: null });
          return OperationPath.fromOperationId({ delimiters: /_/ })(operation);
        },
      },
    },
  ],
});
