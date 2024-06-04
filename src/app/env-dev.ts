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
    AUTH_SIGNIN_EMAIL: `${API_SERVER_URL}/auth/login`,
    AUTH_SIGNUP_EMAIL: `${API_SERVER_URL}/auth/register`,
    AUTH_SIGNIN_GOOGLE: `${API_SERVER_URL}/auth/google-login`,
    AUTH_SIGNUP_GOOGLE: `${API_SERVER_URL}/auth/google-register`,
    GET_USER_BY_EMAIL: `${API_SERVER_URL}/user/email`,
    USER: `${API_SERVER_URL}/user`,
    USERS: `${API_SERVER_URL}/users`,
    MODIFY_PASSWORD: `${API_SERVER_URL}/user/update-password`,
    DELETE_ACCOUNT: `${API_SERVER_URL}/user/delete-account`,
  },
};
