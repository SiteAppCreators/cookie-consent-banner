// components/CookieConsentBanner.js
'use client';

import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Box, Button, Typography, Checkbox, FormControlLabel, Dialog, DialogActions, DialogContent, DialogTitle, Switch, FormGroup, Divider, FormLabel, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

const CookieConsentBanner = ({ isGTMInitialized }) => {
  const [cookies, setCookie] = useCookies(['cookie-consent']);
  const [isVisible, setIsVisible] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: false,
    ads: false,
    functional: false,
    personalized: false,
    security: true,
  });

  useEffect(() => {
    // Toon de banner als er nog geen keuze is gemaakt
    if (!cookies['cookie-consent']) {
      setIsVisible(true);
    } else {
      // Synchroniseer bestaande toestemming met GTM
      syncConsentWithGTM(cookies['cookie-consent']);
    }
  }, [cookies]);

  function syncConsentWithGTM(consent) {
    if (!isGTMInitialized) return; // Wacht tot GTM geladen is

    const consentData = {
      ad_storage: consent.ads ? 'granted' : 'denied',
      ad_user_data: consent.ads ? 'granted' : 'denied',
      ad_personalization: consent.ads ? 'granted' : 'denied',
      analytics_storage: consent.analytics ? 'granted' : 'denied',
      functionality_storage: consent.functional ? 'granted' : 'denied',
      personalization_storage: consent.personalized ? 'granted' : 'denied',
      security_storage: consent.security ? 'granted' : 'denied',
    };

    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', consentData);
    } else {
      console.error('GTM is not properly initialized.');
    }
  };

  function handleSavePreferences() {
    setCookie('cookie-consent', preferences, { path: '/', maxAge: 365 * 24 * 60 * 60 });
    setIsVisible(false);
    syncConsentWithGTM(preferences);
  };

  function handleRejectAll() {
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

  function handleAcceptAll() {
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
    }, 100)
  }

  function handlePreferenceChange(e) {
    const { name, checked } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  if (!isVisible) return null;


  //All cookies
  const preferenceOptions = [
    {
      name: 'security',
      label: 'Necessary',
      description: 'This setting enables cookies that are essential for the website to function properly, so are required. These cookies help with basic functionalities such as user authentication and preferences.',
      disabled: true,
    },
    {
      name: 'ads',
      label: 'Advertising',
      description: 'Advertising cookies are used to display targeted ads according to your previous browsing behavior on the site. They also assist in evaluating the effectiveness of ad campaigns.',
    },
    {
      name: 'analytics',
      label: 'Analytics',
      description: 'Analytics cookies help track how users interact with the website. They gather data like the number of visitors, sources of traffic, and the bounce rate to improve user insights.',
    },
    {
      name: 'functional',
      label: 'Functionality',
      description: 'Functional cookies support various interactive features on the site, such as enabling social media sharing, gathering user feedback, and incorporating third-party functionalities.',
    },
    {
      name: 'personalized',
      label: 'Personalization',
      description: 'Personalized cookies gather data to tailor the website experience to individual users. They track key interactions to deliver a more customized experience based on preferences.',
    },
  ];


  return (
    <Dialog
      open={isVisible}
      onClose={() => { }}
      aria-labelledby="cookie-consent-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle variant='h4' mt={4} textAlign={'center'} id="cookie-consent-title">Cookie Preferences</DialogTitle>
      <DialogContent>
        <Typography variant="body2" m={4} mt={2} fontWeight={'bold'} textAlign={'center'}>
          We use cookies to enhance your browsing experience and deliver relevant content.
          These cookies help us understand your interactions with the site, improving features and offering personalized content.
        </Typography>
        <Divider sx={{ mt: '20px', mb: '20px' }} />
        <Accordion elevation={0}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Manage Preferences</Typography>
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
                  Save Preferences
                </Button>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Box display={{ xs: 'none', sm: 'flex' }} justifyContent={'center'} width={'100%'}>
          <Button onClick={handleRejectAll} variant="outlined" color="#000000" sx={{ m: '15px', width: '30%' }}>
            Reject All
          </Button>
          <Button onClick={handleAcceptAll} variant="contained" sx={{ m: '15px', width: '30%', backgroundColor: '#000000' }}>
            Accept all
          </Button>
        </Box>
        <Box display={{ xs: 'flex', sm: 'none' }} justifyContent={'center'} width={'100%'} sx={{ flexDirection: 'column' }}>
          <Button onClick={handleAcceptAll} variant="contained" sx={{ m: '5px', backgroundColor: '#000000' }}>
            Accept all
          </Button>
          <Button onClick={handleRejectAll} variant="outlined" color="#000000" sx={{ m: '5px' }}>
            Reject All
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CookieConsentBanner;