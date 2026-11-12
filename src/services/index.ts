export { ApiError, getErrorMessage, normalizeError, type ApiErrorKind } from './apiError';
export { api, aiApi } from './api';
export {
  fetchCurrentUser,
  loginRequest,
  logoutRequest,
  registerRequest,
  type LoginPayload,
  type RegisterPayload,
} from './authService';
export { setAuthTokenGetter, setUnauthorizedHandler } from './authBridge';
export { config } from './config';
export { clearCache, readCache, writeCache } from './cache';
export { listAlerts, markAlertAsRead } from './alertService';
export { requestRecommendations } from './recommendationService';
export { getDevice, getLatestReadings, listDevices, listSensors } from './deviceService';
export { getHistory, type HistoryQuery } from './historyService';
export {
  createProperty,
  deleteProperty,
  getProperty,
  listProperties,
  updateProperty,
} from './propertyService';
