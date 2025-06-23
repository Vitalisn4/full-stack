// src/pages/Register.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/apiService';
import { FormCard } from '../components/common/FormCard';
import { StyledInput } from '../components/common/StyledInput';
import { StyledButton } from '../components/common/StyledButton';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // MODIFICATION: Changed React.FormEvert to React.FormEvent
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    type ApiError = {
      response?: {
        data?: {
          error?: string;
        };
      };
    };

    try {
      await api.register({ email, password });
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err: unknown) {
      const apiError = err as ApiError;
      if (
        apiError &&
        typeof apiError === 'object' &&
        apiError.response?.data?.error
      ) {
        setError(apiError.response.data.error as string);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // ... JSX remains the same ...
  return (
    <FormCard>
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <StyledInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <StyledInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p style={{ color: '#f87171', marginTop: '-0.5rem', marginBottom: '1rem' }}>{error}</p>}
        <StyledButton type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Register'}
        </StyledButton>
      </form>
      <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </FormCard>
  );
};

export default RegisterPage;