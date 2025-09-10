"use client";
import { useState } from "react";
import Hero from "@/components/Home/Video";
import Aboutus from "@/components/Home/AboutUs";
import Dedicated from "@/components/Home/Detail";
import Insta from "@/components/Home/News";
import InvestorRelations from "@/components/InvestorRelations";
import GoGreenHero from "@/app/go-green/page";

export default function ClientApp() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main
      className="
        relative isolate
        min-w-0 max-w-[100vw]
        overflow-x-hidden">
      <Hero setIsLoading={setIsLoading} />

      <div className="h-[96px]" aria-hidden />

      <div className="flex flex-col gap-[1in] [&>*]:!my-0">
        <Aboutus />
        <GoGreenHero />
      </div>
      <section className="min-w-0 max-w-[100vw] overflow-x-hidden pb-0">
        <Dedicated />
      </section>
      <div className="-mt-8">
        <InvestorRelations />
      </div>
      <Insta />
    </main>
  );
}
