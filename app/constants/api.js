//export const API_URL = "https://mobile-app-sms0.onrender.com";
// Nếu test trên điện thoại thật: dùng IP LAN của máy tính
 export const API_URL = "http://192.168.234.14:3000";

// Định nghĩa các endpoint
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_URL}/auth/signin`,
    REGISTER: `${API_URL}/auth/signup`,
    VERIFY_TOKEN: `${API_URL}/api/auth/verify-token`,
  },
  // User endpoints
  USER: {
    GET_ALL: `${API_URL}/api/v1/users`,
    GET_BY_ID: (id) => `${API_URL}/api/v1/users/${id}`,
    UPDATE: (id) => `${API_URL}/api/v1/users/${id}`,
    DELETE: (id) => `${API_URL}/api/v1/users/${id}`,
    UPDATE_PASSWORD: (id) => `${API_URL}/api/v1/users/${id}/password`,
    GET_STAT: (id) => `${API_URL}/api/v1/users/${id}/recycle-stats`,
  },

  MATERIAL: {
    GET_ALL: `${API_URL}/api/v1/materials`,
    GET_BY_ID: (id) => `${API_URL}/api/v1/materials/${id}`,
    CREATE: `${API_URL}/api/v1/materials`,
    UPDATE: (id) => `${API_URL}/api/v1/materials/${id}`,
    DELETE: (id) => `${API_URL}/api/v1/materials/${id}`,
  },

  TYPE: {
    GET_ALL: `${API_URL}/api/v1/types`,
    GET_BY_ID: (id) => `${API_URL}/api/v1/types/${id}`,
    CREATE: `${API_URL}/api/v1/types`,
    UPDATE: (id) => `${API_URL}/api/v1/types/${id}`,
    DELETE: (id) => `${API_URL}/api/v1/types/${id}`,
  },
  REWARD: {
    GET_ALL: `${API_URL}/api/v1/rewards`,
    GET_BY_ID: (id, userid) => `${API_URL}/api/v1/rewards/${id}?userId=${userid}`,
    CREATE: `${API_URL}/api/v1/rewards`,
    UPDATE: (id) => `${API_URL}/api/v1/rewards/${id}`,
    DELETE: (id) => `${API_URL}/api/v1/rewards/${id}`,
    GET_BY_TYPE: (type, page = 1, limit = 10) =>
      `${API_URL}/api/v1/rewards/type/${type}?page=${page}&limit=${limit}`,
    TOGGLE_FAVORITE: (userId, rewardId) =>
      `${API_URL}/api/v1/rewards/favorite?userId=${userId}&rewardId=${rewardId}`,
  },
  CENTER: {
    GET_ALL: `${API_URL}/api/v1/centers`,
    GET_BY_ID: (id) => `${API_URL}/api/v1/centers/${id}`,
    CREATE: `${API_URL}/api/v1/centers`,
    UPDATE: (id) => `${API_URL}/api/v1/centers/${id}`,
    DELETE: (id) => `${API_URL}/api/v1/centers/${id}`,
  },
  CART: {
    ADD: (userId) => `${API_URL}/api/v1/rewards/cart?id=${userId}`,
    INCREASE: (userId) => `${API_URL}/api/v1/rewards/increase/${userId}`,
    DECREASE: (userId) => `${API_URL}/api/v1/rewards/decrease/${userId}`,
    GET_ITEMS: (userId) => `${API_URL}/api/v1/rewards/cart?id=${userId}`,
    GET_SUMMARY: (userId) => `${API_URL}/api/v1/rewards/${userId}/summary`,
  },
};