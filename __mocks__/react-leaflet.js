// Mock for react-leaflet — requires a browser environment with canvas support
const React = require('react');

const MapContainer = ({ children }) => React.createElement('div', { 'data-testid': 'map-container' }, children);
const TileLayer = () => null;
const GeoJSON = () => null;
const Marker = () => null;
const Popup = ({ children }) => React.createElement('div', null, children);
const Circle = () => null;

module.exports = { MapContainer, TileLayer, GeoJSON, Marker, Popup, Circle };
