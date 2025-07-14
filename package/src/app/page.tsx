import React from "react";
import Hero from "@/components/Home/Hero";
import Aboutus from "@/components/Home/AboutUs";
import Dedicated from "@/components/Home/Dedicated";
import Digital from "@/components/Home/Digital";
import Beliefs from "@/components/Home/Beliefs";
import Work from "@/components/Home/Work";
import Team from "@/components/Home/Team";
import Featured from "@/components/Home/Featured";
import Manage from "@/components/Home/Manage";
import FAQ from "@/components/Home/FAQ";
import Testimonial from "@/components/Home/Testimonials";
import Articles from "@/components/Home/Articles";
import Join from "@/components/Home/Joinus";
import Insta from "@/components/Home/Insta";
import { Metadata } from "next";

// สำหรับ CSS
import '../Style/css/animate.css';
import '../Style/css/boxed.css';
import '../Style/css/closed-sidemenu.css';
import '../Style/css/dark-boxed.css';
import '../Style/css/icons.css';
import '../Style/css/sidemenu-responsive-tabs.css';
import '../Style/css/sidemenu.css';
import '../Style/css/sidemenu1.css';
import '../Style/css/sidemenu3.css';
import '../Style/css/sidemenu4.css';
import '../Style/css/skin-modes.css';
import '../Style/css/style-dark.css';
import '../Style/css/style.css';

import '../Style/css/boxed.scss';
import '../Style/css/closed-sidemenu.scss';
import '../Style/css/dark-boxed.scss';
import '../Style/css/sidemenu-responsive-tabs.scss';
import '../Style/css/sidemenu.scss';
import '../Style/css/sidemenu1.scss';
import '../Style/css/sidemenu3.scss';
import '../Style/css/sidemenu4.scss';
import '../Style/css/skin-modes.scss';
import '../Style/css/style-dark.scss';



export const metadata: Metadata = {
  title: "Desgy Solutions",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Aboutus />
      <Dedicated />
      <Digital />
      <Beliefs />
      <Work />
      <Team />
      <Featured />
      <Manage />
      <FAQ />
      <Testimonial />
      <Articles />
      <Join />
      <Insta />
    </main>
  );
}
