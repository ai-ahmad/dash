import React, { useEffect, useState } from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from "recharts";
import { FaBox, FaBullhorn, FaClipboardList, FaSpinner } from "react-icons/fa"; // Импортируем иконку загрузки

const Home = () => {
  const [applications, setApplications] = useState([]);
  const [products, setProducts] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [advertising, setAdvertising] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true); // Стейт загрузки

  // Запросы данных
  const requestApplications = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/zayavka/");
      const result = await response.json();
      if (Array.isArray(result.data)) {
        setApplications(result.data);
        setRecentApplications(result.data.slice(0, 5));
      } else {
        console.warn("Expected data to be an array, got:", result.data);
      }
    } catch (e) {
      console.log("ERROR: ", e);
    } finally {
      setLoading(false); // Устанавливаем загрузку в false после получения данных
    }
  };

  const requestProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/card");
      const data = await response.json();
      setProducts(data);
    } catch (e) {
      console.log("ERROR: ", e);
    }
  };

  const requestAdvertising = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/banner");
      const ads = await response.json();
      setAdvertising(ads);
    } catch (e) {
      console.log("ERROR: ", e);
    }
  };

  const requestNews = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/news/");
      const newsData = await response.json();
      if (Array.isArray(newsData)) {
        setNews(newsData);
      } else {
        console.warn("Expected newsData to be an array, got:", newsData);
      }
    } catch (e) {
      console.log("ERROR: ", e);
    }
  };

  useEffect(() => {
    requestApplications();
    requestProducts();
    requestAdvertising();
    requestNews();
  }, []);

  const prepareCandleData = () => {
    return applications.map(app => ({
      date: app.date,
      open: app.totalAmount * 0.8,
      close: app.totalAmount,
      high: app.totalAmount * 1.2,
      low: app.totalAmount * 0.6,
      orderCount: app.count,
    }));
  };

  const candleData = prepareCandleData();

  return (
    <div className="w-10/12 p-5">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <FaSpinner className="animate-spin text-3xl text-gray-50 w-[50px] h-[50px]" /> {/* Иконка загрузки */}
        </div>
      ) : (
        <>
          <div className="p-5 w-full flex items-center justify-between flex-wrap gap-4">
            {/* Продукты */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 shadow-lg flex-1 w-1/4 text-right text-white">
              <div className="flex justify-between items-center">
                <FaBox size={30} />
                <div>
                  <p className="text-2xl font-bold">{products.length}</p>
                  <p className="text-sm font-bold text-opacity-80">Products Assortment</p>
                </div>
              </div>
            </div>

            {/* Новости */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 shadow-lg flex-1 w-1/4 text-right text-white">
              <div className="flex justify-between items-center">
                <FaBox size={30} />
                <div>
                  <p className="text-2xl font-bold">{news.length}</p>
                  <p className="text-sm font-bold text-opacity-80">News</p>
                </div>
              </div>
            </div>

            {/* Заявки */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500 to-teal-600 shadow-lg flex-1 w-1/4 text-right text-white">
              <div className="flex justify-between items-center">
                <FaClipboardList size={30} />
                <div>
                  <p className="text-2xl font-bold">{applications.length}</p>
                  <p className="text-sm font-bold text-opacity-80">Total Applications</p>
                </div>
              </div>
            </div>

            {/* Реклама */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg flex-1 w-1/4 text-right text-white">
              <div className="flex justify-between items-center">
                <FaBullhorn size={30} />
                <div>
                  <p className="text-2xl font-bold">{advertising.length}</p>
                  <p className="text-sm font-bold text-opacity-80">Active Advertising</p>
                </div>
              </div>
            </div>
          </div>

          {/* График для заявок */}
          <div className="p-5 mt-10 bg-base-200 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Applications Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={candleData}>
                <CartesianGrid strokeDasharray="2 2" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area dataKey="high" fill="#82ca9d" stroke="#82ca9d" />
                <Area dataKey="low" fill="#ff0000" stroke="#ff0000" />
                <Bar dataKey="close" fill="#8884d8" name="Total Amount" />
                <Bar dataKey="orderCount" fill="#82ca9d" name="Order Count" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Список последних заявок */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Recent Applications</h2>
            <ul>
              {recentApplications.map((app) => (
                <li key={app._id} className="p-2 border-b border-gray-200 flex justify-between">
                  <span>Application #{app.id}</span>
                  <span>Total: ${app.totalAmount}</span>
                  <span>{app.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
