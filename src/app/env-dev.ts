const SERVER_URL = 'http://localhost:8080';

const API_SERVER_URL = `${SERVER_URL}/api/v0`;

export const environment = {
  API: {
    BASE_SERVER_URL: API_SERVER_URL,
    PING_URL: `${API_SERVER_URL}/ping`,
    ADD_MEAL_PRODUCT_URL: `${API_SERVER_URL}/product/create`,
    GET_MEAL_PRODUCTS_URL: `${API_SERVER_URL}/product/get`,
    DELETE_MEAL_PRODUCTS_URL: `${API_SERVER_URL}/product/delete`,
    UPDATE_MEAL_PRODUCTS_URL: `${API_SERVER_URL}/product/update`,
    AUTH_SIGNIN: `${API_SERVER_URL}/auth/login`,
    AUTH_SIGNUP: `${API_SERVER_URL}/auth/register`,
    GET_USER_BY_EMAIL: `${API_SERVER_URL}/user/email`,
  },
};
