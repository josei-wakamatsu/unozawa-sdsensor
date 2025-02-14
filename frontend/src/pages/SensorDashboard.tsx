import React, { useState, useEffect } from "react";
import axios from "axios";
import { Menu } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const SensorDashboard = () => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [vibrationData, setVibrationData] = useState([]);
  const [temperature, setTemperature] = useState<(number | null)[]>(Array(1).fill(null));
  const [vibration, setVibration] = useState<(number | null)[]>(Array(2).fill(null));
  const backendUrl = "https://unozawa-sdsensor-backend.onrender.com";
  const deviceID = "unozawa";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/data/${deviceID}`);
        const latestData = response.data;

        if (latestData) {
          const timestamp = new Date().toLocaleTimeString();
          setTemperatureData(prevData => [...prevData.slice(-11), { time: timestamp, temp1: latestData.tempC[0] }]);
          setVibrationData(prevData => [...prevData.slice(-11), { time: timestamp, vib1: latestData.vReal[0], vib2: latestData.vReal[1] }]);
          setTemperature([latestData.tempC[0]]);
          setVibration([latestData.vReal[0], latestData.vReal[1]]);
        }
      } catch (error) {
        console.error("データ取得に失敗しました:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <nav className="w-full bg-white px-2 py-3 flex items-center border-b border-gray-200 gap-4">
        <Menu size={20} className="text-black" />
        <img src="/icons/showa_logo.png" alt="Showa Icon" className="h-6" />
      </nav>

      <div className="flex flex-col items-center justify-center p-4">
        <div className="px-6 py-6 bg-[#F3F4F6] rounded-lg mt-8 gap-6 w-full">
          {/* 温度センサ データ表示 */}
          <div className="bg-white rounded-md shadow p-4">
            <h2 className="text-lg font-semibold text-[#868DAA] text-center mb-4">温度センサ</h2>
            <div className="flex flex-row justify-center gap-4">
              {temperature.map((temp, index) => (
                <div key={index} className="text-center w-1/4 border border-gray-200 rounded-md p-4">
                  <p className="text-[#868DAA]">温度センサ {index + 1}</p>
                  <p className="text-lg font-bold text-gray-900">
                    {temp !== null ? `${temp} °C` : "データなし"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 振動センサ データ表示 */}
          <div className="bg-white rounded-md shadow p-4">
            <h2 className="text-lg font-semibold text-[#868DAA] text-center mb-4">振動センサ</h2>
            <div className="flex flex-row justify-center gap-4">
              {vibration.map((vib, index) => (
                <div key={index} className="text-center w-1/4 border border-gray-200 rounded-md p-4">
                  <p className="text-[#868DAA]">振動センサ {index + 1}</p>
                  <p className="text-lg font-bold text-gray-900">
                    {vib !== null ? `${vib} Hz` : "データなし"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 温度センサ グラフ */}
          <div className="bg-white rounded-md shadow p-4">
            <h2 className="text-lg font-semibold text-[#868DAA] text-center mb-4">温度センサ (リアルタイム)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={temperatureData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="temp1" stroke="#FF0000" name="温度センサ1" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 振動センサ グラフ */}
          <div className="bg-white rounded-md shadow p-4">
            <h2 className="text-lg font-semibold text-[#868DAA] text-center mb-4">振動センサ (リアルタイム)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={vibrationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="vib1" stroke="#FFA500" name="振動センサ1" />
                <Line type="monotone" dataKey="vib2" stroke="#008000" name="振動センサ2" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <p className="text-[#8091A3] pt-10 text-sm">© 2006-2025 株式会社 ショウワ 無断転載禁止。</p>
      </div>
    </div>
  );
};

export default SensorDashboard;
