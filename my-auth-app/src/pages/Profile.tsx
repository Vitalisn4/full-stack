import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FormCard } from '../components/common/FormCard';
import { StyledButton } from '../components/common/StyledButton';

const ProfilePage = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
        <FormCard>
            <h1>Loading profile...</h1>
        </FormCard>
    );
  }

  return (
    <FormCard>
      <h1>Welcome back,</h1>
      <h2 style={{ fontWeight: 400, wordBreak: 'break-all' }}>{user.email}</h2>
      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
        <p>Your Role: <strong>{user.role}</strong></p>
      </div>
      <StyledButton onClick={logout}>Logout</StyledButton>
    </FormCard>
  );
};

export default ProfilePage;