import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .string({ required_error: "E-mail is required." })
    .email({ message: "Invalid E-mail address" }),
  password: z
    .string({ required_error: "Password is required." })
    .min(8, { message: "Password must contain at least 8 characters." }),
});
