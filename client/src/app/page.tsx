"use client";
import QtdSitesCRP from "@/components/interface/cards/qtdsites/QtdSitesCRP";
import QtdSitesPH from "@/components/interface/cards/qtdsites/QtdSitesPH";
import FortiWebStatus from "@/components/interface/cards/fortiwebStatus/FortiWebStatus";
import AttackType from "@/components/interface/cards/attackType/AttackType";
import Image from "next/image";
import CountriesTable from "@/components/interface/cards/countries/Countries";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-gray-900 text-white p-6">
      {/* Imagem de fundo */}
      <div
        className="absolute inset-0 bg-center opacity-10"
        style={{ backgroundImage: "url('/waf.png')" }}
      ></div>

      {/* Títulos */}
      <div className="z-10 flex flex-col items-center text-center">
        <h1 className="text-6xl uppercase font-bold mb-1 mt-1 text-slate-300">WAF</h1>
        <h2 className="text-2xl font-bold mb-2 mt-1 text-slate-300">
          Web Application Firewall
        </h2>
      </div>

      {/* Layout principal com GRID para organizar melhor */}
      <div className="z-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-full mt-3">
        
        {/* Coluna da tabela de países (1/3 da largura) */}
        <div className="bg-gray-800 p-6 rounded-3xl shadow-lg md:col-span-1">
          <QtdSitesCRP />
          <div className="mt-2"></div>
          <QtdSitesPH />
        </div>

        {/* Coluna da direita com os cards (2/3 da largura) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
          {/* Bloco 1 */}
          <div className="bg-gray-800 p-6 rounded-3xl shadow-lg">
            <FortiWebStatus />
          </div>

          {/* Bloco 2 */}
          <div className="bg-gray-800 p-6 rounded-3xl shadow-lg">
            <CountriesTable />
          </div>

          {/* Bloco 3 - AttackType ocupa a largura inteira da direita */}
          <div className="bg-gray-800 p-6 rounded-3xl shadow-lg col-span-1 md:col-span-2 w-full">
            <AttackType />
          </div>
        </div>
      </div>

      {/* Logo fixa no canto inferior direito */}
      <Image
        className="absolute bottom-10 top-10 opacity-60 hidden md:block"
        src="/logo_cogel.png"
        alt="Logo Cogel"
        width={150}
        height={150}
      />
    </div>
  );
}
