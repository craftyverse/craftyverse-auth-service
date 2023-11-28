import { z } from "zod";

export const userOtpRequestSchema = z.object({
  userEmail: z.string().email({
    message: "Please provide a valid email address.",
  }),
});

export const userotpVerificationSchema = z.object({
  userOtp: z.string().min(6, {
    message: "Your OTP must be 6 characters.",
  }),
});

export type userOtpRequest = z.infer<typeof userOtpRequestSchema>;
export type userOtp = z.infer<typeof userotpVerificationSchema>;
