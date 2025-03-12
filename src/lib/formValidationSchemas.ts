import { EmailAddress } from "@clerk/nextjs/server";
import { ZodError, z } from "zod";

//======================== COMPANY ==========================
export const companySchema = z.object({
  id: z.string(), // Define 'id' as string
  name: z.string().min(1, { message: "name is required!" }),
  alias: z.string().min(1, { message: "alias is required!" }),
  address: z.string().optional(),
  feedstock: z.string().optional(),
});

export type CompanySchema = z.infer<typeof companySchema>;

// =======================CONSUMER==================================
export const consumerSchema = z.object({
  id: z.string(), //
  name: z.string().min(1, { message: "name is required!" }),
});

export type ConsumerSchema = z.infer<typeof consumerSchema>;

//===============================USERS===============================

export const userSchema = z.object({
  id: z.string().optional(),
  email: z.string().email({ message: "Invalid email address!" }),
  username: z.string().min(2, { message: "Username is required!" }),
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  img: z.string().optional(),
});

export type UserSchema = z.infer<typeof userSchema>;

//=======ADMIN=====
export const adminSchema = z.object({
  id: z.string().optional(),
  email: z.string().email({ message: "Invalid email address!" }),
  username: z.string().min(2, { message: "Username is required!" }),
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  img: z.string().optional(),
});

export type AdminSchema = z.infer<typeof adminSchema>;
//=======PRODUCER=====
export const producerSchema = z.object({
  id: z.string().optional(),
  email: z.string().email({ message: "Invalid email address!" }),
  username: z.string().min(2, { message: "Username is required!" }),
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  companyId: z.string().min(1, { message: "Company name is required!" }),
  img: z.string().optional(),
});

export type ProducerSchema = z.infer<typeof producerSchema>;
//=======STAFF=====
export const staffSchema = z.object({
  id: z.string().optional(),
  email: z.string().email({ message: "Invalid email address!" }),
  username: z.string().min(2, { message: "Username is required!" }),
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  companyId: z.string().min(1, { message: "Company name is required!" }),
  img: z.string().optional(),
});

export type StaffSchema = z.infer<typeof staffSchema>;

//===========================VOLUMES ====================================
export const volumeSchema = z.object({
  id: z.coerce.number().optional(),
  committedVolume: z.coerce.number().optional(),
  quarter: z.string(),
  year: z.string(),
  archived: z.string().optional(),
});

export type VolumeSchema = z.infer<typeof volumeSchema>;

//====================SOLD TO ===================
export const soldSchema = z.object({
  id: z.coerce.number().optional(),
  volumeId: z.coerce.number().optional(),
  soldAmount: z.coerce.number().min(1, { message: "Sold amount is required!" }),
  mc: z.coerce.number().min(1, { message: "MC value is required!" }),
  mro: z.coerce.number().min(1, { message: "MRO value is required!" }),
  consumerId: z.string({ message: "Oil Company is required!" }),
  produceId: z.coerce.number().optional(),
  producerId: z.coerce.number().optional(),
  remainingActualProduce: z.coerce.number().optional(),

});

export type SoldSchema = z.infer<typeof soldSchema>;

//===========================Actual Produce ========================

export const produceSchema = z.object({
  id: z.coerce.number().optional(),
  volumeId: z.coerce.number().optional(),
  quarter: z.string().optional(),
  year: z.string().optional(),
  month: z.string(),
  remainingCommittedVolume: z.coerce.number().optional(),
  actualProduction: z.coerce.number().optional(),
  consumerId: z.coerce.number().optional(),
  companyId: z.coerce.string().optional(),
  
});

export type ProduceSchema = z.infer<typeof produceSchema>;

//==================LIFT SCHEMA ================
export const liftSchema = z.object({
  id: z.coerce.number().optional(),
  liftVolume: z.coerce.number(),
  region: z.string().min(1, { message: "Region is required!" }),
  remark: z.string(),
  soldId: z.coerce.number().optional(),
  remainingSoldVolume: z.coerce.number().optional(),
  
});

export type LiftSchema = z.infer<typeof liftSchema>;

//==================ANNOUNCEMENT================
export const announcementSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  description: z.string().min(1, { message: "Description name is required!" }),
  date: z.coerce.date({ message: "Date is required!" }),
  // producerId: z.coerce.number({ message: "Producer is required!" }),
});

export type AnnouncementSchema = z.infer<typeof announcementSchema>;

//================================EVENT================================
export const eventSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  description: z.string().min(1, { message: "Description name is required!" }),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  // producerId: z.coerce.number({ message: "Producer is required!" }),
});

export type EventSchema = z.infer<typeof eventSchema>;

//===========MAIL=============
export const mailFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

export type MailFormSchema = z.infer<typeof mailFormSchema>;

export const inviteSchema = z.object({
  id: z.string().optional(),
  email: z.string().email({ message: "Invalid email address!" }),
  username: z.string().min(2, { message: "Username is required!" }),
  password: z.string().min(1, { message: "First name is required!" }),
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  img: z.string().optional(),
});

export type InviteSchema = z.infer<typeof inviteSchema>;

//=====Register Form=====
export const registerSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  producerName: z.string().min(1, { message: "Producer name is required!" }),
  img: z.string().optional(),
  companyId: z.string().min(1, { message: "Company name is required!" }),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
