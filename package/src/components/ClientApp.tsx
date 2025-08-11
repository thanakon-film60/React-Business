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
      <div className="h-12" aria-hidden />
      <Aboutus />
      <Dedicated />
      <InvestorRelations />
      <Insta />
    </main>
  );
}

{
  /* <div className="h-12" aria-hidden />; */
}
