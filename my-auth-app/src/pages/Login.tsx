import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { FormCard } from '../components/common/FormCard';
import { InputContainer } from '../components/common/InputContainer';
import { StyledInput } from '../components/common/StyledInput';
import { StyledButton } from '../components/common/StyledButton';
import styled from 'styled-components';

// Styled component for the "Register" link to make it stand out and fix clickability
const RegisterLink = styled(Link)`
  color: #c084fc; /* A vibrant purple from your image */
  font-weight: 600;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const BottomText = styled.p`
  color: rgba(255, 255, 255, 0.9);
`;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiService.login({ email, password });
      await login(response.token);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
        setLoading(false);
    }
  };

  return (
    <FormCard>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <InputContainer>
          <label htmlFor="email">Email</label>
          <StyledInput
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </InputContainer>

        <InputContainer>
          <label htmlFor="password">Password</label>
          <StyledInput
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </InputContainer>
        
        {error && <p style={{ color: '#fecaca', marginTop: '1rem' }}>{error}</p>}
        
        <StyledButton type="submit" disabled={loading}>
          {loading ? 'Logging In...' : 'Login'}
        </StyledButton>
      </form>
      <BottomText>
        Don't have an account? <RegisterLink to="/register">Register</RegisterLink>
      </BottomText>
    </FormCard>
  );
};

export default LoginPage;