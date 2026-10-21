import type { Metadata } from "next";
import { INTRO_SLUG, IntroView } from "./intro-view";

export const metadata: Metadata = { title: "Giới thiệu" };

export default function IntroPage() {
  return <IntroView slug={INTRO_SLUG} />;
}
