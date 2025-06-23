import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { FormCard } from '../components/common/FormCard';
import { StyledButton } from '../components/common/StyledButton';

const ProfileInfo = styled.div`
  background: rgba(0, 0, 0, 0.2);
  padding: 1.25rem;
  border-radius: 8px;
  text-align: left;
  word-break: break-all;
  line-height: 1.6;

  p {
    margin: 0;
  }
`;

const ProfilePage = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <FormCard><h1>Loading profile...</h1></FormCard>;
  }

  return (
    <FormCard>
      <h1>Welcome back!</h1>
      <ProfileInfo>
        <p>Email: <strong>{user.email}</strong></p>
        <p>Role: <strong>{user.role}</strong></p>
      </ProfileInfo>
      <StyledButton onClick={logout}>Logout</StyledButton>
    </FormCard>
  );
};

export default ProfilePage;