import { resendAPIKey } from "@/config/constant";
import { Resend } from "resend";

export const resend = new Resend(resendAPIKey);
