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
import { FaBox, FaBullhorn, FaClipboardList, FaSpinner, FaStore } from "react-icons/fa";

const Home = () => {
  const [applications, setApplications] = useState([]);
  const [products, setProducts] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [advertising, setAdvertising] = useState([]);
  const [news, setNews] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [loading, setLoading] = useState(true);

  const requestApplications = async () => {
    try {
      const response = await fetch("https://admin-dash-oil-trade.onrender.com/api/v1/zayavka/");
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
      setLoading(false);
    }
  };

  const requestProducts = async () => {
    try {
      const response = await fetch("https://admin-dash-oil-trade.onrender.com/api/v1/card");
      const data = await response.json();
      setProducts(data);
    } catch (e) {
      console.log("ERROR: ", e);
    }
  };

  const requestAdvertising = async () => {
    try {
      const response = await fetch("https://admin-dash-oil-trade.onrender.com/api/v1/banner");
      const ads = await response.json();
      setAdvertising(ads);
    } catch (e) {
      console.log("ERROR: ", e);
    }
  };

  const requestNews = async () => {
    try {
      const response = await fetch("https://admin-dash-oil-trade.onrender.com/api/v1/news/");
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
          <FaSpinner className="animate-spin text-3xl text-gray-50 w-[50px] h-[50px]" />
        </div>
      ) : (
        <>
          {/* Dashboard Cards */}
          <div className="p-5 w-full flex items-center justify-between flex-wrap gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 shadow-lg flex-1 w-1/4 text-right text-white">
              <div className="flex justify-between items-center">
                <FaBox size={30} />
                <div>
                  <p className="text-2xl font-bold">{products.length}</p>
                  <p className="text-sm font-bold text-opacity-80">Ассортимент товаров</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 shadow-lg flex-1 w-1/4 text-right text-white">
              <div className="flex justify-between items-center">
                <FaBox size={30} />
                <div>
                  <p className="text-2xl font-bold">{news.length}</p>
                  <p className="text-sm font-bold text-opacity-80">Новости</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500 to-teal-600 shadow-lg flex-1 w-1/4 text-right text-white">
              <div className="flex justify-between items-center">
                <FaClipboardList size={30} />
                <div>
                  <p className="text-2xl font-bold">{applications.length}</p>
                  <p className="text-sm font-bold text-opacity-80">Всего заявок</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg flex-1 w-1/4 text-right text-white">
              <div className="flex justify-between items-center">
                <FaBullhorn size={30} />
                <div>
                  <p className="text-2xl font-bold">{advertising.length}</p>
                  <p className="text-sm font-bold text-opacity-80">Активная реклама</p>
                </div>
              </div>
            </div>

          </div>

          {/* Updated Chart Section */}
          <div className="p-5 mt-10 bg-base-200 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Обзор заявок</h2>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={candleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" label={{ value: "Дата", position: "insideBottomRight", offset: -10 }} />
                <YAxis
                  label={{ value: "Сумма ($)", angle: -90, position: "insideLeft" }}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "Максимальная сумма" || name === "Минимальная сумма" || name === "Общая сумма") {
                      return `$${value.toFixed(2)}`;
                    }
                    return value;
                  }}
                />
                <Legend verticalAlign="top" height={36} />

                <Area type="monotone" dataKey="high" fill="#82ca9d" stroke="#82ca9d" name="Максимальная сумма" />
                <Area type="monotone" dataKey="low" fill="#ff4d4f" stroke="#ff4d4f" name="Минимальная сумма" />
                <Bar dataKey="close" fill="#8884d8" name="Общая сумма" />
                <Bar dataKey="orderCount" fill="#83a6ed" name="Количество заказов" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

        </>
      )}
    </div>
  );
};

export default Home;
