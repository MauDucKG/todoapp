import axios from 'axios';
async function handleTokenRefresh() {
    const refreshToken = localStorage.getItem('refreshToken');

    try {
        const response = await axios.post('https://localhost:7260/api/User/refresh', { refreshToken });
        const newAccessToken = response.data.accessToken;

        localStorage.setItem('token', newAccessToken);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
export default handleTokenRefresh;