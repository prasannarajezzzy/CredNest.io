// API functions for contact queries
export interface ContactQueryData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

import { getApiUrl } from '../config/api';

// Submit a new contact query
export const submitContactQuery = async (data: ContactQueryData): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    const response = await fetch(getApiUrl('/contact-queries'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return { 
        success: true, 
        message: result.message || 'Your message has been sent successfully!'
      };
    } else {
      return { 
        success: false, 
        error: result.message || 'Failed to send message' 
      };
    }
  } catch (error) {
    console.error('API Error:', error);
    return { 
      success: false, 
      error: 'Network error. Please check if the server is running.' 
    };
  }
};

// Get all contact queries (Admin only)
export const getContactQueries = async (token: string, page = 1, limit = 10, filters?: { status?: string; search?: string }): Promise<{ success: boolean; data?: any; error?: string; expired?: boolean }> => {
  try {
    let url = `/contact-queries?page=${page}&limit=${limit}`;
    if (filters?.status) url += `&status=${filters.status}`;
    if (filters?.search) url += `&search=${encodeURIComponent(filters.search)}`;

    const response = await fetch(getApiUrl(url), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      return { success: false, error: result.message || 'Session expired', expired: true };
    }

    if (response.ok && result.success) {
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.message || 'Failed to fetch queries' };
    }
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Update contact query status (Admin only)
export const updateContactQueryStatus = async (token: string, queryId: string, status: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(getApiUrl(`/contact-queries/${queryId}/status`), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return { success: true };
    } else {
      return { success: false, error: result.message || 'Failed to update status' };
    }
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Get contact queries statistics (Admin only)
export const getContactQueriesStats = async (token: string): Promise<{ success: boolean; data?: any; error?: string; expired?: boolean }> => {
  try {
    const response = await fetch(getApiUrl('/contact-queries/stats/dashboard'), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      return { success: false, error: result.message || 'Session expired', expired: true };
    }

    if (response.ok && result.success) {
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.message || 'Failed to fetch stats' };
    }
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: 'Network error' };
  }
};
