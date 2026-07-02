const ACCESS_TOKEN_KEY = "access_token";

export const storage = {
    getToken() {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },

    setToken(token: string) {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    },

    removeToken() {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
    },
};