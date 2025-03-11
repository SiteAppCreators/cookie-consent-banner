// app/layout.js
'use client';  // Zorg ervoor dat dit bestand als client-side wordt behandeld

import { useEffect, useState } from 'react';
import CookieConsentBanner from '../../dist/cookie-consent-banner';  // Importeer de cookie consent banner
// import CookieConsentBanner from './components/CookieConsentBanner';  // Importeer de cookie consent banner
import Head from 'next/head';
import { Button } from '@mui/material';

export default function Layout({ children }) {

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* GTM script voor de head van je pagina */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
                (function(w,d,s,l,i){
                  w[l]=w[l]||[];
                  w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
                  var f=d.getElementsByTagName(s)[0], j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
                  j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                  f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-MQ8R2XL7');
              `,
          }}
        />
      </head>
      <body>
        {/* Noscript fallback voor Google Tag Manager */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MQ8R2XL7"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>

        {/* Je cookie consent banner */}
        <CookieConsentBanner
          gtmId={'GTM-MQ8R2XL7'} />
        {children}
      </body>
    </html>
  );
}