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
      return Response.json(
        errorResponse(
          404,
          `There's no user ${username} exists. Please check the link again.`
        )
      );
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

    const newMessage = <Message>{
      content,
      createdAt: new Date(),
      isFavourite: false,
      isMessageSeen: false,
    };
    user.messages.push(newMessage);
    await user.save();

    return Response.json(
      successResponse(`Message sent successfully to ${username}`)
    );
  } catch (error) {
    console.log("Error adding message", error);
    return Response.json(errorResponse(500, "Internal Server Error"));
  }
}
