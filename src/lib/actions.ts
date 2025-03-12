"use server";

import { revalidatePath } from "next/cache";
import {
  AdminSchema,
  AnnouncementSchema,
  CompanySchema,
  ConsumerSchema,
  EventSchema,
  inviteSchema,
  InviteSchema,
  LiftSchema,
  ProducerSchema,
  ProduceSchema,
  SoldSchema,
  StaffSchema,
  UserSchema,
  VolumeSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

type CurrentState = {
  success: boolean;
  error: boolean;
};

//=================================PRODUCERS===============================================================
export const createCompany = async (
  currentState: CurrentState,
  data: CompanySchema
) => {
  try {
    await prisma.company.create({
      data: {
        id: data.id,
        name: data.name,
        alias: data.alias,
        address: data.address || "-",
        feedstock: data.feedstock || "-",
        createdAt: new Date(),
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateCompany = async (
  currentState: CurrentState,
  data: CompanySchema
) => {
  try {
    await prisma.company.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        alias: data.alias,
        address: data.address,
        feedstock: data.feedstock,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteCompany = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string; // The ID is expected to be a string.

  if (!id) {
    return { success: false, error: true, message: "ID is missing" };
  }

  try {
    await prisma.company.delete({
      where: {
        id: id, // Keep the id as a string since Prisma expects it to be a string.
      },
    });

    // revalidatePath("/list/subjects"); // Uncomment if needed for path revalidation
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

//=========================================CONSUMER========================================================
export const createConsumer = async (
  currentState: CurrentState,
  data: ConsumerSchema
) => {
  try {
    await prisma.consumer.create({
      data: {
        id: data.id,
        name: data.name,
        createdAt: new Date(),
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateConsumer = async (
  currentState: CurrentState,
  data: ConsumerSchema
) => {
  try {
    await prisma.consumer.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteConsumer = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.consumer.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
//===============================USERS ===========================================

export const createUser = async (
  currentState: CurrentState,
  data: UserSchema
) => {
  try {
    const user = await clerkClient.users.createUser({
      emailAddress: [data.email],
      password: "Bioms@2024",
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      publicMetadata: {
        role: "producer", // Set the correct role here
      },
    });

    await prisma.producer.create({
      data: {
        id: user.id,
        email: data.email,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        img: data.img || null,
      },
    });
    // revalidatePath("/list/class"); // Uncomment if needed for revalidating paths
    return { success: true, error: false };
    console.log(user);
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateUser = async (
  currentState: CurrentState,
  data: UserSchema
) => {
  try {
    await prisma.producer.update({
      where: {
        id: data.id,
      },
      data: {},
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
// export const updateUser = async (
//   currentState: CurrentState,
//   data: UserSchema
// ) => {
//   if (!data.id) {
//     return { success: false, error: true };
//   }
//   try {
//     // if (data.password) {
//     //   // Hash the password before sending it to Clerk
//     //   const hashedPassword = await bcrypt.hash(data.password, 10);
//     //   await clerkClient.users.updateUser(data.id, {
//     //     username: data.username,
//     //     password: hashedPassword, // Send the hashed password to Clerk
//     //     firstName: data.name,
//     //     lastName: data.surname,
//     //   });
//     // } else {
//     // const user = await clerkClient.users.updateUser(data.id, {
//     //   username: data.username,
//     //   ...(data.password !== "" && { password: data.password }),
//     //   firstName: data.name,
//     //   lastName: data.surname,
//     // });
//     await clerkClient.users.updateUser(data.id, {
//       username: data.username,
//       password: data.password || undefined, // Ensure password is plain text
//       firstName: data.name,
//       lastName: data.surname,
//     });

//     // Hash the password if provided
//     // const hashedPassword = data.password
//     //   ? await bcrypt.hash(data.password, 10)
//     //   : undefined;

//     await prisma.user.update({
//       where: {
//         id: data.id,
//       },
//       data: {
//         name: data.name,
//         username: data.username,
//         surname: data.surname,
//         email: data.email,
//         img: data.img || null,
//         role: data.role,
//         producers: {
//           set: data.producers?.map((producerId: string) => ({
//             id: producerId,
//           })),
//         },
//       },
//     });

//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

export const deleteUser = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await clerkClient.users.deleteUser(id);

    await prisma.producer.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

//========ADMIN====
export const createAdmin = async (
  currentState: CurrentState,
  data: AdminSchema
) => {
  try {
    const user = await clerkClient.users.createUser({
      emailAddress: [data.email],
      password: "Bioms@2024",
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      publicMetadata: {
        role: "admin", // Set the correct role here
      },
    });

    await prisma.admin.create({
      data: {
        id: user.id,
        email: data.email,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        img: data.img || null,
      },
    });
    // revalidatePath("/list/class"); // Uncomment if needed for revalidating paths
    return { success: true, error: false };
    console.log(user);
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateAdmin = async (
  currentState: CurrentState,
  data: UserSchema
) => {
  try {
    await prisma.admin.update({
      where: {
        id: data.id,
      },
      data: {},
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteAdmin = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await clerkClient.users.deleteUser(id);

    await prisma.admin.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
//========PRODUCER====
export const createProducer = async (
  currentState: CurrentState,
  data: ProducerSchema
) => {
  try {
    const user = await clerkClient.users.createUser({
      emailAddress: [data.email],
      password: process.env.TEMPORARY_PASSWORD,
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      publicMetadata: {
        role: "producer", // Set the correct role here
        companyId: data.companyId,
      },
    });

    await prisma.producer.create({
      data: {
        id: user.id,
        email: data.email,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        companyId: data.companyId,
        img: data.img || null,
      },
    });
    // revalidatePath("/list/class"); // Uncomment if needed for revalidating paths
    return { success: true, error: false };
    console.log(user);
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateProducer = async (
  currentState: CurrentState,
  data: ProducerSchema
) => {
  try {
    await prisma.producer.update({
      where: {
        id: data.id,
      },
      data: {
        email: data.email,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        companyId: data.companyId,
        img: data.img || null,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteProducer = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await clerkClient.users.deleteUser(id);

    await prisma.producer.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
//========STAFF====
export const createStaff = async (
  currentState: CurrentState,
  data: StaffSchema
) => {
  try {
    const user = await clerkClient.users.createUser({
      emailAddress: [data.email],
      password: "Bioms@2024",
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      publicMetadata: {
        role: "staff", // Set the correct role here
        companyId: data.companyId,
      },
    });

    await prisma.staff.create({
      data: {
        id: user.id,
        email: data.email,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        companyId: data.companyId,
        img: data.img || null,
      },
    });
    // revalidatePath("/list/class"); // Uncomment if needed for revalidating paths
    return { success: true, error: false };
    console.log(user);
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateStaff = async (
  currentState: CurrentState,
  data: StaffSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const user = await clerkClient.users.updateUser(data.id, {
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
    });
    await prisma.staff.update({
      where: {
        id: data.id,
      },
      data: {
        email: data.email,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        companyId: data.companyId,
        img: data.img || null,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteStaff = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await clerkClient.users.deleteUser(id);

    await prisma.staff.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
//====================================================VOLUMES=====================================================

//>>>>>CREATE<<<<<<<<
// lib/actions.ts
export const createVolume = async (
  currentState: CurrentState,
  data: VolumeSchema
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      throw new Error("User ID not found in session.");
    }

    // Query the Producer model to get the companyId associated with the current user
    const producer = await prisma.producer.findUnique({
      where: { id: userId },
      select: {
        companyId: true, // Assuming companyId is a field in the Producer model
      },
    });

    // Query the Staff model to get the companyId associated with the current user
    const staff = await prisma.staff.findUnique({
      where: { id: userId },
      select: {
        companyId: true, // Assuming companyId is a field in the Staff model
      },
    });

    // Determine which user has the companyId (either producer or staff)
    const companyId = producer?.companyId || staff?.companyId;

    if (!companyId) {
      throw new Error("Company ID not found for the user.");
    }

    const today = new Date();
    let year = today.getFullYear();

    // Check if the quarter is Q1 and today's date is after September 10
    if (
      data.quarter === "Q1" &&
      today.getMonth() === 8 &&
      today.getDate() > 10
    ) {
      year += 1; // Move to the next year if it's after September 10
    }

    // Create a new volume entry in the database
    await prisma.volume.create({
      data: {
        createdAt: new Date(), // Set createdAt to the current date
        committedVolume: data.committedVolume,
        quarter: data.quarter,
        year: parseInt(data.year), // Use the dynamically calculated year
        companies: {
          // Use the relation to assign the company
          connect: [{ id: companyId }], // Connect the volume to the current user's company
        },
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const getGroupedVolumes = async () => {
  try {
    const groupedVolumes = await prisma.volume.groupBy({
      by: ["producerId"], // Group by producerId
      _count: {
        id: true, // Count the number of records per producerId
      },
      _sum: {
        proposedVolume: true, // Sum of proposedVolume per producerId
        committedVolume: true, // Sum of committedVolume per producerId

        begInventory: true, // Sum of begInventory per producerId
        totalStock: true, // Sum of totalStock per producerId
        sold: true, // Sum of sold per producerId
        unsold: true, // Sum of unsold per producerId
      },
      _avg: {
        proposedVolume: true, // Average of proposedVolume per producerId
        committedVolume: true, // Average of committedVolume per producerId
      },
    });

    return groupedVolumes;
  } catch (error) {
    console.error("Error fetching grouped volumes:", error);
    throw new Error("Error fetching grouped volumes");
  } finally {
    await prisma.$disconnect();
  }
};

// >>> UPDATE <<<<<
export const updateVolume = async (
  currentState: CurrentState,
  data: VolumeSchema
) => {
  try {
    await prisma.volume.update({
      where: {
        id: data.id,
      },
      data: {
        committedVolume: data.committedVolume,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const getVolumeByQuarterYear = async (quarter: string, year: string) => {
  try {
    const volume = await prisma.volume.findFirst({
      where: {
        quarter: quarter,
        year: parseInt(year),
      },
    });

    return volume; // Returns the volume if it exists, otherwise returns null
  } catch (error) {
    console.error("Error fetching volume by quarter and year:", error);
    return null;
  }
};

export const deleteVolume = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    const volumeId = parseInt(id);

    // Start a transaction to ensure data consistency
    await prisma.$transaction(async (prisma) => {
      // Delete related data
      await prisma.produce.deleteMany({
        where: {
          volumeId,
        },
      });

      await prisma.sold.deleteMany({
        where: {
          volumeId,
        },
      });

      // Add more delete operations if there are additional related tables
      // Finally, delete the volume itself
      await prisma.volume.delete({
        where: {
          id: volumeId,
        },
      });
    });

    // Optionally revalidate any paths
    // revalidatePath("/list/subjects");

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// export const archiveVolume = async (
//   currentState: CurrentState,
//   data: FormData
// ) => {
//   const id = data.get("id") as string;
//   try {
//     await prisma.volume.update({
//       where: {
//         id: parseInt(id),
//       },
//       data: {
//         archived: true,
//       },
//     });

//     // revalidatePath("/list/subjects");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

export async function archiveVolume({
  id,
  archived,
}: {
  id: number;
  archived: boolean;
}) {
  try {
    await prisma.volume.update({
      where: { id },
      data: { archived }, // Toggle archived state
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating archive state:", error);
    return { success: false, error: "Failed to update archive status." };
  }
}

// export const getVolumeByQuarterYear = async (quarter: string, year: string) => {
//   try {
//     const volume = await prisma.volume.findFirst({
//       where: {
//         quarter: quarter,
//         year: parseInt(year),
//       },
//     });

//     return volume; // Returns the volume if it exists, otherwise returns null
//   } catch (error) {
//     console.error("Error fetching volume by quarter and year:", error);
//     return null;
//   }
// };

// ==========ACTUAL PRODUCTION/ PRODUCE ===============
export const createProduce = async (
  currentState: CurrentState,
  data: ProduceSchema
) => {
  try {
    const volume = await prisma.volume.findUnique({
      where: { id: data.id },
      select: {
        id: true,
        companies: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!volume) {
      throw new Error("Volume not found.");
    }
    await prisma.produce.create({
      data: {
        volumeId: volume.id, // Assign the volumeId here
        actualProduction: data.actualProduction,
        month: data.month,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateProduce = async (
  currentState: CurrentState,
  data: ProduceSchema
) => {
  try {
    // Fetch the volumeId based on a condition, for example, by using a unique identifier
    const volume = await prisma.volume.findUnique({
      where: { id: data.id }, // Assuming data.volumeId contains the identifier
    });

    // Check if the volume was found
    if (!volume) {
      throw new Error("Volume not found");
    }

    // Create the ActualProduce record with the found volumeId
    await prisma.produce.create({
      data: {
        volumeId: volume.id, // Assign the volumeId here
        actualProduction: data.actualProduction,
        month: data.month,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteProduce = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    await prisma.produce.delete({
      where: {
        id: parseInt(id),
        // ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

//===========CHECK EXISTS ==========================
export const checkProposedVolumeExists = async (
  quarter: string,
  year: number
) => {
  try {
    const proposedVolume = await prisma.volume.findFirst({
      where: {
        quarter,
        year,
      },
    });

    // Return true if a proposed volume exists, otherwise false
    return proposedVolume !== null;
  } catch (error) {
    console.error("Error checking for proposed volume:", error);
    return false;
  }
};

export const checkExistingActualProduce = async (
  quarter: string,
  year: string,
  month: string
) => {
  try {
    // Check if a record already exists for the given quarter, year, and month
    const existingRecord = await prisma.volume.findFirst({
      where: {
        quarter, // Ensure year is an integer
        year: parseInt(year),
      },
      include: {
        produces: {
          select: {
            month: true,
          },
        },
      },
    });

    // Return true if a record exists, otherwise false
    return existingRecord !== null;
  } catch (error) {
    console.error("Error checking for existing actual produce:", error);
    return false;
  }
};

//================VOLUME SOLD==============
export const createSold = async (
  currentState: CurrentState,
  data: SoldSchema
) => {
  try {
    // Fetch the volumeId based on a condition, for example, by using a unique identifier
    const produce = await prisma.produce.findUnique({
      where: { id: data.id }, // Assuming data.volumeId contains the identifier
    });

    // Check if the volume was found
    if (!produce) {
      throw new Error("Produce not found");
    }

    // Create the ActualProduce record with the found volumeId
    await prisma.sold.create({
      data: {
        produceId: produce.id, // Assign the volumeId here
        soldAmount: data.soldAmount,
        mc: data.mc,
        mro: data.mro,
        consumerId: data.consumerId,
        createdAt: new Date(),
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
// export const createSold = async (
//   currentState: CurrentState,
//   data: SoldSchema
// ) => {
//   try {
//     await prisma.sold.create({
//       data: {
//         soldAmount: data.soldAmount,
//         mc: data.mc,
//         mro: data.mro,
//       },
//     });

//     // revalidatePath("/list/subjects");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

//update sold
export const updateSold = async (
  currentState: CurrentState,
  data: SoldSchema
) => {
  try {
    await prisma.sold.update({
      where: {
        id: data.id,
      },
      data: {
        soldAmount: data.soldAmount,
        mc: data.mc,
        mro: data.mro,
        createdAt: new Date(), // Set createdAt to the current date
        consumerId: data.consumerId,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteSold = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    await prisma.sold.delete({
      where: {
        id: parseInt(id),
        // ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

//===============Lift=======================

export const createAnnouncement = async (
  currentState: CurrentState,
  data: AnnouncementSchema
) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    // if (role === "teacher") {
    //   const teacherLesson = await prisma.lesson.findFirst({
    //     where: {
    //       teacherId: userId!,
    //       id: data.lessonId,
    //     },
    //   });

    //   if (!teacherLesson) {
    //     return { success: false, error: true };
    //   }
    // }

    await prisma.announcement.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateAnnouncement = async (
  currentState: CurrentState,
  data: AnnouncementSchema
) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    // if (role === "teacher") {
    //   const teacherLesson = await prisma.lesson.findFirst({
    //     where: {
    //       teacherId: userId!,
    //       id: data.lessonId,
    //     },
    //   });

    //   if (!teacherLesson) {
    //     return { success: false, error: true };
    //   }
    // }

    await prisma.announcement.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteAnnouncement = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    await prisma.announcement.delete({
      where: {
        id: parseInt(id),
        // ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

//=================LIFT====================

export const createLift = async (
  currentState: CurrentState,
  data: LiftSchema
) => {
  try {
    const sold = await prisma.sold.findUnique({
      where: { id: data.id }, // Assuming data.volumeId contains the identifier
    });

    // Check if the volume was found
    if (!sold) {
      throw new Error("Sold not found");
    }

    await prisma.lift.create({
      data: {
        liftVolume: data.liftVolume,
        region: data.region,
        remark: data.remark,
        soldId: sold.id,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateLift = async (
  currentState: CurrentState,
  data: LiftSchema
) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    // if (role === "teacher") {
    //   const teacherLesson = await prisma.lesson.findFirst({
    //     where: {
    //       teacherId: userId!,
    //       id: data.lessonId,
    //     },
    //   });

    //   if (!teacherLesson) {
    //     return { success: false, error: true };
    //   }
    // }

    await prisma.lift.update({
      where: {
        id: data.id,
      },
      data: {
        liftVolume: data.liftVolume,
        region: data.region,
        remark: data.remark,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteLift = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    await prisma.announcement.delete({
      where: {
        id: parseInt(id),
        // ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

//==================Events=================================================

export const createEvent = async (
  currentState: CurrentState,
  data: EventSchema
) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    // if (role === "teacher") {
    //   const teacherLesson = await prisma.lesson.findFirst({
    //     where: {
    //       teacherId: userId!,
    //       id: data.lessonId,
    //     },
    //   });

    //   if (!teacherLesson) {
    //     return { success: false, error: true };
    //   }
    // }

    await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateEvent = async (
  currentState: CurrentState,
  data: EventSchema
) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    // if (role === "teacher") {
    //   const teacherLesson = await prisma.lesson.findFirst({
    //     where: {
    //       teacherId: userId!,
    //       id: data.lessonId,
    //     },
    //   });

    //   if (!teacherLesson) {
    //     return { success: false, error: true };
    //   }
    // }

    await prisma.event.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const deleteEvent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    await prisma.event.delete({
      where: {
        id: parseInt(id),
        // ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

//========send mail===============

export const inviteUser = async (
  currentState: CurrentState,
  data: InviteSchema
) => {
  try {
    const user = await clerkClient.users.createUser({
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      password: data.password,
      emailAddress: [data.email],
      publicMetadata: {
        role: "producer", // Set the correct role here
      },
    });

    await prisma.producer.create({
      data: {
        id: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        img: data.img || null,
      },
    });
    // revalidatePath("/list/class"); // Uncomment if needed for revalidating paths
    return { success: true, error: false };
    // console.log(user);
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteInvite = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    await prisma.event.delete({
      where: {
        id: parseInt(id),
        // ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

//=======FETCH =====
