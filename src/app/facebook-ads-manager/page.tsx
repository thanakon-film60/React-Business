"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FacebookProvider, EmbeddedVideo, EmbeddedPost } from "react-facebook";
// Declare Facebook SDK types
declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}
// Facebook SDK Initialization
if (typeof window !== "undefined") {
  // Load Facebook SDK
  window.fbAsyncInit = function () {
    if (window.FB) {
      window.FB.init({
        xfbml: true,
        version: "v18.0",
      });
    }
  };
  // Load SDK script
  if (!document.getElementById("facebook-jssdk")) {
    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.src = "https://connect.facebook.net/th_TH/sdk.js";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }
}
// ปิด root layout และเพิ่ม CSS สำหรับ modal
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    header, footer, nav.navbar, .layout-grid > :not(main) {
      display: none !important;
    }
    body {
      padding: 0 !important;
      margin: 0 !important;
      overflow-x: hidden !important;
    }
    main, .layout-grid {
      padding: 0 !important;
      margin: 0 !important;
    }
    /* Mobile Responsive Styles */
    @media (max-width: 640px) {
      .min-h-screen {
        min-height: 100vh !important;
      }
    }
    @media (max-width: 768px) {
      /* Make tables scrollable on mobile */
      .overflow-x-auto {
        overflow-x: auto !important;
        -webkit-overflow-scrolling: touch !important;
      }
    }
    .modal-overlay {
      backdrop-filter: blur(8px);
      animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .video-modal-container {
      animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(30px) scale(0.95);
      }
      to { 
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }
    @keyframes slideInFromLeft {
      from { 
        opacity: 0;
        transform: translateX(-30px);
      }
      to { 
        opacity: 1;
        transform: translateX(0);
      }
    }
    @keyframes slideInFromRight {
      from { 
        opacity: 0;
        transform: translateX(30px);
      }
      to { 
        opacity: 1;
        transform: translateX(0);
      }
    }
    .animate-slide-in-left {
      animation: slideInFromLeft 0.5s ease-out;
    }
    .animate-slide-in-right {
      animation: slideInFromRight 0.5s ease-out;
    }
    .glass-effect {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .gradient-border {
      position: relative;
      background: linear-gradient(white, white) padding-box,
                  linear-gradient(135deg, #667eea 0%, #764ba2 100%) border-box;
      border: 2px solid transparent;
    }
  `;
  document.head.appendChild(style);
}
interface Action {
  action_type: string;
  value: string;
}
interface AdCreative {
  id: string;
  thumbnail_url?: string;
  image_url?: string;
  video_id?: string;
  object_story_spec?: any;
  effective_object_story_id?: string;
}
interface AdInsight {
  ad_id: string;
  ad_name: string;
  adset_id: string;
  adset_name: string;
  campaign_id: string;
  campaign_name: string;
  spend: string;
  impressions: string;
  clicks: string;
  ctr: string;
  cpc: string;
  cpm: string;
  actions?: Action[];
  conversions?: Action[];
  date_start: string;
  date_stop: string;
  reach?: string;
  frequency?: string;
  cost_per_action_type?: { action_type: string; value: string }[];
  creative?: AdCreative;
}
interface ApiResponse {
  success: boolean;
  data: AdInsight[];
  error?: string;
  details?: any;
}
type ViewMode = "campaigns" | "adsets" | "ads";
export default function FacebookAdsManagerPage() {
  const router = useRouter();
  const [insights, setInsights] = useState<AdInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("ads");
  const [dateRange, setDateRange] = useState("today");
  const [customDateStart, setCustomDateStart] = useState("");
  const [customDateEnd, setCustomDateEnd] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [googleSheetsData, setGoogleSheetsData] = useState<number>(0);
  const [googleSheetsLoading, setGoogleSheetsLoading] = useState(false);
  const [googleAdsData, setGoogleAdsData] = useState<number>(0);
  const [googleAdsLoading, setGoogleAdsLoading] = useState(false);
  const [facebookBalance, setFacebookBalance] = useState<number>(0);
  const [facebookBalanceLoading, setFacebookBalanceLoading] = useState(false);
  const [phoneCountData, setPhoneCountData] = useState<{
    total: number;
    datesWithData: number;
  }>({ total: 0, datesWithData: 0 });
  const [phoneCountLoading, setPhoneCountLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<
    "facebook" | "tiktok" | "googlead"
  >("facebook");
  const [adCreatives, setAdCreatives] = useState<Map<string, AdCreative>>(
    new Map()
  );
  const [creativesLoading, setCreativesLoading] = useState(false);
  const [selectedAdForPreview, setSelectedAdForPreview] =
    useState<AdInsight | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [topAdsSortBy, setTopAdsSortBy] = useState<"leads" | "cost" | "phone">(
    "leads"
  );
  const [dailySummaryData, setDailySummaryData] = useState<AdInsight[]>([]);
  const [dailySummaryLoading, setDailySummaryLoading] = useState(false);
  const [phoneLeadsData, setPhoneLeadsData] = useState<{
    [date: string]: number;
  }>({});
  const [phoneLeadsLoading, setPhoneLeadsLoading] = useState(false);
  const [topAdsPhoneLeads, setTopAdsPhoneLeads] = useState<Map<string, number>>(
    new Map()
  );
  const [topAdsPhoneLeadsLoading, setTopAdsPhoneLeadsLoading] = useState(false);
  const [topAdsLimit, setTopAdsLimit] = useState<5 | 10 | 15 | 20 | 30 | "all">(
    20
  );
  // Helper function to check if local video exists
  const getLocalVideoPath = (videoId: string | undefined): string | null => {
    if (!videoId) return null;
    return `/images/video/${videoId}.mp4`;
  };
  // Re-parse Facebook SDK when modal opens
  useEffect(() => {
    if (showVideoModal && typeof window !== "undefined" && window.FB) {
      // Give time for DOM to update
      setTimeout(() => {
        if (window.FB) {
          window.FB.XFBML.parse();
        }
      }, 100);
    }
  }, [showVideoModal, selectedAdForPreview]);
  const fetchAdCreatives = useCallback(async (adIds: string[]) => {
    setCreativesLoading(true);
    try {
      const creativesMap = new Map<string, AdCreative>();
      for (const adId of adIds) {
        try {
          // ใช้ Next.js API route แทน Railway API
          const response = await fetch(
            `/api/facebook-ads-creative?ad_id=${adId}`
          );
          const result = await response.json();
          if (result.success && result.data) {
            creativesMap.set(adId, result.data);
          }
        } catch (error) {
          // Error fetching creative
        }
      }
      // Force re-render by creating a new Map instance
      setAdCreatives(new Map(creativesMap));
    } catch (error) {
      // Fatal error
    } finally {
      setCreativesLoading(false);
    }
  }, []);

  const fetchTopAdsPhoneLeads = useCallback(
    async (adIds: string[]) => {
      try {
        setTopAdsPhoneLeadsLoading(true);
        const adIdsParam = adIds.join(",");

        // Calculate date range based on current dateRange state
        const today = new Date();
        let startDate: string;
        let endDate: string = today.toISOString().split("T")[0];

        if (dateRange === "custom" && customDateStart && customDateEnd) {
          startDate = customDateStart;
          endDate = customDateEnd;
        } else {
          let start: Date;
          switch (dateRange) {
            case "today":
              startDate = endDate;
              break;
            case "yesterday":
              const yesterday = new Date(today);
              yesterday.setDate(yesterday.getDate() - 1);
              startDate = endDate = yesterday.toISOString().split("T")[0];
              break;
            case "last_7d":
              start = new Date(today);
              start.setDate(start.getDate() - 7);
              startDate = start.toISOString().split("T")[0];
              break;
            case "last_14d":
              start = new Date(today);
              start.setDate(start.getDate() - 14);
              startDate = start.toISOString().split("T")[0];
              break;
            case "last_30d":
              start = new Date(today);
              start.setDate(start.getDate() - 30);
              startDate = start.toISOString().split("T")[0];
              break;
            case "this_month":
              start = new Date(today.getFullYear(), today.getMonth(), 1);
              startDate = start.toISOString().split("T")[0];
              break;
            case "last_month":
              start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
              const lastMonthEnd = new Date(
                today.getFullYear(),
                today.getMonth(),
                0
              );
              startDate = start.toISOString().split("T")[0];
              endDate = lastMonthEnd.toISOString().split("T")[0];
              break;
            default:
              startDate = endDate;
          }
        }

        // ใช้ API ใหม่ที่ query จาก SQL โดยแมพกับ fb_ad_id และ filter ตามวันที่
        const response = await fetch(
          `/api/facebook-ads-phone-leads-sql?ad_ids=${adIdsParam}&date_start=${startDate}&date_end=${endDate}`
        );
        const result = await response.json();
        if (result.success && result.data) {
          const phoneLeadsMap = new Map<string, number>();
          Object.keys(result.data).forEach((adId) => {
            phoneLeadsMap.set(adId, result.data[adId]);
          });
          setTopAdsPhoneLeads(new Map(phoneLeadsMap));
        }
      } catch (error) {
        setTopAdsPhoneLeads(new Map());
      } finally {
        setTopAdsPhoneLeadsLoading(false);
      }
    },
    [dateRange, customDateStart, customDateEnd]
  );

  const fetchInsights = useCallback(
    async (isBackgroundRefresh = false, retryCount = 0) => {
      try {
        if (!isBackgroundRefresh) {
          setLoading(true);
        }
        setError(null);
        const levelParam =
          viewMode === "campaigns"
            ? "campaign"
            : viewMode === "adsets"
            ? "adset"
            : "ad";
        let url = `https://believable-ambition-production.up.railway.app/api/facebook-ads-campaigns?level=${levelParam}`;
        const filtering = JSON.stringify([
          {
            field: "action_type",
            operator: "IN",
            value: [
              "onsite_conversion.messaging_first_reply",
              "onsite_conversion.total_messaging_connection",
            ],
          },
        ]);
        url += `&filtering=${encodeURIComponent(filtering)}`;
        url += `&action_breakdowns=action_type`;
        if (dateRange === "custom" && customDateStart && customDateEnd) {
          const timeRange = JSON.stringify({
            since: customDateStart,
            until: customDateEnd,
          });
          url += `&time_range=${encodeURIComponent(timeRange)}`;
        } else {
          url += `&date_preset=${dateRange}`;
        }
        const response = await fetch(url);
        const result: ApiResponse = await response.json();

        // ตรวจสอบ Rate Limit Error (403)
        if (
          response.status === 403 &&
          result.error?.includes("Application request limit reached")
        ) {
          const retryDelay = Math.min(30000 * Math.pow(2, retryCount), 120000); // Exponential backoff: 30s, 60s, 120s
          setError(
            `⏳ API Rate Limit - จะรีเฟรชอัตโนมัติในอีก ${
              retryDelay / 1000
            } วินาที... (ครั้งที่ ${retryCount + 1})`
          );

          // รีเฟรชอัตโนมัติหลังจาก delay
          setTimeout(() => {
            if (retryCount < 3) {
              // จำกัดไม่เกิน 3 ครั้ง
              fetchInsights(isBackgroundRefresh, retryCount + 1);
            } else {
              setError(
                "❌ API Rate Limit - เกินจำนวนครั้งที่กำหนด กรุณารอสักครู่แล้วลองใหม่อีกครั้ง"
              );
              setLoading(false);
            }
          }, retryDelay);

          return; // หยุดการทำงานของฟังก์ชันชั่วคราว
        }

        if (!response.ok || !result.success) {
          throw new Error(result.error || "ไม่สามารถดึงข้อมูลได้");
        }
        const uniqueData = new Map<string, AdInsight>();
        result.data.forEach((item) => {
          const key = item.ad_id || item.adset_id || item.campaign_id;
          if (uniqueData.has(key)) {
            const existing = uniqueData.get(key)!;
            if (item.actions) {
              if (!existing.actions) existing.actions = [];
              item.actions.forEach((action) => {
                const existingAction = existing.actions!.find(
                  (a) => a.action_type === action.action_type
                );
                if (existingAction) {
                  existingAction.value = String(
                    parseInt(existingAction.value || "0") +
                      parseInt(action.value || "0")
                  );
                } else {
                  existing.actions!.push({ ...action });
                }
              });
            }
            if (item.conversions) {
              if (!existing.conversions) existing.conversions = [];
              item.conversions.forEach((conversion) => {
                const existingConversion = existing.conversions!.find(
                  (c) => c.action_type === conversion.action_type
                );
                if (existingConversion) {
                  existingConversion.value = String(
                    parseInt(existingConversion.value || "0") +
                      parseInt(conversion.value || "0")
                  );
                } else {
                  existing.conversions!.push({ ...conversion });
                }
              });
            }
          } else {
            uniqueData.set(key, { ...item });
          }
        });
        const insightsArray = Array.from(uniqueData.values());
        setInsights(insightsArray);
        // Fetch creatives for ALL ads
        const allAdIds = insightsArray
          .filter((item) => item.ad_id)
          .map((item) => item.ad_id);
        if (allAdIds.length > 0) {
          fetchAdCreatives(allAdIds);
          // Fetch phone leads for TOP 10 Ads
          fetchTopAdsPhoneLeads(allAdIds);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
      } finally {
        if (!isBackgroundRefresh) {
          setLoading(false);
        }
      }
    },
    [
      dateRange,
      viewMode,
      customDateStart,
      customDateEnd,
      fetchAdCreatives,
      fetchTopAdsPhoneLeads,
    ]
  );
  const fetchGoogleSheetsData = useCallback(async () => {
    try {
      setGoogleSheetsLoading(true);
      let url =
        "https://believable-ambition-production.up.railway.app/api/google-sheets-data";
      if (dateRange === "custom" && customDateStart && customDateEnd) {
        const timeRange = JSON.stringify({
          since: customDateStart,
          until: customDateEnd,
        });
        url += `?time_range=${encodeURIComponent(timeRange)}`;
      } else {
        url += `?date_preset=${dateRange}`;
      }
      const response = await fetch(url);
      const result = await response.json();
      if (!response.ok || !result.success) {
        setGoogleSheetsData(0);
      } else {
        setGoogleSheetsData(result.total || 0);
      }
    } catch (err) {
      setGoogleSheetsData(0);
    } finally {
      setGoogleSheetsLoading(false);
    }
  }, [dateRange, customDateStart, customDateEnd]);
  const fetchGoogleAdsData = useCallback(async () => {
    try {
      setGoogleAdsLoading(true);
      let url =
        "https://believable-ambition-production.up.railway.app/api/google-ads";
      if (dateRange === "custom" && customDateStart && customDateEnd) {
        url += `?startDate=${customDateStart}&endDate=${customDateEnd}`;
      } else {
        const today = new Date();
        let startDate = "";
        let endDate = today.toISOString().split("T")[0];
        switch (dateRange) {
          case "today":
            startDate = endDate;
            break;
          case "yesterday":
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            startDate = endDate = yesterday.toISOString().split("T")[0];
            break;
          case "last_7d":
            const last7d = new Date(today);
            last7d.setDate(last7d.getDate() - 7);
            startDate = last7d.toISOString().split("T")[0];
            break;
          case "last_30d":
            const last30d = new Date(today);
            last30d.setDate(last30d.getDate() - 30);
            startDate = last30d.toISOString().split("T")[0];
            break;
          case "this_month":
            startDate = new Date(today.getFullYear(), today.getMonth(), 1)
              .toISOString()
              .split("T")[0];
            break;
          case "last_month":
            const lastMonth = new Date(
              today.getFullYear(),
              today.getMonth() - 1,
              1
            );
            const lastMonthEnd = new Date(
              today.getFullYear(),
              today.getMonth(),
              0
            );
            startDate = lastMonth.toISOString().split("T")[0];
            endDate = lastMonthEnd.toISOString().split("T")[0];
            break;
          default:
            startDate = endDate;
        }
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      const response = await fetch(url);
      const result = await response.json();
      if (!response.ok || result.error) {
        setGoogleAdsData(0);
      } else {
        const totalClicks = result.summary?.totalClicks || 0;
        setGoogleAdsData(totalClicks);
      }
    } catch (err) {
      setGoogleAdsData(0);
    } finally {
      setGoogleAdsLoading(false);
    }
  }, [dateRange, customDateStart, customDateEnd]);
  const fetchFacebookBalance = useCallback(async () => {
    try {
      setFacebookBalanceLoading(true);
      const response = await fetch("/api/facebook-ads-balance");
      const result = await response.json();
      if (!response.ok || !result.success) {
        setFacebookBalance(0);
      } else {
        setFacebookBalance(result.data.available_balance || 0);
      }
    } catch (err) {
      setFacebookBalance(0);
    } finally {
      setFacebookBalanceLoading(false);
    }
  }, []);
  const fetchPhoneCount = useCallback(async () => {
    try {
      setPhoneCountLoading(true);

      // Calculate date range
      const today = new Date();
      let startDate: string;
      let endDate: string = today.toISOString().split("T")[0];

      if (dateRange === "custom" && customDateStart && customDateEnd) {
        startDate = customDateStart;
        endDate = customDateEnd;
      } else {
        let start: Date;
        switch (dateRange) {
          case "today":
            startDate = endDate;
            break;
          case "yesterday":
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            startDate = endDate = yesterday.toISOString().split("T")[0];
            break;
          case "last_7d":
            start = new Date(today);
            start.setDate(start.getDate() - 7);
            startDate = start.toISOString().split("T")[0];
            break;
          case "last_14d":
            start = new Date(today);
            start.setDate(start.getDate() - 14);
            startDate = start.toISOString().split("T")[0];
            break;
          case "last_30d":
            start = new Date(today);
            start.setDate(start.getDate() - 30);
            startDate = start.toISOString().split("T")[0];
            break;
          case "this_month":
            start = new Date(today.getFullYear(), today.getMonth(), 1);
            startDate = start.toISOString().split("T")[0];
            break;
          case "last_month":
            start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const lastMonthEnd = new Date(
              today.getFullYear(),
              today.getMonth(),
              0
            );
            startDate = start.toISOString().split("T")[0];
            endDate = lastMonthEnd.toISOString().split("T")[0];
            break;
          default:
            startDate = endDate;
        }
      }

      // Fetch phone count with date range from Next.js API
      const response = await fetch(`/api/phone-count`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        setPhoneCountData({ total: 0, datesWithData: 0 });
      } else {
        // Calculate total for date range from result.data { "2025-11-23": 3, ... }
        let total = 0;
        let datesCount = 0;

        // Compare dates as strings (YYYY-MM-DD format)
        Object.keys(result.data || {}).forEach((dateStr) => {
          // dateStr is already in YYYY-MM-DD format
          if (dateStr >= startDate && dateStr <= endDate) {
            total += result.data[dateStr];
            datesCount++;
          }
        });

        setPhoneCountData({
          total: total,
          datesWithData: datesCount,
        });
      }
    } catch (err) {
      setPhoneCountData({ total: 0, datesWithData: 0 });
    } finally {
      setPhoneCountLoading(false);
    }
  }, [dateRange, customDateStart, customDateEnd]);
  const fetchPhoneLeadsData = useCallback(async () => {
    try {
      setPhoneLeadsLoading(true);
      // Fetch all phone leads data grouped by date (no date filter = get all dates)
      const response = await fetch(`/api/facebook-ads-phone-leads`);
      const result = await response.json();
      if (result.success && result.data) {
        // Store phone leads count for each date
        // result.data format: { "2024-11-23": 5, "2024-11-22": 3, ... }
        setPhoneLeadsData(result.data);
      } else {
        setPhoneLeadsData({});
      }
    } catch (err) {
      setPhoneLeadsData({});
    } finally {
      setPhoneLeadsLoading(false);
    }
  }, []);

  const fetchDailySummaryData = useCallback(async () => {
    try {
      setDailySummaryLoading(true);
      // Fetch last 30 days data from Facebook Ads API with daily breakdown
      const url = `https://believable-ambition-production.up.railway.app/api/facebook-ads-campaigns?level=ad&date_preset=last_30d&time_increment=1`;
      const response = await fetch(url);
      const result: ApiResponse = await response.json();
      if (!response.ok || !result.success) {
        setDailySummaryData([]);
      } else {
        setDailySummaryData(result.data || []);
        // Fetch phone leads data for all dates
        fetchPhoneLeadsData();
      }
    } catch (err) {
      setDailySummaryData([]);
    } finally {
      setDailySummaryLoading(false);
    }
  }, [fetchPhoneLeadsData]);
  useEffect(() => {
    const loadAllData = async () => {
      try {
        await Promise.all([
          fetchInsights(),
          fetchGoogleSheetsData(),
          fetchGoogleAdsData(),
          fetchFacebookBalance(),
          fetchPhoneCount(),
          fetchDailySummaryData(),
        ]);
      } catch (error) {
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        setLoading(false);
      }
    };
    loadAllData();
    // Auto-refresh every 2 minutes (120000ms) in background - ลด frequency เพื่อป้องกัน Rate Limit
    const refreshInterval = setInterval(() => {
      Promise.all([
        fetchInsights(true), // true = background refresh (ไม่แสดง loading state)
        fetchGoogleSheetsData(),
        fetchGoogleAdsData(),
        fetchFacebookBalance(),
        fetchPhoneCount(),
        fetchDailySummaryData(),
      ]);
    }, 120000); // 120000ms = 2 minutes (เพิ่มจาก 1 นาที เป็น 2 นาที)
    // Cleanup interval on unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, [
    fetchInsights,
    fetchGoogleSheetsData,
    fetchGoogleAdsData,
    fetchFacebookBalance,
    fetchPhoneCount,
    fetchDailySummaryData,
  ]);
  // Monitor adCreatives changes
  useEffect(() => {
    // adCreatives updated
  }, [adCreatives]);
  const formatNumber = (value: string | number) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(num)
      ? "—"
      : num.toLocaleString("th-TH", { maximumFractionDigits: 2 });
  };
  const formatCurrency = (value: string | number) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(num)
      ? "—"
      : `฿${num.toLocaleString("th-TH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
  };
  const formatPercentage = (value: string | number) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(num)
      ? "—"
      : `${num.toLocaleString("th-TH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}%`;
  };
  const getResultsByActionType = (
    actions: Action[] | undefined,
    actionType: string
  ) => {
    if (!actions) return 0;
    const action = actions.find((a) => a.action_type === actionType);
    return action ? parseInt(action.value || "0") : 0;
  };
  const getTotalResults = () => {
    let total = 0;
    insights.forEach((ad) => {
      if (ad.actions) {
        const messagingAction = ad.actions.find(
          (action) =>
            action.action_type === "onsite_conversion.messaging_first_reply"
        );
        if (messagingAction) {
          const value = parseInt(messagingAction.value || "0");
          total += value;
        }
      }
    });
    return total;
  };
  const getTotalMessagingConnection = () => {
    let total = 0;
    insights.forEach((ad) => {
      if (ad.actions) {
        const messagingAction = ad.actions.find(
          (action) =>
            action.action_type ===
            "onsite_conversion.total_messaging_connection"
        );
        if (messagingAction) {
          const value = parseInt(messagingAction.value || "0");
          total += value;
        }
      }
    });
    return total;
  };
  const getTotalLeads = () => {
    let total = 0;
    insights.forEach((ad) => {
      if (ad.actions) {
        const leadAction = ad.actions.find(
          (action) => action.action_type === "lead"
        );
        if (leadAction) {
          const value = parseInt(leadAction.value || "0");
          total += value;
        }
      }
    });
    return total;
  };
  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    if (value === "custom") {
      const today = new Date().toISOString().split("T")[0];
      if (!customDateStart) setCustomDateStart(today);
      if (!customDateEnd) setCustomDateEnd(today);
      setShowDatePicker(true);
    } else {
      setShowDatePicker(false);
    }
  };
  const applyCustomDateRange = () => {
    if (customDateStart && customDateEnd) {
      setShowDatePicker(false);
      setTimeout(() => {
        setDateRange("custom");
      }, 0);
    }
  };
  // Filter insights based on main date range (ใช้ช่วงเวลาจาก 📊 ช่องควบคุม)
  const getTopAdsFilteredInsights = useCallback(() => {
    // ใช้ช่วงเวลาเดียวกับ main dateRange (📊 ช่องควบคุม)
    return insights;
  }, [insights, dateRange]);
  const filteredInsights = insights;
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-6"></div>
          <p className="text-gray-700 text-xl font-semibold">
            กำลังโหลดข้อมูล...
          </p>
          <p className="text-gray-500 text-sm mt-2">โปรดรอสักครู่</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
          <div className="text-red-500 text-5xl mb-4 text-center">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            เกิดข้อผิดพลาด
          </h2>
          <p className="text-gray-600 mb-6 text-center">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchInsights(false);
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              ลองอีกครั้ง
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3">
        <button
          onClick={() => router.push("/home")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg font-medium text-sm"
        >
          <span className="text-lg">←</span>
          <span>กลับไปหน้าหลัก</span>
        </button>
      </div>
      {/* Top Navigation Bar with Date Range Tabs */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="px-3 sm:px-6 py-3">
          {/* Desktop View: Tabs */}
          <div className="hidden md:flex items-center space-x-2">
            <button className="px-3 sm:px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-xs sm:text-sm">
              📊 ช่องควบคุม
            </button>
            <button
              onClick={() => handleDateRangeChange("today")}
              className={`px-3 sm:px-6 py-2 rounded-lg transition-colors font-medium text-xs sm:text-sm ${
                dateRange === "today"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              วันนี้
            </button>
            <button
              onClick={() => handleDateRangeChange("yesterday")}
              className={`px-6 py-2 rounded-lg transition-colors font-medium text-sm ${
                dateRange === "yesterday"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              เมื่อวาน
            </button>
            <button
              onClick={() => handleDateRangeChange("last_7d")}
              className={`px-6 py-2 rounded-lg transition-colors font-medium text-sm ${
                dateRange === "last_7d"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              7 วัน
            </button>
            <button
              onClick={() => handleDateRangeChange("last_14d")}
              className={`px-6 py-2 rounded-lg transition-colors font-medium text-sm ${
                dateRange === "last_14d"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              14 วัน
            </button>
            <button
              onClick={() => handleDateRangeChange("last_30d")}
              className={`px-6 py-2 rounded-lg transition-colors font-medium text-sm ${
                dateRange === "last_30d"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              30 วัน
            </button>
            <button
              onClick={() => handleDateRangeChange("this_month")}
              className={`px-6 py-2 rounded-lg transition-colors font-medium text-sm ${
                dateRange === "this_month"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              เดือนนี้
            </button>
            <button
              onClick={() => handleDateRangeChange("custom")}
              className={`px-6 py-2 rounded-lg transition-colors font-medium text-sm ${
                dateRange === "custom"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🗓️ กำหนดเอง
            </button>
            {dateRange === "custom" && customDateStart && customDateEnd && (
              <span className="text-xs text-gray-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200 font-medium ml-2">
                {customDateStart} ถึง {customDateEnd}
              </span>
            )}
          </div>
          {/* Mobile View: Dropdown */}
          <div className="md:hidden space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">📅</span>
              <select
                value={dateRange}
                onChange={(e) => handleDateRangeChange(e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700 font-medium text-sm"
              >
                <option value="today">วันนี้</option>
                <option value="yesterday">เมื่อวาน</option>
                <option value="last_7d">7 วันที่ผ่านมา</option>
                <option value="last_14d">14 วันที่ผ่านมา</option>
                <option value="last_30d">30 วันที่ผ่านมา</option>
                <option value="this_month">เดือนนี้</option>
                <option value="custom">🗓️ กำหนดเองเอง</option>
              </select>
            </div>
            {dateRange === "custom" && customDateStart && customDateEnd && (
              <div className="text-xs text-gray-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200 font-medium">
                {customDateStart} ถึง {customDateEnd}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Calendar Date Picker */}
      {showDatePicker && (
        <div
          className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDatePicker(false);
            }
          }}
        >
          <div
            className="date-picker-container bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-800">
                เลือกช่วงวันที่
              </h3>
              <button
                onClick={() => setShowDatePicker(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all text-2xl w-10 h-10 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-base font-bold text-gray-700 mb-4">
                  📅 จากวันที่
                </label>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-300 shadow-md">
                  <input
                    type="date"
                    value={
                      customDateStart || new Date().toISOString().split("T")[0]
                    }
                    onChange={(e) => setCustomDateStart(e.target.value)}
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-lg font-medium focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-base font-bold text-gray-700 mb-4">
                  📅 ถึงวันที่
                </label>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border-2 border-orange-300 shadow-md">
                  <input
                    type="date"
                    value={
                      customDateEnd || new Date().toISOString().split("T")[0]
                    }
                    onChange={(e) => setCustomDateEnd(e.target.value)}
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-lg font-medium focus:outline-none focus:ring-4 focus:ring-orange-300 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex space-x-4 justify-end">
              <button
                onClick={() => setShowDatePicker(false)}
                className="px-10 py-4 text-base border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition-colors font-semibold text-gray-700"
              >
                ยกเลิก
              </button>
              <button
                onClick={applyCustomDateRange}
                className="px-10 py-4 text-base bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold"
              >
                ✓ ตกลง
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Video Preview Modal */}
      {showVideoModal && selectedAdForPreview && (
        <div
          className="modal-overlay fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            margin: 0,
            padding: "1rem",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowVideoModal(false);
              setSelectedAdForPreview(null);
            }
          }}
        >
          <div
            className="video-modal-container bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 truncate">
                  {selectedAdForPreview.ad_name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Campaign: {selectedAdForPreview.campaign_name}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowVideoModal(false);
                  setSelectedAdForPreview(null);
                }}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all text-2xl w-10 h-10 flex items-center justify-center ml-4"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              {/* Video/Post Preview */}
              <div className="mb-6">
                {(() => {
                  const creative = adCreatives.get(selectedAdForPreview.ad_id);
                  const effectiveStoryId = creative?.effective_object_story_id;
                  const videoId =
                    creative?.object_story_spec?.video_data?.video_id ||
                    creative?.video_id;
                  const thumbnailUrl =
                    creative?.thumbnail_url ||
                    creative?.object_story_spec?.video_data?.image_url ||
                    creative?.image_url;
                  // ถ้ามี effective_object_story_id ใช้ EmbeddedPost ก่อน
                  if (effectiveStoryId) {
                    const postUrl = `https://www.facebook.com/${effectiveStoryId.replace(
                      "_",
                      "/posts/"
                    )}`;
                    return (
                      <div className="space-y-4">
                        {/* Facebook Embedded Post */}
                        <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                          <FacebookProvider appId="1086145253509335">
                            <EmbeddedPost
                              href={postUrl}
                              width="100%"
                              showText={true}
                            />
                          </FacebookProvider>
                        </div>
                        {/* Fallback: Open in Facebook Button */}
                        <div className="flex justify-center">
                          <a
                            href={postUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-lg"
                          >
                            <span>📱</span>
                            <span>เปิดดูโพสต์เต็มรูปแบบใน Facebook</span>
                          </a>
                        </div>
                      </div>
                    );
                  }
                  // ถ้ามี video_id แต่ไม่มี story_id - แสดง thumbnail และปุ่มเปิดใน Facebook
                  if (videoId && thumbnailUrl) {
                    return (
                      <div className="space-y-4">
                        {/* Video Thumbnail */}
                        <div className="rounded-xl overflow-hidden bg-gray-100 shadow-lg relative">
                          <img
                            src={thumbnailUrl}
                            alt={selectedAdForPreview.ad_name}
                            className="w-full h-auto"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                            <div className="text-white text-6xl">▶️</div>
                          </div>
                        </div>
                        {/* Open in Facebook Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                          <a
                            href={`https://www.facebook.com/reel/${videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-lg text-sm sm:text-base"
                          >
                            <span>🎬</span>
                            <span>ดูเป็น Reel</span>
                          </a>
                          <a
                            href={`https://www.facebook.com/watch/?v=${videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors font-medium shadow-lg text-sm sm:text-base"
                          >
                            <span>▶️</span>
                            <span>ดูเป็น Video</span>
                          </a>
                        </div>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                          <p className="text-blue-700 text-sm font-medium">
                            📹 Video ID: {videoId}
                          </p>
                          <p className="text-blue-600 text-xs mt-1">
                            คลิกปุ่มด้านบนเพื่อเปิดดูวิดีโอใน Facebook
                          </p>
                        </div>
                      </div>
                    );
                  }
                  // ถ้ามีแค่รูปภาพ (ไม่มี video)
                  if (thumbnailUrl) {
                    return (
                      <div className="rounded-xl overflow-hidden bg-gray-100 shadow-lg">
                        <img
                          src={thumbnailUrl}
                          alt={selectedAdForPreview.ad_name}
                          className="w-full h-auto"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </div>
                    );
                  }
                  // ไม่มีข้อมูล
                  return (
                    <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-6xl mb-4 block">🎬</span>
                        <p className="text-gray-600">ไม่พบวิดีโอหรือรูปภาพ</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
              {/* Ad Performance Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Spent</div>
                  <div className="text-xl font-bold text-blue-700">
                    {formatCurrency(selectedAdForPreview.spend)}
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Results</div>
                  <div className="text-xl font-bold text-green-700">
                    {getResultsByActionType(
                      selectedAdForPreview.actions,
                      "onsite_conversion.messaging_first_reply"
                    )}
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">CPC</div>
                  <div className="text-xl font-bold text-purple-700">
                    {formatCurrency(selectedAdForPreview.cpc)}
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">CTR</div>
                  <div className="text-xl font-bold text-orange-700">
                    {formatPercentage(selectedAdForPreview.ctr)}
                  </div>
                </div>
              </div>
              {/* Ad Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Ad Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Impressions:</span>
                    <span className="font-medium">
                      {formatNumber(selectedAdForPreview.impressions)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Clicks:</span>
                    <span className="font-medium">
                      {formatNumber(selectedAdForPreview.clicks)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">CPM:</span>
                    <span className="font-medium">
                      {formatCurrency(selectedAdForPreview.cpm)}
                    </span>
                  </div>
                  {selectedAdForPreview.reach && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reach:</span>
                      <span className="font-medium">
                        {formatNumber(selectedAdForPreview.reach)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {selectedAdForPreview.date_start}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Main Content Layout */}
      <div className="px-3 sm:px-6 py-3 sm:py-6">
        {/* Performance Cards and Tables in 3-Column Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* Column 1: เงินคงเหลือ + ใช้จ่ายรวม */}
          <div className="flex flex-col">
            {/* Card */}
            <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-white shadow-2xl">
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="text-center">
                  <div className="text-xs sm:text-base font-semibold opacity-90 mb-1 sm:mb-2">
                    💵 เงินคงเหลือ
                  </div>
                  <div className="text-xl sm:text-3xl font-bold">
                    {facebookBalanceLoading ? (
                      <span className="text-2xl">⏳</span>
                    ) : (
                      `฿${facebookBalance.toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs sm:text-base font-semibold opacity-90 mb-1 sm:mb-2">
                    💰 ใช้จ่ายรวม
                  </div>
                  <div className="text-xl sm:text-3xl font-bold">
                    {formatCurrency(
                      insights.reduce(
                        (sum, ad) => sum + parseFloat(ad.spend || "0"),
                        0
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Table */}
            <div className="bg-white rounded-b-2xl sm:rounded-b-3xl shadow-2xl overflow-hidden border border-gray-100 border-t-0 flex-1 mt-0">
              <div className="overflow-y-auto max-h-[120px]">
                <table className="w-full min-w-max text-xs">
                  <thead className="bg-blue-50 sticky top-0">
                    <tr>
                      <th className="px-2 py-2 text-center font-semibold text-gray-700 border-b text-xs whitespace-nowrap">
                        วันที่
                      </th>
                      <th className="px-2 py-2 text-center font-semibold text-gray-700 border-b text-xs whitespace-nowrap">
                        จ่ายแล้ว
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailySummaryLoading ? (
                      <tr>
                        <td
                          colSpan={2}
                          className="px-2 py-4 text-center text-xs"
                        >
                          ⏳
                        </td>
                      </tr>
                    ) : (
                      (() => {
                        const dailyData = new Map<string, { spend: number }>();
                        dailySummaryData.forEach((ad) => {
                          const date = ad.date_start;
                          const existing = dailyData.get(date) || { spend: 0 };
                          existing.spend += parseFloat(ad.spend || "0");
                          dailyData.set(date, existing);
                        });
                        const sortedDates = Array.from(dailyData.keys()).sort(
                          (a, b) =>
                            new Date(b).getTime() - new Date(a).getTime()
                        );
                        const last30Days = sortedDates.slice(1, 31);
                        return last30Days.map((date) => {
                          const data = dailyData.get(date)!;
                          return (
                            <tr
                              key={date}
                              className="hover:bg-blue-50 border-b"
                            >
                              <td className="px-2 py-2 text-center text-xs text-gray-900">
                                {new Date(date).toLocaleDateString("th-TH", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </td>
                              <td className="px-2 py-2 text-center text-xs font-semibold text-blue-600">
                                {formatCurrency(data.spend)}
                              </td>
                            </tr>
                          );
                        });
                      })()
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Column 2: New Inbox & Total Inbox */}
          <div className="flex flex-col">
            {/* Card */}
            <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-white shadow-2xl">
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="text-center">
                  <div className="text-xs sm:text-base font-semibold opacity-90 mb-1 sm:mb-3">
                    New Inbox
                  </div>
                  <div className="text-xl sm:text-4xl font-bold">
                    {getTotalResults()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs sm:text-base font-semibold opacity-90 mb-1 sm:mb-3">
                    Total Inbox
                  </div>
                  <div className="text-xl sm:text-4xl font-bold">
                    {getTotalMessagingConnection()}
                  </div>
                </div>
              </div>
            </div>
            {/* Table */}
            <div className="bg-white rounded-b-2xl sm:rounded-b-3xl shadow-2xl overflow-hidden border border-gray-100 border-t-0 flex-1 mt-0">
              <div className="overflow-y-auto max-h-[120px]">
                <table className="w-full min-w-max text-xs">
                  <thead className="bg-teal-50 sticky top-0">
                    <tr>
                      <th className="px-2 py-2 text-center font-semibold text-gray-700 border-b text-xs whitespace-nowrap">
                        วันที่
                      </th>
                      <th className="px-2 py-2 text-center font-semibold text-gray-700 border-b text-xs whitespace-nowrap">
                        New Inbox
                      </th>
                      <th className="px-2 py-2 text-center font-semibold text-gray-700 border-b text-xs whitespace-nowrap">
                        Total Inbox
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailySummaryLoading ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-2 py-4 text-center text-xs"
                        >
                          ⏳
                        </td>
                      </tr>
                    ) : (
                      (() => {
                        const dailyData = new Map<
                          string,
                          { newInbox: number; totalInbox: number }
                        >();
                        dailySummaryData.forEach((ad) => {
                          const date = ad.date_start;
                          const existing = dailyData.get(date) || {
                            newInbox: 0,
                            totalInbox: 0,
                          };
                          existing.newInbox += getResultsByActionType(
                            ad.actions,
                            "onsite_conversion.messaging_first_reply"
                          );
                          existing.totalInbox += getResultsByActionType(
                            ad.actions,
                            "onsite_conversion.total_messaging_connection"
                          );
                          dailyData.set(date, existing);
                        });
                        const sortedDates = Array.from(dailyData.keys()).sort(
                          (a, b) =>
                            new Date(b).getTime() - new Date(a).getTime()
                        );
                        const last30Days = sortedDates.slice(1, 31);
                        return last30Days.map((date) => {
                          const data = dailyData.get(date)!;
                          return (
                            <tr
                              key={date}
                              className="hover:bg-teal-50 border-b"
                            >
                              <td className="px-2 py-2 text-center text-xs text-gray-900">
                                {new Date(date).toLocaleDateString("th-TH", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </td>
                              <td className="px-2 py-2 text-center text-xs font-semibold text-green-600">
                                {data.newInbox}
                              </td>
                              <td className="px-2 py-2 text-center text-xs font-semibold text-teal-600">
                                {data.totalInbox}
                              </td>
                            </tr>
                          );
                        });
                      })()
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Column 3: ชื่อ - เบอร์ */}
          <div className="flex flex-col">
            {/* Card */}
            <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-white shadow-2xl text-center">
              <div className="text-base sm:text-xl font-semibold mb-2 sm:mb-3 opacity-90">
                📞 ชื่อ - เบอร์
              </div>
              <div className="text-2xl sm:text-4xl font-bold">
                {phoneCountLoading ? (
                  <span className="text-3xl">⏳</span>
                ) : (
                  <div>{phoneCountData.total.toLocaleString()}</div>
                )}
              </div>
            </div>
            {/* Table */}
            <div className="bg-white rounded-b-2xl sm:rounded-b-3xl shadow-2xl overflow-hidden border border-gray-100 border-t-0 flex-1 mt-0">
              <div className="overflow-y-auto max-h-[120px]">
                <table className="w-full min-w-max text-xs">
                  <thead className="bg-purple-50 sticky top-0">
                    <tr>
                      <th className="px-2 py-2 text-center font-semibold text-gray-700 border-b text-xs whitespace-nowrap">
                        วันที่
                      </th>
                      <th className="px-2 py-2 text-center font-semibold text-gray-700 border-b text-xs whitespace-nowrap">
                        เบอร์
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {phoneLeadsLoading ? (
                      <tr>
                        <td
                          colSpan={2}
                          className="px-2 py-4 text-center text-xs"
                        >
                          ⏳
                        </td>
                      </tr>
                    ) : (
                      Object.entries(phoneLeadsData)
                        .sort(
                          ([dateA], [dateB]) =>
                            new Date(dateB).getTime() -
                            new Date(dateA).getTime()
                        )
                        .slice(1)
                        .map(([date, count]) => (
                          <tr
                            key={date}
                            className="hover:bg-purple-50 border-b"
                          >
                            <td className="px-2 py-2 text-center text-xs text-gray-900">
                              {new Date(date).toLocaleDateString("th-TH", {
                                month: "short",
                                day: "numeric",
                              })}
                            </td>
                            <td className="px-2 py-2 text-center text-xs font-semibold text-purple-600">
                              {count}
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* TOP Ads Section - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-8">
          {/* Left Column - TOP Ads Table */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 border border-gray-100">
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 px-4 sm:px-8 py-4 sm:py-6 -m-4 sm:-m-8 mb-4 sm:mb-8 relative overflow-hidden rounded-t-2xl sm:rounded-t-3xl">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 transition-opacity duration-500"></div>
            </div>
            <div className="flex flex-col gap-3 mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                🏆 TOP {topAdsLimit === "all" ? "ทั้งหมด" : topAdsLimit} Ads
              </h2>
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                {/* Sort By Buttons */}
                <div className="flex gap-2 flex-1">
                  <button
                    onClick={() => setTopAdsSortBy("leads")}
                    className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                      topAdsSortBy === "leads"
                        ? "bg-purple-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <span className="hidden sm:inline">
                      💬 Total Inbox (มาก → น้อย)
                    </span>
                    <span className="sm:hidden">💬 Inbox</span>
                  </button>
                  <button
                    onClick={() => setTopAdsSortBy("phone")}
                    className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                      topAdsSortBy === "phone"
                        ? "bg-purple-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <span className="hidden sm:inline">
                      📞 ชื่อ - เบอร์ (มาก → น้อย)
                    </span>
                    <span className="sm:hidden">📞 เบอร์</span>
                  </button>
                  <button
                    onClick={() => setTopAdsSortBy("cost")}
                    className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                      topAdsSortBy === "cost"
                        ? "bg-purple-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <span className="hidden sm:inline">
                      💰 ต้นทุน (น้อย → มาก)
                    </span>
                    <span className="sm:hidden">💰 Cost</span>
                  </button>
                </div>
                {/* Top Ads Limit Dropdown */}
                <select
                  value={topAdsLimit}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTopAdsLimit(
                      value === "all"
                        ? "all"
                        : (Number(value) as 5 | 10 | 15 | 20 | 30)
                    );
                  }}
                  className="flex-1 sm:flex-none sm:min-w-[140px] px-3 py-2 rounded-lg font-medium text-xs sm:text-sm bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-800 hover:from-yellow-500 hover:to-orange-500 transition-all border-2 border-yellow-500 shadow-lg cursor-pointer"
                >
                  <option value={5}>⭐ Top 5</option>
                  <option value={10}>⭐ Top 10</option>
                  <option value={15}>⭐ Top 15</option>
                  <option value={20}>⭐ Top 20</option>
                  <option value={30}>⭐ Top 30</option>
                  <option value="all">⭐ Top ทั้งหมด</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              {/* Loading State */}
              {creativesLoading && adCreatives.size === 0 && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4 rounded">
                  <p className="text-blue-700 text-sm font-medium">
                    ⏳ กำลังโหลดรูปภาพโฆษณา...
                  </p>
                </div>
              )}
              {/* Success State */}
              {/* {!creativesLoading && adCreatives.size > 0 && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 mb-4 rounded">
                    <p className="text-green-700 text-sm font-medium">
                      ✅ โหลดรูปภาพสำเร็จ {adCreatives.size} รายการ
                    </p>
                  </div>
                )} */}
              <table className="w-full" key={`table-${adCreatives.size}`}>
                <thead>
                  <tr className="border-b-2 border-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
                    <th className="text-center py-2 px-1 font-semibold text-gray-700 text-sm">
                      #
                    </th>
                    <th className="text-center py-2 px-1 font-semibold text-gray-700 text-sm">
                      Ad Image
                    </th>
                    <th className="text-center py-2 px-1 font-semibold text-gray-700 text-sm">
                      จ่ายแล้ว
                    </th>
                    <th className="text-center py-2 px-1 font-semibold text-gray-700 text-sm">
                      New Inbox
                    </th>
                    <th className="text-center py-2 px-1 font-semibold text-gray-700 text-sm">
                      Total Inbox
                    </th>
                    <th className="text-center py-2 px-1 font-semibold text-gray-700 text-sm">
                      ชื่อ - เบอร์
                    </th>
                    <th className="text-center py-2 px-1 font-semibold text-gray-700 text-sm">
                      ThruPlay
                    </th>
                    <th className="text-center py-2 px-1 font-semibold text-gray-700 text-sm">
                      ต้นทุน Inbox
                    </th>
                  </tr>
                </thead>
                <tbody key={`tbody-${adCreatives.size}-${Date.now()}`}>
                  {getTopAdsFilteredInsights()
                    .sort((a, b) => {
                      if (topAdsSortBy === "leads") {
                        // เรียงตาม Total Inbox จากมากไปน้อย
                        const totalInboxA = getResultsByActionType(
                          a.actions,
                          "onsite_conversion.total_messaging_connection"
                        );
                        const totalInboxB = getResultsByActionType(
                          b.actions,
                          "onsite_conversion.total_messaging_connection"
                        );
                        return totalInboxB - totalInboxA;
                      } else if (topAdsSortBy === "phone") {
                        // เรียงตาม ชื่อ - เบอร์ จากมากไปน้อย
                        const phoneLeadsA = topAdsPhoneLeads.get(a.ad_id) || 0;
                        const phoneLeadsB = topAdsPhoneLeads.get(b.ad_id) || 0;
                        return phoneLeadsB - phoneLeadsA;
                      } else {
                        // เรียงตาม cost per messaging connection จากน้อยไปมาก
                        const costA = a.cost_per_action_type?.find(
                          (cost) =>
                            cost.action_type ===
                            "onsite_conversion.total_messaging_connection"
                        );
                        const costB = b.cost_per_action_type?.find(
                          (cost) =>
                            cost.action_type ===
                            "onsite_conversion.total_messaging_connection"
                        );
                        const valueA = costA
                          ? parseFloat(costA.value)
                          : Infinity;
                        const valueB = costB
                          ? parseFloat(costB.value)
                          : Infinity;
                        return valueA - valueB;
                      }
                    })
                    .slice(0, topAdsLimit === "all" ? undefined : topAdsLimit)
                    .map((ad, index) => {
                      const creative = adCreatives.get(ad.ad_id);
                      console.log(
                        `🖼️ [Render TOP ${index + 1}] Ad:`,
                        ad.ad_id,
                        ad.ad_name?.substring(0, 30),
                        "| Creative:",
                        creative
                          ? {
                              id: creative.id,
                              has_thumbnail: !!creative.thumbnail_url,
                              has_image: !!creative.image_url,
                              thumbnail_preview:
                                creative.thumbnail_url?.substring(0, 60),
                            }
                          : "NO CREATIVE DATA"
                      );
                      console.log(
                        "📦 [Render] adCreatives Map:",
                        "size=",
                        adCreatives.size,
                        "| Has this ad?",
                        adCreatives.has(ad.ad_id),
                        "| All ad IDs in map:",
                        Array.from(adCreatives.keys())
                      );
                      return (
                        <tr
                          key={ad.ad_id}
                          className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:via-purple-50 hover:to-pink-50 transition-all duration-300 hover:shadow-md"
                        >
                          <td className="py-2 px-1 text-center">
                            <div className="text-gray-700 font-bold text-lg">
                              {index + 1}
                            </div>
                          </td>
                          <td className="py-2 px-1 text-center">
                            <div
                              className="relative group cursor-pointer flex justify-center items-center"
                              onClick={() => {
                                setSelectedAdForPreview(ad);
                                setShowVideoModal(true);
                              }}
                            >
                              {(() => {
                                const videoId =
                                  creative?.object_story_spec?.video_data
                                    ?.video_id || creative?.video_id;
                                const localVideoPath = videoId
                                  ? `/images/video/${videoId}.mp4`
                                  : null;
                                const thumbnailUrl =
                                  creative?.thumbnail_url ||
                                  creative?.image_url;
                                // แสดงวิดีโอจาก local ก่อน (ถ้ามี)
                                if (localVideoPath) {
                                  return (
                                    <div className="w-20 h-20 flex-shrink-0">
                                      <video
                                        src={localVideoPath}
                                        className="w-full h-full object-cover rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        onLoadedMetadata={(e) => {
                                          const video = e.currentTarget;
                                          // เล่น 3 วินาทีแรก แล้ววนลูป
                                          video.addEventListener(
                                            "timeupdate",
                                            function (this: HTMLVideoElement) {
                                              if (this.currentTime >= 3) {
                                                this.currentTime = 0;
                                              }
                                            }
                                          );
                                        }}
                                        onError={(e) => {
                                          console.error(
                                            `❌ [Video Error] Failed to load: ${localVideoPath}`
                                          );
                                          // ถ้าไม่มีวิดีโอ ให้แสดงรูปภาพแทน
                                          e.currentTarget.style.display =
                                            "none";
                                          if (thumbnailUrl) {
                                            const img =
                                              document.createElement("img");
                                            img.src = thumbnailUrl;
                                            img.alt = "Ad preview";
                                            img.className =
                                              "w-full h-full object-cover rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow";
                                            e.currentTarget.parentElement?.appendChild(
                                              img
                                            );
                                          }
                                        }}
                                      />
                                    </div>
                                  );
                                }
                                // ถ้าไม่มีวิดีโอ ให้แสดงรูปภาพ
                                if (thumbnailUrl) {
                                  return (
                                    <div className="w-20 h-20 flex-shrink-0">
                                      <img
                                        src={thumbnailUrl}
                                        alt="Ad preview"
                                        className="w-full h-full object-cover rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                        onError={(e) => {
                                          console.error(
                                            "Image load error for ad:",
                                            ad.ad_id
                                          );
                                          e.currentTarget.src =
                                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='12'%3ENo Image%3C/text%3E%3C/svg%3E";
                                        }}
                                      />
                                    </div>
                                  );
                                }
                                // ถ้าไม่มีทั้งวิดีโอและรูปภาพ
                                return (
                                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">
                                      📷
                                    </span>
                                  </div>
                                );
                              })()}
                            </div>
                          </td>
                          <td className="py-2 px-1 text-center text-gray-700 font-semibold text-xl">
                            {formatCurrency(ad.spend)}
                          </td>
                          <td className="py-2 px-1 text-center font-semibold text-green-700 text-xl">
                            {getResultsByActionType(
                              ad.actions,
                              "onsite_conversion.messaging_first_reply"
                            )}
                          </td>
                          <td className="py-2 px-1 text-center font-semibold text-blue-700 text-xl">
                            {getResultsByActionType(
                              ad.actions,
                              "onsite_conversion.total_messaging_connection"
                            )}
                          </td>
                          <td className="py-2 px-1 text-center font-semibold text-purple-700 text-xl">
                            {topAdsPhoneLeadsLoading ? (
                              <span className="text-sm">⏳</span>
                            ) : (
                              topAdsPhoneLeads.get(ad.ad_id) || 0
                            )}
                          </td>
                          <td className="py-2 px-1 text-center text-gray-700 text-xl">
                            {(() => {
                              const thruplay = ad.actions?.find(
                                (action) => action.action_type === "video_view"
                              );
                              return thruplay
                                ? formatNumber(thruplay.value)
                                : "—";
                            })()}
                          </td>
                          <td className="py-2 px-1 text-center text-gray-700 text-xl">
                            {(() => {
                              const costPerMessaging =
                                ad.cost_per_action_type?.find(
                                  (cost) =>
                                    cost.action_type ===
                                    "onsite_conversion.total_messaging_connection"
                                );
                              return costPerMessaging
                                ? formatCurrency(costPerMessaging.value)
                                : "—";
                            })()}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column - Duplicate TOP Ads Table */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 border border-gray-100">
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 px-4 sm:px-8 py-4 sm:py-6 -m-4 sm:-m-8 mb-4 sm:mb-8 relative overflow-hidden rounded-t-2xl sm:rounded-t-3xl">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 transition-opacity duration-500"></div>
            </div>
            <div className="flex flex-col gap-3 mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                🏆 TOP {topAdsLimit === "all" ? "ทั้งหมด" : topAdsLimit} Ads
              </h2>
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                {/* Sort By Buttons */}
                <div className="flex gap-2 flex-1">
                  <button
                    onClick={() => setTopAdsSortBy("leads")}
                    className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                      topAdsSortBy === "leads"
                        ? "bg-purple-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <span className="hidden sm:inline">
                      💬 Total Inbox (มาก → น้อย)
                    </span>
                    <span className="sm:hidden">💬 Inbox</span>
                  </button>
                  <button
                    onClick={() => setTopAdsSortBy("phone")}
                    className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                      topAdsSortBy === "phone"
                        ? "bg-purple-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <span className="hidden sm:inline">
                      📞 ชื่อ - เบอร์ (มาก → น้อย)
                    </span>
                    <span className="sm:hidden">📞 เบอร์</span>
                  </button>
                  <button
                    onClick={() => setTopAdsSortBy("cost")}
                    className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                      topAdsSortBy === "cost"
                        ? "bg-purple-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <span className="hidden sm:inline">
                      💰 ต้นทุน (น้อย → มาก)
                    </span>
                    <span className="sm:hidden">💰 Cost</span>
                  </button>
                </div>
                {/* Top Ads Limit Dropdown */}
                <select
                  value={topAdsLimit}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTopAdsLimit(
                      value === "all"
                        ? "all"
                        : (Number(value) as 5 | 10 | 15 | 20 | 30)
                    );
                  }}
                  className="flex-1 sm:flex-none sm:min-w-[140px] px-3 py-2 rounded-lg font-medium text-xs sm:text-sm bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-800 hover:from-yellow-500 hover:to-orange-500 transition-all border-2 border-yellow-500 shadow-lg cursor-pointer"
                >
                  <option value={5}>⭐ Top 5</option>
                  <option value={10}>⭐ Top 10</option>
                  <option value={15}>⭐ Top 15</option>
                  <option value={20}>⭐ Top 20</option>
                  <option value={30}>⭐ Top 30</option>
                  <option value="all">⭐ Top ทั้งหมด</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full" key={`table2-${adCreatives.size}`}>
                <thead>
                  <tr className="border-b-2 border-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
                    <th className="text-center py-2 px-1 font-semibold text-gray-700 text-sm">
                      #
                    </th>
                    <th className="text-center py-2 px-1 font-semibold text-gray-700 text-sm">
                      Ad Image
                    </th>
                    <th className="text-center py-2 px-1 font-semibold text-gray-700 text-sm">
                      จ่ายแล้ว
                    </th>
                    <th className="text-center py-2 px-1 font-semibold text-gray-700 text-sm">
                      New Inbox
                    </th>
                    <th className="text-center py-2 px-1 font-semibold text-gray-700 text-sm">
                      Total Inbox
                    </th>
                    <th className="text-center py-2 px-1 font-semibold text-gray-700 text-sm">
                      ชื่อ - เบอร์
                    </th>
                    <th className="text-center py-2 px-1 font-semibold text-gray-700 text-sm">
                      ThruPlay
                    </th>
                    <th className="text-center py-2 px-1 font-semibold text-gray-700 text-sm">
                      ต้นทุน Inbox
                    </th>
                  </tr>
                </thead>
                <tbody key={`tbody2-${adCreatives.size}-${Date.now()}`}>
                  {getTopAdsFilteredInsights()
                    .sort((a, b) => {
                      if (topAdsSortBy === "leads") {
                        const totalInboxA = getResultsByActionType(
                          a.actions,
                          "onsite_conversion.total_messaging_connection"
                        );
                        const totalInboxB = getResultsByActionType(
                          b.actions,
                          "onsite_conversion.total_messaging_connection"
                        );
                        return totalInboxB - totalInboxA;
                      } else if (topAdsSortBy === "phone") {
                        const phoneLeadsA = topAdsPhoneLeads.get(a.ad_id) || 0;
                        const phoneLeadsB = topAdsPhoneLeads.get(b.ad_id) || 0;
                        return phoneLeadsB - phoneLeadsA;
                      } else {
                        const costA = a.cost_per_action_type?.find(
                          (cost) =>
                            cost.action_type ===
                            "onsite_conversion.total_messaging_connection"
                        );
                        const costB = b.cost_per_action_type?.find(
                          (cost) =>
                            cost.action_type ===
                            "onsite_conversion.total_messaging_connection"
                        );
                        const valueA = costA
                          ? parseFloat(costA.value)
                          : Infinity;
                        const valueB = costB
                          ? parseFloat(costB.value)
                          : Infinity;
                        return valueA - valueB;
                      }
                    })
                    .slice(0, topAdsLimit === "all" ? undefined : topAdsLimit)
                    .map((ad, index) => {
                      const creative = adCreatives.get(ad.ad_id);
                      return (
                        <tr
                          key={ad.ad_id}
                          className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:via-purple-50 hover:to-pink-50 transition-all duration-300 hover:shadow-md"
                        >
                          <td className="py-2 px-1 text-center">
                            <div className="text-gray-700 font-bold text-lg">
                              {index + 1}
                            </div>
                          </td>
                          <td className="py-2 px-1 text-center">
                            <div
                              className="relative group cursor-pointer flex justify-center items-center"
                              onClick={() => {
                                setSelectedAdForPreview(ad);
                                setShowVideoModal(true);
                              }}
                            >
                              {(() => {
                                const videoId =
                                  creative?.object_story_spec?.video_data
                                    ?.video_id || creative?.video_id;
                                const localVideoPath = videoId
                                  ? `/images/video/${videoId}.mp4`
                                  : null;
                                const thumbnailUrl =
                                  creative?.thumbnail_url ||
                                  creative?.image_url;
                                if (localVideoPath) {
                                  return (
                                    <div className="w-20 h-20 flex-shrink-0">
                                      <video
                                        src={localVideoPath}
                                        className="w-full h-full object-cover rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                      />
                                    </div>
                                  );
                                }
                                if (thumbnailUrl) {
                                  return (
                                    <div className="w-20 h-20 flex-shrink-0">
                                      <img
                                        src={thumbnailUrl}
                                        alt="Ad preview"
                                        className="w-full h-full object-cover rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                      />
                                    </div>
                                  );
                                }
                                return (
                                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">
                                      📷
                                    </span>
                                  </div>
                                );
                              })()}
                            </div>
                          </td>
                          <td className="py-2 px-1 text-center text-gray-700 font-semibold text-xl">
                            {formatCurrency(ad.spend)}
                          </td>
                          <td className="py-2 px-1 text-center font-semibold text-green-700 text-xl">
                            {getResultsByActionType(
                              ad.actions,
                              "onsite_conversion.messaging_first_reply"
                            )}
                          </td>
                          <td className="py-2 px-1 text-center font-semibold text-blue-700 text-xl">
                            {getResultsByActionType(
                              ad.actions,
                              "onsite_conversion.total_messaging_connection"
                            )}
                          </td>
                          <td className="py-2 px-1 text-center font-semibold text-purple-700 text-xl">
                            {topAdsPhoneLeadsLoading ? (
                              <span className="text-sm">⏳</span>
                            ) : (
                              topAdsPhoneLeads.get(ad.ad_id) || 0
                            )}
                          </td>
                          <td className="py-2 px-1 text-center text-gray-700 text-xl">
                            {(() => {
                              const thruplay = ad.actions?.find(
                                (action) => action.action_type === "video_view"
                              );
                              return thruplay
                                ? formatNumber(thruplay.value)
                                : "—";
                            })()}
                          </td>
                          <td className="py-2 px-1 text-center text-gray-700 text-xl">
                            {(() => {
                              const costPerMessaging =
                                ad.cost_per_action_type?.find(
                                  (cost) =>
                                    cost.action_type ===
                                    "onsite_conversion.total_messaging_connection"
                                );
                              return costPerMessaging
                                ? formatCurrency(costPerMessaging.value)
                                : "—";
                            })()}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
