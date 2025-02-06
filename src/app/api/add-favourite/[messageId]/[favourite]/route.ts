import UserModel from "@/model/User";
import { authOptions } from "../../../auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { errorResponse, successResponse } from "@/helpers/apiResponse";

export async function PUT(
  request: Request,
  { params }: { params: { messageId: string; favourite: boolean } }
) {
  const { messageId, favourite } = await params;
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(errorResponse(401, "User not authenticated"));
  }

  try {
    const user = await UserModel.findById(session.user._id);

    if (!user) {
      return Response.json(errorResponse(404, "User not found"));
    }

    if (favourite) {
      user.messages.forEach((message) => {
        console.log("MESSAGE ID", messageId, message._id);
        if (message._id == messageId) {
          message.isFavourite = favourite;
        }
      });
      await user.save();
    } else {
      // Remove the messageId from the favourite array
      user.messages = user.messages.filter(
        (message) => message._id !== messageId
      );
    }

    await user.save();

    return Response.json(
      successResponse("Favourite status updated successfully")
    );
  } catch (error) {
    console.error("Error updating favourite status:", error);
    return Response.json(errorResponse(500, "Error updating favourite status"));
  }
}
