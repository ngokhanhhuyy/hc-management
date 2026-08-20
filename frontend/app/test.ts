import type { AppType } from "@hc-management/backend";
import { hc } from "hono/client";

const client = hc<AppType>("http://localhost:5000/");

const response = await client.api.authentication["get-access-cookie"].$post({
  json: {
    userName: "admin",
    password: "admin"
  }
});

const userResponse = await client.api.users[":id{[0-9]+}"].$get({
  param: {
    id: "1"
  }
});

console.log(await userResponse.json());
