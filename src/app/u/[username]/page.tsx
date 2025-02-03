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
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useCompletion } from "ai/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const specialChar = "||";

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const MessagePage = () => {
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });
  const [loading, setLoading] = useState(false);
  const tempMessages: string[] = [
    "What is your tech stack?",
    "What's your dream job?",
    "Do you love coding?",
  ];
  const params = useParams<{ username: string }>();
  const username = params.username;
  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setLoading(true);
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
        form.setValue("message", "");
      }
      setLoading(false);
    } catch (error) {
      console.log("Error sending message to user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      setLoading(false);
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

  const [retryCountdown, setRetryCountdown] = useState(0);
  const [errorDelay, setErrorDelay] = useState(0);

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: "/api/suggest-messages",
  });

  useEffect(() => {
    if (error?.message) {
      const match = error.message.match(/Please try again in (\d+)s/);
      const seconds = match ? parseInt(match[1], 10) : 20; // Default to 20s if not found
      setErrorDelay(seconds);
      setRetryCountdown(seconds);
      toast({
        title: "Attention please!",
        description: `Free usage limit exceeded. Please try again in ${retryCountdown}s`,
        variant: "destructive",
      });

      const timer = setInterval(() => {
        setRetryCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [error, retryCountdown, toast]);

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
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
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
            disabled={isSuggestLoading || retryCountdown > 0}
            onClick={() => complete("")}
          >
            {isSuggestLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suggesting...
              </>
            ) : retryCountdown > 0 ? (
              `Retry in ${retryCountdown}s`
            ) : (
              "Suggest Messages"
            )}
          </Button>
          <div className="my-4">Click on any messages below to select it.</div>

          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Messages</h3>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              {error ? (
                <Alert>
                  <AlertTitle>⚠️ Attention!</AlertTitle>
                  <AlertDescription>
                    {error?.message &&
                      retryCountdown > 0 &&
                      `Free usage limit exceeded. Please try again in ${retryCountdown}s`}
                    {error?.message &&
                      retryCountdown === 0 &&
                      `Please go ahead and send a message to ${username}`}
                  </AlertDescription>
                </Alert>
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
              ) : isSuggestLoading ? (
                <>
                  <div className="space-y-5">
                    <Skeleton className="h-9" />
                    <Skeleton className="h-9" />
                    <Skeleton className="h-9" />
                  </div>
                </>
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
        </div>
      </div>
    </>
  );
};

export default MessagePage;
