/// <reference types="@cloudflare/workers-types/2023-07-01" />

declare module "h3" {
  interface H3EventContext {
    cf: CfProperties;
    cloudflare: {
      request: Request;
      env: Env;
      context: ExecutionContext;
    };
  }
}

declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

export {};
