import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { errorResponse, successResponse } from "@/helpers/apiResponse";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(errorResponse(401, "User not authenticated"));
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(errorResponse(401, "User not found"));
    }

    return Response.json(
      successResponse(
        `Message acceptance status turned ${updatedUser.isAcceptingMessage ? "on" : "off"} updated successfully`,
        updatedUser
      )
    );
  } catch (error) {
    console.log("Error updating message acceptance status:", error);
    return Response.json(
      errorResponse(500, "Error updating message acceptance status")
    );
  }
}

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(errorResponse(401, "User not authenticated"));
  }

  const userId = user._id;

  try {
    const userDetails = await UserModel.findById(userId);
    if (!userDetails) {
      return Response.json(errorResponse(404, "User not found"));
    }

    return Response.json(
      successResponse(
        `Message acceptance status updated successfully`,
        // TODO: check again for this mistake
        { isAcceptingMessage: userDetails.isAcceptingMessage }
      )
    );
  } catch (error) {
    console.log("Error retrieving message acceptance status:", error);
    return Response.json(
      errorResponse(500, "Error retrieving message acceptance status")
    );
  }
}
