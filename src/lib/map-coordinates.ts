const bounds = {
  north: -34.48,
  south: -34.75,
  west: -58.55,
  east: -58.3,
};

const clampPercent = (value: number) => Math.min(100, Math.max(0, value));

export function percentToMapCoordinates(x: number, y: number) {
  return {
    lat: bounds.north - (clampPercent(y) / 100) * (bounds.north - bounds.south),
    lng: bounds.west + (clampPercent(x) / 100) * (bounds.east - bounds.west),
  };
}

export function mapCoordinatesToPercent(lat: number, lng: number) {
  return {
    x: clampPercent(((lng - bounds.west) / (bounds.east - bounds.west)) * 100),
    y: clampPercent(((bounds.north - lat) / (bounds.north - bounds.south)) * 100),
  };
}