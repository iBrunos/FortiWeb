"use client";
import QtdSitesCRP from "@/components/interface/cards/qtdsites/QtdSitesCRP";
import QtdSitesPH from "@/components/interface/cards/qtdsites/QtdSitesPH";
import QtdSitesTotal from "@/components/interface/cards/qtdsites/QtdSitesTotal";
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
        <h1 className="text-6xl uppercase font-bold mb-1 mt-1 text-slate-300">
          WAF
        </h1>
        <h2 className="text-2xl font-bold mb-2 mt-1 text-slate-300">
          Web Application Firewall
        </h2>
      </div>

      {/* Layout principal com GRID para organizar melhor */}
      <div
        className="z-10 grid gap-6 w-full max-w-full mt-3"
        style={{
          gridTemplateColumns: "1.2fr 1fr 0.8fr",
          gridTemplateRows: "auto auto",
        }}
      >
        {/* Coluna 1, linhas 1 e 2 */}
        <div className="bg-gray-800 p-6 rounded-3xl shadow-lg">
          <QtdSitesTotal />
          <QtdSitesCRP />
          <div className="mt-2"></div>
          <QtdSitesPH />
        </div>

        {/* AttackType ocupa colunas 2 e 3 na linha 1 */}
        <div
          className="bg-gray-800 p-6 rounded-3xl shadow-lg"
          style={{ gridColumn: "2 / 4", gridRow: "1 / 2" }}
        >
          <AttackType />
          <div className="flex mt-6 gap-6">
            <div className="flex-1">
              <FortiWebStatus />
            </div>
            <div className="flex-1">
              <CountriesTable />
            </div>
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