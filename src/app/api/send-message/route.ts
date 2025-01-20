import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { errorResponse, successResponse } from "@/helpers/apiResponse";

import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(errorResponse(404, "User not found"));
    }

    // Is User Accepting Message
    if (!user.isAcceptingMessage) {
      return Response.json(
        errorResponse(
          403,
          `${username} is not accepting any messages as of now`
        )
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      successResponse(`Message sent successfully to ${username}`)
    );
  } catch (error) {
    console.log("Error adding message", error);
    return Response.json(errorResponse(500, "Internal Server Error"));
  }
}
