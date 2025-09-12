import React from "react";
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

const AwardsPage = () => {
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Award className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            รางวัลและความภาคภูมิใจ
          </h1>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            TPP
            มุ่งมั่นพัฒนาและรักษามาตรฐานด้านคุณภาพของบรรจุภัณฑ์อย่างต่อเนื่อง
            จนได้รับการยอมรับและความไว้วางใจจากลูกค้าในทุกกลุ่มอุตสาหกรรม
            ผลงานคุณภาพได้รับการยืนยันด้วยรางวัลจากหลายสถาบัน นอกจากนี้ TPP
            ยังให้ความสำคัญกับการดำเนินธุรกิจควบคู่กับความรับผิดชอบต่อสังคม
            โดยได้รับรางวัลและการยกย่องจากกิจกรรมเพื่อสังคมมาอย่างต่อเนื่อง
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">25+</div>
              <div className="text-gray-600">ปีแห่งความเชื่อมั่น</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">รางวัลและการรับรอง</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                100+
              </div>
              <div className="text-gray-600">ลูกค้าที่ไว้วางใจ</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-orange-600 mb-2">5</div>
              <div className="text-gray-600">มาตรฐานระดับสากล</div>
            </div>
          </div>
        </div>
      </div>

      {/* Awards Grid */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            รางวัลและการรับรองมาตรฐาน
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {awards.map((award, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="flex justify-center mb-4">{award.icon}</div>
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

      {/* Key Achievements */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ความสำเร็จที่โดดเด่น
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-lg p-8">
              <Target className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                มาตรฐานคุณภาพ
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>ได้รับการรับรอง ISO 9001:2015</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>มาตรฐาน GMP และ HACCP</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>ระบบควบคุมคุณภาพทุกขั้นตอนการผลิต</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>ห้องปฏิบัติการทดสอบที่ได้มาตรฐาน</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-lg p-8">
              <Heart className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                ความรับผิดชอบต่อสังคม
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>โครงการอนุรักษ์สิ่งแวดล้อม</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>การสนับสนุนการศึกษาในชุมชน</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>กิจกรรมเพื่อสังคมอย่างต่อเนื่อง</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>การจ้างงานและพัฒนาชุมชนท้องถิ่น</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Awards Gallery Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            ประกาศนียบัตรและรางวัลแห่งความภาคภูมิใจ
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            รางวัลและการรับรองมาตรฐานต่างๆ ที่ TPP ได้รับจากหน่วยงานชั้นนำ
            ทั้งในประเทศและระดับสากล ยืนยันถึงคุณภาพและมาตรฐานการดำเนินงานของเรา
          </p>

          {/* Main Trophy Display */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-8 shadow-xl">
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

          {/* Certificates Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* ISO Certificates */}
            <div className="bg-gray-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-white rounded-lg flex flex-col items-center justify-center p-4">
                <Shield className="w-12 h-12 text-blue-600 mb-2" />
                <p className="text-sm font-semibold text-center">
                  ISO 14001:2015
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Environmental Management
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-white rounded-lg flex flex-col items-center justify-center p-4">
                <Shield className="w-12 h-12 text-blue-600 mb-2" />
                <p className="text-sm font-semibold text-center">
                  ISO 9001:2015
                </p>
                <p className="text-xs text-gray-500 mt-1">Quality Management</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-white rounded-lg flex flex-col items-center justify-center p-4">
                <Award className="w-12 h-12 text-green-600 mb-2" />
                <p className="text-sm font-semibold text-center">
                  Green Industry
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Level 3 Certification
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-white rounded-lg flex flex-col items-center justify-center p-4">
                <Star className="w-12 h-12 text-yellow-500 mb-2" />
                <p className="text-sm font-semibold text-center">
                  SGS Certified
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  International Standard
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-white rounded-lg flex flex-col items-center justify-center p-4">
                <Award className="w-12 h-12 text-purple-600 mb-2" />
                <p className="text-sm font-semibold text-center">
                  FSC® Certified
                </p>
                <p className="text-xs text-gray-500 mt-1">Forest Stewardship</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-white rounded-lg flex flex-col items-center justify-center p-4">
                <Trophy className="w-12 h-12 text-red-600 mb-2" />
                <p className="text-sm font-semibold text-center">TBFST Award</p>
                <p className="text-xs text-gray-500 mt-1">Excellence Award</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-white rounded-lg flex flex-col items-center justify-center p-4">
                <Shield className="w-12 h-12 text-indigo-600 mb-2" />
                <p className="text-sm font-semibold text-center">
                  GMP Certified
                </p>
                <p className="text-xs text-gray-500 mt-1">Good Manufacturing</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-white rounded-lg flex flex-col items-center justify-center p-4">
                <Award className="w-12 h-12 text-orange-600 mb-2" />
                <p className="text-sm font-semibold text-center">
                  Best Performance
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supplier Award 2023
                </p>
              </div>
            </div>
          </div>

          {/* Additional Certifications */}
          <div className="mt-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-center text-gray-800 mb-6">
              ใบรับรองและรางวัลเกียรติยศ
            </h3>
            <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
              <img
                src="images/certifications/awards-collage.png"
                alt="ใบรับรองและรางวัลต่างๆ ของบริษัท ไทยแพคเก็จจิ้ง แอนด์ พริ้นติ้ง"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-sm sm:text-base font-medium text-center">
                  มาตรฐานสากล ISO | Q Mark | รางวัล CSR | การรับรองคุณภาพ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            ร่วมเป็นส่วนหนึ่งของความสำเร็จ
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            TPP พร้อมเป็นพันธมิตรที่ดีในการสร้างสรรค์บรรจุภัณฑ์คุณภาพสูง
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300">
            ติดต่อเรา
          </button>
        </div>
      </div>
    </div>
  );
};

export default AwardsPage;
