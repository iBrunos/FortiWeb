"use client";

import { useState, useEffect } from "react";
import { RxUpdate } from "react-icons/rx";
import Image from "next/image";

const QtdSites: React.FC = () => {
  const [totalCRP, setTotalCRP] = useState<number | null>(null);
  const [totalPH, setTotalPH] = useState<number | null>(null);
  const [totalSites, setTotalSites] = useState<number | null>(null);
 /*
  const API_URL_CR = "http://localhost:3001/crp/total"; // Endpoint do backend para CRP
  const API_URL_PH = "http://localhost:3001/ph/total"; // Endpoint do backend para PH
 */
  const API_URL_CR = "https://fortiwebapi.salvador.ba.gov.br/crp/total"; // Endpoint do backend para CRP
  const API_URL_PH = "https://fortiwebapi.salvador.ba.gov.br/ph/total"; // Endpoint do backend para PH
 
  const fetchData = async () => {
    try {
      // Fetch para CRP
      const responseCRP = await fetch(API_URL_CR, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
  
      if (!responseCRP.ok) {
        throw new Error(`Erro: ${responseCRP.status}`);
      }
  
      const dataCRP = await responseCRP.json();
      setTotalCRP(dataCRP.total); // Armazenando o total de CRP
  
      // Fetch para PH
      const responsePH = await fetch(API_URL_PH, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
  
      if (!responsePH.ok) {
        throw new Error(`Erro: ${responsePH.status}`);
      }
  
      const dataPH = await responsePH.json();
      setTotalPH(dataPH.total); // Armazenando o total de PH
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };
  
  // Executa a função uma vez ao carregar a página
  fetchData();
  
  // Configura a execução da função a cada 1 hora (3600000 ms)
  setInterval(fetchData, 3600000);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3600000); // Atualiza a cada hora
    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, []);

  return (
<div className="flex flex-col items-center">
  <button
    title="Atualizar dados"
    onClick={fetchData}
    className="fixed top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
  >
    <RxUpdate />
  </button>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
    {[ 
      { title: "Sites via CRP", value: totalCRP },
      { title: "Sites via PH", value: totalPH },
      { title: "Total de Sites", value: totalPH !== null && totalCRP !== null ? totalPH + totalCRP : "N/A" }
    ].map((item, index) => (
      <div key={index} className="flex flex-col rounded-3xl bg-slate-800 shadow-sm w-full md:max-w-xs p-6 md:p-8 my-4 border border-slate-600">
        <div className="pb-6 md:pb-8 m-0 mb-6 md:mb-8 text-center text-slate-100 border-b border-slate-600">
          <p className="text-lg md:text-2xl uppercase font-semibold text-slate-300">{item.title}</p>
          <h1 className="flex justify-center gap-1 mt-4 font-bold text-white text-4xl md:text-6xl">
            {item.value !== null ? item.value : "N/A"}
          </h1>
        </div>
      </div>
    ))}
  </div>
</div>

  );
};

export default QtdSites;