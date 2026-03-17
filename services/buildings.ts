import { CampusLocation } from '../types';
import { supabase } from './supabase';

<<<<<<< Updated upstream
const HIDDEN_BUILDING_IDS = new Set(['lam-woo', 'sc-lw']);

export const getBuildings = async (): Promise<CampusLocation[]> => {
=======
let cachedBuildings: CampusLocation[] | null = null;
let fetchBuildingsPromise: Promise<CampusLocation[]> | null = null;

export const prefetchBuildings = () => {
    if (!fetchBuildingsPromise) {
        fetchBuildingsPromise = _getBuildingsInternal().then(data => {
            cachedBuildings = data;
            return data;
        });
    }
    return fetchBuildingsPromise;
};

export const getBuildings = async (forceRefresh = false): Promise<CampusLocation[]> => {
    if (forceRefresh) {
        cachedBuildings = null;
        fetchBuildingsPromise = null;
    }
    if (cachedBuildings) return cachedBuildings;
    return prefetchBuildings();
};

const _getBuildingsInternal = async (): Promise<CampusLocation[]> => {
>>>>>>> Stashed changes
    const { data, error } = await supabase
        .from('buildings')
        .select('*')
        .order('id');

    if (error) {
        console.error('Error fetching buildings:', error.message);
        throw error;
    }

    // Map from database schema (snake_case) to application type (camelCase)
    return (data || [])
        .filter(b => !HIDDEN_BUILDING_IDS.has(b.id))
        .map(b => ({
            id: b.id,
            name: b.name,
            category: b.category as any,
            description: b.description,
            imageUrl: b.image_url,
            coordinates: {
                latitude: b.lat,
                longitude: b.lng
            }
        }));
};
