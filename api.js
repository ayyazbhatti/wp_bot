const axios = require('axios');
const config = require('./config');

class ApiService {
  constructor() {
    this.apiUrl = config.API_BASE_URL;
  }

  async registerUser(fullName, email) {
    console.log(`[API] Starting registration for: ${fullName}, ${email}`);
    console.log(`[API] API URL: ${this.apiUrl}`);
    
    try {
      const payload = {
        full_name: fullName,
        email: email
      };

      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      console.log(`[API] Sending payload:`, payload);
      console.log(`[API] Headers:`, headers);

      const response = await axios.post(this.apiUrl, payload, { headers });
      
      console.log(`[API] Response status: ${response.status}`);
      console.log(`[API] Response data:`, response.data);
      
      if (response.data.success) {
        console.log(`[API] Registration successful`);
        return {
          success: true,
          data: response.data,
          message: `${config.SUCCESS_MESSAGE}`
        };
      } else {
        console.log(`[API] Registration failed in response`);
        return {
          success: false,
          message: 'Registration failed. Please try again.'
        };
      }
    } catch (error) {
      console.error('[API] Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      
      if (error.response?.status === 400) {
        return {
          success: false,
          message: 'Invalid email format. Please provide a valid email address.'
        };
      } else if (error.response?.status === 409) {
        return {
          success: false,
          message: 'An account with this email already exists. Please use a different email.'
        };
      } else {
        return {
          success: false,
          message: 'Registration service is temporarily unavailable. Please try again later.'
        };
      }
    }
  }
}

module.exports = ApiService; 