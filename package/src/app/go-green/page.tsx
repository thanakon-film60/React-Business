import type { Metadata } from "next";
import GoGreenSection from "./GoGreenSection";

export const metadata: Metadata = {
  title: "Go Green",
  description: "Sustainability at TPP",
};

export default function Page() {
  return (
    <GoGreenSection
      title="Sustainability at TPP"
      imageFit="cover"
      textFirstOnMobile={false}
      imagePosition="left"
    />
  );
}
