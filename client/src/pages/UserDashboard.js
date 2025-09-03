import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from '../axios';
import UserForm from '../components/UserForm';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [pipelineStats, setPipelineStats] = useState({
    totalBuilds: 0,
    successfulBuilds: 0,
    failedBuilds: 0,
    lastDeployment: null
  });
  const [activeTab, setActiveTab] = useState('users');
  const formRef = useRef(null);

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchUsers();
      fetchPipelineStats();
    }
  }, [user, navigate]);

  const fetchUsers = () => {
    axios
      .get('/users')
      .then(res => setUsers(res.data))
      .catch(err => {
        console.error('Fetch Error:', err);
        if (err.response?.status === 401) logout();
      });
  };

  const fetchPipelineStats = () => {
    // Mock pipeline stats - in real app, this would be API call
    setPipelineStats({
      totalBuilds: 156,
      successfulBuilds: 149,
      failedBuilds: 7,
      lastDeployment: new Date().toLocaleString()
    });
  };

  const handleCreate = (userData) => {
    // Add role as 'developer' for CI/CD context
    const newUser = { ...userData, role: userData.role || 'developer' };
    axios
      .post('/users', newUser)
      .then(() => {
        fetchUsers();
        setEditingUser(null);
      })
      .catch(err => console.error('Create Error:', err));
  };

  const handleUpdate = (id, userData) => {
    if (user?.role !== 'admin') return;
    axios
      .put(`/users/${id}`, userData)
      .then(() => {
        fetchUsers();
        setEditingUser(null);
      })
      .catch(err => console.error('Update Error:', err));
  };

  const handleDelete = (id) => {
    if (user?.role !== 'admin') return;
    axios
      .delete(`/users/${id}`)
      .then(fetchUsers)
      .catch(err => console.error('Delete Error:', err));
  };

  const handleEditClick = (selectedUser) => {
    if (user?.role === 'admin') {
      setEditingUser(selectedUser);
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return '#ff6b6b';
      case 'developer': return '#4ecdc4';
      case 'viewer': return '#45b7d1';
      default: return '#95a5a6';
    }
  };

  return (
    <div>
      <header>
        <div>
          <h1>CI/CD Pipeline Management Dashboard</h1>
          <div>
            <span>{user?.name} ({user?.role})</span>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      </header>

      {/* Dashboard Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Pipeline Overview
        </button>
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Team Management
        </button>
        <button 
          className={`tab ${activeTab === 'deployments' ? 'active' : ''}`}
          onClick={() => setActiveTab('deployments')}
        >
          🚀 Deployments
        </button>
      </div>

      {/* Pipeline Overview Tab */}
      {activeTab === 'overview' && (
        <div className="pipeline-overview">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Builds</h3>
              <div className="stat-number">{pipelineStats.totalBuilds}</div>
            </div>
            <div className="stat-card success">
              <h3>Successful</h3>
              <div className="stat-number">{pipelineStats.successfulBuilds}</div>
            </div>
            <div className="stat-card failed">
              <h3>Failed</h3>
              <div className="stat-number">{pipelineStats.failedBuilds}</div>
            </div>
            <div className="stat-card">
              <h3>Success Rate</h3>
              <div className="stat-number">
                {Math.round((pipelineStats.successfulBuilds / pipelineStats.totalBuilds) * 100)}%
              </div>
            </div>
          </div>
          
          <div className="recent-activity">
            <h3>Recent Pipeline Activity</h3>
            <div className="activity-item">
              <span className="activity-status success">✅</span>
              <span>Build #156 completed successfully</span>
              <span className="activity-time">2 minutes ago</span>
            </div>
            <div className="activity-item">
              <span className="activity-status success">🚀</span>
              <span>Deployed to production</span>
              <span className="activity-time">5 minutes ago</span>
            </div>
            <div className="activity-item">
              <span className="activity-status running">🔄</span>
              <span>Build #157 in progress</span>
              <span className="activity-time">Just now</span>
            </div>
          </div>
        </div>
      )}

      {/* Team Management Tab */}
      {activeTab === 'users' && (
        <div>
          {(user?.role === 'admin' || user?.role === 'viewer') && (
            <div ref={formRef}>
              <UserForm
                onSubmit={
                  editingUser && user?.role === 'admin'
                    ? (data) => handleUpdate(editingUser.id, data)
                    : handleCreate
                }
                user={editingUser && user?.role === 'admin' ? editingUser : null}
                onCancel={() => setEditingUser(null)}
              />
            </div>
          )}

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(userData => (
                <tr key={userData.id}>
                  <td>{userData.id}</td>
                  <td>{userData.name}</td>
                  <td>{userData.email}</td>
                  <td>
                    <span 
                      className="role-badge" 
                      style={{ backgroundColor: getRoleColor(userData.role) }}
                    >
                      {userData.role || 'developer'}
                    </span>
                  </td>
                  <td>
                    {user?.role === 'admin' ? (
                      <>
                        <button onClick={() => handleEditClick(userData)}>Edit</button>{' '}
                        <button onClick={() => handleDelete(userData.id)}>Delete</button>
                      </>
                    ) : (
                      'N/A'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className="floating-add-btn"
            onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
          >
            + Add Team Member
          </button>
        </div>
      )}

      {/* Deployments Tab */}
      {activeTab === 'deployments' && (
        <div className="deployments-section">
          <div className="deployment-pipeline">
            <h3>Deployment Pipeline Status</h3>
            <div className="pipeline-stages">
              <div className="stage completed">
                <div className="stage-icon">✅</div>
                <div className="stage-name">Build</div>
                <div className="stage-time">2:34</div>
              </div>
              <div className="stage completed">
                <div className="stage-icon">✅</div>
                <div className="stage-name">Test</div>
                <div className="stage-time">1:45</div>
              </div>
              <div className="stage running">
                <div className="stage-icon">🔄</div>
                <div className="stage-name">Deploy</div>
                <div className="stage-time">0:23</div>
              </div>
              <div className="stage pending">
                <div className="stage-icon">⏳</div>
                <div className="stage-name">Verify</div>
                <div className="stage-time">-</div>
              </div>
            </div>
          </div>

          <div className="deployment-history">
            <h3>Recent Deployments</h3>
            <div className="deployment-item">
              <span className="deploy-env prod">PROD</span>
              <span className="deploy-info">v2.1.3 - Main branch</span>
              <span className="deploy-status success">Success</span>
              <span className="deploy-time">10 min ago</span>
            </div>
            <div className="deployment-item">
              <span className="deploy-env staging">STAGE</span>
              <span className="deploy-info">v2.1.4 - Feature/new-ui</span>
              <span className="deploy-status success">Success</span>
              <span className="deploy-time">1 hour ago</span>
            </div>
            <div className="deployment-item">
              <span className="deploy-env dev">DEV</span>
              <span className="deploy-info">v2.1.5 - Hotfix/auth-bug</span>
              <span className="deploy-status running">Running</span>
              <span className="deploy-time">Just now</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;