// // src/components/Chart.js
// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

// const Chart = ({ data }) => {
//   // const isPieChart = data.hasOwnProperty("completed");
//   // const progress = data.progress || 0;
//   return (
//     <div className="chart">
//       <ResponsiveContainer width="100%" height={300}>
//         <PieChart>
//           <Pie
//             data={[
//               { name: "Completed", value: data.progress },
//               { name: "Remaining", value: 100 - data.progress },
//               // { name: "Not Started", value: data.notStarted },
//             ]}
//             cx="50%"
//             cy="50%"
//             innerRadius={40}
//             outerRadius={80}
//             // fill="#82ca9d"
//             // label
//             dataKey="value"
//             label={({ value }) => `${value.toFixed(1)}%`}
//           >
//             <Cell fill="#16C024" />
//             <Cell fill="red" />
//             {/* <Cell key="completed" fill="#82ca9d" /> */}
//             {/* <Cell key="inProgress" fill="#00AAFF" /> */}
//             {/* <Cell key="notStarted" fill="#FFBB28" /> */}
//           </Pie>
//           {/* <Tooltip /> */}
//           <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
//           <Legend />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default Chart;


// src/components/Chart.js
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Chart = ({ data }) => {
  // Destructure progress and optionally add other fields
  const progress = data.progress || 0;
  const notStarted = data.notStarted || 0;  // Ensure this is part of data if needed
  const inProgress = data.inProgress || 0;  // Add this field if needed
  
  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={[
              { name: "Completed", value: progress },
              { name: "Remaining", value: 100 - progress },
              // Add notStarted and inProgress if those fields are available
              // { name: "Not Started", value: notStarted },
              // { name: "In Progress", value: inProgress },
            ]}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            dataKey="value"
            label={({ value }) => `${value.toFixed(1)}%`}
          >
            <Cell fill="#16C024" /> {/* Completed */}
            <Cell fill="red" /> {/* Remaining */}
            {/* Uncomment if you want more fields */}
            {/* <Cell fill="#FFBB28" /> {/* Not Started */}
            {/* <Cell fill="#00AAFF" /> {/* In Progress */}
          </Pie>
          <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
