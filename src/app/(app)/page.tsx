"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  GamepadIcon,
  Lock,
  Mail,
  Rocket,
  Server,
  Trophy,
  Users,
} from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import messages from "../../messages.json";
import { Glow, GlowArea } from "@/components/Glow";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <>
    <head>
      <title>Home</title>
    </head>
      <div className="h-[82dvh]">
        <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
          <section className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold">
              Dive into the World of Anonymous Feedback
            </h1>
            <p className="mt-3 md:mt-4 text-base md:text-lg">
              True Feedback - Where your identity remains a secret.
            </p>
          </section>
          <section>
            <GlowArea className="flex gap-8 items-center justify-center p-12">
              <Glow color="red" className="rounded-xl">
                <Card className="max-w-md">
                  <CardHeader>
                    <CardTitle>Free plan</CardTitle>
                    <CardDescription className="max-w-sm">
                      2 Monthly free games, trials and perks for you to enjoy.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-center space-x-3">
                        <Server className="text-foreground" size={20} />
                        <span>Dedicated Low-Latency Gaming Servers</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <Users className="text-foreground" size={20} />
                        <span>Monthly Multiplayer Tournament Entry</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <Trophy className="text-foreground" size={20} />
                        <span>Exclusive In-Game Rewards & Cosmetics</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <Rocket className="text-foreground" size={20} />
                        <span>Early Access to New Game Releases</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <Lock className="text-foreground" size={20} />
                        <span>Ad-Free Gaming Experience</span>
                      </li>{" "}
                    </ul>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button className="w-full">Subscribe</Button>
                  </CardFooter>
                </Card>
              </Glow>
              <Glow>
                {" "}
                <Card className="max-w-md ">
                  <CardHeader>
                    <CardTitle>Pro plan</CardTitle>
                    <CardDescription className="max-w-sm">
                      Everything you need to game, from{" "}
                      <span className="text-primary">$20/month.</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-center space-x-3">
                        <GamepadIcon size={20} className="text-foreground" />
                        <span>Access to 500+ Premium Games Library</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <Server className="text-foreground" size={20} />
                        <span>Dedicated Low-Latency Gaming Servers</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <Users className="text-foreground" size={20} />
                        <span>Monthly Multiplayer Tournament Entry</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <Trophy className="text-foreground" size={20} />
                        <span>Exclusive In-Game Rewards & Cosmetics</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <Rocket className="text-foreground" size={20} />
                        <span>Early Access to New Game Releases</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <Lock className="text-foreground" size={20} />
                        <span>Ad-Free Gaming Experience</span>
                      </li>{" "}
                    </ul>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button className="w-full">Subscribe</Button>
                  </CardFooter>
                </Card>
              </Glow>
              <Glow color="teal">
                <ul className="p-24">
                  <li>gsfsdfd</li>
                  <li>gsfsdfd</li>
                  <li>gsfsdfd</li>
                  <li>gsfsdfd</li>
                  <li>gsfsdfd</li>
                </ul>
              </Glow>
            </GlowArea>
          </section>
          <Carousel
            plugins={[Autoplay({ delay: 2000 })]}
            className="w-full max-w-lg md:max-w-xl"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                      <Mail className="flex-shrink-0" />
                      <div>
                        <p>{message.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </main>
      </div>
      <footer className="text-center p-2">
        © 2025 Anonymous Feedback. All rights reserved.
      </footer>
    </>
  );
};

export default Home;
