// Mock for recharts — requires canvas, not available in jsdom
const React = require('react');

const noop = () => null;
const passthrough = ({ children }) => React.createElement('div', null, children);

module.exports = {
  AreaChart: passthrough,
  Area: noop,
  BarChart: passthrough,
  Bar: noop,
  LineChart: passthrough,
  Line: noop,
  PieChart: passthrough,
  Pie: noop,
  Cell: noop,
  XAxis: noop,
  YAxis: noop,
  CartesianGrid: noop,
  Tooltip: noop,
  Legend: noop,
  ResponsiveContainer: passthrough,
  RadarChart: passthrough,
  PolarGrid: noop,
  PolarAngleAxis: noop,
  PolarRadiusAxis: noop,
  Radar: noop,
};
