"use client"; 
import { useState } from "react";
import Hero from "@/components/Home/Video";
import Aboutus from "@/components/Home/AboutUs";
import Dedicated from "@/components/Home/Detail";
import Insta from "@/components/Home/Insta";
import InvestorRelations from "@/components/InvestorRelations";
import Loading from "@/app/loading";

export default function ClientApp() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
        <main>
          <Hero setIsLoading={setIsLoading} />
          <Aboutus />
          <Dedicated />
          <InvestorRelations />
          <Insta />
        </main>
    </>
  );
}
