import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList,
} from 'recharts';

const ContributingFactorsChart = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <h3 style={{ textAlign: 'center' }}>Contributing Factors Leading to a Crash</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 10, right: 40, left: 100, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="factor" />
          <Tooltip />
          <Bar dataKey="count" fill="#66cc99">
            <LabelList dataKey="count" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ContributingFactorsChart;
