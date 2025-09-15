"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Machine = {
  id: number;
  name: string;
  power: number;
  speed: string;
  precision: string;
  image?: string;
};

type MachineCategory = "prePress" | "printing" | "postPress" | "specialty";

const MachinesShowcase = () => {
  const [activeCategory, setActiveCategory] = useState<"all" | MachineCategory>(
    "all"
  );
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  const machines: Record<MachineCategory, Machine[]> = {
    prePress: [
      {
        id: 1,
        name: "Sample Box Cutting Machine",
        power: 85,
        speed: "150 pcs/min",
        precision: "±0.1mm",
        image: "/images/machine1.jpg",
      },
      {
        id: 2,
        name: "Computer-to-Plate (CTP)",
        power: 95,
        speed: "30 plates/hr",
        precision: "2400 dpi",
        image: "/images/machine2.jpg",
      },
    ],
    printing: [
      {
        id: 3,
        name: "5-Colors Printing Machine",
        power: 88,
        speed: "12,000 sph",
        precision: "±0.05mm",
        image: "/images/machine3.jpg",
      },
      {
        id: 4,
        name: "6-Colors Printing Machine",
        power: 90,
        speed: "15,000 sph",
        precision: "±0.03mm",
        image: "/images/machine4.jpg",
      },
      {
        id: 5,
        name: "8-Colors Printing Machine",
        power: 98,
        speed: "18,000 sph",
        precision: "±0.02mm",
        image: "/images/machine5.jpg",
      },
    ],
    postPress: [
      {
        id: 6,
        name: "Die Cutting Machine",
        power: 92,
        speed: "7,500 sph",
        precision: "±0.1mm",
        image: "/images/machine6.jpg",
      },
      {
        id: 7,
        name: "Auto Gluing Machine",
        power: 87,
        speed: "25,000 pcs/hr",
        precision: "±0.2mm",
        image: "/images/machine7.jpg",
      },
      {
        id: 8,
        name: "Laminating Machine",
        power: 85,
        speed: "50 m/min",
        precision: "Uniform",
        image: "/images/machine8.jpg",
      },
      {
        id: 9,
        name: "Hologram Sticker Machine",
        power: 93,
        speed: "80 m/min",
        precision: "High-def",
        image: "/images/machine9.jpg",
      },
    ],
    specialty: [
      {
        id: 10,
        name: "Corrugating Machine (B/E Flute)",
        power: 89,
        speed: "120 m/min",
        precision: "±0.15mm",
        image: "/images/machine10.jpg",
      },
      {
        id: 11,
        name: "Window Patching Machine",
        power: 86,
        speed: "8,000 sph",
        precision: "±0.2mm",
        image: "/images/machine11.jpg",
      },
      {
        id: 12,
        name: "Food Packaging Forming",
        power: 94,
        speed: "60 pcs/min",
        precision: "Food-grade",
        image: "/images/machine12.jpg",
      },
    ],
  };

  const categories: {
    key: "all" | MachineCategory;
    label: string;
    gradient: string;
  }[] = [
    { key: "all", label: "ทั้งหมด", gradient: "from-slate-600 to-slate-800" },
    {
      key: "prePress",
      label: "ก่อนพิมพ์",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      key: "printing",
      label: "งานพิมพ์",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      key: "postPress",
      label: "หลังพิมพ์",
      gradient: "from-rose-500 to-pink-600",
    },
    {
      key: "specialty",
      label: "พิเศษ",
      gradient: "from-violet-500 to-purple-600",
    },
  ];

  const getAllMachines = (): Machine[] => {
    if (activeCategory === "all") {
      return Object.values(machines).flat();
    }
    return machines[activeCategory as MachineCategory] || [];
  };

  const getGradientForMachine = (machineId: number) => {
    if (machineId <= 2) return "from-amber-400 to-orange-500";
    if (machineId <= 5) return "from-emerald-400 to-teal-500";
    if (machineId <= 9) return "from-rose-400 to-pink-500";
    return "from-violet-400 to-purple-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-green-50 to-yellow-50 rounded-full opacity-40 blur-3xl"></div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 lg:py-24 mt-[0.5in]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20">
          <h1 className="text-5xl lg:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
              ศักยภาพเครื่องจักร
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            เทคโนโลยีการผลิตระดับโลก พร้อมส่งมอบคุณภาพสูงสุดในทุกกระบวนการ
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-2 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <motion.button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isActive
                      ? "text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900"
                  }`}>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute inset-0 bg-gradient-to-r ${cat.gradient} rounded-xl`}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Machines Grid - Card Layout with Image Space */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <AnimatePresence mode="popLayout">
            {getAllMachines().map((machine, index) => (
              <motion.div
                key={machine.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedMachine(machine)}
                className="group cursor-pointer">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  {/* Card Layout with Two Columns */}
                  <div className="flex">
                    {/* Left Column - Text Content */}
                    <div className="flex-1 p-6">
                      {/* Machine Number Badge */}
                      <div
                        className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r ${getGradientForMachine(
                          machine.id
                        )} text-white font-bold text-sm mb-3`}>
                        {machine.id}
                      </div>

                      {/* Machine Name */}
                      <h3 className="text-lg font-bold text-gray-900 mb-4 leading-tight line-clamp-2">
                        {machine.name}
                      </h3>

                      {/* Specs */}
                      <div className="space-y-3">
                        <div>
                          <span className="text-xs text-gray-500 block">
                            ความเร็ว
                          </span>
                          <span className="text-sm font-semibold text-gray-700">
                            {machine.speed}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 block">
                            ความแม่นยำ
                          </span>
                          <span className="text-sm font-semibold text-gray-700">
                            {machine.precision}
                          </span>
                        </div>
                      </div>

                      {/* Power Meter */}
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600">
                            ประสิทธิภาพ
                          </span>
                          <span
                            className={`text-xs font-bold bg-gradient-to-r ${getGradientForMachine(
                              machine.id
                            )} bg-clip-text text-transparent`}>
                            {machine.power}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${machine.power}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className={`h-full bg-gradient-to-r ${getGradientForMachine(
                              machine.id
                            )} rounded-full`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Image Space */}
                    <div className="w-48 bg-gradient-to-br from-gray-100 to-gray-50 relative overflow-hidden">
                      {/* Image Placeholder Area */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {/* Decorative Circle Background */}
                        <div
                          className={`absolute w-32 h-32 bg-gradient-to-br ${getGradientForMachine(
                            machine.id
                          )} opacity-10 rounded-full blur-2xl`}></div>

                        {/* Image Container */}
                        <div className="relative w-full h-full flex items-center justify-center p-4">
                          {machine.image ? (
                            <img
                              src={machine.image}
                              alt={machine.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                e.currentTarget.nextElementSibling?.classList.remove(
                                  "hidden"
                                );
                              }}
                            />
                          ) : null}

                          {/* Fallback Pattern when no image */}
                          <div className={!machine.image ? "block" : "hidden"}>
                            <svg
                              width="120"
                              height="120"
                              viewBox="0 0 120 120"
                              className="opacity-20">
                              <rect
                                x="10"
                                y="30"
                                width="100"
                                height="60"
                                rx="4"
                                fill="currentColor"
                                className="text-gray-400"
                              />
                              <circle
                                cx="35"
                                cy="60"
                                r="8"
                                fill="currentColor"
                                className="text-gray-500"
                              />
                              <circle
                                cx="60"
                                cy="60"
                                r="8"
                                fill="currentColor"
                                className="text-gray-500"
                              />
                              <circle
                                cx="85"
                                cy="60"
                                r="8"
                                fill="currentColor"
                                className="text-gray-500"
                              />
                              <rect
                                x="25"
                                y="15"
                                width="70"
                                height="8"
                                rx="2"
                                fill="currentColor"
                                className="text-gray-400"
                              />
                              <rect
                                x="25"
                                y="97"
                                width="70"
                                height="8"
                                rx="2"
                                fill="currentColor"
                                className="text-gray-400"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Gradient Overlay for depth */}
                      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Bottom Action Bar */}
                  <div
                    className={`h-1 bg-gradient-to-r ${getGradientForMachine(
                      machine.id
                    )} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Modal for Selected Machine (Optional) */}
        <AnimatePresence>
          {selectedMachine && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedMachine(null)}>
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col md:flex-row">
                  {/* Image Section */}
                  <div className="md:w-1/2 h-64 md:h-auto bg-gradient-to-br from-gray-100 to-gray-50 p-8 flex items-center justify-center">
                    {selectedMachine.image ? (
                      <img
                        src={selectedMachine.image}
                        alt={selectedMachine.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="text-gray-400">
                        <svg
                          width="200"
                          height="200"
                          viewBox="0 0 120 120"
                          className="opacity-20">
                          <rect
                            x="10"
                            y="30"
                            width="100"
                            height="60"
                            rx="4"
                            fill="currentColor"
                          />
                          <circle
                            cx="35"
                            cy="60"
                            r="8"
                            fill="currentColor"
                            className="text-gray-500"
                          />
                          <circle
                            cx="60"
                            cy="60"
                            r="8"
                            fill="currentColor"
                            className="text-gray-500"
                          />
                          <circle
                            cx="85"
                            cy="60"
                            r="8"
                            fill="currentColor"
                            className="text-gray-500"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="md:w-1/2 p-8">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${getGradientForMachine(
                        selectedMachine.id
                      )} text-white font-bold text-lg mb-4`}>
                      {selectedMachine.id}
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      {selectedMachine.name}
                    </h2>

                    <div className="space-y-4">
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600">ความเร็ว</span>
                        <span className="font-semibold text-gray-900">
                          {selectedMachine.speed}
                        </span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600">ความแม่นยำ</span>
                        <span className="font-semibold text-gray-900">
                          {selectedMachine.precision}
                        </span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600">ประสิทธิภาพ</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${getGradientForMachine(
                                selectedMachine.id
                              )} rounded-full`}
                              style={{ width: `${selectedMachine.power}%` }}
                            />
                          </div>
                          <span className="font-semibold text-gray-900">
                            {selectedMachine.power}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedMachine(null)}
                      className={`mt-8 w-full py-3 bg-gradient-to-r ${getGradientForMachine(
                        selectedMachine.id
                      )} text-white font-semibold rounded-xl hover:opacity-90 transition-opacity`}>
                      ปิด
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MachinesShowcase;
