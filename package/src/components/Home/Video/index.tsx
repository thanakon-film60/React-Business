"use client";
import { useEffect, useRef, useState } from "react";

interface HeroProps {
  setIsLoading: (val: boolean) => void;
}

const Hero = ({ setIsLoading }: HeroProps) => {
  const [hasLoaded, setHasLoaded] = useState(false);

useEffect(() => {
  if (hasLoaded) setIsLoading(false);
}, [hasLoaded]);
  
return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden z-1 mt-[20px]"
      id="main-banner"
    >
      <video
        
        src="/images/video/fixed-banner-video.mp4"
        className="w-full h-full object-cover absolute top-0 left-0"
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => setHasLoaded(true)}
      />
      <div className="relative z-10 w-full flex justify-center items-center">
      </div>
    </section>
  );
};

export default Hero;

// "use client";
// import { Dispatch, SetStateAction } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { motion } from "framer-motion";
// import { Icon } from "@iconify/react/dist/iconify.js";

// interface HeroProps {
//   setIsLoading: Dispatch<SetStateAction<boolean>>;
// }
// const Hero = ({ setIsLoading }: HeroProps) => {
//   const handleVideoReady = () => {
//     setIsLoading(false); 
//   };

//   return (
//     <section
//       className="relative w-full min-h-screen flex items-center justify-center overflow-hidden z-1 mt-[20px]"
//       id="main-banner"
//     >
//       <video
//         src="/images/video/banner-video.mp4"
//         className="w-full h-full object-cover absolute top-0 left-0"
//         autoPlay
//         loop
//         muted
//         playsInline
//         onLoadedData={handleVideoReady}
//       />
//       <div className="relative z-10 w-full flex justify-center items-center"></div>
//     </section>
//   );
// };

// export default Hero;
