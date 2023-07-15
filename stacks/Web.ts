import { use, StackContext, StaticSite } from "sst/constructs";
import { Api } from "./Api.js";

export function Web({ stack, app }: StackContext) {
  const api = use(Api);
  const stage = app.stage;
  const site = new StaticSite(stack, "site", {
    customDomain: {
      domainName: `reddit-test-${stage}.moonmoon.link`,
      domainAlias: `www.reddit-test-${stage}.moonmoon.link`,
      hostedZone: "moonmoon.link"
    },
    path: "packages/web",
    buildCommand: "npm run build",
    buildOutput: "dist",
    environment: {
      VITE_GRAPHQL_URL: api.url + "/graphql",
    },
  });

  stack.addOutputs({
    SITE: site.url,
  });
}
