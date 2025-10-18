function getBaseUrl(): string {
    try {
        return import.meta.env.VITE_API_URL || 'http://localhost:3000';
    } catch {
        return 'http://localhost:3000';
    }
}

export const consts = {
    api: {
        baseUrl: getBaseUrl()
    },
    auth: {
        tokenKey: 'auth_token'
    }
}
