import styled from 'styled-components';

export const StyledButton = styled.button`
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 12px;
  background-color: #ffffff;
  /* A deep purple that matches the "Register" link color family */
  color: #5b21b6;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s ease-in-out;
  margin-top: 1rem;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: scale(0.99);
  }

  &:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
  }
`;