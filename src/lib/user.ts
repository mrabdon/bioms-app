import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (req.headers["clerk-signature"] !== webhookSecret) {
    return res.status(403).json({ error: "Invalid signature" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const event = req.body;

  try {
    switch (event.type) {
      case "user.created":
        await prisma.admin.create({
          data: {
            id: event.data.id,
            email: event.data.email_addresses[0]?.email_address,
            firstName: event.data.first_name,
            lastName: event.data.last_name,
          },
        });
        break;

      case "user.updated":
        await prisma.admin.update({
          where: { id: event.data.id },
          data: {
            email: event.data.email_addresses[0]?.email_address,
            firstName: event.data.first_name,
            lastName: event.data.last_name,
          },
        });
        break;

      case "user.deleted":
        await prisma.admin.delete({
          where: { id: event.data.id },
        });
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process webhook" });
  }
}
