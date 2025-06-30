"use client";

import { useState, useEffect } from 'react';
import { useScreenSize } from '@/components/responsive/ResponsiveLayout';
import QtdSitesCRP from "@/components/interface/cards/qtdsites/QtdSitesCRP";
import QtdSitesPH from "@/components/interface/cards/qtdsites/QtdSitesPH";
import QtdSitesTotal from "@/components/interface/cards/qtdsites/QtdSitesTotal";
import FortiWebStatus from "@/components/interface/cards/fortiwebStatus/FortiWebStatus";
import AttackType from "@/components/interface/cards/attackType/AttackType";
import CountriesTable from "@/components/interface/cards/countries/Countries";
import AlertSystem from "@/components/alerts/AlertSystem";
import TrendChart from "@/components/charts/TrendChart";
import Image from "next/image";

export default function ImprovedHome() {
  const screenSize = useScreenSize();
  const [fortiWebData, setFortiWebData] = useState({
    cpu: 0,
    memory: 0,
    disk: 0,
    attackCount: 0
  });

  // Fetch FortiWeb status for alerts
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch("https://fortiwebapi.salvador.ba.gov.br/fortiwebstatus/status");
        const data = await response.json();
        setFortiWebData({
          cpu: data.cpu || 0,
          memory: data.memory || 0,
          disk: data.disk || 0,
          attackCount: 0 // This would come from attack data
        });
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getGridLayout = () => {
    switch (screenSize) {
      case 'sm':
        return {
          container: "flex flex-col gap-4 p-4",
          mainGrid: "flex flex-col gap-4",
          leftColumn: "w-full",
          rightColumn: "w-full",
          attackTypeSection: "w-full"
        };
      case 'md':
        return {
          container: "flex flex-col gap-6 p-6",
          mainGrid: "flex flex-col gap-6",
          leftColumn: "w-full",
          rightColumn: "w-full",
          attackTypeSection: "w-full"
        };
      case 'lg':
        return {
          container: "grid gap-6 p-6",
          mainGrid: "grid-cols-1 lg:grid-cols-2 gap-6",
          leftColumn: "lg:col-span-1",
          rightColumn: "lg:col-span-1",
          attackTypeSection: "lg:col-span-2"
        };
      default:
        return {
          container: "grid gap-6 p-6",
          mainGrid: "grid-cols-3 gap-6",
          leftColumn: "col-span-1",
          rightColumn: "col-span-2",
          attackTypeSection: "col-span-3"
        };
    }
  };

  const layout = getGridLayout();
  const isMobile = screenSize === 'sm' || screenSize === 'md';

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Alert System */}
      <AlertSystem 
        cpuUsage={fortiWebData.cpu}
        memoryUsage={fortiWebData.memory}
        diskUsage={fortiWebData.disk}
        attackCount={fortiWebData.attackCount}
      />

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-center opacity-10"
        style={{ backgroundImage: "url('/waf.png')" }}
      />

      {/* Header */}
      <div className="z-10 flex flex-col items-center text-center p-4">
        <h1 className={`uppercase font-bold mb-1 mt-1 text-slate-300 ${
          isMobile ? 'text-3xl sm:text-4xl' : 'text-4xl md:text-5xl lg:text-6xl'
        }`}>
          WAF
        </h1>
        <h2 className={`font-bold mb-2 mt-1 text-slate-300 ${
          isMobile ? 'text-lg sm:text-xl' : 'text-xl md:text-2xl'
        }`}>
          Web Application Firewall
        </h2>
      </div>

      {/* Main Content */}
      <div className={`z-10 w-full max-w-full ${layout.container}`}>
        <div className={`${layout.mainGrid}`}>
          {/* Left Column - Site Stats */}
          <div className={`${layout.leftColumn} bg-gray-800 p-4 md:p-6 rounded-3xl shadow-lg`}>
            <QtdSitesTotal />
            <div className="mt-4">
              <QtdSitesCRP />
            </div>
            <div className="mt-4">
              <QtdSitesPH />
            </div>
          </div>

          {/* Right Column - Status and Countries */}
          <div className={`${layout.rightColumn} space-y-6`}>
            {/* FortiWeb Status */}
            <div className="bg-gray-800 p-4 md:p-6 rounded-3xl shadow-lg">
              <FortiWebStatus />
            </div>

            {/* Countries Table */}
            <div className="bg-gray-800 p-4 md:p-6 rounded-3xl shadow-lg">
              <CountriesTable />
            </div>
          </div>
        </div>

        {/* Attack Types Section */}
        <div className={`${layout.attackTypeSection} bg-gray-800 p-4 md:p-6 rounded-3xl shadow-lg mt-6`}>
          <AttackType />
        </div>

        {/* Trend Chart Section */}
        <div className="w-full mt-6">
          <TrendChart />
        </div>
      </div>

      {/* Logo - Hidden on mobile, positioned responsively on larger screens */}
      {!isMobile && (
        <Image
          className="absolute bottom-10 right-10 opacity-60 hidden lg:block"
          src="/logo_cogel.png"
          alt="Logo Cogel"
          width={screenSize === 'lg' ? 120 : 150}
          height={screenSize === 'lg' ? 120 : 150}
        />
      )}
    </div>
  );
}