import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./index.css";

// Helper to generate a single new data point
const generateNewPoint = (index) => {
  const now = new Date();
  const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

  const tempPV = 900 + index * 0.1 + (Math.random() * 10 - 5);
  const cpPV =
    0.85 + (Math.random() > 0.9 ? -0.05 : Math.random() * 0.04 - 0.02);
  const oilPV =
    65 + (Math.random() > 0.95 ? Math.random() * 5 : Math.random() * 2 - 1);

  return {
    time: timeStr,
    tempPV: parseFloat(tempPV.toFixed(1)),
    tempSP: 920,
    cpPV: parseFloat(cpPV.toFixed(3)),
    cpSP: 0.85,
    oilPV: parseFloat(oilPV.toFixed(1)),
    oilSP: 65,
  };
};

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [data, setData] = useState(() => {
    const initialData = [];
    for (let i = 0; i < 40; i++) {
      initialData.push(generateNewPoint(i));
    }
    return initialData;
  });

  const themeColors = {
    grid: darkMode ? "#414755" : "#e2e8f0",
    tick: darkMode ? "#c1c6d7" : "#64748b",
    tooltipBg: darkMode ? "#212a3d" : "#ffffff",
    tooltipBorder: darkMode ? "#414755" : "#cbd5e1",
    tooltipText: darkMode ? "#dae2fc" : "#0f172a",
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Telemetry Update Effect - 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const nextData = [
          ...prevData.slice(1),
          generateNewPoint(prevData.length),
        ];
        return nextData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Clock Update Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`${darkMode ? "bg-background text-on-background" : "bg-slate-50 text-slate-900"} font-body-md text-body-md min-h-screen flex antialiased transition-colors duration-300`}
    >
      {/* SideNavBar */}
      <nav
        className={`${darkMode ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"} text-blue-500 text-sm uppercase tracking-wider left-0 ${isSidebarCollapsed ? "w-16" : "w-52"} border-r fixed top-0 h-full flex flex-col pt-14 pb-4 z-40 hidden md:flex transition-all duration-300`}
      >
        {/* Top Section - Unit Info */}
        <div
          className={`px-4 mb-4 flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-3"} overflow-hidden transition-all duration-300`}
        >
          <div
            className={`${darkMode ? "bg-surface-container-high border-outline-variant" : "bg-slate-100 border-slate-200"} w-8 h-8 rounded-full flex items-center justify-center border shrink-0 transition-colors`}
          >
            <span className="material-symbols-outlined text-primary text-lg">
              lens
            </span>
          </div>
          {!isSidebarCollapsed && (
            <div className="whitespace-nowrap">
              <div
                className={`font-headline-md text-headline-md ${darkMode ? "text-on-surface" : "text-slate-900"} font-bold`}
              >
                Unit 04
              </div>
              <div
                className={`font-label-sm text-label-sm ${darkMode ? "text-on-surface-variant" : "text-slate-500"} font-bold`}
              >
                Active | 1450°C
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div
          className={`flex-1 ${isSidebarCollapsed ? "px-2" : "px-2"} space-y-1 overflow-hidden`}
        >
          {[
            {
              id: "overview",
              icon: "dashboard",
              label: "Overview",
              active: true,
            },
            {
              id: "process",
              icon: "precision_manufacturing",
              label: "Process",
            },
            { id: "charges", icon: "inventory_2", label: "Charges" },
            { id: "analytics", icon: "monitoring", label: "Analytics" },
            { id: "logs", icon: "receipt_long", label: "Logs" },
          ].map((item) => (
            <a
              key={item.id}
              className={`flex items-center group relative transition-all duration-200 rounded-lg ${isSidebarCollapsed ? "justify-center py-3" : "gap-3 px-4 py-2.5"} 
                ${
                  item.active
                    ? darkMode
                      ? "bg-blue-500/10 text-blue-300 border-r-4 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                      : "bg-blue-50 text-blue-700 border-r-4 border-blue-600"
                    : darkMode
                      ? "text-on-surface-variant hover:text-on-surface hover:bg-slate-800"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                } font-bold`}
              href="#/"
            >
              <span
                className={`material-symbols-outlined ${isSidebarCollapsed ? "text-[24px]" : "text-[20px]"}`}
              >
                {item.icon}
              </span>
              {!isSidebarCollapsed && (
                <span className="text-[11px] uppercase tracking-wider whitespace-nowrap">
                  {item.label}
                </span>
              )}

              {/* Tooltip for Collapsed State */}
              {isSidebarCollapsed && (
                <div
                  className={`absolute left-full ml-4 px-2 py-1 rounded text-[10px] whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 ${darkMode ? "bg-slate-800 text-white border border-slate-700" : "bg-slate-900 text-white"}`}
                >
                  {item.label}
                </div>
              )}
            </a>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-auto px-2 space-y-1 pb-2">
          <div
            className={`h-px ${darkMode ? "bg-surface-highest" : "bg-slate-100"} my-2`}
          ></div>
          {[
            { id: "support", icon: "support_agent", label: "Support" },
            { id: "diagnostics", icon: "terminal", label: "Diagnostics" },
          ].map((item) => (
            <a
              key={item.id}
              className={`flex items-center group relative transition-all duration-200 rounded-lg ${isSidebarCollapsed ? "justify-center py-3" : "gap-3 px-4 py-2.5"} 
                ${darkMode ? "text-on-surface-variant hover:text-on-surface hover:bg-slate-800" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"} font-bold`}
              href="#/"
            >
              <span
                className={`material-symbols-outlined ${isSidebarCollapsed ? "text-[24px]" : "text-[20px]"}`}
              >
                {item.icon}
              </span>
              {!isSidebarCollapsed && (
                <span className="text-[11px] uppercase tracking-wider whitespace-nowrap">
                  {item.label}
                </span>
              )}

              {isSidebarCollapsed && (
                <div
                  className={`absolute left-full ml-4 px-2 py-1 rounded text-[10px] whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 ${darkMode ? "bg-slate-800 text-white border border-slate-700" : "bg-slate-900 text-white"}`}
                >
                  {item.label}
                </div>
              )}
            </a>
          ))}

          {/* Toggle Button */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`flex items-center w-full group relative transition-all duration-200 rounded-lg mt-2 ${isSidebarCollapsed ? "justify-center py-3" : "gap-3 px-4 py-2.5"} 
              ${darkMode ? "text-on-surface-variant hover:text-on-surface hover:bg-slate-800" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"} font-bold`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isSidebarCollapsed
                ? "side_navigation"
                : "keyboard_double_arrow_left"}
            </span>
            {!isSidebarCollapsed && (
              <span className="text-[11px] uppercase tracking-wider">
                Collapse Sidebar
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Main Content Wrapper */}
      <main
        className={`flex-1 flex flex-col ${isSidebarCollapsed ? "md:ml-16" : "md:ml-52"} w-full relative transition-all duration-300`}
      >
        {/* TopAppBar */}
        <header
          className={`${darkMode ? "bg-slate-950/90 border-slate-800 text-blue-500" : "bg-white/90 border-slate-200 text-blue-600"} backdrop-blur-md tracking-tight top-0 border-b fixed z-50 flex justify-between items-center px-6 h-11 w-full ${isSidebarCollapsed ? "md:w-[calc(100%-4rem)]" : "md:w-[calc(100%-13rem)]"} right-0 transition-all duration-300`}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-heartbeat shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              <span className="text-lg font-bold tracking-tighter text-blue-500">
                FURNACE CTRL-X
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {/* Operator Info */}
            <div
              className={`${darkMode ? "bg-blue-500/10 border-blue-500/30 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.2)]" : "bg-blue-50 border-blue-200 text-blue-700"} px-3 py-1 rounded border flex flex-col items-start leading-tight`}
            >
              <span className="text-[8px] uppercase tracking-widest opacity-70 font-bold">
                Authenticated System Access
              </span>
              <span className="text-[11px] font-bold tracking-wider">
                OPERATOR ID: 1000124876
              </span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex items-center gap-2 px-3 py-1 rounded border transition-all active:scale-95 group ${darkMode ? "bg-slate-900 border-slate-700 hover:border-blue-500/50" : "bg-slate-50 border-slate-200 hover:border-blue-400"}`}
            >
              <span
                className={`material-symbols-outlined text-[16px] ${darkMode ? "text-blue-400" : "text-blue-600"}`}
              >
                {darkMode ? "light_mode" : "dark_mode"}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? "text-on-surface" : "text-slate-700"}`}
              >
                {darkMode ? "Light Mode" : "Dark Mode"}
              </span>
            </button>

            {/* Time Info (UTC) */}
            <div
              className={`flex flex-col items-end leading-none ${darkMode ? "text-on-surface" : "text-slate-700"}`}
            >
              <div className="flex items-baseline gap-1">
                <span className="text-[14px] font-bold font-mono tracking-tighter">
                  {currentTime.getUTCHours().toString().padStart(2, "0")}:
                  {currentTime.getUTCMinutes().toString().padStart(2, "0")}:
                  {currentTime.getUTCSeconds().toString().padStart(2, "0")}
                </span>
                <span className="text-[9px] font-bold text-blue-500">UTC</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider font-bold opacity-60 mt-0.5">
                {currentTime.toUTCString().split(" ").slice(0, 4).join(" ")}
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Workspace */}
        <div className="pt-14 px-margin pb-10 flex flex-col gap-2 max-w-[1600px] mx-auto w-full">
          {/* Dashboard Specific Header - Industrial Control Bar */}
          <section
            className={`${darkMode ? "bg-gradient-to-b from-slate-900 to-slate-950 border-slate-800 shadow-lg" : "bg-white border-slate-200 shadow-md"} rounded-lg border flex flex-col xl:flex-row items-stretch w-full overflow-hidden transition-all duration-300`}
          >
            {/* 1. LEFT SECTION — SYSTEM IDENTITY */}
            <div
              className={`flex flex-col justify-center px-4 py-2 ${darkMode ? "bg-slate-900/80 border-slate-800" : "bg-slate-50 border-slate-200"} border-b xl:border-b-0 xl:border-r min-w-[160px] shrink-0 transition-colors`}
            >
              <h1
                className={`font-data-display text-2xl font-black ${darkMode ? "text-slate-100" : "text-slate-900"} leading-none mb-0.5`}
              >
                SQF1A
              </h1>
              <span
                className={`text-[9px] ${darkMode ? "text-blue-400" : "text-blue-600"} font-bold uppercase tracking-[0.15em]`}
              >
                Furnace Digital Twin
              </span>
            </div>

            {/* 2. CENTER SECTION — CHARGE INFO */}
            <div
              className={`flex items-center px-3 py-2 ${darkMode ? "border-slate-800" : "border-slate-200"} border-b xl:border-b-0 xl:border-r gap-1.5 flex-1 min-w-0 transition-colors`}
            >
              <div
                className={`flex flex-col justify-center px-3 py-1 ${darkMode ? "bg-slate-950/60 border-slate-800/60" : "bg-white border-slate-100"} rounded border flex-1 h-full transition-colors`}
              >
                <span
                  className={`text-[8px] ${darkMode ? "text-blue-500" : "text-blue-500"} font-bold uppercase tracking-widest mb-0.5`}
                >
                  Charge ID
                </span>
                <span
                  className={`font-mono text-[12px] ${darkMode ? "text-slate-200" : "text-slate-700"}`}
                >
                  RSQF001
                </span>
              </div>
              <div
                className={`flex flex-col justify-center px-3 py-1 ${darkMode ? "bg-slate-950/60 border-slate-800/60" : "bg-white border-slate-100"} rounded border flex-1 h-full transition-colors`}
              >
                <span
                  className={`text-[8px] ${darkMode ? "text-blue-500" : "text-blue-500"} font-bold uppercase tracking-widest mb-0.5`}
                >
                  Work Orders
                </span>
                <span
                  className={`font-mono text-[12px] ${darkMode ? "text-slate-200" : "text-slate-700"}`}
                >
                  5
                </span>
              </div>
              <div
                className={`flex flex-col justify-center px-3 py-1 ${darkMode ? "bg-blue-900/20 border-blue-800/40" : "bg-blue-50 border-blue-200"} rounded border flex-1 h-full relative overflow-hidden shrink-0 transition-colors`}
              >
                <div
                  className={`absolute top-0 left-0 w-1 h-full ${darkMode ? "bg-blue-500" : "bg-blue-600"}`}
                ></div>
                <span
                  className={`text-[8px] ${darkMode ? "text-blue-400" : "text-blue-600"} font-bold uppercase tracking-widest mb-0.5 pl-1`}
                >
                  Stage
                </span>
                <span
                  className={`font-mono text-[12px] ${darkMode ? "text-blue-300" : "text-blue-700"} font-bold pl-1`}
                >
                  FURNACE
                </span>
              </div>
            </div>

            {/* 3. MAIN HIGHLIGHT — CHARGE HEALTH */}
            <div
              className={`flex items-center gap-4 px-4 py-2 ${darkMode ? "bg-gradient-to-r from-green-950/40 via-green-900/20 to-green-950/40 border-slate-800" : "bg-green-50 border-slate-200"} border-b xl:border-b-0 xl:border-r shrink-0 transition-colors`}
            >
              <div
                className={`w-10 h-10 rounded-full ${darkMode ? "bg-green-500/10 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" : "bg-green-100 border-green-500"} border flex items-center justify-center relative shrink-0 transition-all`}
              >
                <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping"></div>
                <span
                  className={`material-symbols-outlined text-[24px] ${darkMode ? "text-green-400" : "text-green-600"}`}
                >
                  check_circle
                </span>
              </div>
              <div className="flex flex-col justify-center">
                <span
                  className={`text-[8px] ${darkMode ? "text-green-500" : "text-green-600"} font-black uppercase tracking-[0.15em]`}
                >
                  Charge Health
                </span>
                <span
                  className={`font-data-display text-lg font-black ${darkMode ? "text-green-400" : "text-green-600"} leading-none`}
                >
                  GREEN
                </span>
                <span
                  className={`text-[10px] ${darkMode ? "text-green-200/80" : "text-green-800"} font-medium`}
                >
                  In Control
                </span>
              </div>
            </div>

            {/* 4. RIGHT SECTION — STATUS INFO */}
            <div className="flex items-center px-3 py-2 gap-1.5 flex-1 min-w-0 transition-colors">
              <div
                className={`flex flex-col justify-center px-3 py-1 ${darkMode ? "bg-slate-950/60 border-slate-800/60" : "bg-white border-slate-100"} rounded border flex-1 h-full transition-colors`}
              >
                <span
                  className={`text-[8px] ${darkMode ? "text-on-surface-variant" : "text-slate-500"} font-bold uppercase tracking-widest mb-0.5`}
                >
                  Time Remaining
                </span>
                <span
                  className={`font-mono text-[12px] ${darkMode ? "text-on-surface" : "text-slate-700"} font-bold`}
                >
                  01:42:15{" "}
                  <span className="text-[9px] opacity-60">/ 05:00</span>
                </span>
              </div>
              <div
                className={`flex flex-col justify-center px-3 py-1 ${darkMode ? "bg-slate-950/60 border-slate-800/60" : "bg-white border-slate-100"} rounded border flex-1 h-full transition-colors`}
              >
                <span
                  className={`text-[8px] ${darkMode ? "text-on-surface-variant" : "text-slate-500"} font-bold uppercase tracking-widest mb-0.5`}
                >
                  Operator
                </span>
                <span
                  className={`font-mono text-[12px] ${darkMode ? "text-on-surface" : "text-slate-600"} font-bold`}
                >
                  OP-742
                </span>
              </div>
            </div>
          </section>

          {/* Main Grid */}
          <div className="grid grid-cols-12 gap-x-6 gap-y-gutter items-stretch">
            {/* LEFT COLUMN: Twin View & Controls */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-10 h-full">
              {/* Twin Schematic */}
              <div
                className={`${darkMode ? "bg-surface-container border-surface-variant" : "bg-white border-slate-200 shadow-md"} rounded-xl p-6 border flex flex-col transition-all duration-300`}
              >
                <div
                  className={`flex justify-between items-center mb-6 pb-2 border-b ${darkMode ? "border-surface-highest" : "border-slate-100"}`}
                >
                  <h2
                    className={`font-headline-md text-headline-md ${darkMode ? "text-on-surface" : "text-slate-900"} flex items-center gap-2`}
                  >
                    <span className="material-symbols-outlined text-secondary text-lg">
                      schema
                    </span>
                    Furnace Topology
                  </h2>
                  <span
                    className={`font-status-label text-status-label ${darkMode ? "bg-secondary/20 text-secondary" : "bg-secondary/10 text-secondary-600"} px-1.5 py-0.5 rounded`}
                  >
                    LIVE
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-center w-full mt-24 mb-12 px-1 relative">
                  {/* Gas Flow & Chimney Container */}
                  <div className="relative w-full">
                    {/* Top Pipe (Gas Flow) */}
                    <div className="absolute -top-12 left-4 w-3/4 flex flex-col z-0">
                      <div className="flex items-center gap-2 mb-0.5 pl-2">
                        <span className="text-[9px] font-bold text-cyan-400 tracking-wider">
                          GAS FLOW
                        </span>
                      </div>
                      <div className="h-3 bg-gradient-to-b from-slate-500 via-slate-400 to-slate-600 rounded-sm relative border border-slate-700 shadow-sm">
                        {/* Animated flow inside pipe */}
                        <div className="absolute inset-0 overflow-hidden rounded-sm">
                          <div className="w-[200%] h-full bg-[linear-gradient(90deg,transparent_25%,rgba(34,211,238,0.4)_50%,transparent_75%)] bg-[length:20px_100%] animate-[gas-flow-move_1s_linear_infinite]"></div>
                        </div>
                        {/* Arrow indicator */}
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-800 z-10 flex">
                          <span className="material-symbols-outlined text-[14px] font-black">
                            arrow_forward_ios
                          </span>
                        </div>
                      </div>
                      {/* Vertical connector down to furnace */}
                      <div className="w-4 h-10 bg-gradient-to-r from-slate-500 via-slate-400 to-slate-600 ml-8 border-x border-slate-700 relative z-0"></div>
                    </div>

                    {/* Chimney (Exhaust) */}
                    <div className="absolute -top-24 right-6 w-10 h-24 bg-gradient-to-r from-slate-700 via-slate-500 to-slate-800 rounded-t-sm border-x border-t border-slate-900 shadow-[4px_0_10px_rgba(0,0,0,0.5)] z-0 flex justify-center">
                      {/* Smoke animation */}
                      <div className="absolute -top-12 w-12 h-12 rounded-full bg-slate-400/20 blur-xl animate-[scale-pulse_3s_ease-out_infinite]"></div>
                    </div>

                    {/* MAIN FURNACE CYLINDER */}
                    <div
                      className={`relative w-full h-24 rounded-[1.5rem] border-2 shadow-[0_10px_25px_rgba(0,0,0,0.3),inset_0_0_15px_rgba(0,0,0,0.6)] flex z-10 isolate transition-all duration-300 ${darkMode ? "border-slate-950 bg-slate-900" : "border-slate-300 bg-slate-100"}`}
                    >
                      {/* Left End Cap */}
                      <div
                        className={`w-8 h-full rounded-l-[1.8rem] border-r shadow-[inset_-3px_0_8px_rgba(0,0,0,0.4)] z-20 ${darkMode ? "bg-gradient-to-r from-slate-800 via-slate-500 to-slate-800 border-slate-900/80" : "bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 border-slate-300"}`}
                      ></div>

                      {/* Furnace Body (Inner Chamber) */}
                      <div className="flex-1 h-full relative overflow-hidden flex bg-black">
                        {/* Outer Shell Specular Highlight */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/80 pointer-events-none z-40"></div>
                        <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-b from-white/20 to-transparent pointer-events-none z-40"></div>

                        {/* SVG Fire System */}
                        <svg
                          className="absolute inset-0 w-full h-full z-[15] pointer-events-none"
                          viewBox="0 0 444 96"
                          preserveAspectRatio="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <defs>
                            <filter
                              id="flameTurbulence"
                              x="-10%"
                              y="-10%"
                              width="120%"
                              height="120%"
                            >
                              <feTurbulence
                                type="turbulence"
                                baseFrequency="0.018 0.045"
                                numOctaves="4"
                                seed="3"
                                result="noise"
                              >
                                <animate
                                  attributeName="baseFrequency"
                                  values="0.018 0.045;0.022 0.06;0.014 0.04;0.018 0.045"
                                  dur="3s"
                                  repeatCount="indefinite"
                                />
                              </feTurbulence>
                              <feDisplacementMap
                                in="SourceGraphic"
                                in2="noise"
                                scale="10"
                                xChannelSelector="R"
                                yChannelSelector="G"
                              />
                            </filter>
                            <filter id="emberGlow">
                              <feGaussianBlur stdDeviation="2" result="blur" />
                              <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>

                            {/* Flame gradient: white-hot base → yellow → orange → red → transparent tip */}
                            <linearGradient
                              id="fg1"
                              x1="0"
                              y1="1"
                              x2="0"
                              y2="0"
                            >
                              <stop
                                offset="0%"
                                stopColor="#fff9e0"
                                stopOpacity="1"
                              />
                              <stop
                                offset="12%"
                                stopColor="#ffe44d"
                                stopOpacity="0.98"
                              />
                              <stop
                                offset="38%"
                                stopColor="#ff7700"
                                stopOpacity="0.9"
                              />
                              <stop
                                offset="68%"
                                stopColor="#cc1e00"
                                stopOpacity="0.65"
                              />
                              <stop
                                offset="100%"
                                stopColor="#550000"
                                stopOpacity="0"
                              />
                            </linearGradient>
                            <linearGradient
                              id="fg2"
                              x1="0"
                              y1="1"
                              x2="0"
                              y2="0"
                            >
                              <stop
                                offset="0%"
                                stopColor="#ffdd44"
                                stopOpacity="0.95"
                              />
                              <stop
                                offset="30%"
                                stopColor="#ff5500"
                                stopOpacity="0.8"
                              />
                              <stop
                                offset="65%"
                                stopColor="#aa1100"
                                stopOpacity="0.45"
                              />
                              <stop
                                offset="100%"
                                stopColor="#440000"
                                stopOpacity="0"
                              />
                            </linearGradient>
                            <linearGradient
                              id="fg3"
                              x1="0"
                              y1="1"
                              x2="0"
                              y2="0"
                            >
                              <stop
                                offset="0%"
                                stopColor="#ffee77"
                                stopOpacity="0.85"
                              />
                              <stop
                                offset="35%"
                                stopColor="#ff6600"
                                stopOpacity="0.6"
                              />
                              <stop
                                offset="75%"
                                stopColor="#880000"
                                stopOpacity="0.25"
                              />
                              <stop
                                offset="100%"
                                stopColor="#330000"
                                stopOpacity="0"
                              />
                            </linearGradient>

                            {/* Hot floor glow */}
                            <radialGradient
                              id="floorHeat"
                              cx="50%"
                              cy="100%"
                              r="65%"
                            >
                              <stop
                                offset="0%"
                                stopColor="#ff7700"
                                stopOpacity="0.95"
                              />
                              <stop
                                offset="45%"
                                stopColor="#ff2200"
                                stopOpacity="0.55"
                              />
                              <stop
                                offset="100%"
                                stopColor="#660000"
                                stopOpacity="0"
                              />
                            </radialGradient>

                            {/* Ambient orange fill */}
                            <radialGradient
                              id="ambHeat"
                              cx="50%"
                              cy="55%"
                              r="55%"
                            >
                              <stop
                                offset="0%"
                                stopColor="#ff4400"
                                stopOpacity="0.3"
                              />
                              <stop
                                offset="100%"
                                stopColor="#110000"
                                stopOpacity="0.05"
                              />
                            </radialGradient>
                          </defs>

                          {/* Base ambient glow */}
                          <rect
                            x="0"
                            y="0"
                            width="444"
                            height="96"
                            fill="url(#ambHeat)"
                          />

                          {/* Hot brick floor */}
                          <rect
                            x="0"
                            y="70"
                            width="444"
                            height="26"
                            fill="url(#floorHeat)"
                          />

                          {/* ── TIER 1: Wide hot base flames ── */}
                          <g filter="url(#flameTurbulence)" opacity="0.97">
                            <path fill="url(#fg1)">
                              <animate
                                attributeName="d"
                                values="M0,96 C30,96 38,42 55,22 C68,6 72,50 88,64 C100,74 104,96 130,96 Z;
                  M0,96 C28,96 36,37 53,17 C66,1 70,46 86,60 C98,70 102,96 130,96 Z;
                  M0,96 C32,96 40,46 57,26 C70,10 74,53 90,67 C102,77 106,96 130,96 Z;
                  M0,96 C30,96 38,42 55,22 C68,6 72,50 88,64 C100,74 104,96 130,96 Z"
                                dur="2.1s"
                                repeatCount="indefinite"
                              />
                            </path>
                            <path fill="url(#fg1)">
                              <animate
                                attributeName="d"
                                values="M110,96 C135,96 143,40 159,21 C171,7 175,51 191,64 C202,73 206,96 234,96 Z;
                  M110,96 C133,96 141,35 157,16 C169,2 173,47 189,60 C200,69 204,96 234,96 Z;
                  M110,96 C137,96 145,44 161,25 C173,11 177,54 193,67 C204,76 208,96 234,96 Z;
                  M110,96 C135,96 143,40 159,21 C171,7 175,51 191,64 C202,73 206,96 234,96 Z"
                                dur="1.85s"
                                repeatCount="indefinite"
                              />
                            </path>
                            <path fill="url(#fg1)">
                              <animate
                                attributeName="d"
                                values="M215,96 C240,96 248,38 265,19 C277,5 281,49 298,63 C309,72 313,96 344,96 Z;
                  M215,96 C238,96 246,44 263,25 C275,11 279,54 296,67 C307,76 311,96 344,96 Z;
                  M215,96 C242,96 250,35 267,16 C279,2 283,47 300,61 C311,70 315,96 344,96 Z;
                  M215,96 C240,96 248,38 265,19 C277,5 281,49 298,63 C309,72 313,96 344,96 Z"
                                dur="2.35s"
                                repeatCount="indefinite"
                              />
                            </path>
                            <path fill="url(#fg1)">
                              <animate
                                attributeName="d"
                                values="M320,96 C348,96 356,41 373,23 C385,9 389,53 406,66 C417,75 421,96 444,96 Z;
                  M320,96 C346,96 354,36 371,18 C383,4 387,49 404,62 C415,71 419,96 444,96 Z;
                  M320,96 C350,96 358,45 375,27 C387,13 391,56 408,69 C419,78 423,96 444,96 Z;
                  M320,96 C348,96 356,41 373,23 C385,9 389,53 406,66 C417,75 421,96 444,96 Z"
                                dur="2.0s"
                                repeatCount="indefinite"
                              />
                            </path>
                          </g>

                          {/* ── TIER 2: Mid-height secondary flames ── */}
                          <g filter="url(#flameTurbulence)" opacity="0.82">
                            <path fill="url(#fg2)">
                              <animate
                                attributeName="d"
                                values="M20,96 C42,96 50,58 62,42 C72,29 76,55 88,68 C96,77 100,96 120,96 Z;
                  M20,96 C40,96 48,53 60,38 C70,25 74,51 86,64 C94,73 98,96 120,96 Z;
                  M20,96 C44,96 52,62 64,46 C74,33 78,58 90,71 C98,80 102,96 120,96 Z;
                  M20,96 C42,96 50,58 62,42 C72,29 76,55 88,68 C96,77 100,96 120,96 Z"
                                dur="1.65s"
                                repeatCount="indefinite"
                              />
                            </path>
                            <path fill="url(#fg2)">
                              <animate
                                attributeName="d"
                                values="M148,96 C168,96 176,55 190,37 C200,23 204,57 218,70 C227,79 231,96 255,96 Z;
                  M148,96 C166,96 174,50 188,32 C198,18 202,53 216,66 C225,75 229,96 255,96 Z;
                  M148,96 C170,96 178,59 192,41 C202,27 206,60 220,73 C229,82 233,96 255,96 Z;
                  M148,96 C168,96 176,55 190,37 C200,23 204,57 218,70 C227,79 231,96 255,96 Z"
                                dur="2.05s"
                                repeatCount="indefinite"
                              />
                            </path>
                            <path fill="url(#fg2)">
                              <animate
                                attributeName="d"
                                values="M268,96 C290,96 298,52 314,34 C325,20 329,56 344,69 C354,78 358,96 382,96 Z;
                  M268,96 C288,96 296,47 312,30 C323,16 327,52 342,65 C352,74 356,96 382,96 Z;
                  M268,96 C292,96 300,56 316,38 C327,24 331,59 346,72 C356,81 360,96 382,96 Z;
                  M268,96 C290,96 298,52 314,34 C325,20 329,56 344,69 C354,78 358,96 382,96 Z"
                                dur="1.9s"
                                repeatCount="indefinite"
                              />
                            </path>
                            <path fill="url(#fg2)">
                              <animate
                                attributeName="d"
                                values="M378,96 C400,96 408,54 424,36 C435,22 439,58 454,71 C464,80 468,96 444,96 Z;
                  M378,96 C398,96 406,49 422,32 C433,18 437,54 452,67 C462,76 466,96 444,96 Z;
                  M378,96 C402,96 410,58 426,40 C437,26 441,61 456,74 C466,83 470,96 444,96 Z;
                  M378,96 C400,96 408,54 424,36 C435,22 439,58 454,71 C464,80 468,96 444,96 Z"
                                dur="2.2s"
                                repeatCount="indefinite"
                              />
                            </path>
                          </g>

                          {/* ── TIER 3: Tall thin spire flames ── */}
                          <g filter="url(#flameTurbulence)" opacity="0.68">
                            <path fill="url(#fg3)">
                              <animate
                                attributeName="d"
                                values="M70,96 C80,96 84,68 91,50 C96,36 99,62 106,76 C110,85 114,96 124,96 Z;
                  M70,96 C80,96 83,63 90,45 C95,31 98,58 105,72 C109,81 113,96 124,96 Z;
                  M70,96 C80,96 85,72 92,54 C97,40 100,65 107,79 C111,88 115,96 124,96 Z;
                  M70,96 C80,96 84,68 91,50 C96,36 99,62 106,76 C110,85 114,96 124,96 Z"
                                dur="1.45s"
                                repeatCount="indefinite"
                              />
                            </path>
                            <path fill="url(#fg3)">
                              <animate
                                attributeName="d"
                                values="M195,96 C205,96 209,65 218,46 C223,32 227,60 234,74 C239,84 243,96 255,96 Z;
                  M195,96 C205,96 208,60 217,41 C222,27 226,56 233,70 C238,80 242,96 255,96 Z;
                  M195,96 C205,96 210,69 219,50 C224,36 228,63 235,77 C240,87 244,96 255,96 Z;
                  M195,96 C205,96 209,65 218,46 C223,32 227,60 234,74 C239,84 243,96 255,96 Z"
                                dur="1.72s"
                                repeatCount="indefinite"
                              />
                            </path>
                            <path fill="url(#fg3)">
                              <animate
                                attributeName="d"
                                values="M308,96 C318,96 322,63 331,44 C336,30 340,59 347,73 C352,83 356,96 368,96 Z;
                  M308,96 C318,96 321,58 330,39 C335,25 339,55 346,69 C351,79 355,96 368,96 Z;
                  M308,96 C318,96 323,67 332,48 C337,34 341,62 348,76 C353,86 357,96 368,96 Z;
                  M308,96 C318,96 322,63 331,44 C336,30 340,59 347,73 C352,83 356,96 368,96 Z"
                                dur="2.0s"
                                repeatCount="indefinite"
                              />
                            </path>
                            <path fill="url(#fg3)">
                              <animate
                                attributeName="d"
                                values="M408,96 C418,96 422,62 431,43 C436,29 440,58 447,72 C452,82 456,96 444,96 Z;
                  M408,96 C418,96 421,57 430,38 C435,24 439,54 446,68 C451,78 455,96 444,96 Z;
                  M408,96 C418,96 423,66 432,47 C437,33 441,61 448,75 C453,85 457,96 444,96 Z;
                  M408,96 C418,96 422,62 431,43 C436,29 440,58 447,72 C452,82 456,96 444,96 Z"
                                dur="1.55s"
                                repeatCount="indefinite"
                              />
                            </path>
                          </g>

                          {/* ── TIER 4: Floating embers ── */}
                          <g filter="url(#emberGlow)">
                            <circle
                              cx="100"
                              cy="80"
                              r="2"
                              fill="#ffee88"
                              opacity="0.9"
                            >
                              <animate
                                attributeName="cy"
                                values="80;10;80"
                                dur="3.1s"
                                repeatCount="indefinite"
                              />
                              <animate
                                attributeName="cx"
                                values="100;108;100"
                                dur="3.1s"
                                repeatCount="indefinite"
                              />
                              <animate
                                attributeName="opacity"
                                values="0.9;0;0.9"
                                dur="3.1s"
                                repeatCount="indefinite"
                              />
                            </circle>
                            <circle
                              cx="220"
                              cy="75"
                              r="1.5"
                              fill="#ffcc55"
                              opacity="0.85"
                            >
                              <animate
                                attributeName="cy"
                                values="75;8;75"
                                dur="2.6s"
                                repeatCount="indefinite"
                                begin="0.6s"
                              />
                              <animate
                                attributeName="cx"
                                values="220;213;220"
                                dur="2.6s"
                                repeatCount="indefinite"
                                begin="0.6s"
                              />
                              <animate
                                attributeName="opacity"
                                values="0.85;0;0.85"
                                dur="2.6s"
                                repeatCount="indefinite"
                                begin="0.6s"
                              />
                            </circle>
                            <circle
                              cx="340"
                              cy="78"
                              r="2.5"
                              fill="#ffee66"
                              opacity="0.9"
                            >
                              <animate
                                attributeName="cy"
                                values="78;5;78"
                                dur="3.6s"
                                repeatCount="indefinite"
                                begin="1.1s"
                              />
                              <animate
                                attributeName="cx"
                                values="340;349;340"
                                dur="3.6s"
                                repeatCount="indefinite"
                                begin="1.1s"
                              />
                              <animate
                                attributeName="opacity"
                                values="0.9;0;0.9"
                                dur="3.6s"
                                repeatCount="indefinite"
                                begin="1.1s"
                              />
                            </circle>
                            <circle
                              cx="160"
                              cy="82"
                              r="1.5"
                              fill="#ffdd77"
                              opacity="0.8"
                            >
                              <animate
                                attributeName="cy"
                                values="82;18;82"
                                dur="2.9s"
                                repeatCount="indefinite"
                                begin="1.8s"
                              />
                              <animate
                                attributeName="cx"
                                values="160;153;160"
                                dur="2.9s"
                                repeatCount="indefinite"
                                begin="1.8s"
                              />
                              <animate
                                attributeName="opacity"
                                values="0.8;0;0.8"
                                dur="2.9s"
                                repeatCount="indefinite"
                                begin="1.8s"
                              />
                            </circle>
                            <circle
                              cx="400"
                              cy="76"
                              r="2"
                              fill="#ffbb44"
                              opacity="0.85"
                            >
                              <animate
                                attributeName="cy"
                                values="76;12;76"
                                dur="3.3s"
                                repeatCount="indefinite"
                                begin="0.4s"
                              />
                              <animate
                                attributeName="cx"
                                values="400;408;400"
                                dur="3.3s"
                                repeatCount="indefinite"
                                begin="0.4s"
                              />
                              <animate
                                attributeName="opacity"
                                values="0.85;0;0.85"
                                dur="3.3s"
                                repeatCount="indefinite"
                                begin="0.4s"
                              />
                            </circle>
                            <circle
                              cx="280"
                              cy="80"
                              r="1.8"
                              fill="#ffcc44"
                              opacity="0.8"
                            >
                              <animate
                                attributeName="cy"
                                values="80;15;80"
                                dur="2.75s"
                                repeatCount="indefinite"
                                begin="2.1s"
                              />
                              <animate
                                attributeName="cx"
                                values="280;274;280"
                                dur="2.75s"
                                repeatCount="indefinite"
                                begin="2.1s"
                              />
                              <animate
                                attributeName="opacity"
                                values="0.8;0;0.8"
                                dur="2.75s"
                                repeatCount="indefinite"
                                begin="2.1s"
                              />
                            </circle>
                          </g>
                        </svg>

                        {/* Heat distortion shimmer on top */}
                        <div className="absolute inset-0 z-[25] pointer-events-none">
                          <div className="heat-wave"></div>
                        </div>

                        {/* Zones */}
                        {[1, 2, 3, 4].map((zone, idx) => (
                          <div
                            key={zone}
                            className={`flex-1 relative flex items-center justify-center border-l ${idx === 0 ? "border-transparent" : "border-white/10 border-dashed"} z-30`}
                          >
                            {zone === 4 && (
                              <div className="absolute inset-0 bg-red-600/50 animate-pulse pointer-events-none mix-blend-multiply"></div>
                            )}
                            <div
                              className={`w-9 h-9 rounded-full border-2 flex items-center justify-center shadow-[0_0_20px_rgba(96,165,250,0.8)] backdrop-blur-md relative z-20 ${darkMode ? "bg-blue-900/90 border-blue-400" : "bg-blue-600 border-blue-300"}`}
                            >
                              <span className="text-blue-50 font-bold text-sm tracking-widest drop-shadow-md">
                                Z{zone}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Right End Cap */}
                      <div
                        className={`w-8 h-full rounded-r-[1.8rem] border-l shadow-[inset_3px_0_8px_rgba(0,0,0,0.4)] z-20 ${darkMode ? "bg-gradient-to-l from-slate-800 via-slate-500 to-slate-800 border-slate-900/80" : "bg-gradient-to-l from-slate-400 via-slate-200 to-slate-400 border-slate-300"}`}
                      ></div>
                    </div>
                  </div>

                  {/* ZONE DATA ROW BELOW FURNACE */}
                  <div className="w-full mt-20 flex justify-between bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-sm relative z-20">
                    {[
                      { z: 1, pv: 920, sp: 920, error: false },
                      { z: 2, pv: 921, sp: 920, error: false },
                      { z: 3, pv: 919, sp: 920, error: false },
                      { z: 4, pv: 935, sp: 920, error: true },
                    ].map((data, idx) => (
                      <div
                        key={data.z}
                        className={`flex-1 flex flex-col items-center justify-center ${idx !== 0 ? "border-l border-outline-variant/30" : ""}`}
                      >
                        <div className="text-[9px] text-on-surface-variant font-bold mb-0.5 uppercase tracking-wider">
                          Z{data.z}
                        </div>
                        <div
                          className={`text-base font-data-display font-bold leading-tight ${data.error ? "text-error animate-pulse" : "text-on-surface"}`}
                        >
                          {data.pv}°C
                        </div>
                        <div className="text-[9px] text-outline font-medium mt-0.5 opacity-70">
                          SP {data.sp}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Flow Panels Grid */}
              <div className="grid grid-cols-2 gap-gutter">
                <div className="bg-surface-container rounded-xl p-card-padding border border-surface-variant">
                  <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-2">
                    Carbon Potential
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="font-data-display text-data-display text-secondary">
                      0.85<span className="text-lg">%</span>
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-secondary h-full rounded-full w-[85%]"></div>
                  </div>
                </div>
                <div className="bg-surface-container rounded-xl p-card-padding border border-surface-variant">
                  <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-2">
                    Ammonia Flow
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="font-data-display text-data-display text-tertiary">
                      14.2<span className="text-lg"> L/m</span>
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-tertiary h-full rounded-full w-[60%]"></div>
                  </div>
                </div>
              </div>
            </div>
            {/* CENTER COLUMN: Charts & Process Params */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-4 h-full">
              <div className="flex flex-col gap-4 transition-all w-full flex-1">
                {/* Header (Top of Section) */}
                <div
                  className={`flex justify-between items-center pb-2 border-b ${darkMode ? "border-surface-highest" : "border-slate-100"}`}
                >
                  <h2
                    className={`font-headline-md text-headline-md ${darkMode ? "text-on-surface" : "text-slate-900"} flex items-center gap-2 uppercase tracking-wider`}
                  >
                    <span className="material-symbols-outlined text-primary text-lg">
                      tune
                    </span>
                    Process Parameters
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 mr-2">
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-0.5 bg-primary rounded-full"></div>
                        <span
                          className={`text-[10px] font-bold ${darkMode ? "text-on-surface-variant" : "text-slate-500"}`}
                        >
                          PV
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 border-t-2 border-dashed border-primary"></div>
                        <span
                          className={`text-[10px] font-bold ${darkMode ? "text-on-surface-variant" : "text-slate-500"}`}
                        >
                          SP
                        </span>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded border text-[10px] font-bold cursor-pointer transition-colors ${darkMode ? "bg-surface-container-high border-outline-variant text-on-surface" : "bg-white border-slate-200 text-slate-700"}`}
                    >
                      Last 2 hrs
                      <span className="material-symbols-outlined text-[14px]">
                        arrow_drop_down
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="flex flex-col gap-4 h-auto">
                  {/* 1. Temperature Card */}
                  <div
                    className={`${darkMode ? "bg-surface-container border-surface-variant" : "bg-white border-slate-200 shadow-sm"} rounded-xl p-3 border flex flex-col gap-3 relative overflow-hidden`}
                  >
                    <div className="flex justify-between items-center z-10 relative">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-widest ${darkMode ? "text-on-surface-variant" : "text-slate-500"}`}
                      >
                        Temperature
                      </span>
                      <div className="flex items-center gap-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-[10px] text-slate-500 font-bold">
                            SP
                          </span>
                          <span
                            className={`text-[14px] font-bold ${darkMode ? "text-on-surface" : "text-slate-900"}`}
                          >
                            {data[data.length - 1].tempSP}°C
                          </span>
                        </div>
                        <div
                          className="flex items-baseline gap-1"
                          key={`t-pv-${currentTime.getSeconds()}`}
                        >
                          <span className="text-[10px] text-slate-500 font-bold">
                            PV
                          </span>
                          <span
                            className={`text-[14px] font-bold animate-value-flash ${darkMode ? "text-on-surface" : "text-slate-900"}`}
                          >
                            {data[data.length - 1].tempPV}°C
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-[10px] text-slate-500 font-bold">
                            DEV
                          </span>
                          <span
                            className={`text-[14px] font-bold ${Math.abs(data[data.length - 1].tempPV - data[data.length - 1].tempSP) > 5 ? "text-yellow-500" : "text-green-500"}`}
                          >
                            {data[data.length - 1].tempPV -
                              data[data.length - 1].tempSP >
                            0
                              ? "+"
                              : ""}
                            {(
                              data[data.length - 1].tempPV -
                              data[data.length - 1].tempSP
                            ).toFixed(1)}
                            °C
                          </span>
                        </div>
                        <div
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase border ${Math.abs(data[data.length - 1].tempPV - data[data.length - 1].tempSP) > 5 ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/30" : "bg-green-500/10 text-green-500 border-green-500/30"}`}
                        >
                          {Math.abs(
                            data[data.length - 1].tempPV -
                              data[data.length - 1].tempSP,
                          ) > 5
                            ? "WARNING"
                            : "GOOD"}
                        </div>
                      </div>
                    </div>
                    <div className="h-[100px] w-full -ml-2 -mb-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={data}
                          margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={themeColors.grid}
                            vertical={false}
                            opacity={0.2}
                          />
                          <YAxis domain={["auto", "auto"]} hide />
                          <Line
                            type="monotone"
                            dataKey="tempPV"
                            stroke="#adc6ff"
                            strokeWidth={2}
                            dot={false}
                            isAnimationActive={true}
                            animationDuration={1500}
                          />
                          <Line
                            type="monotone"
                            dataKey="tempSP"
                            stroke="#adc6ff"
                            strokeWidth={1}
                            strokeDasharray="5 5"
                            dot={false}
                            isAnimationActive={true}
                            animationDuration={1500}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* 2. Carbon Potential Card */}
                  <div
                    className={`${darkMode ? "bg-surface-container border-surface-variant" : "bg-white border-slate-200 shadow-sm"} rounded-xl p-3 border flex flex-col gap-3 relative overflow-hidden`}
                  >
                    <div className="flex justify-between items-center z-10 relative">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-widest ${darkMode ? "text-on-surface-variant" : "text-slate-500"}`}
                      >
                        Carbon Potential
                      </span>
                      <div className="flex items-center gap-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-[10px] text-slate-500 font-bold">
                            SP
                          </span>
                          <span
                            className={`text-[14px] font-bold ${darkMode ? "text-on-surface" : "text-slate-900"}`}
                          >
                            {data[data.length - 1].cpSP}%
                          </span>
                        </div>
                        <div
                          className="flex items-baseline gap-1"
                          key={`cp-pv-${currentTime.getSeconds()}`}
                        >
                          <span className="text-[10px] text-slate-500 font-bold">
                            PV
                          </span>
                          <span
                            className={`text-[14px] font-bold animate-value-flash ${darkMode ? "text-on-surface" : "text-slate-900"}`}
                          >
                            {data[data.length - 1].cpPV}%
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-[10px] text-slate-500 font-bold">
                            DEV
                          </span>
                          <span
                            className={`text-[14px] font-bold ${Math.abs(data[data.length - 1].cpPV - data[data.length - 1].cpSP) > 0.05 ? "text-yellow-500" : "text-green-500"}`}
                          >
                            {data[data.length - 1].cpPV -
                              data[data.length - 1].cpSP >
                            0
                              ? "+"
                              : ""}
                            {(
                              data[data.length - 1].cpPV -
                              data[data.length - 1].cpSP
                            ).toFixed(2)}
                            %
                          </span>
                        </div>
                        <div
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase border ${Math.abs(data[data.length - 1].cpPV - data[data.length - 1].cpSP) > 0.05 ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/30" : "bg-green-500/10 text-green-500 border-green-500/30"}`}
                        >
                          {Math.abs(
                            data[data.length - 1].cpPV -
                              data[data.length - 1].cpSP,
                          ) > 0.05
                            ? "WARNING"
                            : "GOOD"}
                        </div>
                      </div>
                    </div>
                    <div className="h-[100px] w-full -ml-2 -mb-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={data}
                          margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={themeColors.grid}
                            vertical={false}
                            opacity={0.2}
                          />
                          <YAxis domain={["auto", "auto"]} hide />
                          <Line
                            type="monotone"
                            dataKey="cpPV"
                            stroke="#89ceff"
                            strokeWidth={2}
                            dot={false}
                            isAnimationActive={true}
                            animationDuration={1500}
                          />
                          <Line
                            type="monotone"
                            dataKey="cpSP"
                            stroke="#89ceff"
                            strokeWidth={1}
                            strokeDasharray="5 5"
                            dot={false}
                            isAnimationActive={true}
                            animationDuration={1500}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* 3. Quench Oil Temperature Card */}
                  <div
                    className={`${darkMode ? "bg-surface-container border-surface-variant" : "bg-white border-slate-200 shadow-sm"} rounded-xl p-3 border flex flex-col gap-3 relative overflow-hidden`}
                  >
                    <div className="flex justify-between items-center z-10 relative">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-widest ${darkMode ? "text-on-surface-variant" : "text-slate-500"}`}
                      >
                        Quench Oil Temperature
                      </span>
                      <div className="flex items-center gap-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-[10px] text-slate-500 font-bold">
                            SP
                          </span>
                          <span
                            className={`text-[14px] font-bold ${darkMode ? "text-on-surface" : "text-slate-900"}`}
                          >
                            {data[data.length - 1].oilSP}°C
                          </span>
                        </div>
                        <div
                          className="flex items-baseline gap-1"
                          key={`oil-pv-${currentTime.getSeconds()}`}
                        >
                          <span className="text-[10px] text-slate-500 font-bold">
                            PV
                          </span>
                          <span
                            className={`text-[14px] font-bold animate-value-flash ${darkMode ? "text-on-surface" : "text-slate-900"}`}
                          >
                            {data[data.length - 1].oilPV}°C
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-[10px] text-slate-500 font-bold">
                            DEV
                          </span>
                          <span
                            className={`text-[14px] font-bold ${Math.abs(data[data.length - 1].oilPV - data[data.length - 1].oilSP) > 2 ? "text-red-500" : "text-green-500"}`}
                          >
                            {data[data.length - 1].oilPV -
                              data[data.length - 1].oilSP >
                            0
                              ? "+"
                              : ""}
                            {(
                              data[data.length - 1].oilPV -
                              data[data.length - 1].oilSP
                            ).toFixed(1)}
                            °C
                          </span>
                        </div>
                        <div
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase border ${Math.abs(data[data.length - 1].oilPV - data[data.length - 1].oilSP) > 2 ? "bg-red-500/10 text-red-500 border-red-500/30" : "bg-green-500/10 text-green-500 border-green-500/30"}`}
                        >
                          {Math.abs(
                            data[data.length - 1].oilPV -
                              data[data.length - 1].oilSP,
                          ) > 2
                            ? "WARNING"
                            : "GOOD"}
                        </div>
                      </div>
                    </div>
                    <div className="h-[100px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={data}
                          margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={themeColors.grid}
                            vertical={false}
                            opacity={0.2}
                          />
                          <YAxis domain={["auto", "auto"]} hide />
                          <Line
                            type="monotone"
                            dataKey="oilPV"
                            stroke="#c0c1ff"
                            strokeWidth={2}
                            dot={false}
                            isAnimationActive={true}
                            animationDuration={1500}
                          />
                          <Line
                            type="monotone"
                            dataKey="oilSP"
                            stroke="#c0c1ff"
                            strokeWidth={1}
                            strokeDasharray="5 5"
                            dot={false}
                            isAnimationActive={true}
                            animationDuration={1500}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Quench System Status Strip */}
                <div className="flex flex-col mt-auto">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest mb-2 pl-1 ${darkMode ? "text-on-surface-variant" : "text-slate-500"}`}
                  >
                    Quench System Status
                  </span>
                  <div
                    className={`flex items-center justify-between rounded-xl px-2 py-4 border ${darkMode ? "bg-surface-container-highest border-surface-variant" : "bg-slate-100 border-slate-200"}`}
                  >
                    {/* Segment 1: Oil Temperature */}
                    <div className="flex items-center gap-2 flex-1 justify-center px-0.5">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${darkMode ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"}`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          thermostat
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={`text-[9px] uppercase font-bold tracking-widest whitespace-nowrap ${darkMode ? "text-on-surface-variant" : "text-slate-500"}`}
                        >
                          Oil Temp
                        </span>
                        <span
                          className={`text-lg font-bold leading-none mt-0.5 ${darkMode ? "text-white" : "text-slate-900"}`}
                        >
                          72°C
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-px h-10 shrink-0 ${darkMode ? "bg-outline-variant/30" : "bg-slate-300"}`}
                    ></div>

                    {/* Segment 2: Agitation */}
                    <div className="flex items-center gap-2 flex-1 justify-center px-0.5">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${darkMode ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-600"}`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          cyclone
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={`text-[9px] uppercase font-bold tracking-widest whitespace-nowrap ${darkMode ? "text-on-surface-variant" : "text-slate-500"}`}
                        >
                          Agitation
                        </span>
                        <span className="text-lg font-bold leading-none mt-0.5 text-green-500">
                          ON
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-px h-10 shrink-0 ${darkMode ? "bg-outline-variant/30" : "bg-slate-300"}`}
                    ></div>

                    {/* Segment 3: Oil Level */}
                    <div className="flex items-center gap-2 flex-1 justify-center px-0.5">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${darkMode ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-600"}`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          water_drop
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={`text-[9px] uppercase font-bold tracking-widest whitespace-nowrap ${darkMode ? "text-on-surface-variant" : "text-slate-500"}`}
                        >
                          Oil Level
                        </span>
                        <span className="text-lg font-bold leading-none mt-0.5 text-green-500">
                          OK
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-px h-10 shrink-0 ${darkMode ? "bg-outline-variant/30" : "bg-slate-300"}`}
                    ></div>

                    {/* Segment 4: Transfer Time */}
                    <div className="flex items-center gap-2 flex-1 justify-center px-0.5">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${darkMode ? "bg-slate-500/20 text-slate-400" : "bg-slate-200 text-slate-600"}`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          timer
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={`text-[9px] uppercase font-bold tracking-widest whitespace-nowrap ${darkMode ? "text-on-surface-variant" : "text-slate-500"}`}
                        >
                          Transfer Time
                        </span>
                        <span
                          className={`text-lg font-bold leading-none mt-0.5 ${darkMode ? "text-white" : "text-slate-900"}`}
                        >
                          8 sec
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* RIGHT COLUMN: Deviations & Predictions */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-gutter h-full">
              {/* Deviations List */}
              <div
                className={`${darkMode ? "bg-surface-container border-surface-variant" : "bg-white border-slate-200 shadow-md"} rounded-xl p-card-padding border transition-all`}
              >
                <div
                  className={`flex justify-between items-center mb-4 pb-2 border-b ${darkMode ? "border-surface-highest" : "border-slate-100"}`}
                >
                  <h2
                    className={`font-headline-md text-headline-md ${darkMode ? "text-on-surface" : "text-slate-900"} flex items-center gap-2`}
                  >
                    <span className="material-symbols-outlined text-error">
                      warning
                    </span>
                    Active Deviations
                  </h2>
                  <span
                    className={`font-status-label text-status-label px-2 py-0.5 rounded-full ${darkMode ? "bg-error/20 text-error" : "bg-red-100 text-red-600"}`}
                  >
                    2 ACTIVE
                  </span>
                </div>
                <div
                  className={`flex flex-col border rounded overflow-hidden ${darkMode ? "border-outline-variant/30 bg-surface-container-lowest" : "border-slate-200 bg-white"}`}
                >
                  {/* Row 1 */}
                  <div
                    className={`flex items-center gap-3 p-2 border-b transition-colors ${darkMode ? "border-outline-variant/30 hover:bg-surface-container-highest" : "border-slate-100 hover:bg-slate-50"}`}
                  >
                    {/* Left Side */}
                    <div className="w-1 self-stretch bg-red-500 rounded-full"></div>
                    <div className="flex-1 min-w-[120px]">
                      <div className="flex items-center justify-between mb-0.5">
                        <span
                          className={`font-label-sm font-bold ${darkMode ? "text-on-surface" : "text-slate-900"}`}
                        >
                          Temperature High – Zone 4
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${darkMode ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-red-50 text-red-600 border-red-200"}`}
                        >
                          HIGH
                        </span>
                      </div>
                      <div
                        className={`flex items-center gap-2 text-[11px] font-mono ${darkMode ? "text-on-surface" : "text-slate-600"}`}
                      >
                        <span>PV 935°C</span>
                        <span className="opacity-30">|</span>
                        <span>SP 920°C</span>
                        <span className="opacity-30">|</span>
                        <span
                          className={`${darkMode ? "text-red-400" : "text-red-600"} font-black`}
                        >
                          +15°C
                        </span>
                      </div>
                      <div
                        className={`text-[10px] ${darkMode ? "text-on-surface-variant" : "text-slate-500"} font-bold mt-0.5`}
                      >
                        Duration 00:02:45
                      </div>
                    </div>
                    {/* Right Side (Sparkline) */}
                    <div className="w-16 h-8 shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { v: 0 },
                            { v: 5 },
                            { v: 10 },
                            { v: 12 },
                            { v: 15 },
                          ]}
                        >
                          <Line
                            type="monotone"
                            dataKey="v"
                            stroke="#ef4444"
                            strokeWidth={1.5}
                            dot={false}
                            isAnimationActive={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div
                    className={`flex items-center gap-3 p-2 transition-colors ${darkMode ? "hover:bg-surface-container-highest" : "hover:bg-slate-50"}`}
                  >
                    {/* Left Side */}
                    <div className="w-1 self-stretch bg-yellow-400 rounded-full"></div>
                    <div className="flex-1 min-w-[120px]">
                      <div className="flex items-center justify-between mb-0.5">
                        <span
                          className={`font-label-sm font-bold ${darkMode ? "text-on-surface" : "text-slate-900"}`}
                        >
                          Carbon Potential Ripple
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${darkMode ? "bg-yellow-400/20 text-yellow-300 border-yellow-400/30" : "bg-yellow-50 text-yellow-600 border-yellow-200"}`}
                        >
                          MEDIUM
                        </span>
                      </div>
                      <div
                        className={`flex items-center gap-2 text-[11px] font-mono ${darkMode ? "text-on-surface-variant" : "text-slate-500"}`}
                      >
                        <span>PV 0.88%</span>
                        <span className="opacity-30">|</span>
                        <span>SP 0.85%</span>
                        <span className="opacity-30">|</span>
                        <span
                          className={`${darkMode ? "text-yellow-300" : "text-yellow-600"} font-bold`}
                        >
                          +0.03%
                        </span>
                      </div>
                      <div className="text-[10px] text-outline mt-0.5">
                        Duration 00:00:45
                      </div>
                    </div>
                    {/* Right Side (Sparkline) */}
                    <div className="w-16 h-8 shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { v: 0 },
                            { v: 1 },
                            { v: 0 },
                            { v: 2 },
                            { v: 3 },
                          ]}
                        >
                          <Line
                            type="monotone"
                            dataKey="v"
                            stroke="#facc15"
                            strokeWidth={1.5}
                            dot={false}
                            isAnimationActive={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
              {/* Prediction Panel */}
              <div className="flex flex-col gap-4 mt-2">
                {/* Prediction Alert Box */}
                <div
                  className={`${darkMode ? "bg-surface-container-lowest border-primary/30" : "bg-white border-primary/40"} rounded-lg border overflow-hidden shadow-[0_0_15px_rgba(0,122,255,0.05)] flex flex-col transition-all`}
                >
                  {/* Header Bar */}
                  <div
                    className={`${darkMode ? "bg-primary/20 border-primary/30" : "bg-primary/10 border-primary/20"} border-b px-3 py-2 flex items-center gap-2 transition-colors`}
                  >
                    <span className="material-symbols-outlined text-primary text-sm">
                      psychiatry
                    </span>
                    <h2 className="font-bold text-[11px] text-primary tracking-widest uppercase">
                      Prediction
                    </h2>
                  </div>

                  {/* Content Area */}
                  <div className="p-3 flex gap-2 items-center">
                    {/* Left: Message & Reason */}
                    <div className="flex-1 flex flex-col gap-2">
                      <p className="text-[15px] font-bold text-on-surface leading-tight">
                        Charge likely to become{" "}
                        <span className="text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">
                          RED
                        </span>{" "}
                        in{" "}
                        <span className="text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">
                          06 minutes
                        </span>
                      </p>
                      <p className="text-[11px] text-on-surface-variant leading-snug">
                        Reason: Temperature trending high in Zone 2 and Carbon
                        Potential low
                      </p>
                    </div>

                    {/* Right: Circular Gauge */}
                    <div className="flex flex-col items-center justify-center shrink-0 w-20">
                      <div className="w-12 h-12 relative flex items-center justify-center mb-1">
                        <svg
                          className="w-full h-full transform -rotate-90"
                          viewBox="0 0 36 36"
                        >
                          {/* Background Circle */}
                          <path
                            className="text-surface-highest"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          />
                          {/* Progress Circle (78%) */}
                          <path
                            className="text-primary"
                            strokeDasharray="78, 100"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-[12px] font-bold text-on-surface leading-none">
                            78<span className="text-[8px]">%</span>
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] text-outline uppercase tracking-wider font-bold">
                        Confidence
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recommended Actions */}
                <div
                  className={`${darkMode ? "bg-surface-container border-surface-variant" : "bg-white border-slate-200"} rounded-lg border p-3 flex flex-col gap-2 transition-all`}
                >
                  <h3
                    className={`font-bold text-[10px] ${darkMode ? "text-on-surface" : "text-slate-900"} tracking-widest uppercase border-b ${darkMode ? "border-surface-highest" : "border-slate-100"} pb-2 mb-1`}
                  >
                    Recommended Actions
                  </h3>

                  <div className="flex flex-col gap-1.5">
                    <label className="flex items-start gap-2 cursor-pointer group">
                      <div
                        className={`w-4 h-4 rounded border ${darkMode ? "border-outline-variant bg-surface-container-lowest" : "border-slate-300 bg-slate-50"} group-hover:border-primary flex items-center justify-center mt-0.5 shrink-0 transition-colors`}
                      >
                        <span className="material-symbols-outlined text-[12px] text-transparent group-hover:text-primary">
                          check
                        </span>
                      </div>
                      <span
                        className={`text-[13px] font-medium ${darkMode ? "text-on-surface" : "text-slate-800"}`}
                      >
                        Reduce furnace setpoint by 10°C
                      </span>
                    </label>
                    <label className="flex items-start gap-2 cursor-pointer group">
                      <div
                        className={`w-4 h-4 rounded border ${darkMode ? "border-outline-variant bg-surface-container-lowest" : "border-slate-300 bg-slate-50"} group-hover:border-primary flex items-center justify-center mt-0.5 shrink-0 transition-colors`}
                      >
                        <span className="material-symbols-outlined text-[12px] text-transparent group-hover:text-primary">
                          check
                        </span>
                      </div>
                      <span
                        className={`text-[13px] font-medium ${darkMode ? "text-on-surface" : "text-slate-800"}`}
                      >
                        Check ammonia flow control valve
                      </span>
                    </label>
                    <label className="flex items-start gap-2 cursor-pointer group">
                      <div
                        className={`w-4 h-4 rounded border ${darkMode ? "border-outline-variant bg-surface-container-lowest" : "border-slate-300 bg-slate-50"} group-hover:border-primary flex items-center justify-center mt-0.5 shrink-0 transition-colors`}
                      >
                        <span className="material-symbols-outlined text-[12px] text-transparent group-hover:text-primary">
                          check
                        </span>
                      </div>
                      <span
                        className={`text-[13px] font-medium ${darkMode ? "text-on-surface" : "text-slate-800"}`}
                      >
                        Verify gas carburizing flow
                      </span>
                    </label>
                  </div>

                  <div className="mt-1 flex justify-end">
                    <button className="px-2 py-1 border border-primary/50 text-primary hover:bg-primary/10 rounded text-[10px] font-bold uppercase tracking-wider transition-colors">
                      View All Actions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* BOTTOM SECTION: Process Timeline & KPIs */}
          <div className="flex flex-col gap-gutter mt-1">
            {/* Process Timeline */}
            <div
              className={`${darkMode ? "bg-surface-container border-surface-variant" : "bg-white border-slate-200 shadow-md"} rounded-xl p-6 border flex flex-col gap-6 transition-all`}
            >
              {/* TOP ROW: Process Stages & Total Cycle Time */}
              <div className="flex justify-between items-start">
                {/* Stages Flow */}
                <div className="flex items-center flex-1 pr-4">
                  {/* Prewash */}
                  <div className="flex flex-col items-center text-center">
                    <span className="material-symbols-outlined text-[14px] text-green-500 mb-0.5">
                      check_circle
                    </span>
                    <span
                      className={`font-bold text-[10px] ${darkMode ? "text-on-surface-variant" : "text-slate-600"} uppercase tracking-wider mb-0.5`}
                    >
                      Prewash
                    </span>
                    <span className="text-[9px] text-outline font-mono">
                      00:20 / 00:20
                    </span>
                  </div>
                  <div className="flex-1 mx-1.5 border-t border-outline-variant/30 relative min-w-[15px]"></div>

                  {/* Furnace (ACTIVE) */}
                  <div
                    className={`flex flex-col items-center text-center ${darkMode ? "bg-primary/10 border-primary/30" : "bg-blue-50 border-blue-200"} border px-2 py-1 rounded relative shrink-0 transition-colors`}
                  >
                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                    <span
                      className={`material-symbols-outlined text-[14px] text-primary mb-0.5`}
                    >
                      local_fire_department
                    </span>
                    <span className="font-bold text-[10px] text-primary uppercase tracking-wider mb-0.5">
                      Furnace
                    </span>
                    <span className="text-[9px] text-primary font-mono">
                      02:57 / 03:30
                    </span>
                  </div>
                  <div className="flex-1 mx-1.5 border-t border-outline-variant/20 relative min-w-[15px]"></div>

                  {/* Quench */}
                  <div className="flex flex-col items-center text-center opacity-50 shrink-0">
                    <span className="material-symbols-outlined text-[14px] text-outline-variant mb-0.5">
                      ac_unit
                    </span>
                    <span
                      className={`font-bold text-[10px] ${darkMode ? "text-on-surface-variant" : "text-slate-600"} uppercase tracking-wider mb-0.5`}
                    >
                      Quench
                    </span>
                    <span className="text-[9px] text-outline font-mono">
                      00:00 / 00:30
                    </span>
                  </div>
                  <div className="flex-1 mx-1.5 border-t border-outline-variant/20 relative min-w-[15px]"></div>

                  {/* Temper */}
                  <div className="flex flex-col items-center text-center opacity-50 shrink-0">
                    <span className="material-symbols-outlined text-[14px] text-outline-variant mb-0.5">
                      waves
                    </span>
                    <span
                      className={`font-bold text-[10px] ${darkMode ? "text-on-surface-variant" : "text-slate-600"} uppercase tracking-wider mb-0.5`}
                    >
                      Temper
                    </span>
                    <span className="text-[9px] text-outline font-mono">
                      00:00 / 01:00
                    </span>
                  </div>
                </div>

                {/* Total Cycle Time */}
                <div
                  className={`flex flex-col items-end pl-4 border-l shrink-0 ${darkMode ? "border-surface-highest" : "border-slate-100"}`}
                >
                  <span className="font-bold text-[9px] text-outline uppercase tracking-widest mb-0.5">
                    Cycle Time
                  </span>
                  <span
                    className={`font-data-display text-lg ${darkMode ? "text-on-surface" : "text-slate-900"} leading-none`}
                  >
                    03:17 <span className="text-outline text-xs">/ 05:20</span>
                  </span>
                </div>
              </div>
              {/* MAIN TIMELINE BAR */}
              <div className="flex flex-col mt-3 relative">
                {/* Vertical Grid Lines Background */}
                <div className="absolute inset-0 flex justify-between px-5 pointer-events-none">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`w-[1px] h-full ${darkMode ? "bg-surface-highest/50" : "bg-slate-200"}`}
                    ></div>
                  ))}
                </div>

                {/* Timeline Graph */}
                <div className="relative w-full h-10 flex items-center px-5">
                  {/* Base Line */}
                  <div className="absolute left-0 right-0 h-[2px] bg-surface-highest"></div>

                  {/* Progress Line Segments */}
                  {/* Green (16:00 - 18:00) 0% to 40% */}
                  <div className="absolute left-0 w-[40%] h-[2px] bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>

                  {/* Yellow (18:00 - 18:45) 40% to 55% */}
                  <div className="absolute left-[40%] w-[15%] h-[2px] bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.4)]"></div>

                  {/* Red (18:45 - 19:00) 55% to 60% */}
                  <div className="absolute left-[55%] w-[5%] h-[2px] bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"></div>

                  {/* Markers (Aligned with time) */}
                  {/* Green Markers at 16:30, 17:15, 17:50 */}
                  <div className="absolute left-[10%] w-2.5 h-2.5 rounded-full bg-green-500 border border-surface-container shadow-[0_0_5px_rgba(34,197,94,0.8)] -translate-x-1/2 -translate-y-1/2 top-1/2 z-10"></div>
                  <div className="absolute left-[25%] w-2.5 h-2.5 rounded-full bg-green-500 border border-surface-container shadow-[0_0_5px_rgba(34,197,94,0.8)] -translate-x-1/2 -translate-y-1/2 top-1/2 z-10"></div>
                  <div className="absolute left-[37%] w-2.5 h-2.5 rounded-full bg-green-500 border border-surface-container shadow-[0_0_5px_rgba(34,197,94,0.8)] -translate-x-1/2 -translate-y-1/2 top-1/2 z-10"></div>

                  {/* Yellow Marker at 18:20 */}
                  <div className="absolute left-[46.6%] w-3 h-3 rounded-full bg-yellow-400 border-2 border-surface-container shadow-[0_0_8px_rgba(250,204,21,0.8)] -translate-x-1/2 -translate-y-1/2 top-1/2 z-10"></div>

                  {/* Red Marker at 18:55 */}
                  <div className="absolute left-[58.3%] w-3 h-3 rounded-full bg-red-500 border-2 border-surface-container shadow-[0_0_8px_rgba(239,68,68,0.8)] -translate-x-1/2 -translate-y-1/2 top-1/2 z-10 animate-pulse"></div>

                  {/* Current Head (At 19:00 - Exactly 60%) */}
                  <div className="absolute left-[60%] w-[3px] h-6 bg-primary shadow-[0_0_10px_rgba(173,198,255,1)] -translate-x-1/2 -translate-y-1/2 top-1/2 z-20 rounded-full">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full ring-2 ring-background"></div>
                  </div>
                </div>

                {/* Time Scale Labels - Perfectly Aligned */}
                <div className="flex justify-between w-full mt-4 px-5 text-[11px] text-on-surface-variant font-mono font-bold">
                  <span className="w-10 text-center -ml-5">16:00</span>
                  <span className="w-10 text-center">17:00</span>
                  <span className="w-10 text-center">18:00</span>
                  <span className="w-10 text-center">19:00</span>
                  <span className="w-10 text-center">20:00</span>
                  <span className="w-10 text-center -mr-5">21:00</span>
                </div>
              </div>

              {/* LEGEND */}
              <div
                className={`flex items-center gap-6 mt-2 border-t pt-4 ${darkMode ? "border-surface-highest" : "border-slate-100"}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider ${darkMode ? "text-on-surface" : "text-slate-700"}`}
                  >
                    Within Limit
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]"></div>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider ${darkMode ? "text-on-surface" : "text-slate-700"}`}
                  >
                    Warning
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse"></div>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider ${darkMode ? "text-on-surface" : "text-slate-700"}`}
                  >
                    Violation
                  </span>
                </div>
              </div>
            </div>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mt-10">
              {/* KPI 1 */}
              <div
                className={`${darkMode ? "bg-surface-container border-surface-variant" : "bg-white border-slate-200 shadow-sm"} rounded-xl p-card-padding border flex items-center gap-4 transition-all`}
              >
                <div
                  className={`w-10 h-10 rounded-full ${darkMode ? "bg-primary/10 border-primary/30" : "bg-blue-50 border-blue-200"} flex items-center justify-center`}
                >
                  <span className="material-symbols-outlined text-primary text-xl">
                    speed
                  </span>
                </div>
                <div
                  key={`util-${currentTime.getSeconds()}`}
                  className="flex flex-col animate-value-flash"
                >
                  <span
                    className={`font-label-sm text-[10px] ${darkMode ? "text-on-surface-variant" : "text-slate-500"} uppercase font-bold tracking-wider`}
                  >
                    Utilization
                  </span>
                  <span
                    className={`font-data-display text-2xl ${darkMode ? "text-on-surface" : "text-slate-900"} leading-none mt-0.5`}
                  >
                    {(
                      94 +
                      Math.sin(currentTime.getSeconds() / 5) * 0.8
                    ).toFixed(1)}
                    <span className="text-sm opacity-50">%</span>
                  </span>
                </div>
              </div>
              {/* KPI 2 */}
              <div
                className={`${darkMode ? "bg-surface-container border-surface-variant" : "bg-white border-slate-200 shadow-sm"} rounded-xl p-card-padding border flex items-center gap-4 transition-all`}
              >
                <div
                  className={`w-10 h-10 rounded-full ${darkMode ? "bg-secondary/10 border-secondary/30" : "bg-cyan-50 border-cyan-200"} flex items-center justify-center`}
                >
                  <span className="material-symbols-outlined text-secondary text-xl">
                    verified
                  </span>
                </div>
                <div className="flex flex-col">
                  <span
                    className={`font-label-sm text-[10px] ${darkMode ? "text-on-surface-variant" : "text-slate-500"} uppercase font-bold tracking-wider`}
                  >
                    Quality Score
                  </span>
                  <span
                    className={`font-data-display text-2xl ${darkMode ? "text-on-surface" : "text-slate-900"} leading-none mt-0.5`}
                  >
                    99.8<span className="text-sm opacity-50">%</span>
                  </span>
                </div>
              </div>
              {/* KPI 3 */}
              <div
                className={`${darkMode ? "bg-surface-container border-surface-variant" : "bg-white border-slate-200 shadow-sm"} rounded-xl p-card-padding border flex items-center gap-4 transition-all`}
              >
                <div
                  className={`w-10 h-10 rounded-full ${darkMode ? "bg-tertiary/10 border-tertiary/30" : "bg-indigo-50 border-indigo-200"} flex items-center justify-center`}
                >
                  <span className="material-symbols-outlined text-tertiary text-xl">
                    bolt
                  </span>
                </div>
                <div
                  key={`energy-${currentTime.getSeconds()}`}
                  className="flex flex-col w-full animate-value-flash"
                >
                  <span
                    className={`font-label-sm text-[10px] ${darkMode ? "text-on-surface-variant" : "text-slate-500"} uppercase font-bold tracking-wider flex justify-between`}
                  >
                    Energy{" "}
                    <span className="text-tertiary font-black">
                      +
                      {(
                        2 +
                        Math.sin(currentTime.getSeconds() / 2) * 0.5
                      ).toFixed(1)}
                      %
                    </span>
                  </span>
                  <span
                    className={`font-data-display text-2xl ${darkMode ? "text-on-surface" : "text-slate-900"} leading-none mt-0.5`}
                  >
                    {(452 + Math.cos(currentTime.getSeconds() / 3) * 5).toFixed(
                      0,
                    )}
                    <span className="text-sm opacity-50"> kW</span>
                  </span>
                </div>
              </div>
              {/* KPI 4 */}
              <div
                className={`${darkMode ? "bg-surface-container border-surface-variant" : "bg-white border-slate-200 shadow-sm"} rounded-xl p-card-padding border flex items-center gap-4 transition-all`}
              >
                <div
                  className={`w-10 h-10 rounded-full ${darkMode ? "bg-error/10 border-error/30" : "bg-red-50 border-red-200"} flex items-center justify-center`}
                >
                  <span className="material-symbols-outlined text-error text-xl">
                    gpp_bad
                  </span>
                </div>
                <div className="flex flex-col">
                  <span
                    className={`font-label-sm text-[10px] ${darkMode ? "text-on-surface-variant" : "text-slate-500"} uppercase font-bold tracking-wider`}
                  >
                    Alarms
                  </span>
                  <span
                    className={`font-data-display text-2xl ${darkMode ? "text-on-surface" : "text-slate-900"} leading-none mt-0.5`}
                  >
                    0<span className="text-sm opacity-50"> Shift</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`${darkMode ? "bg-slate-950 text-emerald-500 border-slate-800" : "bg-slate-900 text-emerald-400 border-slate-700"} font-['Space_Grotesk'] text-[9px] uppercase font-bold docked full-width bottom-0 border-t flat no shadows fixed right-0 w-[calc(100%-13rem)] h-6 flex justify-between items-center px-4 z-50 transition-all`}
      >
        <div>SYSTEM STATUS: NOMINAL | V2.4.1</div>
        <div className="flex items-center gap-4">
          <a
            className="text-slate-500 hover:text-emerald-300 cursor-pointer"
            href="#/"
          >
            Emergency Stop
          </a>
          <a
            className="text-slate-500 hover:text-emerald-300 cursor-pointer"
            href="#/"
          >
            Maintenance Mode
          </a>
          <a
            className="text-slate-500 hover:text-emerald-300 cursor-pointer"
            href="#/"
          >
            Export Data
          </a>
        </div>
      </footer>
    </div>
  );
}
