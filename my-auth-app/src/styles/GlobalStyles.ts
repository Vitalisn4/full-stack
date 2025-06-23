import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  /* Import the Poppins font from Google Fonts */
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Poppins', sans-serif;
    color: #ffffff;
    /* The animated gradient background */
    background: linear-gradient(-45deg, #4c51bf, #06b6d4, #4f46e5, #0ea5e9);
    background-size: 400% 400%;
    animation: gradientAnimation 15s ease infinite;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  /* The animation keyframes */
  @keyframes gradientAnimation {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  #root {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Style for navigation links */
  a {
    text-decoration: none;
    color: #a78bfa; /* A light, complementary violet */
    font-weight: 600;
    transition: color 0.2s ease-in-out;
    &:hover {
      color: #ffffff;
    }
  }
`;