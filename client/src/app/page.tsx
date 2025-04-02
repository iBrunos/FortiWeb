"use client";
import QtdSites from "@/components/interface/cards/qtdsites/QtdSites";
import FortiWebStatus from "@/components/interface/cards/fortiwebStatus/FortiWebStatus";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      {/* Imagem de fundo */}
      <div className="absolute inset-0  bg-center opacity-10" style={{ backgroundImage: "url('/waf.png')" }}></div>

      {/* Títulos */}
      <div className="z-10 flex flex-col items-center text-center">
        <h1 className="text-6xl uppercase font-bold mb-1 mt-10 text-slate-300">WAF</h1>
        <h2 className="text-2xl font-bold mb-6 mt-1 text-slate-300">Web Application Firewall</h2>
      </div>

      {/* Conteúdo principal */}
      <div className="z-10 flex flex-col items-center space-y-6">
        <FortiWebStatus />
        <QtdSites />
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
