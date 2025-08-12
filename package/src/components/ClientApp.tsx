"use client";
import { useState } from "react";
import Hero from "@/components/Home/Video";
import Aboutus from "@/components/Home/AboutUs";
import Dedicated from "@/components/Home/Detail";
import Insta from "@/components/Home/News";
import InvestorRelations from "@/components/InvestorRelations";

export default function ClientApp() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main
      className="
        relative isolate
        min-w-0 max-w-[100vw]
        overflow-x-hidden   /* แทน overflow-x-clip */
      "
    >
      <Hero setIsLoading={setIsLoading} />

      <div className="h-8 sm:h-10" aria-hidden />

      <Aboutus />

      <section className="min-w-0 max-w-[100vw] overflow-x-hidden">
        <Dedicated />
      </section>

      <InvestorRelations />
      <Insta />
    </main>
  );
}
