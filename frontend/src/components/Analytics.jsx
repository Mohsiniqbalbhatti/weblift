import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
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
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    setNoData(false);
    const fetchAnalytics = async () => {
      try {
        if (!projectId) return;
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}project/${projectId}/analytics`,
          { withCredentials: true }
        );
        if (res.status === 202) {
          setNoData(true);
          console.log("res status", res.status);
        }
        if (res.data.dailyVisits.length > 0) {
          // CHANGED: Filter out entries that do not have a visitors count.
          // Also, use the proper key `visitors` from the backend data.
          const formatted = res.data.dailyVisits
            .filter((item) => item.visitors !== undefined) // Only include entries with a visitors property
            .map((item) => ({
              date: new Date(item.date).toISOString().split("T")[0],
              visitors: item.visitors, // Use visitors from backend data
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
    <div>
      {noData ? (
        <></>
      ) : (
        <>
          {" "}
          <div
            className={`row   ${projectId ? "card  p-3 mt-5 pt-5" : ""}`}
            ref={ref}
          >
            <div className="col-12 justify-content-center align-items-center">
              {projectId && (
                <h3 className="text-center my-2">
                  Heres the Live Analytics for your site!
                </h3>
              )}
              <div className="analytics-box mx-auto my-3">
                {inView && (
                  <ResponsiveContainer width="100%" height={300}>
                    {/* CHANGED: Use the updated data state */}
                    <LineChart data={data}>
                      <XAxis dataKey="date" />
                      <YAxis
                        domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]}
                        tickFormatter={(value) =>
                          new Intl.NumberFormat("en").format(value)
                        }
                      />
                      <Tooltip
                        contentStyle={{ color: "#FF0000" }}
                        labelStyle={{ color: "#FF0000" }}
                      />
                      <Line
                        dataKey="visitors"
                        stroke="#34D0BA"
                        dot={{ fill: "#34D0BA" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Analytics;
