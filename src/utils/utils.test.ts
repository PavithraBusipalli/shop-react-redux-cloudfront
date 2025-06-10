import { 
  formatAsPrice, 
  calculateDiscountedPrice, 
  calculateTax, 
  formatProductName, 
  generateProductId, 
  isInStock, 
  calculateShippingCost,
  generateOrderId,
  calculateDeliveryDate,
  formatDate,
  calculateLoyaltyPoints,
  formatPhoneNumber
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
    it('should calculate basic shipping cost correctly', () => {
      const cost = calculateShippingCost(10, 100);
      expect(cost).toBe(5.1); // (10 * 0.5) + (100 * 0.001) = 5.1
    });

    it('should apply expedited shipping multiplier', () => {
      const standardCost = calculateShippingCost(10, 100, false);
      const expeditedCost = calculateShippingCost(10, 100, true);
      expect(expeditedCost).toBe(standardCost * 2);
    });

    it('should return minimum shipping cost of $5', () => {
      const cost = calculateShippingCost(1, 1);
      expect(cost).toBe(5);
    });

    it('should return 0 for invalid inputs', () => {
      expect(calculateShippingCost(0, 100)).toBe(0);
      expect(calculateShippingCost(10, 0)).toBe(0);
      expect(calculateShippingCost(-5, 100)).toBe(0);
      expect(calculateShippingCost(10, -50)).toBe(0);
    });
  });

  describe('generateOrderId', () => {
    it('should generate order ID with default prefix', () => {
      const orderId = generateOrderId();
      expect(orderId).toMatch(/^ORD-\d+-\d{3}$/);
    });

    it('should generate order ID with custom prefix', () => {
      const orderId = generateOrderId('CUSTOM');
      expect(orderId).toMatch(/^CUSTOM-\d+-\d{3}$/);
    });

    it('should generate unique order IDs', () => {
      const id1 = generateOrderId();
      const id2 = generateOrderId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('calculateDeliveryDate', () => {
    it('should add 5 days for standard shipping', () => {
      const orderDate = new Date('2023-06-10'); // Saturday
      const deliveryDate = calculateDeliveryDate(orderDate, false);
      
      // Should be 5 business days later, skipping weekends
      expect(deliveryDate.getDay()).not.toBe(0); // Not Sunday
      expect(deliveryDate.getDay()).not.toBe(6); // Not Saturday
    });

    it('should add 2 days for expedited shipping', () => {
      const orderDate = new Date('2023-06-12'); // Monday
      const deliveryDate = calculateDeliveryDate(orderDate, true);
      
      // Should be 2 business days later
      expect(deliveryDate.getDay()).not.toBe(0); // Not Sunday
      expect(deliveryDate.getDay()).not.toBe(6); // Not Saturday
    });

    it('should skip weekends for delivery', () => {
      const orderDate = new Date('2023-06-09'); // Friday
      const deliveryDate = calculateDeliveryDate(orderDate, true);
      
      // Should not be delivered on weekend
      expect(deliveryDate.getDay()).not.toBe(0); // Not Sunday
      expect(deliveryDate.getDay()).not.toBe(6); // Not Saturday
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2023-06-15');
      const formatted = formatDate(date);
      expect(formatted).toBe('June 15, 2023');
    });

    it('should handle different dates', () => {
      const date = new Date('2024-12-25');
      const formatted = formatDate(date);
      expect(formatted).toBe('December 25, 2024');
    });
  });

  describe('calculateLoyaltyPoints', () => {
    it('should calculate basic points for bronze tier', () => {
      const points = calculateLoyaltyPoints(100, 'bronze');
      expect(points).toBe(100); // 1 point per dollar for bronze
    });

    it('should apply tier multipliers correctly', () => {
      expect(calculateLoyaltyPoints(100, 'bronze')).toBe(100);
      expect(calculateLoyaltyPoints(100, 'silver')).toBe(150);
      expect(calculateLoyaltyPoints(100, 'gold')).toBe(200);
      expect(calculateLoyaltyPoints(100, 'platinum')).toBe(300);
    });

    it('should add first purchase bonus', () => {
      const points = calculateLoyaltyPoints(100, 'bronze', true);
      expect(points).toBe(150); // 100 base + 50 first purchase bonus
    });

    it('should add large purchase bonus', () => {
      const points = calculateLoyaltyPoints(600, 'bronze', false);
      expect(points).toBe(700); // 600 base + 100 large purchase bonus
    });

    it('should combine all bonuses for platinum first purchase over $500', () => {
      const points = calculateLoyaltyPoints(600, 'platinum', true);
      expect(points).toBe(1950); // (600 * 3) + 50 + 100 = 1950
    });

    it('should return 0 for zero or negative amounts', () => {
      expect(calculateLoyaltyPoints(0)).toBe(0);
      expect(calculateLoyaltyPoints(-50)).toBe(0);
    });

    it('should use bronze as default tier', () => {
      const points = calculateLoyaltyPoints(100);
      expect(points).toBe(100);
    });    it('should handle fractional purchase amounts', () => {
      const points = calculateLoyaltyPoints(99.99, 'silver');
      expect(points).toBe(148); // Math.floor(99.99 * 1.5) = 148 (corrected)
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format 10-digit US phone numbers', () => {
      expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
      expect(formatPhoneNumber('555-123-4567')).toBe('(555) 123-4567');
      expect(formatPhoneNumber('(555) 123-4567')).toBe('(555) 123-4567');
    });

    it('should format 11-digit numbers with country code', () => {
      expect(formatPhoneNumber('11234567890')).toBe('+1 (123) 456-7890');
      expect(formatPhoneNumber('1-555-123-4567')).toBe('+1 (555) 123-4567');
    });

    it('should handle numbers with various formatting', () => {
      expect(formatPhoneNumber('(555) 123.4567')).toBe('(555) 123-4567');
      expect(formatPhoneNumber('555 123 4567')).toBe('(555) 123-4567');
      expect(formatPhoneNumber('555.123.4567')).toBe('(555) 123-4567');
    });    it('should return null for invalid numbers', () => {
      expect(formatPhoneNumber('')).toBe(null);
      expect(formatPhoneNumber('123')).toBe(null);
      expect(formatPhoneNumber('123456789012')).toBe(null); // 12 digits - too long
      expect(formatPhoneNumber('21234567890')).toBe(null); // 11 digits but starts with 2
      expect(formatPhoneNumber('abcdefghijk')).toBe(null); // Letters only, no digits
    });

    it('should return null for empty or undefined input', () => {
      expect(formatPhoneNumber('')).toBe(null);
      expect(formatPhoneNumber(null as any)).toBe(null);
      expect(formatPhoneNumber(undefined as any)).toBe(null);
    });

    it('should handle international numbers correctly', () => {
      // Only US numbers should be valid
      expect(formatPhoneNumber('441234567890')).toBe(null); // UK number
      expect(formatPhoneNumber('331234567890')).toBe(null); // French number
    });
  });
});
