import { useState, useEffect } from "react";
import { FaArrowAltCircleUp } from "react-icons/fa";
import { FaArrowAltCircleDown } from "react-icons/fa";
import { IoMdGitNetwork } from "react-icons/io";

interface FortiWebStatusData {
  cpu: number;
  memory: number;
  disk: number;
  tcp_concurrent_connection: number;
  throughput_in: number;
  throughput_out: number;
}

const FortiWebStatus = () => {
  const [data, setData] = useState<FortiWebStatusData>({
    cpu: 0,
    memory: 0,
    disk: 0,
    tcp_concurrent_connection: 0,
    throughput_in: 0,
    throughput_out: 0
  });
  const [loaded, setLoaded] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch("https://fortiwebapi.salvador.ba.gov.br/fortiwebstatus/status");
      if (!response.ok) throw new Error("Erro ao buscar dados");
      const result: FortiWebStatusData = await response.json();
      setData(result);
      setLoaded(true);
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatThroughput = (value: number) => {
    // converte para Mbps usando sua fórmula
    const mbps = (value * 8 * 10) / 1048576;
    if (mbps >= 1000) {
      return `${(mbps / 1000).toFixed(2)} Gbps`;
    }
    return `${mbps.toFixed(2)} Mbps`;
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg w-full max-w-6xl h-auto">
      <h2 className="text-xl md:text-3xl font-bold mb-4 text-center">FortiWeb Status</h2>

      {/* Barras de uso */}
      <div className="space-y-4">
        {(["cpu", "memory", "disk"] as (keyof FortiWebStatusData)[]).map((key) => (
          <div key={key}>
            <div className="flex justify-between text-sm md:text-base">
              <span>{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
              <span className="font-semibold">{data[key]}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className={`bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ${loaded ? "" : "w-0"}`}
                style={{ width: `${data[key]}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Cards */}
      <h2 className="text-xl md:text-3xl font-bold mb-4 mt-[6rem] text-center">Network Status</h2>
      <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
        {/* Conexões Ativas */}
        <div className="flex flex-col rounded-3xl bg-slate-800 items-center shadow-sm w-full md:max-w-xs p-6 md:p-8 border border-blue-500">
          <IoMdGitNetwork className="text-blue-300 mb-1" />
          <div className="pb-6 md:pb-8 mb-6 md:mb-8 text-center text-slate-100 border-b border-slate-600">
            <p className="uppercase font-semibold text-blue-300">CONEXÕES ATIVAS</p>
            <h1 className="flex justify-center gap-1 mt-4 font-bold text-white text-2xl md:text-4xl">
              {data.tcp_concurrent_connection}
            </h1>
          </div>
        </div>

        {/* Throughput IN */}
        <div className="flex flex-col rounded-3xl bg-slate-800 items-center shadow-sm w-full md:max-w-xs p-6 md:p-8 border border-green-500">
          <FaArrowAltCircleDown className="text-green-300 mb-1" />
          <div className="pb-6 md:pb-8 mb-6 md:mb-8 text-center text-slate-100 border-b border-slate-600">
            <p className="uppercase font-semibold text-green-300">THROUGHPUT IN</p>
            <h1 className="flex justify-center gap-1 mt-4 font-bold text-white text-2xl md:text-4xl">
              {formatThroughput(data.throughput_in)}
            </h1>
          </div>
        </div>

        {/* Throughput OUT */}
        <div className="flex flex-col rounded-3xl bg-slate-800 items-center shadow-sm w-full md:max-w-xs p-6 md:p-8 border border-red-500">
          <FaArrowAltCircleUp className="text-red-300 mb-1" />
          <div className="pb-6 md:pb-8 mb-6 md:mb-8 text-center text-slate-100 border-b border-slate-600">
            <p className="uppercase font-semibold text-red-300">THROUGHPUT OUT </p>
            <h1 className="flex justify-center gap-1 mt-4 font-bold text-white text-2xl md:text-4xl">
              {formatThroughput(data.throughput_out)}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FortiWebStatus;
