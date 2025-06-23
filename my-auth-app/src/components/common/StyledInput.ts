import styled from 'styled-components';

export const StyledInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.2rem;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);
  color: #ffffff;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    outline: none;
    border-bottom-color: #ffffff;
  }
`;