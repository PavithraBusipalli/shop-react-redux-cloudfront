import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { formatAsPrice, calculateDiscountedPrice, calculateTax, isInStock } from '../../utils/utils';

interface PriceDisplayProps {
  originalPrice: number;
  discountPercentage?: number;
  taxRate?: number;
  quantity?: number;
  showTax?: boolean;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  originalPrice,
  discountPercentage = 0,
  taxRate = 0,
  quantity = 1,
  showTax = true
}) => {  const discountedPrice = calculateDiscountedPrice(originalPrice, discountPercentage);
  const taxAmount = showTax ? calculateTax(discountedPrice, taxRate) : 0;
  const finalPrice = discountedPrice + taxAmount;
  const inStock = isInStock(quantity);

  return (
    <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Price Information
      </Typography>
      
      <Box sx={{ mb: 1 }}>
        <Typography variant="body1">
          Original Price: {formatAsPrice(originalPrice)}
        </Typography>
      </Box>

      {discountPercentage > 0 && (
        <Box sx={{ mb: 1 }}>
          <Typography variant="body1" color="primary">
            Discount ({discountPercentage}%): -{formatAsPrice(originalPrice - discountedPrice)}
          </Typography>
          <Typography variant="body1">
            Discounted Price: {formatAsPrice(discountedPrice)}
          </Typography>
        </Box>
      )}

      {showTax && taxRate > 0 && (
        <Box sx={{ mb: 1 }}>
          <Typography variant="body1">
            Tax ({taxRate}%): {formatAsPrice(taxAmount)}
          </Typography>
        </Box>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" color="secondary">
          Final Price: {formatAsPrice(finalPrice)}
        </Typography>
      </Box>

      <Box>
        <Chip 
          label={inStock ? `In Stock (${quantity})` : 'Out of Stock'} 
          color={inStock ? 'success' : 'error'}
          variant="outlined"
        />
      </Box>
    </Box>
  );
};

export default PriceDisplay;
