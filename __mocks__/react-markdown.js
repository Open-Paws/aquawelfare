// Mock for react-markdown
const React = require('react');
const ReactMarkdown = ({ children }) => React.createElement('div', { 'data-testid': 'markdown' }, children);
module.exports = ReactMarkdown;
module.exports.default = ReactMarkdown;
