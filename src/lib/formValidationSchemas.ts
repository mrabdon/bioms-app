import { EmailAddress } from "@clerk/nextjs/server";
import { ZodError, z } from "zod";

//======================== PRODUCER ==========================
export const producerSchema = z.object({
  id: z.string(), // Define 'id' as string
  name: z.string().min(1, { message: "name is required!" }),
  alias: z.string().min(1, { message: "alias is required!" }),
  address: z.string().optional(),
  feedstock: z.string().optional(),
});

export type ProducerSchema = z.infer<typeof producerSchema>;

// =======================CONSUMER==================================
export const consumerSchema = z.object({
  id: z.string(), //
  name: z.string().min(1, { message: "name is required!" }),
});

export type ConsumerSchema = z.infer<typeof consumerSchema>;

//===============================USERS===============================

// Async username validation
// async function checkUsernameExists(username: string): Promise<boolean> {
//   const response = await fetch(
//     `/list/users/check-username?username=${username}`
//   );
//   const data = await response.json();
//   return data.exists; // Assuming your API responds with { exists: true/false }
// }
export const userSchema = z.object({
  id: z.string().optional(),
  email: z.string().email({ message: "Invalid email address!" }),
  username: z.string().min(2, { message: "Username is required!" }),
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  img: z.string().optional(),
});

export type UserSchema = z.infer<typeof userSchema>;

// // For detailed error mapping from Clerk
// const clerkErrors = {
//   form_identifier_exists: "That username is taken. Please try another.",
//   form_password_length_too_short: "Passwords must be 8 characters or more.",
// };

// const validateUserInput = (input) => {
//   try {
//     userSchema.parse(input);
//     return { success: true, errors: [] };
//   } catch (zodError) {
//     // Map Zod errors
//     return {
//       success: false,
//       errors: zodError.errors.map((err) => ({
//         field: err.path[0],
//         message: err.message,
//       })),
//     };
//   }
// };
// const handleClerkErrors = (clerkError) => {
//   return clerkError.errors.map((error) => ({
//     field: error.code === "form_identifier_exists" ? "username" : "password",
//     message: clerkErrors[error.code] || error.message,
//   }));
// };

// // Example Usage
// const clerkResponse = {
//   clerkError: true,
//   errors: [
//     {
//       code: "form_identifier_exists",
//       message: "That username is taken. Please try another.",
//       longMessage: "That username is taken. Please try another.",
//       meta: {},
//     },
//     {
//       code: "form_password_length_too_short",
//       message: "Passwords must be 8 characters or more.",
//       longMessage: "Passwords must be 8 characters or more.",
//       meta: {},
//     },
//   ],
// };

// if (clerkResponse.clerkError) {
//   const clerkHandledErrors = handleClerkErrors(clerkResponse);
//   console.log(clerkHandledErrors);
//   // Use `clerkHandledErrors` to show messages in your UI
// }

//VOLUME
// export const volumeSchema = z.object({
//   id: z.coerce.number().optional(),
//   committedVolume: z.coerce
//     .number()
//     .min(1, { message: "Committed volume is required" }),
// });

//===========================VOLUMES ====================================
export const volumeSchema = z.object({
  id: z.coerce.number().optional(),
  committedVolume: z.coerce.number().optional(),
  quarter: z.string(),
  year: z.string(),
});

export type VolumeSchema = z.infer<typeof volumeSchema>;

//===========================Actual Produce ========================

export const actualProduceSchema = z.object({
  id: z.coerce.number().optional(),
  volumeId: z.coerce.number().optional(),
  quarter: z.string(),
  year: z.string(),
  month: z.string(),
  actualProduction: z.coerce.number().optional(),
});

export type ActualProduceSchema = z.infer<typeof actualProduceSchema>;

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
