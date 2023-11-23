import { z } from "zod";

export const loginUserRequestSchema = z.object({
  userEmail: z
    .string({ required_error: "Please provide your email." })
    .email({ message: "you must provide a valid email." }),
  userPassword: z
    .string({ required_error: "Please provide a password." })
    .regex(
      new RegExp(".*[A-Z].*"),
      "You need to provide at least one uppercase character."
    )
    .regex(
      new RegExp(".*[a-z].*"),
      "You need to provide at least one lowercase character."
    )
    .regex(new RegExp(".*\\d.*"), "You need to provide at least one number.")
    .regex(
      new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
      "You need to provide at least one special character"
    )
    .min(8, "Must be at least 8 characters in length."),
});

export const loginUserResponseSchema = z.object({
  userAccessToken: z.string(),
});

export type loginUserRequest = z.infer<typeof loginUserRequestSchema>;
export type loginUserResponse = z.infer<typeof loginUserResponseSchema>;
