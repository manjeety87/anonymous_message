import UserModel from "@/model/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { errorResponse, successResponse } from "@/helpers/apiResponse";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(errorResponse(401, "User not authenticated"));
  }

  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await UserModel.aggregate([
      { $match: { id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length === 0) {
      return Response.json(errorResponse(401, "User not found"));
    }

    return Response.json(successResponse(user[0].messages));
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return Response.json(
      errorResponse(500, "Internal Server Error")
    );
  }
}
