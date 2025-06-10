import { 
  formatAsPrice, 
  calculateDiscountedPrice, 
  calculateTax, 
  formatProductName, 
  generateProductId, 
  isInStock, 
  calculateShippingCost 
} from './utils';

describe('Utils Functions', () => {
  describe('formatAsPrice', () => {
    it('should format price as USD currency', () => {
      expect(formatAsPrice(10.99)).toBe('$10.99');
      expect(formatAsPrice(100)).toBe('$100.00');
      expect(formatAsPrice(0)).toBe('$0.00');
    });

    it('should handle large numbers', () => {
      expect(formatAsPrice(1234.56)).toBe('$1,234.56');
      expect(formatAsPrice(1000000)).toBe('$1,000,000.00');
    });

    it('should handle decimal places correctly', () => {
      expect(formatAsPrice(9.999)).toBe('$10.00');
      expect(formatAsPrice(9.99)).toBe('$9.99');
    });
  });

  describe('calculateDiscountedPrice', () => {
    it('should calculate discounted price correctly', () => {
      expect(calculateDiscountedPrice(100, 10)).toBe(90);
      expect(calculateDiscountedPrice(50, 20)).toBe(40);
      expect(calculateDiscountedPrice(200, 50)).toBe(100);
    });

    it('should handle zero discount', () => {
      expect(calculateDiscountedPrice(100, 0)).toBe(100);
    });

    it('should handle 100% discount', () => {
      expect(calculateDiscountedPrice(100, 100)).toBe(0);
    });

    it('should throw error for negative price', () => {
      expect(() => calculateDiscountedPrice(-10, 10)).toThrow('Original price cannot be negative');
    });

    it('should throw error for invalid discount percentage', () => {
      expect(() => calculateDiscountedPrice(100, -5)).toThrow('Discount percentage must be between 0 and 100');
      expect(() => calculateDiscountedPrice(100, 105)).toThrow('Discount percentage must be between 0 and 100');
    });
  });

  describe('calculateTax', () => {
    it('should calculate tax correctly', () => {
      expect(calculateTax(100, 10)).toBe(10);
      expect(calculateTax(50, 8.5)).toBe(4.25);
      expect(calculateTax(200, 0)).toBe(0);
    });

    it('should throw error for negative price', () => {
      expect(() => calculateTax(-10, 5)).toThrow('Price cannot be negative');
    });

    it('should throw error for negative tax rate', () => {
      expect(() => calculateTax(100, -5)).toThrow('Tax rate cannot be negative');
    });
  });

  describe('formatProductName', () => {
    it('should capitalize first letter of each word', () => {
      expect(formatProductName('apple iphone')).toBe('Apple Iphone');
      expect(formatProductName('samsung galaxy s21')).toBe('Samsung Galaxy S21');
      expect(formatProductName('wireless bluetooth headphones')).toBe('Wireless Bluetooth Headphones');
    });

    it('should handle single word', () => {
      expect(formatProductName('laptop')).toBe('Laptop');
    });

    it('should handle empty or invalid input', () => {
      expect(formatProductName('')).toBe('');
      expect(formatProductName('   ')).toBe('');
      expect(formatProductName(null as any)).toBe('');
      expect(formatProductName(undefined as any)).toBe('');
    });

    it('should handle mixed case input', () => {
      expect(formatProductName('APPle iPHONe')).toBe('Apple Iphone');
      expect(formatProductName('SAMSUNG GALAXY')).toBe('Samsung Galaxy');
    });

    it('should handle extra spaces', () => {
      expect(formatProductName('  apple   iphone  ')).toBe('Apple Iphone');
    });
  });

  describe('generateProductId', () => {
    it('should generate ID with default prefix', () => {
      const id = generateProductId();
      expect(id).toMatch(/^prod-\d+-\d+$/);
    });

    it('should generate ID with custom prefix', () => {
      const id = generateProductId('item');
      expect(id).toMatch(/^item-\d+-\d+$/);
    });

    it('should generate unique IDs', () => {
      const id1 = generateProductId();
      const id2 = generateProductId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('isInStock', () => {
    it('should return true for positive quantities', () => {
      expect(isInStock(1)).toBe(true);
      expect(isInStock(100)).toBe(true);
      expect(isInStock(0.5)).toBe(true);
    });

    it('should return false for zero or negative quantities', () => {
      expect(isInStock(0)).toBe(false);
      expect(isInStock(-1)).toBe(false);
      expect(isInStock(-10)).toBe(false);
    });
  });

  describe('calculateShippingCost', () => {
    it('should calculate shipping cost correctly', () => {
      // Base rate (5) + weight (2kg * 0.5) + distance (10km * 0.1) = 5 + 1 + 1 = 7
      expect(calculateShippingCost(2, 10)).toBe(7);
      
      // Base rate (5) + weight (5kg * 0.5) + distance (20km * 0.1) = 5 + 2.5 + 2 = 9.5
      expect(calculateShippingCost(5, 20)).toBe(9.5);
    });

    it('should handle minimum values', () => {
      // Base rate (5) + weight (0.1kg * 0.5) + distance (0.1km * 0.1) = 5 + 0.05 + 0.01 = 5.06
      expect(calculateShippingCost(0.1, 0.1)).toBe(5.06);
    });

    it('should throw error for zero or negative weight', () => {
      expect(() => calculateShippingCost(0, 10)).toThrow('Weight and distance must be positive numbers');
      expect(() => calculateShippingCost(-1, 10)).toThrow('Weight and distance must be positive numbers');
    });

    it('should throw error for zero or negative distance', () => {
      expect(() => calculateShippingCost(5, 0)).toThrow('Weight and distance must be positive numbers');
      expect(() => calculateShippingCost(5, -10)).toThrow('Weight and distance must be positive numbers');
    });
  });
});
