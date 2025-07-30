"use client"; 
import { useState } from "react";
import Hero from "@/components/Home/Video";
import Aboutus from "@/components/Home/AboutUs";
import Dedicated from "@/components/Home/Detail";
import Insta from "@/components/Home/Insta";
import InvestorRelations from "@/components/InvestorRelations";
import Loading from "@/app/loading";

// สำหรับ CSS
// import '../Style/style.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import '../app/globals.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';

export default function ClientApp() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    // <main>
    //   {isLoading ? (
    //     <Loading />
    //   ) : (
    //     <>
    //       <Hero setIsLoading={setIsLoading} />
    //       <Aboutus />
    //       <Dedicated />
    //       <InvestorRelations />
    //       <Insta />
    //     </>
    //   )}
    // </main>
    
      <main>
        <>
          <Hero />
          <Aboutus />
          <Dedicated />
          <InvestorRelations />
          <Insta />
        </>
    </main>
  );
}
