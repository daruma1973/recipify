import { createContext } from 'react';

const SettingsContext = createContext({
  settings: {
    currencySymbol: '£',
    thousandSeparator: true
  }
});

export default SettingsContext; 