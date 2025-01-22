const SERVER_URL = 'http://localhost:8080';

const API_SERVER_URL = `${SERVER_URL}/api/v0`;

export const environment = {
  API: {
    BASE_SERVER_URL: API_SERVER_URL,
    PING_URL: `${API_SERVER_URL}/ping`,
    ADD_MEAL_PRODUCT_URL: `${API_SERVER_URL}/products/create`,
    GET_MEAL_PRODUCTS_URL: `${API_SERVER_URL}/products/get`,
    DELETE_MEAL_PRODUCTS_URL: `${API_SERVER_URL}/products/delete`,
    UPDATE_MEAL_PRODUCTS_URL: `${API_SERVER_URL}/products/update`,
  },
  NON_AUTH_API: {
    PING_URL: `${API_SERVER_URL}/ping`,
    AUTH_SIGNIN_EMAIL: `${API_SERVER_URL}/auth/login`,
    AUTH_SIGNUP_EMAIL: `${API_SERVER_URL}/auth/register`,
    AUTH_SIGNIN_GOOGLE: `${API_SERVER_URL}/auth/google-login`,
    AUTH_SIGNUP_GOOGLE: `${API_SERVER_URL}/auth/google-register`,
    REFRESH_TOKEN: `${API_SERVER_URL}/refreshToken`,
    BANNER: `${API_SERVER_URL}/banners/displayed`,
    SUBSCRIBE: `${API_SERVER_URL}/subscribe`,
  },
};
