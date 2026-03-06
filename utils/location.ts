import { CAMPUS_BUILDINGS } from '../data/buildings';

/**
 * Calculate distance between two points in kilometers
 */
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

/**
 * Find the nearest building within a threshold (default 100 meters)
 */
export function getNearestBuilding(lat: number, lng: number, thresholdKm = 0.1) {
    let minDistance = Infinity;
    let nearestBuilding = null;

    for (const building of CAMPUS_BUILDINGS) {
        const dist = getDistance(lat, lng, building.coordinates.latitude, building.coordinates.longitude);
        if (dist < minDistance) {
            minDistance = dist;
            nearestBuilding = building;
        }
    }

    if (minDistance <= thresholdKm && nearestBuilding) {
        return nearestBuilding.name;
    }

    return null;
}

/**
 * Check if a location is within Hong Kong region
 * @param lat User's latitude
 * @param lng User's longitude
 * @returns true if the location is in Hong Kong
 */
export function isInHongKong(lat: number, lng: number): boolean {
    // Hong Kong center point coordinates (approximately Victoria Harbour)
    const HK_CENTER = { lat: 22.3193, lng: 114.1694 };
    
    // Threshold: 50km (Hong Kong is approximately 25km N-S, 40km E-W)
    const MAX_DISTANCE_KM = 50;
    
    const distance = getDistance(lat, lng, HK_CENTER.lat, HK_CENTER.lng);
    return distance <= MAX_DISTANCE_KM;
}
