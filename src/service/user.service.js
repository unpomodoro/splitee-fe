import axios from 'axios';
import authHeader from './auth-header';
const API_URL = 'http://localhost:8080/api/test/';
class UserService {
    // group's detail page is "public" (bills)
    getPublicContent() {
        return axios.get(API_URL + 'all');
    }

    // Otherwise users have access to group they are in and all its resources ->
    getUserBoard() {
        return axios.get(API_URL + 'user', { headers: authHeader() });
    }
    getModeratorBoard() {
        return axios.get(API_URL + 'mod', { headers: authHeader() });
    }
    getAdminBoard() {
        return axios.get(API_URL + 'admin', { headers: authHeader() });
    }
}
export default new UserService();