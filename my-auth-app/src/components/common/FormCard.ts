import styled from 'styled-components';

export const FormCard = styled.div`
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: 400px;
  /* Updated glassmorphism effect to better match the image */
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: center;

  h1 {
    font-weight: 700;
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #fff;
  }
`;