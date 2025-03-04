/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to show the currency symbol (default: true)
 * @returns {string} Formatted currency string
 */
const formatCurrency = (amount, showSymbol = true) => {
  const symbol = '£';
  
  // Format the number with 2 decimal places
  const formattedAmount = parseFloat(amount).toFixed(2);
  
  // Format with thousand separator
  const parts = formattedAmount.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const displayAmount = parts.join('.');
  
  return showSymbol ? `${symbol}${displayAmount}` : displayAmount;
};

export default formatCurrency; 