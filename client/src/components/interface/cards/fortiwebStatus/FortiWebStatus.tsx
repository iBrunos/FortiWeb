import { useState, useEffect } from "react";

interface FortiWebStatusData {
  cpu: number;
  memory: number;
  disk: number;
  tcp_concurrent_connection: number;
}

const FortiWebStatus = () => {
  const [data, setData] = useState<FortiWebStatusData>({
    cpu: 0,
    memory: 0,
    disk: 0,
    tcp_concurrent_connection: 0,
  });
  const [loaded, setLoaded] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch("https://fortiwebapi.salvador.ba.gov.br/fortiwebstatus/status"); // Ajuste a URL conforme necessário
      if (!response.ok) {
        throw new Error("Erro ao buscar dados");
      }
      const result: FortiWebStatusData = await response.json();
      setData(result);
      setLoaded(true);
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Atualiza a cada 10 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg w-[70rem] h-[20rem]">
      <h2 className="text-3xl font-bold mb-4">FortiWeb Status</h2>
      <div className="space-y-3">
        {(Object.keys(data) as Array<keyof FortiWebStatusData>).filter(key => key !== "tcp_concurrent_connection").map((key) => (
          <div key={key}>
            <div className="flex justify-between">
              <span>{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
              <span className="font-semibold">{data[key]}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
              <div
                className={`bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ${loaded ? '' : 'w-0'}`}
                style={{ width: `${data[key]}%` }}
              ></div>
            </div>
          </div>
        ))}
        <div className="flex justify-between mt-3">
          <span>Conexões Ativas:</span>
          <span className="font-semibold">{data.tcp_concurrent_connection}</span>
        </div>
      </div>
    </div>
  );
};

export default FortiWebStatus;
