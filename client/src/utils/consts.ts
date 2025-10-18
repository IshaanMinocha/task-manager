const getBaseUrl = () => {
    if (typeof process !== 'undefined' && process.env.VITE_API_URL) {
        return process.env.VITE_API_URL;
    }
    return 'http://localhost:3000';
};

export const consts = {
    api: {
        baseUrl: getBaseUrl()
    },
    auth: {
        tokenKey: 'auth_token'
    }
}