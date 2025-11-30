import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  Eye,
  LogOut,
  RefreshCw,
  X,
  Check,
  Edit3,
  Mail,
  MessageSquare
} from 'lucide-react';
import { getLoanApplications, updateApplicationStatus, getDashboardStats, updateApplicationData } from '../api/loanApplication';
import { getContactQueries, updateContactQueryStatus, getContactQueriesStats } from '../api/contactQuery';

interface AdminDashboardProps {
  token: string;
  adminData: any;
  onLogout: () => void;
}

interface LoanApplication {
  _id: string;
  loanType: string;
  propertyFinalized: boolean;
  propertyValue: string;
  profession: string;
  annualIncome: string;
  loanAmount: string;
  phoneNumber: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

interface ContactQuery {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
  updatedAt: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ token, adminData, onLogout }) => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<LoanApplication[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<any>({});
  
  // Contact Queries state
  const [activeTab, setActiveTab] = useState<'applications' | 'queries'>('applications');
  const [contactQueries, setContactQueries] = useState<ContactQuery[]>([]);
  const [filteredQueries, setFilteredQueries] = useState<ContactQuery[]>([]);
  const [queryStats, setQueryStats] = useState<any>(null);
  const [querySearchTerm, setQuerySearchTerm] = useState('');
  const [queryStatusFilter, setQueryStatusFilter] = useState('all');
  const [selectedQuery, setSelectedQuery] = useState<ContactQuery | null>(null);
  const [showQueryModal, setShowQueryModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  useEffect(() => {
    filterQueries();
  }, [contactQueries, querySearchTerm, queryStatusFilter]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [appsResult, statsResult, queriesResult, queryStatsResult] = await Promise.all([
        getLoanApplications(token, 1, 100),
        getDashboardStats(token),
        getContactQueries(token, 1, 100),
        getContactQueriesStats(token)
      ]);

      // Check if any request returned expired token
      if (appsResult.expired || statsResult.expired || queriesResult.expired || queryStatsResult.expired) {
        onLogout();
        return;
      }

      if (appsResult.success) {
        setApplications(appsResult.data.applications);
      }

      if (statsResult.success) {
        setStats(statsResult.data);
      }

      if (queriesResult.success) {
        setContactQueries(queriesResult.data.queries);
      }

      if (queryStatsResult.success) {
        setQueryStats(queryStatsResult.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.phoneNumber.includes(searchTerm) ||
        app.loanAmount.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  const filterQueries = () => {
    let filtered = contactQueries;

    if (querySearchTerm) {
      filtered = filtered.filter(query => 
        query.name.toLowerCase().includes(querySearchTerm.toLowerCase()) ||
        query.email.toLowerCase().includes(querySearchTerm.toLowerCase()) ||
        query.phone.includes(querySearchTerm) ||
        query.message.toLowerCase().includes(querySearchTerm.toLowerCase())
      );
    }

    if (queryStatusFilter !== 'all') {
      filtered = filtered.filter(query => query.status === queryStatusFilter);
    }

    setFilteredQueries(filtered);
  };

  const handleQueryStatusUpdate = async (queryId: string, newStatus: string) => {
    try {
      const result = await updateContactQueryStatus(token, queryId, newStatus);
      if (result.success) {
        setContactQueries(prev => 
          prev.map(query => 
            query._id === queryId 
              ? { ...query, status: newStatus as any, updatedAt: new Date().toISOString() }
              : query
          )
        );
        // Refresh stats
        const statsResult = await getContactQueriesStats(token);
        if (statsResult.success) {
          setQueryStats(statsResult.data);
        }
      }
    } catch (error) {
      console.error('Error updating query status:', error);
    }
  };

  const getQueryStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'read': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'replied': return 'bg-green-100 text-green-800 border-green-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      const result = await updateApplicationStatus(token, applicationId, newStatus);
      if (result.success) {
        setApplications(prev => 
          prev.map(app => 
            app._id === applicationId 
              ? { ...app, status: newStatus as any, updatedAt: new Date().toISOString() }
              : app
          )
        );
        // Refresh stats
        const statsResult = await getDashboardStats(token);
        if (statsResult.success) {
          setStats(statsResult.data);
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleFieldEdit = (applicationId: string, field: string, value: any) => {
    setEditingField(`${applicationId}-${field}`);
    setEditValues({ [field]: value });
  };

  const handleFieldSave = async (applicationId: string, field: string) => {
    try {
      const updateData = { [field]: editValues[field] };
      const result = await updateApplicationData(token, applicationId, updateData);
      
      if (result.success) {
        setApplications(prev => 
          prev.map(app => 
            app._id === applicationId 
              ? { ...app, [field]: editValues[field], updatedAt: new Date().toISOString() }
              : app
          )
        );
        
        if (selectedApplication && selectedApplication._id === applicationId) {
          setSelectedApplication({
            ...selectedApplication,
            [field]: editValues[field],
            updatedAt: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('Error updating field:', error);
    } finally {
      setEditingField(null);
      setEditValues({});
    }
  };

  const handleFieldCancel = () => {
    setEditingField(null);
    setEditValues({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatLoanType = (type: string) => {
    switch (type) {
      case 'new-home': return 'New Home Loan';
      case 'balance-transfer': return 'Balance Transfer';
      case 'loan-against-property': return 'Loan Against Property';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const EditableField = ({ 
    applicationId, 
    field, 
    value, 
    type = 'text', 
    options = null 
  }: { 
    applicationId: string; 
    field: string; 
    value: any; 
    type?: 'text' | 'select' | 'number';
    options?: string[] | null;
  }) => {
    const isEditing = editingField === `${applicationId}-${field}`;

    if (isEditing) {
      return (
        <div className="flex items-center space-x-2">
          {type === 'select' && options ? (
            <select
              value={editValues[field] || value}
              onChange={(e) => setEditValues({ ...editValues, [field]: e.target.value })}
              className="text-sm border border-gray-300 rounded px-2 py-1 min-w-[120px]"
            >
              {options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              value={editValues[field] || value}
              onChange={(e) => setEditValues({ ...editValues, [field]: e.target.value })}
              className="text-sm border border-gray-300 rounded px-2 py-1 min-w-[120px]"
              autoFocus
            />
          )}
          <button
            onClick={() => handleFieldSave(applicationId, field)}
            className="text-green-600 hover:text-green-800"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={handleFieldCancel}
            className="text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return (
      <div 
        className="flex items-center space-x-2 group cursor-pointer"
        onClick={() => handleFieldEdit(applicationId, field, value)}
      >
        <span className="text-sm">{type === 'select' && field === 'loanType' ? formatLoanType(value) : value}</span>
        <Edit3 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
  };

  if (loading || !adminData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">CredNest Admin</h1>
              <span className="ml-4 text-sm text-gray-500">Loan Management Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchDashboardData}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <div className="text-sm text-gray-600">
                Welcome, {adminData?.email || 'Admin'}
              </div>
              <button
                onClick={onLogout}
                className="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-1 mb-6 border border-gray-200 inline-flex">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'applications'
                ? 'bg-emerald-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Loan Applications
          </button>
          <button
            onClick={() => setActiveTab('queries')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'queries'
                ? 'bg-emerald-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Contact Queries
          </button>
        </div>

        {/* Stats Cards */}
        {activeTab === 'applications' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.overview.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.overview.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.overview.approved}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.overview.rejected}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'queries' && queryStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Queries</p>
                  <p className="text-2xl font-bold text-gray-900">{queryStats.overview.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">New</p>
                  <p className="text-2xl font-bold text-gray-900">{queryStats.overview.new}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Replied</p>
                  <p className="text-2xl font-bold text-gray-900">{queryStats.overview.replied}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <FileText className="w-6 h-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Archived</p>
                  <p className="text-2xl font-bold text-gray-900">{queryStats.overview.archived}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Applications Section */}
        {activeTab === 'applications' && (
          <>
            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by phone, amount, or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Loan Applications ({filteredApplications.length})
            </h2>
            <p className="text-sm text-gray-500 mt-1">Click on any field to edit it directly</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profession
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Annual Income
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <tr key={application._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{application._id.slice(-8).toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(application.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <EditableField
                        applicationId={application._id}
                        field="loanType"
                        value={application.loanType}
                        type="select"
                        options={['new-home', 'balance-transfer', 'loan-against-property']}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <EditableField
                        applicationId={application._id}
                        field="phoneNumber"
                        value={application.phoneNumber}
                        type="text"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <EditableField
                        applicationId={application._id}
                        field="loanAmount"
                        value={application.loanAmount}
                        type="text"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <EditableField
                        applicationId={application._id}
                        field="propertyValue"
                        value={application.propertyValue}
                        type="select"
                        options={['Under 1 Crore', '1 Crore to 2 Crore', '2 Crore to 3 Crore', 'Above 3 Crore']}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <EditableField
                        applicationId={application._id}
                        field="profession"
                        value={application.profession}
                        type="select"
                        options={['Salaried', 'Self Employed']}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <EditableField
                        applicationId={application._id}
                        field="annualIncome"
                        value={application.annualIncome}
                        type="select"
                        options={['Above 50 L', '25L - 50L', '18L - 25L', '12L - 18L', '6L - 12L', 'Below 6L']}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={application.status}
                        onChange={(e) => handleStatusUpdate(application._id, e.target.value)}
                        className={`text-xs font-medium px-3 py-1 rounded-full border ${getStatusColor(application.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowEditModal(true);
                        }}
                        className="text-emerald-600 hover:text-emerald-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No applications found matching your criteria.</p>
            </div>
          )}
            </div>
          </>
        )}

        {/* Contact Queries Section */}
        {activeTab === 'queries' && (
          <>
            {/* Filters and Search for Queries */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, email, phone, or message..."
                      value={querySearchTerm}
                      onChange={(e) => setQuerySearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={queryStatusFilter}
                    onChange={(e) => setQueryStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Queries Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Contact Queries ({filteredQueries.length})
                </h2>
                <p className="text-sm text-gray-500 mt-1">View and manage customer contact queries</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Query ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredQueries.map((query) => (
                      <tr key={query._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{query._id.slice(-8).toUpperCase()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{query.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{query.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{query.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate" title={query.message}>
                            {query.message}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={query.status}
                            onChange={(e) => handleQueryStatusUpdate(query._id, e.target.value)}
                            className={`text-xs font-medium px-3 py-1 rounded-full border ${getQueryStatusColor(query.status)}`}
                          >
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                            <option value="archived">Archived</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-xs text-gray-500">
                            {formatDate(query.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedQuery(query);
                              setShowQueryModal(true);
                            }}
                            className="text-emerald-600 hover:text-emerald-900"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredQueries.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No contact queries found matching your criteria.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Application Details Modal */}
      {showEditModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  Application Details
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Application ID</label>
                  <p className="text-gray-900">#{selectedApplication._id.slice(-8).toUpperCase()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={selectedApplication.status}
                    onChange={(e) => {
                      handleStatusUpdate(selectedApplication._id, e.target.value);
                      setSelectedApplication({
                        ...selectedApplication,
                        status: e.target.value as any
                      });
                    }}
                    className={`w-full px-3 py-2 rounded-lg border ${getStatusColor(selectedApplication.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Loan Type</label>
                  <p className="text-gray-900">{formatLoanType(selectedApplication.loanType)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <p className="text-gray-900">+91 {selectedApplication.phoneNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Property Value</label>
                  <p className="text-gray-900">{selectedApplication.propertyValue}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Property Finalized</label>
                  <p className="text-gray-900">{selectedApplication.propertyFinalized ? 'Yes' : 'No'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Profession</label>
                  <p className="text-gray-900">{selectedApplication.profession}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Annual Income</label>
                  <p className="text-gray-900">{selectedApplication.annualIncome}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Loan Amount</label>
                <p className="text-gray-900 text-lg font-semibold">₹{selectedApplication.loanAmount}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Created At</label>
                  <p className="text-gray-900">{formatDate(selectedApplication.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Updated</label>
                  <p className="text-gray-900">{formatDate(selectedApplication.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Query Details Modal */}
      {showQueryModal && selectedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  Contact Query Details
                </h2>
                <button
                  onClick={() => setShowQueryModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Query ID</label>
                  <p className="text-gray-900">#{selectedQuery._id.slice(-8).toUpperCase()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={selectedQuery.status}
                    onChange={(e) => {
                      handleQueryStatusUpdate(selectedQuery._id, e.target.value);
                      setSelectedQuery({
                        ...selectedQuery,
                        status: e.target.value as any
                      });
                    }}
                    className={`w-full px-3 py-2 rounded-lg border ${getQueryStatusColor(selectedQuery.status)}`}
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{selectedQuery.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">
                    <a href={`mailto:${selectedQuery.email}`} className="text-emerald-600 hover:underline">
                      {selectedQuery.email}
                    </a>
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <p className="text-gray-900">
                  <a href={`tel:${selectedQuery.phone}`} className="text-emerald-600 hover:underline">
                    {selectedQuery.phone}
                  </a>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Message</label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedQuery.message}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Created At</label>
                  <p className="text-gray-900">{formatDate(selectedQuery.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Updated</label>
                  <p className="text-gray-900">{formatDate(selectedQuery.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
