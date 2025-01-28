"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useCompletion } from "ai/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";

const specialChar = "||";

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

// const initialMessageString =
//   "What's your favorite movie?||Do you have any pets?||What's your dream job?";

const MessagePage = () => {
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });
  const tempMessages: string[] = [
    "What is your tech stack?",
    "What's your dream job?",
    "Do you love coding?",
  ];
  const params = useParams<{ username: string }>();
  const username = params.username;
  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      const response = await axios.post("/api/send-message", {
        username: username,
        content: data.message,
      });
      if (response.data.error) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: response.data.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: response.data.message,
        });
      }
    } catch (error) {
      console.log("Error sending message to user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          `Error sending message to ${username}`,
        variant: "destructive",
      });
    }
  };

  const handleMessageClick = (message: string) => {
    form.setValue("message", message);
  };

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: "/api/suggest-messages",
  });

  const fetchSuggestedMessages = async () => {
    try {
      complete("");
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Handle error appropriately
    }
  };

  return (
    <>
      <div className="min-h-screen justify-center items-center pt-8 mx-0 md:mx-auto lg:mx-auto p-6 rounded w-full max-w-6xl">
        <h1 className="text-4xl text-center font-bold mb-4">
          Public Profile Link
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="message"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Send anonymous message to @{username}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Write your anonymous message here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={false}>
              {false ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Send it"
              )}
            </Button>
          </form>
        </Form>
        <div className="mt-12">
          <Button
            className="h-10"
            disabled={isSuggestLoading}
            onClick={fetchSuggestedMessages}
          >
            Suggest Messages
          </Button>
          <div className="my-4">Click on any messages below to select it.</div>

          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Messages</h3>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              {error ? (
                <p className="text-red-500">Hi{error.message}</p>
              ) : completion !== "" ? (
                parseStringMessages(completion).map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="mb-2 truncate h-auto"
                    onClick={() => handleMessageClick(message)}
                  >
                    {message}
                  </Button>
                ))
              ) : (
                tempMessages.map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="mb-2"
                    onClick={() => handleMessageClick(message)}
                  >
                    {message}
                  </Button>
                ))
              )}
            </CardContent>
          </Card>
          <Separator className="my-6" />
          <div className="text-center">
            <div className="mb-4">Get Your Message Board</div>
            <Link href={"/sign-up"}>
              <Button>Create Your Account</Button>
            </Link>
          </div>

          {/* <div>{completion}</div> */}

          {/* <div className="container py-3 w-full border-2">
            <div className="px-8 pb-2 text-xl font-semibold">Messages</div>
            {tempMessages.map((message, index) => (
              <div className="w-full my-6 px-6" key={index}>
                <Button
                  className="w-full h-10 font-semibold"
                  variant={"outline"}
                  onClick={() => form.setValue("message", message)}
                >
                  {message}
                </Button>
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </>
  );
};

export default MessagePage;
