"use client";
import QtdSites from "@/components/interface/cards/qtdsites/QtdSites";
import FortiWebStatus from "@/components/interface/cards/fortiwebStatus/FortiWebStatus";
import AttackType from "@/components/interface/cards/attackType/AttackType";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      {/* Imagem de fundo */}
      <div
        className="absolute inset-0 bg-center opacity-10"
        style={{ backgroundImage: "url('/waf.png')" }}
      ></div>

      {/* Títulos */}
      <div className="z-10 flex flex-col items-center text-center">
        <h1 className="text-6xl uppercase font-bold mb-1 mt-10 text-slate-300">WAF</h1>
        <h2 className="text-2xl font-bold mb-6 mt-1 text-slate-300">
          Web Application Firewall
        </h2>
      </div>

      {/* Layout principal em GRID (Removido o bloco extra) */}
      <div className="z-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[100rem]">
        {/* Bloco 1 */}
        <div className="bg-gray-800 p-6 rounded-3xl shadow-lg">
          <FortiWebStatus />
        </div>

        {/* Bloco 2 */}
        <div className="bg-gray-800 p-6 rounded-3xl shadow-lg">
          <QtdSites />
        </div>

        {/* Bloco 3 - AttackType ocupa a largura inteira */}
        <div className="bg-gray-800 p-6 rounded-3xl shadow-lg col-span-1 md:col-span-2">
          <AttackType />
        </div>
      </div>

      {/* Logo fixa no canto inferior direito */}
      <Image
        className="absolute bottom-10 right-10 opacity-60"
        src="/logo_cogel.png"
        alt="Logo Cogel"
        width={100}
        height={100}
      />
    </div>
  );
}