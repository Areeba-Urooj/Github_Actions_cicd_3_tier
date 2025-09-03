import React, { useState, useEffect } from 'react';

function UserForm({ user, onSubmit, onCancel }) {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'developer' 
  });

  useEffect(() => {
    if (user) {
      // Pre-fill name, email, and role for editing, password left blank
      setForm({ 
        name: user.name, 
        email: user.email, 
        password: '', 
        role: user.role || 'developer' 
      });
    } else {
      // Reset form for creation
      setForm({ name: '', email: '', password: '', role: 'developer' });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      email: form.email,
      role: form.role,
    };

    // Only include password if adding new user
    if (!user) {
      payload.password = form.password;
    }

    onSubmit(payload);

    // Reset form after submission if creating
    if (!user) {
      setForm({ name: '', email: '', password: '', role: 'developer' });
    }
  };

  return (
    <div className="user-form-container">
      <h3>{user ? 'Edit Team Member' : 'Add New Team Member'}</h3>
      <form className="user-form" onSubmit={handleSubmit}>
        <input
          className="form-field"
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="form-field"
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />
        {!user && (
          <input
            className="form-field"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        )}
        <select
          className="form-field"
          name="role"
          value={form.role}
          onChange={handleChange}
          required
        >
          <option value="developer">Developer</option>
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
          <option value="devops">DevOps Engineer</option>
          <option value="tester">QA Tester</option>
        </select>
        <div className="role-description">
          <small>
            {form.role === 'admin' && '🔑 Full access to all features and team management'}
            {form.role === 'developer' && '💻 Can view pipelines and manage own deployments'}
            {form.role === 'viewer' && '👀 Read-only access to dashboards and reports'}
            {form.role === 'devops' && '⚙️ Pipeline configuration and infrastructure management'}
            {form.role === 'tester' && '🧪 Test environment access and quality assurance'}
          </small>
        </div>
        <div className="button-group">
          <button type="submit" className="primary-btn">
            {user ? 'Update Member' : 'Add Team Member'}
          </button>
          {user && (
            <button type="button" className="secondary-btn" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default UserForm;