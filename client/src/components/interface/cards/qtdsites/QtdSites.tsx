"use client";

import { useState, useEffect } from "react";
import { RxUpdate } from "react-icons/rx";
import Image from "next/image";

const QtdSites: React.FC = () => {
  const [totalCRP, setTotalCRP] = useState<number | null>(null);
  const [totalPH, setTotalPH] = useState<number | null>(null);
  const [totalSites, setTotalSites] = useState<number | null>(null);

  const API_URL_CR = "http://fortiwebapi.salvador.ba.gov.br/crp/total"; // Endpoint do backend para CRP
  const API_URL_PH = "http://fortiwebapi.salvador.ba.gov.br/ph/total"; // Endpoint do backend para PH

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
      <h1 className="text-6xl uppercase font-bold mb-1 mt-10 text-slate-300">WAF</h1>
      <h1 className="text-2xl font-bold mb-6 mt-1 text-slate-300">Web Application Firewall</h1>

      <button
        title="Atualizar dados"
        onClick={fetchData}
        className="absolute  top-10 right-10 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
      >
        <RxUpdate />
      </button>
      <Image
        className="absolute top-[70rem] right-10"
        src="/logo_cogel.png" // Certifique-se de que o caminho da imagem está correto
        alt="Background Image"
        width={100} // Ajuste conforme necessário
        height={100} // Ajuste conforme necessário
      />

      <div className="flex justify-center gap-6 mt-6">
        <div className="flex flex-col rounded-3xl bg-slate-800 shadow-sm max-w-xs p-8 my-6 border border-slate-600">
          <div className="pb-8 m-0 mb-8 text-center text-slate-100 border-b border-slate-600">
            <p className="text-2xl uppercase font-semibold text-slate-300">
              Sites via CRP
            </p>
            <h1 className="flex justify-center gap-1 mt-4 font-bold text-white text-6xl">
              {totalCRP !== null ? totalCRP : "N/A"}
            </h1>
          </div>
        </div>

        <div className="flex flex-col rounded-3xl bg-slate-800 shadow-sm max-w-xs p-8 my-6 border border-slate-600">
          <div className="pb-8 m-0 mb-8 text-center text-slate-100 border-b border-slate-600">
            <p className="text-2xl uppercase font-semibold text-slate-300">
              Sites via PH
            </p>
            <h1 className="flex justify-center gap-1 mt-4 font-bold text-white text-6xl">
              {totalPH !== null ? totalPH : "N/A"}
            </h1>
          </div>
        </div>

        <div className="flex flex-col rounded-3xl bg-slate-800 shadow-sm max-w-xs p-8 my-6 border border-slate-600">
          <div className="pb-8 m-0 mb-8 text-center text-slate-100 border-b border-slate-600">
            <p className="text-2xl uppercase font-semibold text-slate-300">
              Total de Sites
            </p>
            <h1 className="flex justify-center gap-1 mt-4 font-bold text-white text-6xl">
              {totalPH !== null && totalCRP !== null ? totalPH + totalCRP : "N/A"}
            </h1>
          </div>
        </div>
      </div>
      <Image
      className="opacity-40"
        src="/waf.png" // Certifique-se de que o caminho da imagem está correto
        alt="Background Image"
        width={500} // Ajuste conforme necessário
        height={500} // Ajuste conforme necessário
      />

    </div>
  );
};

export default QtdSites;