"use client";
import { useEffect, useRef, useState } from "react";

interface HeroProps {
  setIsLoading: (val: boolean) => void;
}

const Hero = ({ setIsLoading }: HeroProps) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (hasLoaded) setIsLoading(false);
  }, [hasLoaded, setIsLoading]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="main-banner"
      className="relative w-full min-h-[60svh] md:min-h-[80svh] lg:min-h-[100svh] flex items-center justify-center overflow-hidden mt-5"
      aria-label="Company hero video">
      <video
        ref={videoRef}
        className="hidden md:block absolute inset-0 w-full h-full object-cover z-[-1] motion-reduce:hidden"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/images/video/fixed-banner-poster.jpg"
        onLoadedData={() => setHasLoaded(true)}
        aria-hidden="true"
        tabIndex={-1}
        disablePictureInPicture>
        <source src="/images/video/fixed-banner-video.webm" type="video/webm" />
        <source src="/images/video/fixed-banner-video.mp4" type="video/mp4" />
      </video>

      <img
        src="/images/video/fixed-banner-poster.jpg"
        alt=""
        className="md:hidden absolute inset-0 w-full h-full object-cover z-[-1]"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

      <div className="relative z-[1] w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 text-white"></div>
    </section>
  );
};

export default Hero;
