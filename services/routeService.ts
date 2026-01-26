import { apiClient } from './apiClient';
import { authService } from './authService';

export interface RouteDefinition {
  id: number;
  origin: string;
  destination: string;
  createdBy?: string | null;
  modifiedBy?: string | null;
  createdDate?: string;
  modifiedDate?: string | null;
  isRemoved: boolean;
}

const getAllRoutes = async (): Promise<RouteDefinition[]> => {
  const { data } = await apiClient.get('/Routes', {
    headers: authService.getAuthHeader()
  });
  return data;
};

const searchRoutes = async (origin?: string, destination?: string): Promise<RouteDefinition[]> => {
  const routes = await getAllRoutes();
  return routes.filter(route => {
    const matchOrigin = !origin || route.origin.toLowerCase().includes(origin.toLowerCase());
    const matchDest = !destination || route.destination.toLowerCase().includes(destination.toLowerCase());
    return matchOrigin && matchDest && !route.isRemoved;
  });
};

const createRoute = async (origin: string, destination: string): Promise<RouteDefinition> => {
  const { data } = await apiClient.post('/Routes', { origin, destination }, {
    headers: authService.getAuthHeader()
  });
  return data;
};

const updateRoute = async (id: number, origin: string, destination: string): Promise<RouteDefinition> => {
  const { data } = await apiClient.put(`/Routes/${id}`, { origin, destination }, {
    headers: authService.getAuthHeader()
  });
  return data;
};

const getUniqueAirports = async (): Promise<{ code: string; city: string; name: string }[]> => {
  const routes = await getAllRoutes();
  const airportCodes = new Set<string>();
  
  routes.forEach(route => {
    if (!route.isRemoved) {
      airportCodes.add(route.origin);
      airportCodes.add(route.destination);
    }
  });
  
  return Array.from(airportCodes).map(code => ({
    code,
    city: code,
    name: code
  })).sort((a, b) => a.code.localeCompare(b.code));
};

const deleteRoute = async (id: number): Promise<boolean> => {
  await apiClient.delete(`/Routes/${id}`, {
    headers: authService.getAuthHeader()
  });
  return true;
};

export const routeService = {
  getAll: getAllRoutes,
  search: searchRoutes,
  create: createRoute,
  update: updateRoute,
  delete: deleteRoute,
  getUniqueAirports
};
