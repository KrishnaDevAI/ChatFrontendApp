const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

async function postAuthRequest(path, payload) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.detail || data.message || 'Request failed');
    }

    return data;
}

export const login = (payload) => postAuthRequest('/auth/login/', payload);
export const register = (payload) => postAuthRequest('/auth/register/', payload);
export const googleLogin = (accessToken) => postAuthRequest('/auth/google/', { access_token: accessToken });
export const logout = () => postAuthRequest('/auth/logout/', {});