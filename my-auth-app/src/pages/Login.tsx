// src/pages/Login.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/apiService';
import { FormCard } from '../components/common/FormCard';
import { StyledInput } from '../components/common/StyledInput';
import { StyledButton } from '../components/common/StyledButton';

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
      const response = await api.login({ email, password });
      // The access token is in the `data` property of the axios response
      await login(response.data.accessToken);
    } catch (err: unknown) {
      type AxiosError = {
        response?: {
          data?: {
            error?: string;
          };
        };
      };

      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        (err as AxiosError).response?.data?.error
      ) {
        setError((err as AxiosError).response!.data!.error!);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ... JSX remains the same ...
  return (
    <FormCard>
      <h1>Login</h1>
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
          {loading ? 'Logging In...' : 'Login'}
        </StyledButton>
      </form>
      <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </FormCard>
  );
};

export default LoginPage;