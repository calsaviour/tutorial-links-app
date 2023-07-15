import { use, StackContext, Api as ApiGateway } from "sst/constructs";
import { Database } from "./Database.js";

export function Api({ stack, app }: StackContext) {
  const stage = app.stage;
  const api = new ApiGateway(stack, "api", {
    customDomain: {
      domainName: `api-reddit-${stage}.moonmoon.link`,
      hostedZone: "moonmoon.link"
    },
    defaults: {
      function: {
        bind: [use(Database)],
      },
    },
    routes: {
      "POST /graphql": {
        type: "graphql",
        function: {
          handler: "packages/functions/src/graphql/graphql.handler",
        },
        pothos: {
          schema: "packages/functions/src/graphql/schema.ts",
          output: "packages/graphql/schema.graphql",
          commands: [
            "cd packages/graphql && npx @genql/cli --output ./genql --schema ./schema.graphql --esm",
          ],
        },
      },
    },
  });

  stack.addOutputs({
    API: api.url,
  });

  return api;
}
