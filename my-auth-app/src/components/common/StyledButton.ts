import styled from 'styled-components';

export const StyledButton = styled.button`
  padding: 0.8rem 1.5rem;
  width: 100%;
  border: none;
  border-radius: 8px;
  background-color: #ffffff;
  color: #4c51bf; /* Deep indigo text */
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;

  /* Hover effect with gradient and lift */
  &:hover:not(:disabled) {
    background: linear-gradient(45deg, #a78bfa, #7c3aed);
    color: #ffffff;
    transform: translateY(-3px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  /* Click effect */
  &:active:not(:disabled) {
    transform: translateY(-1px) scale(0.98);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    background-color: #e0e0e0;
    color: #9e9e9e;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;