import styled from 'styled-components';

export const FormCard = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 2.5rem 3rem;
  
  /* The Glassmorphism Effect */
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* For Safari */
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: center;

  h1 {
    font-weight: 600;
    font-size: 2.25rem;
    margin-bottom: 0.5rem;
  }
`;