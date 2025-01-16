import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";

import { usernameValidation } from "@/schemas/signUpSchema";
import { errorResponse, successResponse } from "@/helpers/apiResponse";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});
// OPTIMIZE Nextjs has been updated now no need of this code
// // TODO use this in all routes
// if(request.method !== "GET"){
//     return Response.json(
//         {
//           success: false,
//           message: "Method not allowed",
//         },
//         { status: 405 }
//       );
// }
export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    // validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam);
    // OPTIMIZE please refer this once and learn more
    console.log(result);

    if (!result.success) {
      const userNameErrors = result.error.format().username?._errors || [];
      return Response.json(
        errorResponse(
          400,
          userNameErrors?.length > 0
            ? userNameErrors.join(", ")
            : "Invalid query parameters"
        )
      );
      //   return Response.json(
      //     {
      //       success: false,
      //       message:
      //         userNameErrors?.length > 0
      //           ? userNameErrors.join(", ")
      //           : "Invalid query parameters",
      //     },
      //     { status: 400 }
      //   );
    }

    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        errorResponse(400, "User is already taken")
      );
    }

    return Response.json(
      successResponse("Username is unique")
    );
  } catch (error) {
    console.log(`Error checking username`, error);
    return Response.json(
      errorResponse(500, "Error checking username")
    );
  }
}
