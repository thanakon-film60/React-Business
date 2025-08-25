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
        overflow-x-hidden ">
      /* แทน overflow-x-clip *
      <Hero setIsLoading={setIsLoading} />
      <div className="h-8 sm:h-10" aria-hidden />
      {/* <div className="mb-1 sm:mb-1">
        <Aboutus />
      </div> */}
      <Aboutus />
      <section className="min-w-0 max-w-[100vw] overflow-x-hidden pb-0 -mb-10">
        <Dedicated />
      </section>
      <div className="-mt-8">
        <InvestorRelations />
      </div>
      <Insta />
    </main>
  );
}
