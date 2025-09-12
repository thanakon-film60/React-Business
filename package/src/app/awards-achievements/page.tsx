"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Award,
  Trophy,
  Star,
  Shield,
  Target,
  Users,
  Heart,
  Leaf,
} from "lucide-react";

// Define type for refs
interface RefsType {
  header?: HTMLDivElement | null;
  awardsGrid?: HTMLDivElement | null;
  achievements?: HTMLDivElement | null;
  gallery?: HTMLDivElement | null;
}

// Define type for isVisible state
interface IsVisibleType {
  header?: boolean;
  awardsGrid?: boolean;
  achievements?: boolean;
  gallery?: boolean;
}

const AwardsPage = () => {
  const [isVisible, setIsVisible] = useState<IsVisibleType>({});
  const [countingStarted, setCountingStarted] = useState(false);
  const [counts, setCounts] = useState({
    years: 0,
    awards: 0,
    customers: 0,
    standards: 0,
  });
  const refs = useRef<RefsType>({});

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.keys(refs.current).forEach((key) => {
      const refKey = key as keyof RefsType;
      if (refs.current[refKey]) {
        observer.observe(refs.current[refKey] as Element);
      }
    });

    return () => observer.disconnect();
  }, []);

  // Counter animation for stats
  useEffect(() => {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countingStarted) {
            setCountingStarted(true);
            animateCounters();
          }
        });
      },
      { threshold: 0.5 }
    );

    const statsSection = document.getElementById("stats-section");
    if (statsSection) {
      statsObserver.observe(statsSection);
    }

    return () => statsObserver.disconnect();
  }, [countingStarted]);

  const animateCounters = () => {
    const targets = { years: 25, awards: 50, customers: 100, standards: 5 };
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounts({
        years: Math.floor(targets.years * progress),
        awards: Math.floor(targets.awards * progress),
        customers: Math.floor(targets.customers * progress),
        standards: Math.floor(targets.standards * progress),
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setCounts(targets);
      }
    }, stepDuration);
  };

  const awards = [
    {
      icon: <Trophy className="w-8 h-8 text-amber-600" />,
      title: "รางวัลคุณภาพยอดเยี่ยม",
      year: "2023",
      description: "มาตรฐานการผลิตบรรจุภัณฑ์ระดับสากล",
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "ISO 9001:2015",
      year: "2022-2024",
      description: "ระบบการจัดการคุณภาพ",
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      title: "Supplier Excellence Award",
      year: "2023",
      description: "จากลูกค้าชั้นนำในอุตสาหกรรม",
    },
    {
      icon: <Leaf className="w-8 h-8 text-green-600" />,
      title: "Green Industry",
      year: "2022",
      description: "อุตสาหกรรมสีเขียวระดับ 3",
    },
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "CSR Excellence",
      year: "2023",
      description: "องค์กรต้นแบบด้านความรับผิดชอบต่อสังคม",
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Best Workplace",
      year: "2023",
      description: "สถานที่ทำงานที่มีความสุข",
    },
  ];

  // Add CSS animations
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      @keyframes fadeInUp {
        from { 
          opacity: 0; 
          transform: translateY(20px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Header Section with Fade In */}
      <div
        ref={(el) => {
          refs.current.header = el;
        }}
        id="header"
        className={`bg-gradient-to-r from-blue-50 to-purple-50 py-16 transition-all duration-1000 ${
          isVisible.header
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className={`flex justify-center mb-6 ${
              isVisible.header ? "animate-bounce" : ""
            }`}>
            <Award className="w-16 h-16 text-blue-600" />
          </div>
          <h1
            className={`text-4xl font-bold text-gray-900 mb-6 transition-all duration-1000 delay-200 ${
              isVisible.header ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}>
            รางวัลและความภาคภูมิใจ
          </h1>
          <p
            className={`text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${
              isVisible.header ? "opacity-100" : "opacity-0"
            }`}>
            TPP
            มุ่งมั่นพัฒนาและรักษามาตรฐานด้านคุณภาพของบรรจุภัณฑ์อย่างต่อเนื่อง
            จนได้รับการยอมรับและความไว้วางใจจากลูกค้าในทุกกลุ่มอุตสาหกรรม
            ผลงานคุณภาพได้รับการยืนยันด้วยรางวัลจากหลายสถาบัน นอกจากนี้ TPP
            ยังให้ความสำคัญกับการดำเนินธุรกิจควบคู่กับความรับผิดชอบต่อสังคม
            โดยได้รับรางวัลและการยกย่องจากกิจกรรมเพื่อสังคมมาอย่างต่อเนื่อง
          </p>
        </div>
      </div>

      {/* Stats Section with Counter Animation */}
      <div id="stats-section" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 transform hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {counts.years}+
              </div>
              <div className="text-gray-600">ปีแห่งความเชื่อมั่น</div>
            </div>
            <div className="p-6 transform hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {counts.awards}+
              </div>
              <div className="text-gray-600">รางวัลและการรับรอง</div>
            </div>
            <div className="p-6 transform hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {counts.customers}+
              </div>
              <div className="text-gray-600">ลูกค้าที่ไว้วางใจ</div>
            </div>
            <div className="p-6 transform hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {counts.standards}
              </div>
              <div className="text-gray-600">มาตรฐานระดับสากล</div>
            </div>
          </div>
        </div>
      </div>

      {/* Awards Grid with Stagger Animation */}
      <div
        ref={(el) => {
          refs.current.awardsGrid = el;
        }}
        id="awardsGrid"
        className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className={`text-3xl font-bold text-center text-gray-900 mb-12 transition-all duration-1000 ${
              isVisible.awardsGrid
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}>
            รางวัลและการรับรองมาตรฐาน
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {awards.map((award, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg shadow-lg p-8 border border-gray-100 transform transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 ${
                  isVisible.awardsGrid
                    ? `opacity-100 translate-y-0`
                    : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: isVisible.awardsGrid
                    ? `${index * 100}ms`
                    : "0ms",
                }}>
                <div className="flex justify-center mb-4 transform hover:rotate-12 transition-transform duration-300">
                  {award.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                  {award.title}
                </h3>
                <p className="text-blue-600 text-center font-medium mb-3">
                  {award.year}
                </p>
                <p className="text-gray-600 text-center text-sm">
                  {award.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Achievements with Slide Animation */}
      <div
        ref={(el) => {
          refs.current.achievements = el;
        }}
        id="achievements"
        className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className={`text-3xl font-bold text-center text-gray-900 mb-12 transition-all duration-1000 ${
              isVisible.achievements ? "opacity-100" : "opacity-0"
            }`}>
            ความสำเร็จที่โดดเด่น
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              className={`bg-blue-50 rounded-lg p-8 transform transition-all duration-1000 hover:shadow-xl ${
                isVisible.achievements
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-20"
              }`}>
              <Target className="w-12 h-12 text-blue-600 mb-4 animate-pulse" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                มาตรฐานคุณภาพ
              </h3>
              <ul className="space-y-3 text-gray-700">
                {[
                  "ได้รับการรับรอง ISO 9001:2015",
                  "มาตรฐาน GMP และ HACCP",
                  "ระบบควบคุมคุณภาพทุกขั้นตอนการผลิต",
                  "ห้องปฏิบัติการทดสอบที่ได้มาตรฐาน",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className={`flex items-start transition-all duration-500 hover:translate-x-2 ${
                      isVisible.achievements ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ transitionDelay: `${500 + idx * 100}ms` }}>
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className={`bg-green-50 rounded-lg p-8 transform transition-all duration-1000 hover:shadow-xl ${
                isVisible.achievements
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-20"
              }`}>
              <Heart className="w-12 h-12 text-green-600 mb-4 animate-pulse" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                ความรับผิดชอบต่อสังคม
              </h3>
              <ul className="space-y-3 text-gray-700">
                {[
                  "โครงการอนุรักษ์สิ่งแวดล้อม",
                  "การสนับสนุนการศึกษาในชุมชน",
                  "กิจกรรมเพื่อสังคมอย่างต่อเนื่อง",
                  "การจ้างงานและพัฒนาชุมชนท้องถิ่น",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className={`flex items-start transition-all duration-500 hover:translate-x-2 ${
                      isVisible.achievements ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ transitionDelay: `${500 + idx * 100}ms` }}>
                    <span className="text-green-600 mr-2">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Awards Gallery Section with Animation */}
      <div
        ref={(el) => {
          refs.current.gallery = el;
        }}
        id="gallery"
        className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className={`text-3xl font-bold text-center text-gray-900 mb-4 transition-all duration-1000 ${
              isVisible.gallery
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}>
            ประกาศนียบัตรและรางวัลแห่งความภาคภูมิใจ
          </h2>
          <p
            className={`text-center text-gray-600 mb-12 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
              isVisible.gallery ? "opacity-100" : "opacity-0"
            }`}>
            รางวัลและการรับรองมาตรฐานต่างๆ ที่ TPP ได้รับจากหน่วยงานชั้นนำ
            ทั้งในประเทศและระดับสากล ยืนยันถึงคุณภาพและมาตรฐานการดำเนินงานของเรา
          </p>

          {/* Main Trophy Display with Floating Animation */}
          <div
            className={`flex justify-center mb-12 ${
              isVisible.gallery ? "opacity-100" : "opacity-0"
            }`}>
            <div className="relative">
              <div
                className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-all duration-500"
                style={{
                  animation: "float 3s ease-in-out infinite",
                }}>
                <Trophy className="w-32 h-32 text-amber-500 mx-auto mb-4" />
                <p className="text-center text-2xl font-bold text-gray-800">
                  TBPST Award Winner
                </p>
                <p className="text-center text-gray-600 mt-2">
                  รางวัลความเป็นเลิศด้านการจัดการ
                </p>
              </div>
            </div>
          </div>

          {/* Certificates Image Display */}
          <div
            className={`relative w-full overflow-hidden rounded-xl shadow-2xl transition-all duration-1000 ${
              isVisible.gallery ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}>
            <img
              src="images/certifications/awards-collage.png" // เปลี่ยนเป็น URL รูปภาพของคุณ
              alt="ใบรับรองและรางวัลต่างๆ ของบริษัท TPP"
              className="w-full h-auto object-contain hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500">
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">
                  รางวัลและใบรับรองมาตรฐาน
                </h3>
                <p className="text-lg">
                  ISO 9001:2015 | ISO 14001:2015 | Green Industry | FSC®
                  Certified | GMP Certified | และรางวัลอื่นๆ อีกมากมาย
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 max-w-3xl mx-auto">
              รางวัลและการรับรองเหล่านี้สะท้อนถึงความมุ่งมั่นของ TPP
              ในการรักษามาตรฐานคุณภาพสูงสุดและความรับผิดชอบต่อสังคมและสิ่งแวดล้อม
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action with Pulse Animation */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div
          className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full"
          style={{
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full"
          style={{
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            animationDelay: "1s",
          }}></div>

        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2
            className="text-3xl font-bold text-white mb-6"
            style={{
              animation: "fadeInUp 1s ease-out forwards",
            }}>
            ร่วมเป็นส่วนหนึ่งของความสำเร็จ
          </h2>
          <p
            className="text-xl text-blue-100 mb-8"
            style={{
              animation: "fadeInUp 1s ease-out forwards",
              animationDelay: "200ms",
            }}>
            TPP พร้อมเป็นพันธมิตรที่ดีในการสร้างสรรค์บรรจุภัณฑ์คุณภาพสูง
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transform hover:scale-110 transition-all duration-300 animate-bounce">
            ติดต่อเรา
          </button>
        </div>
      </div>
    </div>
  );
};

export default AwardsPage;
