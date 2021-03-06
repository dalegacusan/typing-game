import { z } from "zod";
import { usernameMaxLength } from "../../../config/app";
import { ApiRequestFunction } from "../enums/api-request-function.enum";

export const USER_UPDATE_SCHEMA = z.object({
  request: z.object({
    head: z.object({
      function: z.enum([ApiRequestFunction.USER_UPDATE]),
    }),
    body: z.object({
      userId: z.string().nonempty(),
      username: z.string().nonempty().max(usernameMaxLength),
    }),
  }),
});

export type USER_UPDATE_TYPE = z.infer<typeof USER_UPDATE_SCHEMA>;
