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
