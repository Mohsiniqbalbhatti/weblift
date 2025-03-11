import React from "react";
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

// Updated data array to include date and visitors count for each day
const data = [
  { date: "2025-03-01", visitors: 2400 }, // Added date key and renamed pv to visitors
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

function Analytics() {
  // Using react-intersection-observer to trigger the chart render when the component is fully in view
  const { ref, inView } = useInView({
    triggerOnce: true, // Trigger the animation only once
    threshold: 1, // Fire when 100% of the component is visible
  });

  return (
    <div className="row justify-content-center my-5 py-5" ref={ref}>
      <div className="col-12 mt-5 pt-5 d-flex justify-content-center flex-column align-items-center">
        {/* Updated catchy heading */}
        <h3 className="mt-5 text-cream text-center">
          Get Real-Time Visitor Trends
        </h3>
        {/* Updated description text */}
        <p className="text-light text-center w-50">
          Visualize your site's performance with an interactive chart that
          displays daily visitor counts. Hover over data points to reveal exact
          numbers and uncover peak traffic times.
        </p>
      </div>
      <div className="analytics-box">
        {inView && (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              {/* Set XAxis to use the 'date' key */}
              <XAxis dataKey="date" padding={{ left: 30, right: 30 }} />
              {/* YAxis displays the number of visitors */}
              <YAxis domain={[0, 10000]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff" }} // Tooltip background color
                labelStyle={{ color: "#555" }} // Tooltip label text style
                itemStyle={{ color: "#333" }} // Tooltip data text style
              />
              <Legend />
              {/* Updated the Line component to use 'visitors' as the data key */}
              <Line
                type="monotone"
                dataKey="visitors"
                stroke="#EDEDD6"
                dot={{ fill: "#34D0BA" }}
                activeDot={{ fill: "#34D0BA", r: 8 }}
                name="Visitors"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default Analytics;
