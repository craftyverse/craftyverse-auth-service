import { z } from "zod";

export const userOtpRequestSchema = z.object({
  userOtp: z.string().min(6, {
    message: "Your OTP must be 6 characters.",
  }),
});

export type userOtp = z.infer<typeof userOtpRequestSchema>;
