import styled from 'styled-components';

export const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem 0.5rem;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid rgba(255, 255, 255, 0.5);
  color: #ffffff;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  margin-bottom: 1rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
    font-family: 'Poppins', sans-serif;
  }

  /* Focus effect */
  &:focus {
    outline: none;
    border-bottom-color: #06b6d4; /* Vibrant teal accent */
  }
`;