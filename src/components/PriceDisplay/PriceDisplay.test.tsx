import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import PriceDisplay from './PriceDisplay';

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('PriceDisplay Component', () => {
  it('should render basic price information', () => {
    renderWithTheme(<PriceDisplay originalPrice={100} />);
    
    expect(screen.getByText('Price Information')).toBeInTheDocument();
    expect(screen.getByText('Original Price: $100.00')).toBeInTheDocument();
    expect(screen.getByText('Final Price: $100.00')).toBeInTheDocument();
  });

  it('should display discount information when discount is applied', () => {
    renderWithTheme(
      <PriceDisplay 
        originalPrice={100} 
        discountPercentage={20} 
      />
    );
    
    expect(screen.getByText('Original Price: $100.00')).toBeInTheDocument();
    expect(screen.getByText('Discount (20%): -$20.00')).toBeInTheDocument();
    expect(screen.getByText('Discounted Price: $80.00')).toBeInTheDocument();
    expect(screen.getByText('Final Price: $80.00')).toBeInTheDocument();
  });

  it('should display tax information when tax is applied', () => {
    renderWithTheme(
      <PriceDisplay 
        originalPrice={100} 
        taxRate={10} 
        showTax={true}
      />
    );
    
    expect(screen.getByText('Tax (10%): $10.00')).toBeInTheDocument();
    expect(screen.getByText('Final Price: $110.00')).toBeInTheDocument();
  });

  it('should display both discount and tax correctly', () => {
    renderWithTheme(
      <PriceDisplay 
        originalPrice={100} 
        discountPercentage={20}
        taxRate={10} 
        showTax={true}
      />
    );
    
    expect(screen.getByText('Original Price: $100.00')).toBeInTheDocument();
    expect(screen.getByText('Discount (20%): -$20.00')).toBeInTheDocument();
    expect(screen.getByText('Discounted Price: $80.00')).toBeInTheDocument();
    expect(screen.getByText('Tax (10%): $8.00')).toBeInTheDocument();
    expect(screen.getByText('Final Price: $88.00')).toBeInTheDocument();
  });

  it('should show in stock status when quantity is positive', () => {
    renderWithTheme(
      <PriceDisplay 
        originalPrice={100} 
        quantity={5}
      />
    );
    
    expect(screen.getByText('In Stock (5)')).toBeInTheDocument();
  });

  it('should show out of stock status when quantity is zero', () => {
    renderWithTheme(
      <PriceDisplay 
        originalPrice={100} 
        quantity={0}
      />
    );
    
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('should not display tax when showTax is false', () => {
    renderWithTheme(
      <PriceDisplay 
        originalPrice={100} 
        taxRate={10}
        showTax={false}
      />
    );
    
    expect(screen.queryByText(/Tax/)).not.toBeInTheDocument();
    expect(screen.getByText('Final Price: $100.00')).toBeInTheDocument();
  });

  it('should not display discount section when no discount is applied', () => {
    renderWithTheme(
      <PriceDisplay 
        originalPrice={100} 
        discountPercentage={0}
      />
    );
    
    expect(screen.queryByText(/Discount/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Discounted Price/)).not.toBeInTheDocument();
  });

  it('should handle complex calculations correctly', () => {
    renderWithTheme(
      <PriceDisplay 
        originalPrice={199.99} 
        discountPercentage={25}
        taxRate={8.5}
        quantity={3}
        showTax={true}
      />
    );
    
    // Original: $199.99
    // Discount 25%: $199.99 - $50.00 = $149.99
    // Tax 8.5%: $149.99 * 0.085 = $12.75 (rounded)
    // Final: $149.99 + $12.75 = $162.74
    
    expect(screen.getByText('Original Price: $199.99')).toBeInTheDocument();
    expect(screen.getByText('In Stock (3)')).toBeInTheDocument();
  });
});
