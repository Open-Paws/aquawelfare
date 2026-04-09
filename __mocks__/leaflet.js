// Mock for leaflet — not compatible with jsdom
const leaflet = {
  map: jest.fn(),
  tileLayer: jest.fn(),
  geoJSON: jest.fn(),
  Icon: jest.fn(),
};
module.exports = leaflet;
