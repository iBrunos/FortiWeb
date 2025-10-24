"use client";
import QtdSitesCRP from "@/components/interface/cards/qtdsites/QtdSitesCRP";
import QtdSitesTotal from "@/components/interface/cards/qtdsites/QtdSitesTotal";
import FortiWebStatus from "@/components/interface/cards/fortiwebStatus/FortiWebStatus";
import AttackType from "@/components/interface/cards/attackType/AttackType";
import Image from "next/image";
import CountriesTable from "@/components/interface/cards/countries/Countries";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-gray-900 text-white p-4 md:p-6">
      {/* Imagem de fundo */}
      <div
        className="absolute inset-0 bg-center opacity-10 bg-cover"
        style={{ backgroundImage: "url('/waf.png')" }}
      ></div>

      {/* Cabeçalho */}
      <div className="z-10 flex flex-col items-center text-center mb-4 md:mb-6">
        <h1 className="text-4xl md:text-6xl uppercase font-bold mb-1 mt-1 text-slate-300">
          WAF
        </h1>
        <h2 className="text-lg md:text-2xl font-bold mb-2 mt-1 text-slate-300">
          Web Application Firewall
        </h2>
      </div>

      {/* Layout principal responsivo */}
      <div className="z-10 flex flex-col lg:grid gap-4 md:gap-6 w-full max-w-full">
        {/* Primeira linha: Total de Sites e Attack Type */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Coluna 1: Total de Sites */}
          <div className="lg:col-span-1">
            <QtdSitesCRP />
          </div>

          {/* Coluna 2 e 3: Conteúdo principal */}
          <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6">
            {/* Status dos FortiWebs */}
            <FortiWebStatus />

            {/* Attack Type e Countries lado a lado */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <CountriesTable />
              <AttackType />

            </div>
          </div>
        </div>
      </div>

      {/* Logo responsiva */}
      <div className="z-10 flex justify-center md:block md:absolute md:bottom-6 md:right-6 mt-6 md:mt-0">
        <Image
          className="opacity-60"
          src="/logo_cogel.png"
          alt="Logo Cogel"
          width={120}
          height={120}
          priority
        />
      </div>
    </div>
  );
}