// components/CookieConsentBanner.js
'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Box, Button, Typography, Checkbox, FormControlLabel, Dialog, DialogActions, DialogContent, DialogTitle, Switch, FormGroup, Divider, FormLabel, Accordion, AccordionSummary, AccordionDetails, Select, MenuItem, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CookieIcon from '@mui/icons-material/Cookie';
import { useTranslation } from 'react-i18next';
import '../../i18n/i18next';

const PreferenceOption = ({ option, checked, onChange, index }) => (
  <Box sx={{ mb: '20px' }}>
    <FormControlLabel
      control={
        <Switch
          checked={checked}
          onChange={onChange}
          name={option.name}
          color="success"
          disabled={option.disabled}
        />
      }
      label={<Typography fontSize={"14px"}>{option.label}</Typography>}
    />
    <Typography fontSize={"12px"} color="textSecondary" sx={{ ml: 6 }}>
      {option.description}
    </Typography>
    {
      index !== 4 && <Divider sx={{ mt: '20px', mb: '20px' }} />
    }
  </Box>
);

const CookieConsentBanner = ({ gtmId }) => {
  const { t, i18n } = useTranslation(); // Translation hook
  const [cookies, setCookie] = useCookies(['cookie-consent']); // Name of cookie
  const [isVisible, setIsVisible] = useState(false); // Show the banner
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language); // Selected language
  const [preferences, setPreferences] = useState({
    analytics: false,
    ads: false,
    functional: false,
    personalized: false,
    security: true,
  }); // All used cookies

  useEffect(() => {
    // Show banner if no cookie consent is found
    if (!cookies['cookie-consent']) {
      setIsVisible(true);
    } else {
      // Synchronize cookie consent with GTM when opening the page
      syncConsentWithGTM(cookies['cookie-consent']);
    }
  }, [cookies]);

  useEffect(() => {
    // Laad het Google Tag Manager script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;  // Vervang dit met jouw GTM-ID
    script.async = true;

    script.onload = () => {
      // Initialiseer GTM zodra het script is geladen
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script); // Verwijder het script bij unmounten van de layout
    };
  }, []); // Dit gebeurt slechts eenmaal bij de eerste render

  function syncConsentWithGTM(consent) {
    const consentData = {
      ad_storage: consent.ads ? 'granted' : 'denied',
      ad_user_data: consent.ads ? 'granted' : 'denied',
      ad_personalization: consent.ads ? 'granted' : 'denied',
      analytics_storage: consent.analytics ? 'granted' : 'denied',
      functionality_storage: consent.functional ? 'granted' : 'denied',
      personalization_storage: consent.personalized ? 'granted' : 'denied',
      security_storage: consent.security ? 'granted' : 'denied',
    }; // GTM consent data

    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', consentData);
    }
  };

  function handleSavePreferences() { // Save the preferences
    setCookie('cookie-consent', preferences, { path: '/', maxAge: 365 * 24 * 60 * 60 });
    setIsVisible(false);
    syncConsentWithGTM(preferences);
  };

  function handleRejectAll() {  // Reject all cookies
    const rejectedPreferences = {
      analytics: false,
      ads: false,
      functional: false,
      personalized: false,
      security: true,
    };
    setPreferences(rejectedPreferences);
    setCookie('cookie-consent', rejectedPreferences, { path: '/', maxAge: 365 * 24 * 60 * 60 });
    setTimeout(() => {
      setIsVisible(false);
      syncConsentWithGTM(rejectedPreferences);
    }, 200)
  };

  function handleAcceptAll() { // Accept all cookies
    const acceptedPreferences = {
      analytics: true,
      ads: true,
      functional: true,
      personalized: true,
      security: true,
    };

    setPreferences(acceptedPreferences);

    setCookie('cookie-consent', acceptedPreferences, { path: '/', maxAge: 365 * 24 * 60 * 60 });
    setTimeout(() => {
      setIsVisible(false);
      syncConsentWithGTM(acceptedPreferences);
    }, 200)
  }

  function handlePreferenceChange(e) {
    const { name, checked } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };


  //All cookies
  const preferenceOptions = [
    {
      name: 'security',
      label: t('necessary.label'),
      description: t('necessary.description'),
      disabled: true,
    },
    {
      name: 'ads',
      label: t('advertising.label'),
      description: t('advertising.description'),
    },
    {
      name: 'analytics',
      label: t('analytics.label'),
      description: t('analytics.description'),
    },
    {
      name: 'functional',
      label: t('functionality.label'),
      description: t('functionality.description'),
    },
    {
      name: 'personalized',
      label: t('personalization.label'),
      description: t('personalization.description'),
    },
  ];

  function handleLanguageChange(event) {
    const selectedLang = event.target.value;
    setSelectedLanguage(selectedLang);
    i18n.changeLanguage(selectedLang);
  };

  return (
    <>
      <Button sx={{
        visibility: isVisible ? 'hidden' : 'visible',
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 1000,
        backgroundColor: 'black',
        minWidth: '50px',
        minHeight: '50px',
        borderRadius: '50%',
        padding: '10px',
      }} onClick={() => setIsVisible(true)} variant="contained">
        <CookieIcon sx={{ color: 'white' }} />
      </Button>
      <Dialog
        open={isVisible}
        onClose={() => { }}
        aria-labelledby="cookie-consent-title"
        maxWidth="sm"
        fullWidth
      >
        <Box p={2} display="flex" justifyContent="end">
          <Select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            variant="standard"
            sx={{ width: '40px', fontSize: '11px' }}
          >
            <MenuItem value="en" sx={{ fontSize: '11px' }}>EN</MenuItem>
            <MenuItem value="nl" sx={{ fontSize: '11px' }}>NL</MenuItem>
            <MenuItem value="fr" sx={{ fontSize: '11px' }}>FR</MenuItem>
            <MenuItem value="de" sx={{ fontSize: '11px' }}>DE</MenuItem>
            <MenuItem value="es" sx={{ fontSize: '11px' }}>ES</MenuItem>
            {/* Add more languages here if needed */}
          </Select>
        </Box>
        <DialogTitle variant='h4' textAlign={'center'} id="cookie-consent-title">{t('cookiePreferencesTitle')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" m={4} mt={2} fontWeight={'bold'} textAlign={'center'}>
            {t('cookieDescription')}
          </Typography>
          <Divider sx={{ mt: '20px', mb: '20px' }} />
          <Accordion elevation={0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{t('managePreferences')}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                <FormGroup>
                  {preferenceOptions.map((option, index) => (
                    <PreferenceOption
                      key={option.name}
                      option={option}
                      checked={preferences[option.name]}
                      onChange={handlePreferenceChange}
                      index={index}
                    />
                  ))}
                </FormGroup>
                <Box justifyContent={'center'} display={'flex'} mt={1}>
                  <Button onClick={handleSavePreferences} variant="outlined" color="#000000" sx={{ m: '15px' }}>
                    {t('buttons.savePreferences')}
                  </Button>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Box display={{ xs: 'none', sm: 'flex' }} justifyContent={'center'} width={'100%'}>
            <Button onClick={handleRejectAll} variant="outlined" color="#000000" sx={{ m: '15px', width: '30%' }}>
              {t('buttons.rejectAll')}
            </Button>
            <Button onClick={handleAcceptAll} variant="contained" sx={{ m: '15px', width: '30%', backgroundColor: '#000000' }}>
              {t('buttons.acceptAll')}
            </Button>
          </Box>
          <Box display={{ xs: 'flex', sm: 'none' }} justifyContent={'center'} width={'100%'} sx={{ flexDirection: 'column' }}>
            <Button onClick={handleAcceptAll} variant="contained" sx={{ m: '5px', backgroundColor: '#000000' }}>
              {t('buttons.acceptAll')}
            </Button>
            <Button onClick={handleRejectAll} variant="outlined" color="#000000" sx={{ m: '5px' }}>
              {t('buttons.rejectAll')}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CookieConsentBanner;