import UserModel from "@/model/User";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { errorResponse, successResponse } from "@/helpers/apiResponse";

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  const messageId = params.messageId;
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(errorResponse(401, "User not authenticated"));
  }

  try {
    const updateResult = await UserModel.updateOne(
      {
        _id: user._id,
      },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updateResult.modifiedCount === 0) {
      return Response.json(
        errorResponse(404, "Message not found or already deleted")
      );
    }

    return Response.json(successResponse("Message deleted successfully"));
  } catch (error) {
    console.error("Error deleting message:", error);
    return Response.json(errorResponse(500, "Error deleteing message"));
  }
}
