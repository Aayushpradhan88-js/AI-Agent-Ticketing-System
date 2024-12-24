import axios from 'axios';

const API_URL = 'http://localhost:3000/user';

export const register = async (email, password) => {
    const response = await axios.post(`${API_URL}/register`, { email, password });
    return response.data;
}

export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
}

export const upload = async (userID, File) => {
    const formData = new FormData();
    formData.append('userID', userID);
    formData.append('file', File);

    const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data;
    
}