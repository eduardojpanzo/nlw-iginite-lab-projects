import { cookies } from "next/headers";
import { Copyright } from "@/components/Copyright";
import { EmptyMemories } from "@/components/EmptyMemories";
import { Hero } from "@/components/Hero";
import { SignIn } from "@/components/SignIn";
import { Profile } from "@/components/Profile";

export default function Home() {
  return <EmptyMemories />;
}
