import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://wemeet-backend-latest.onrender.com/api/',
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = sessionStorage.getItem('refreshToken');
      // console.log("hooo:",refreshToken)
      // const response = await axios.post('http://localhost:9004/v1/auth/refresh', {
      //              refreshToken,
      //             });
      //   console.log(response.data)
     
      if (refreshToken) {
        try {
          const response = await axiosInstance.post('/refresh', {
            refreshToken,
          });
// console.log(response)
          const accessToken  = response.data.accessToken;

          if (!accessToken) {
            // If accessToken is undefined or invalid
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('refreshToken');
            window.location.href = '/login'; // Redirect to login page
            return Promise.reject(new Error('Access token is undefined.'));
          }

          // Update tokens and retry original request
          sessionStorage.setItem('accessToken', accessToken);
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          // Handle refresh token failure  (refresh api fail)
          sessionStorage.removeItem('accessToken');
          sessionStorage.removeItem('refreshToken');
          window.location.href = '/login'; // Redirect to login page
          return Promise.reject(err);
        }
      } else {
        // No refresh token available
        window.location.href = '/login'; // Redirect to login page
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
