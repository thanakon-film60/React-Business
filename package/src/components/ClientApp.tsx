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
    <main className="overflow-x-clip">
      <Hero setIsLoading={setIsLoading} />
      <section className="overflow-x-clip">
        <Aboutus />
      </section>
      <section className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Dedicated />
      </section>
      <section className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <InvestorRelations />
      </section>
      <section className="overflow-x-clip">
        <Insta />
      </section>
    </main>
  );
}

{
  /* <div className="h-12" aria-hidden />; */
}
