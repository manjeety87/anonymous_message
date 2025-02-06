import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Heart, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Message } from "@/model/User";
import dayjs from "dayjs";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
  isFavourite: boolean;
};

const MessageCard = ({
  message,
  onMessageDelete,
  isFavourite: isFavourites,
}: MessageCardProps) => {
  const { toast } = useToast();
  const [isFavourite, setIsFavourite] = useState(isFavourites);
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast({
        title: response.data.message,
      });
      onMessageDelete(message._id as string);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to delete message",
        variant: "destructive",
      });
    }
  };
  const handleFavouritesConfirm = async (isFavourite: boolean) => {
    setIsFavourite(isFavourite);
    try {
      const response = await axios.put<ApiResponse>(
        `/api/add-favourite/${message._id}/${isFavourite}`
      );
      toast({
        title: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to add to favourites",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    setIsFavourite(isFavourites);
  }, [isFavourites]);

  return (
    <Card className="card-bordered">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Anonymous</CardTitle>
          <div className="flex items-center">
            <Heart
              className={`w-6 h-6 mr-2 stroke-current ${isFavourite ? "fill-red-500" : ""} hover:fill-red-500`}
              // className={`${true ? "fill-red-500" : ""} hover:fill-red-500 w-6 h-6 mr-2 stroke-current`}
              onClick={() => handleFavouritesConfirm(!isFavourite)}
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-10 h-8">
                  <X className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your important feedback and remove your feedback from our
                    servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteConfirm()}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        {/* <CardDescription> */}
        {/* {message.content.length > 250
          ? message.content.slice(0, 100) + "..."
          : message.content} */}
        {/* </CardDescription> */}
      </CardHeader>
      <CardContent>
        {message.content.length > 150
          ? message.content.slice(0, 150) + "..."
          : message.content}
      </CardContent>
      <CardFooter>
        <div className="text-sm">
          {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
        </div>
      </CardFooter>
    </Card>
  );
};

export default MessageCard;
