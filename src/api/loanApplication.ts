// API functions for loan application
export interface LoanApplicationData {
  loanType: string;
  propertyFinalized: boolean;
  propertyValue: string;
  profession: string;
  annualIncome: string;
  loanAmount: string;
  phoneNumber: string;
  createdAt?: Date;
}

const API_BASE_URL = 'http://localhost:5000/api';

// Save loan application to MongoDB via backend API
export const saveLoanApplication = async (data: LoanApplicationData): Promise<{ success: boolean; id?: string; error?: string; applicationNumber?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/loan-applications`, {
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
        id: result.data.id,
        applicationNumber: result.data.applicationNumber
      };
    } else {
      return { 
        success: false, 
        error: result.message || 'Failed to save application' 
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

// Get all loan applications (Admin only)
export const getLoanApplications = async (token: string, page = 1, limit = 10): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/loan-applications?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.message || 'Failed to fetch applications' };
    }
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Admin login
export const adminLogin = async (email: string, password: string): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      // Store token in localStorage
      localStorage.setItem('adminToken', result.data.token);
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.message || 'Login failed' };
    }
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Update application status (Admin only)
export const updateApplicationStatus = async (token: string, applicationId: string, status: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/loan-applications/${applicationId}/status`, {
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

// Update application data (Admin only)
export const updateApplicationData = async (token: string, applicationId: string, updateData: Partial<LoanApplicationData>): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/loan-applications/${applicationId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return { success: true };
    } else {
      return { success: false, error: result.message || 'Failed to update application' };
    }
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: 'Network error' };
  }
};

// Get dashboard statistics (Admin only)
export const getDashboardStats = async (token: string): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/loan-applications/stats/dashboard`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

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
