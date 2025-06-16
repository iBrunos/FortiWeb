"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaInfoCircle, FaTimes, FaBell } from 'react-icons/fa';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

interface AlertSystemProps {
  cpuUsage?: number;
  memoryUsage?: number;
  diskUsage?: number;
  attackCount?: number;
}

export const AlertSystem: React.FC<AlertSystemProps> = ({
  cpuUsage = 0,
  memoryUsage = 0,
  diskUsage = 0,
  attackCount = 0
}) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);

  useEffect(() => {
    const newAlerts: Alert[] = [];

    // CPU Alert
    if (cpuUsage > 80) {
      newAlerts.push({
        id: `cpu-${Date.now()}`,
        type: cpuUsage > 90 ? 'critical' : 'warning',
        title: 'Alto uso de CPU',
        message: `CPU está em ${cpuUsage}%`,
        timestamp: new Date(),
        acknowledged: false
      });
    }

    // Memory Alert
    if (memoryUsage > 80) {
      newAlerts.push({
        id: `memory-${Date.now()}`,
        type: memoryUsage > 90 ? 'critical' : 'warning',
        title: 'Alto uso de Memória',
        message: `Memória está em ${memoryUsage}%`,
        timestamp: new Date(),
        acknowledged: false
      });
    }

    // Disk Alert
    if (diskUsage > 85) {
      newAlerts.push({
        id: `disk-${Date.now()}`,
        type: diskUsage > 95 ? 'critical' : 'warning',
        title: 'Espaço em disco baixo',
        message: `Disco está em ${diskUsage}%`,
        timestamp: new Date(),
        acknowledged: false
      });
    }

    // Attack Alert
    if (attackCount > 1000) {
      newAlerts.push({
        id: `attack-${Date.now()}`,
        type: attackCount > 5000 ? 'critical' : 'warning',
        title: 'Alto volume de ataques',
        message: `${attackCount} ataques detectados`,
        timestamp: new Date(),
        acknowledged: false
      });
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev.slice(0, 9)]); // Keep only 10 most recent
    }
  }, [cpuUsage, memoryUsage, diskUsage, attackCount]);

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, acknowledged: true } : alert
    ));
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500" />;
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  const getAlertBgColor = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return 'bg-red-900 border-red-500';
      case 'warning':
        return 'bg-yellow-900 border-yellow-500';
      default:
        return 'bg-blue-900 border-blue-500';
    }
  };

  const unacknowledgedCount = alerts.filter(alert => !alert.acknowledged).length;

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Alert Bell */}
      <button
        onClick={() => setShowAlerts(!showAlerts)}
        className="relative bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-colors"
      >
        <FaBell className="w-6 h-6" />
        {unacknowledgedCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {unacknowledgedCount}
          </span>
        )}
      </button>

      {/* Alerts Panel */}
      <AnimatePresence>
        {showAlerts && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-16 right-0 w-80 max-h-96 overflow-y-auto bg-gray-800 rounded-lg shadow-xl border border-gray-600"
          >
            <div className="p-4 border-b border-gray-600">
              <h3 className="text-white font-semibold">Alertas do Sistema</h3>
            </div>
            
            <div className="p-2">
              {alerts.length === 0 ? (
                <p className="text-gray-400 text-center py-4">Nenhum alerta ativo</p>
              ) : (
                alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-2 p-3 rounded-lg border ${getAlertBgColor(alert.type)} ${
                      alert.acknowledged ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-2">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm">{alert.title}</h4>
                          <p className="text-gray-300 text-xs">{alert.message}</p>
                          <p className="text-gray-400 text-xs mt-1">
                            {alert.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        {!alert.acknowledged && (
                          <button
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded"
                          >
                            ✓
                          </button>
                        )}
                        <button
                          onClick={() => removeAlert(alert.id)}
                          className="text-gray-400 hover:text-white"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlertSystem;