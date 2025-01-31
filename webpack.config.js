const path = require('path');

module.exports = {
  entry: './src/app/components/CookieConsentBanner.js',
  output: {
    filename: 'cookie-consent-banner.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'CookieConsentBanner',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      },
      {
        test: /\.json$/,
        use: 'json-loader', // Zorg ervoor dat JSON-bestanden worden ingesloten
        type: 'javascript/auto', // Voor Webpack 5, zorg ervoor dat de json-loader correct werkt
      }
    ],
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
    'react-cookies': 'react-cookies',
    'react-i18next': 'react-i18next',
    '@mui/material': '@mui/material',
    '@emotion/react': '@emotion/react',
    '@emotion/styled': '@emotion/styled',
    '@mui/icons-material': '@mui/icons-material',
  },
};
