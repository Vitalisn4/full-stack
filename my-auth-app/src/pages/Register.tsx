import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { FormCard } from '../components/common/FormCard';
import { StyledInput } from '../components/common/StyledInput';
import { StyledButton } from '../components/common/StyledButton';

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