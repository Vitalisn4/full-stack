import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { FormCard } from '../components/common/FormCard';
import { InputContainer } from '../components/common/InputContainer';
import { StyledInput } from '../components/common/StyledInput';
import { StyledButton } from '../components/common/StyledButton';
import styled from 'styled-components';

const LoginLink = styled(Link)`
  color: #c084fc;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const BottomText = styled.p`
  color: rgba(255, 255, 255, 0.9);
`;

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);

    try {
      await apiService.register({ email, password });
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard>
      <h1>Create Account</h1>
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
          {loading ? 'Creating Account...' : 'Register'}
        </StyledButton>
      </form>
      <BottomText>
        Already have an account? <LoginLink to="/login">Login</LoginLink>
      </BottomText>
    </FormCard>
  );
};

export default RegisterPage;