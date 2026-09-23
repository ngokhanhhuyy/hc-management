import { defineConfig } from "orval";

export default defineConfig({
  hcmanagement: {
    input: "http://localhost:5000/openapi/v1.json",
    output: {
      mode: "tags",
      namingConvention: "PascalCase",
      target: "./src/client/schema.ts",
      client: "fetch",
      docs: false,
      indexFiles: true,
      tagsSplitDeduplication: true,
      override: {
        fetch: {
          includeHttpResponseReturnType: false,
          forceSuccessResponse: true
        },
        mutator: {
          path: "./src/mutators/fetch.ts",
          name: "fetchAndThrowAsync"
        },
        useTypeOverInterfaces: true,
        operationName: (operation) => {
          const operationId = operation.operationId as string;
          let name = operationId.split("_")[1];
          name = `${name[0].toLowerCase()}${name.slice(1)}Async`;
          console.log(name);
          return name;
        },
      },
    },
  },
});
