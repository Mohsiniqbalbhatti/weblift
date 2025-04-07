import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useInView } from "react-intersection-observer";

// Default static data
const defaultData = [
  { date: "2025-03-01", visitors: 2400 },
  { date: "2025-03-02", visitors: 1398 },
  { date: "2025-03-03", visitors: 9800 },
  { date: "2025-03-04", visitors: 1400 },
  { date: "2025-03-05", visitors: 3398 },
  { date: "2025-03-06", visitors: 7800 },
  { date: "2025-03-07", visitors: 3908 },
  { date: "2025-03-08", visitors: 4800 },
  { date: "2025-03-09", visitors: 3800 },
  { date: "2025-03-10", visitors: 5300 },
];

function Analytics({ projectId }) {
  const [data, setData] = useState(defaultData);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 1 });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        if (!projectId) return;
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}project/${projectId}/analytics`,
          { withCredentials: true }
        );

        if (res.data.dailyVisits.length > 0) {
          // CHANGED: map backend `count` → `visitors` and format date strings
          const formatted = res.data.dailyVisits.map((item) => ({
            date: new Date(item.date).toISOString().split("T")[0],
            visitors: item.count,
          }));
          setData(formatted);
        } else {
          // Fallback to generated data if no visits yet
          setData(generateFallbackData(res.data.createdAt));
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchAnalytics();
  }, [projectId]);

  const generateFallbackData = (createdAt) => {
    const startDate = new Date(createdAt);
    const daysDiff = Math.ceil(
      (new Date() - startDate) / (1000 * 60 * 60 * 24)
    );
    return Array.from({ length: daysDiff }, (_, i) => ({
      date: new Date(startDate.getTime() + i * 86400000)
        .toISOString()
        .split("T")[0],
      visitors: 0,
    }));
  };

  return (
    <div className="row justify-content-center" ref={ref}>
      <div className="analytics-box">
        {inView && (
          <ResponsiveContainer width="100%" height={300}>
            {/* CHANGED: always use `data` state; it starts as defaultData and becomes real when projectId is set */}
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis
                domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]}
                tickFormatter={(value) =>
                  new Intl.NumberFormat("en").format(value)
                }
              />
              <Tooltip />
              <Line
                dataKey="visitors"
                stroke="#EDEDD6"
                dot={{ fill: "#34D0BA" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default Analytics;
