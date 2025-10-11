import axios from 'axios';

export const auth = {
  login: async (email, password, captchaValue, role) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        captchaToken: captchaValue,
        role
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      return { success: true, role: user.role };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    }
  }
};
