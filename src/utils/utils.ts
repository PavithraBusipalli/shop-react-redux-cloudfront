const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const formatAsPrice = (price: number) => priceFormatter.format(price);

/**
 * Calculate the total price with discount
 * @param originalPrice - The original price
 * @param discountPercentage - The discount percentage (0-100)
 * @returns The discounted price
 */
export const calculateDiscountedPrice = (originalPrice: number, discountPercentage: number): number => {
  if (originalPrice < 0) {
    throw new Error("Original price cannot be negative");
  }
  if (discountPercentage < 0 || discountPercentage > 100) {
    throw new Error("Discount percentage must be between 0 and 100");
  }
  
  const discountAmount = (originalPrice * discountPercentage) / 100;
  return originalPrice - discountAmount;
};

/**
 * Calculate tax amount based on price and tax rate
 * @param price - The price before tax
 * @param taxRate - The tax rate as a percentage (0-100)
 * @returns The tax amount
 */
export const calculateTax = (price: number, taxRate: number): number => {
  if (price < 0) {
    throw new Error("Price cannot be negative");
  }
  if (taxRate < 0) {
    throw new Error("Tax rate cannot be negative");
  }
  
  return (price * taxRate) / 100;
};

/**
 * Format a product name for display (capitalize first letter of each word)
 * @param name - The product name
 * @returns The formatted product name
 */
export const formatProductName = (name: string): string => {
  if (!name || typeof name !== 'string') {
    return '';
  }
    return name
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Generate a random product ID
 * @param prefix - Optional prefix for the ID
 * @returns A random product ID
 */
export const generateProductId = (prefix: string = 'prod'): string => {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);
  return `${prefix}-${timestamp}-${randomNum}`;
};

/**
 * Check if a product is in stock
 * @param quantity - The quantity in stock
 * @returns True if in stock, false otherwise
 */
export const isInStock = (quantity: number): boolean => {
  return quantity > 0;
};

/**
 * Calculate shipping cost based on weight and distance
 * @param weight - Weight in pounds
 * @param distance - Distance in miles
 * @param expedited - Whether to use expedited shipping
 * @returns Shipping cost in dollars
 */
export function calculateShippingCost(weight: number, distance: number, expedited: boolean = false): number {
  if (weight <= 0 || distance <= 0) {
    return 0;
  }
  
  const baseRate = 0.5; // $0.50 per pound
  const distanceRate = 0.001; // $0.001 per mile
  const expeditedMultiplier = 2;
  
  let cost = (weight * baseRate) + (distance * distanceRate);
  
  if (expedited) {
    cost *= expeditedMultiplier;
  }
  
  // Minimum shipping cost of $5
  return Math.max(cost, 5);
}

/**
 * Generate a unique order ID
 * @param prefix - Optional prefix for the order ID
 * @returns A unique order ID string
 */
export function generateOrderId(prefix: string = 'ORD'): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Calculate estimated delivery date
 * @param orderDate - The date the order was placed
 * @param expedited - Whether expedited shipping is used
 * @returns Estimated delivery date
 */
export function calculateDeliveryDate(orderDate: Date, expedited: boolean = false): Date {
  const deliveryDate = new Date(orderDate);
  const daysToAdd = expedited ? 2 : 5; // 2 days for expedited, 5 for standard
  
  deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);
  
  // Skip weekends for delivery
  while (deliveryDate.getDay() === 0 || deliveryDate.getDay() === 6) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
  }
  
  return deliveryDate;
}

/**
 * Format date for display
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Calculate loyalty points based on purchase amount and customer tier
 * @param purchaseAmount - The total purchase amount
 * @param customerTier - The customer tier ('bronze', 'silver', 'gold', 'platinum')
 * @param isFirstPurchase - Whether this is the customer's first purchase
 * @returns The loyalty points earned
 */
export function calculateLoyaltyPoints(
  purchaseAmount: number, 
  customerTier: 'bronze' | 'silver' | 'gold' | 'platinum' = 'bronze',
  isFirstPurchase: boolean = false
): number {
  if (purchaseAmount <= 0) {
    return 0;
  }

  // Base points: 1 point per dollar
  let points = Math.floor(purchaseAmount);

  // Tier multipliers
  const tierMultipliers = {
    bronze: 1,
    silver: 1.5,
    gold: 2,
    platinum: 3
  };

  points *= tierMultipliers[customerTier];

  // First purchase bonus
  if (isFirstPurchase) {
    points += 50; // 50 bonus points for first purchase
  }

  // Bonus for large purchases
  if (purchaseAmount >= 500) {
    points += 100; // 100 bonus points for purchases over $500
  }

  return Math.floor(points);
}

/**
 * Validate and format phone number
 * @param phoneNumber - The phone number to validate and format
 * @returns Formatted phone number or null if invalid
 */
export function formatPhoneNumber(phoneNumber: string): string | null {
  if (!phoneNumber) {
    return null;
  }

  // Remove all non-digits
  const digits = phoneNumber.replace(/\D/g, '');

  // Check if it's a valid US phone number (10 digits)
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // Check if it's a valid US phone number with country code (11 digits starting with 1)
  if (digits.length === 11 && digits.startsWith('1')) {
    const phoneDigits = digits.slice(1);
    return `+1 (${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3, 6)}-${phoneDigits.slice(6)}`;
  }

  return null; // Invalid phone number
}
