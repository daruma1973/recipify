import React from 'react';
import PropTypes from 'prop-types';

/**
 * A component to display currency values consistently throughout the app.
 */
const CurrencyDisplay = ({ 
  amount, 
  showSymbol = true, 
  variant = 'body1', 
  color = 'inherit',
  component = 'span',
  ...props 
}) => {
  // Format the number with 2 decimal places
  const formattedAmount = parseFloat(amount).toFixed(2);
  
  // Format with thousand separator
  const parts = formattedAmount.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const displayAmount = parts.join('.');
  
  return (
    <span {...props}>
      {showSymbol ? `£${displayAmount}` : displayAmount}
    </span>
  );
};

CurrencyDisplay.propTypes = {
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  showSymbol: PropTypes.bool,
  variant: PropTypes.string,
  color: PropTypes.string,
  component: PropTypes.elementType
};

export default CurrencyDisplay; 