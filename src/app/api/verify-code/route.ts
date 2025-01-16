import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  if (request.method !== "POST") {
    return Response.json(
      {
        success: false,
        message: "Method not allowed",
      },
      { status: 405 }
    );
  }

  await dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedusername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedusername });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        // OPTIMIZE check for the status code and update it accordingly
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (!isCodeValid) {
      return Response.json(
        { success: false, message: "Invalid verification code" },
        { status: 400 }
      );
    }

    if (!isCodeExpired) {
      return Response.json(
        { success: false, message: "Verification code has expired" },
        { status: 400 }
      );
    }

    if (isCodeValid && isCodeExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        { success: true, message: "Account verified successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("Error verifying user", error);
    return Response.json(
      { success: false, message: "Error verifying user" },
      { status: 500 }
    );
  }
}
