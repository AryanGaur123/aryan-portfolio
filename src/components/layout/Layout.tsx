import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { theme } from '../../styles/theme';
import GlobalStyles from '../../styles/GlobalStyles';
import Header from './Header';
import Footer from './Footer';
import CustomCursor from '../ui/CustomCursor';

const Main = styled.main`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showCustomCursor, setShowCustomCursor] = useState(false);

  useEffect(() => {
    // Only enable custom cursor on non-touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setShowCustomCursor(!isTouchDevice);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {showCustomCursor && <CustomCursor />}
      <Header />
      <Main>{children}</Main>
      <Footer />
    </ThemeProvider>
  );
};

export default Layout;
