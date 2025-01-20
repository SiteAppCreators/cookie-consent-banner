// components/CookieConsentBanner.js
'use client';

import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Box, Button, Typography } from '@mui/material';

const CookieConsentBanner = ({ isGTMInitialized }) => {
  const [cookies, setCookie] = useCookies(['cookie-consent']);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Toon de banner als de gebruiker nog geen keuze heeft gemaakt
    if (!cookies['cookie-consent']) {
      setIsVisible(true);
    } else {
      // Als de keuze al is gemaakt, synchroniseer de toestemming met GTM
      syncConsentWithGTM(cookies['cookie-consent']);
    }
  }, [cookies]);

  const syncConsentWithGTM = (consent) => {
    if (!isGTMInitialized) return; // Wacht tot GTM geladen is

    const consentData = consent === 'accepted' ? {
      ad_storage: 'granted',
      analytics_storage: 'granted',
    } : {
      ad_storage: 'denied',
      analytics_storage: 'denied',
    };

    // Verstuur de consent data naar GTM als gtag beschikbaar is
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', consentData);
    } else {
      console.error('GTM is not properly initialized.');
    }
  };

  const handleAccept = () => {
    setCookie('cookie-consent', 'accepted', { path: '/', maxAge: 365 * 24 * 60 * 60 });
    setIsVisible(false);
    syncConsentWithGTM('accepted');
  };

  const handleReject = () => {
    setCookie('cookie-consent', 'rejected', { path: '/', maxAge: 365 * 24 * 60 * 60 });
    setIsVisible(false);
    syncConsentWithGTM('rejected');
  };

  if (!isVisible) return null; // Verberg de banner als de gebruiker al een keuze heeft gemaakt

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#333',
        color: '#fff',
        padding: 2,
        textAlign: 'center',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="body1" sx={{ marginBottom: 2 }}>
        We use cookies to improve your experience. Accept cookies?
      </Typography>
      <Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginRight: 2 }}
          onClick={handleAccept}
        >
          Accept
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleReject}
        >
          Reject
        </Button>
      </Box>
    </Box>
  );
};

export default CookieConsentBanner;