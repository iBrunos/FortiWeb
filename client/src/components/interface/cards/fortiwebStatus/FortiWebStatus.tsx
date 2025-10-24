import { useState, useEffect } from "react";
import { FaArrowAltCircleUp, FaArrowAltCircleDown } from "react-icons/fa";
import { IoMdGitNetwork } from "react-icons/io";

interface FortiWebStatusData {
  cpu: number;
  memory: number;
  disk: number;
  tcp_concurrent_connection: number;
  throughput_in: number;
  throughput_out: number;
}

interface FortiWebs {
  WAF01: FortiWebStatusData;
  WAF02: FortiWebStatusData;
}

const FortiWebStatus = () => {
  const [data, setData] = useState<FortiWebs | null>(null);
  const [loaded, setLoaded] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch("https://fortiwebapi.salvador.ba.gov.br/fortiwebstatus/status");
      if (!response.ok) throw new Error("Erro ao buscar dados");
      const result: FortiWebs = await response.json();
      setData(result);
      setLoaded(true);
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatThroughput = (value: number) => {
    const mbps = (value * 8) / 1048576;
    if (mbps >= 1000) return `${(mbps / 1000).toFixed(2)} Gbps`;
    return `${mbps.toFixed(2)} Mbps`;
  };

  if (!data || !data.WAF01 || !data.WAF02) {
    return (
      <div className="text-center text-white p-4 md:p-8">
        <p>Carregando dados dos FortiWebs...</p>
      </div>
    );
  }

  const renderFortiWeb = (label: string, fw: FortiWebStatusData | undefined) => {
    if (!fw) return null;

    return (
      <div className="bg-gray-800 text-white p-4 md:p-6 rounded-2xl shadow-lg w-full">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-4 text-center">{label}</h2>

        {/* Barras de uso */}
        <div className="space-y-3 md:space-y-4 mb-6">
          {(["cpu", "memory", "disk"] as (keyof FortiWebStatusData)[]).map((key) => (
            <div key={key}>
              <div className="flex justify-between text-sm md:text-base">
                <span className="capitalize">{key}:</span>
                <span className="font-semibold">{fw[key] ?? 0}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 md:h-2.5 overflow-hidden">
                <div
                  className={`bg-blue-600 h-2 md:h-2.5 rounded-full transition-all duration-1000 ${
                    loaded ? "" : "w-0"
                  }`}
                  style={{ width: `${fw[key] ?? 0}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Network Status */}
        <h3 className="text-lg md:text-xl font-bold mb-4 text-center">Network Status</h3>
        
        {/* Cards de rede */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {/* Conexões Ativas */}
          <div className="flex flex-col rounded-xl md:rounded-2xl bg-slate-700 items-center shadow-sm p-4 border border-blue-500">
            <IoMdGitNetwork className="text-white mb-2 text-lg md:text-xl" />
            <div className="text-center text-slate-100">
              <p className="uppercase font-semibold text-white text-xs md:text-sm">CONEXÕES ATIVAS</p>
              <h1 className="mt-2 font-bold text-white text-xl md:text-2xl">
                {fw.tcp_concurrent_connection ?? 0}
              </h1>
            </div>
          </div>

          {/* Throughput IN */}
          <div className="flex flex-col rounded-xl md:rounded-2xl bg-slate-700 items-center shadow-sm p-4 border border-blue-500">
            <FaArrowAltCircleDown className="text-white mb-2 text-lg md:text-xl" />
            <div className="text-center text-slate-100">
              <p className="uppercase font-semibold text-white text-xs md:text-sm">THROUGHPUT IN</p>
              <h1 className="mt-2 font-bold text-white text-lg md:text-xl">
                {formatThroughput(fw.throughput_in ?? 0)}
              </h1>
            </div>
          </div>

          {/* Throughput OUT */}
          <div className="flex flex-col rounded-xl md:rounded-2xl bg-slate-700 items-center shadow-sm p-4 border border-blue-500">
            <FaArrowAltCircleUp className="text-white mb-2 text-lg md:text-xl" />
            <div className="text-center text-slate-100">
              <p className="uppercase font-semibold text-white text-xs md:text-sm">THROUGHPUT OUT</p>
              <h1 className="mt-2 font-bold text-white text-lg md:text-xl">
                {formatThroughput(fw.throughput_out ?? 0)}
              </h1>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      {renderFortiWeb("FortiWeb 01", data.WAF01)}
      {renderFortiWeb("FortiWeb 02", data.WAF02)}
    </div>
  );
};

export default FortiWebStatus;