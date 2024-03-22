import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema:
    "https://api-sa-east-1.hygraph.com/v2/clfwfbwrb53m101upc30jfrna/master",
  documents: ["./src/graphql/**/*.tsx"],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./src/gql/": {
      preset: "client",
    },
  },
};

export default config;
