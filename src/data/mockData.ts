import { Order, ProductCategory, OrderStatus, TopProductData } from '../types';

export const CATEGORIES: { name: ProductCategory; color: string; avgMargin: number }[] = [
  { name: 'Electronics', color: '#6366f1', avgMargin: 0.32 },
  { name: 'Computing', color: '#0ea5e9', avgMargin: 0.28 },
  { name: 'Audio & Video', color: '#10b981', avgMargin: 0.42 },
  { name: 'Smart Home', color: '#f59e0b', avgMargin: 0.36 },
  { name: 'Office & Ergonomics', color: '#8b5cf6', avgMargin: 0.45 },
  { name: 'Wearables', color: '#ec4899', avgMargin: 0.38 },
  { name: 'Gaming Accessories', color: '#f43f5e', avgMargin: 0.35 },
];

export const CITIES: { city: string; state: string; weight: number }[] = [
  { city: 'New York', state: 'NY', weight: 1.2 },
  { city: 'Los Angeles', state: 'CA', weight: 1.1 },
  { city: 'Chicago', state: 'IL', weight: 0.9 },
  { city: 'Houston', state: 'TX', weight: 0.8 },
  { city: 'Austin', state: 'TX', weight: 0.95 },
  { city: 'San Francisco', state: 'CA', weight: 1.15 },
  { city: 'Seattle', state: 'WA', weight: 1.05 },
  { city: 'Boston', state: 'MA', weight: 0.85 },
  { city: 'Denver', state: 'CO', weight: 0.75 },
  { city: 'Miami', state: 'FL', weight: 0.8 },
  { city: 'San Diego', state: 'CA', weight: 0.7 },
  { city: 'Atlanta', state: 'GA', weight: 0.75 },
  { city: 'Dallas', state: 'TX', weight: 0.85 },
  { city: 'Phoenix', state: 'AZ', weight: 0.65 },
];

export const PRODUCTS_CATALOG: {
  id: string;
  name: string;
  category: ProductCategory;
  unitPrice: number;
  cost: number;
  stock: number;
  rating: number;
}[] = [
  { id: 'PRD-101', name: 'UltraWide 34" Curved 144Hz Monitor', category: 'Computing', unitPrice: 649.99, cost: 450.00, stock: 48, rating: 4.8 },
  { id: 'PRD-102', name: 'Studio Pro ANC Wireless Headphones', category: 'Audio & Video', unitPrice: 349.99, cost: 195.00, stock: 112, rating: 4.9 },
  { id: 'PRD-103', name: 'Ergonomic Task Chair with Lumbar Support', category: 'Office & Ergonomics', unitPrice: 429.00, cost: 235.00, stock: 35, rating: 4.7 },
  { id: 'PRD-104', name: 'M3 Pro Aluminum Thunderbolt 4 Dock', category: 'Computing', unitPrice: 229.50, cost: 145.00, stock: 85, rating: 4.6 },
  { id: 'PRD-105', name: 'Smart Fitness Tracker & Bio-Sensor Band', category: 'Wearables', unitPrice: 179.99, cost: 105.00, stock: 140, rating: 4.5 },
  { id: 'PRD-106', name: 'Custom Hot-Swap RGB Mechanical Keyboard', category: 'Gaming Accessories', unitPrice: 189.00, cost: 115.00, stock: 92, rating: 4.8 },
  { id: 'PRD-107', name: '4K HDR AI Tracking Studio Webcam', category: 'Audio & Video', unitPrice: 199.99, cost: 120.00, stock: 64, rating: 4.7 },
  { id: 'PRD-108', name: 'Smart Ambient Desk Bar Light & Screen Bar', category: 'Smart Home', unitPrice: 99.00, cost: 58.00, stock: 180, rating: 4.6 },
  { id: 'PRD-109', name: 'MagSafe 3-in-1 Fast Wireless Station', category: 'Electronics', unitPrice: 119.00, cost: 68.00, stock: 155, rating: 4.4 },
  { id: 'PRD-110', name: 'Dual Gas Spring Heavy-Duty Monitor Arm', category: 'Office & Ergonomics', unitPrice: 149.99, cost: 82.00, stock: 78, rating: 4.8 },
  { id: 'PRD-111', name: 'Ultra-Lightweight Wireless Gaming Mouse', category: 'Gaming Accessories', unitPrice: 129.99, cost: 74.00, stock: 130, rating: 4.7 },
  { id: 'PRD-112', name: 'Smart HEPA Air Quality Desk Purifier', category: 'Smart Home', unitPrice: 189.99, cost: 112.00, stock: 52, rating: 4.5 },
  { id: 'PRD-113', name: 'Spatial Audio True Wireless Earbuds', category: 'Audio & Video', unitPrice: 169.00, cost: 95.00, stock: 210, rating: 4.6 },
  { id: 'PRD-114', name: 'Titanium Smart Ring Health Monitor', category: 'Wearables', unitPrice: 299.00, cost: 180.00, stock: 68, rating: 4.6 },
  { id: 'PRD-115', name: 'Precision CNC Aluminum Laptop Stand', category: 'Office & Ergonomics', unitPrice: 79.99, cost: 42.00, stock: 120, rating: 4.9 },
  { id: 'PRD-116', name: 'Noise-Absorbing Desk Felt Partition Mat', category: 'Office & Ergonomics', unitPrice: 59.99, cost: 28.00, stock: 95, rating: 4.3 },
  { id: 'PRD-117', name: 'Smart Home Matter Hub & Energy Monitor', category: 'Smart Home', unitPrice: 139.00, cost: 82.00, stock: 84, rating: 4.4 },
  { id: 'PRD-118', name: 'Portable 2TB NVMe Rugged USB4 SSD', category: 'Computing', unitPrice: 219.00, cost: 150.00, stock: 76, rating: 4.9 },
];

export const CUSTOMERS = [
  { name: 'Eleanor Vance', email: 'e.vance@veritas.io', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
  { name: 'Marcus Thorne', email: 'marcus.t@apexcloud.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
  { name: 'Sophia Chen', email: 'sophia.chen@strata.design', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
  { name: 'David K. Miller', email: 'd.miller@quantumdata.org', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
  { name: 'Amara Okafor', email: 'amara@luminos.tech', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' },
  { name: 'Julian Morales', email: 'j.morales@hyperion.co', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80' },
  { name: 'Aria Montgomery', email: 'aria.m@synthetix.ai', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80' },
  { name: 'Liam Gallagher', email: 'liam@vanguardops.net', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80' },
  { name: 'Chloe Dubois', email: 'chloe.dubois@aero.fr', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80' },
  { name: 'Nathaniel Wright', email: 'n.wright@chronos.io', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80' },
  { name: 'Zara Al-Mansoor', email: 'zara@horizoncapital.com', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80' },
  { name: 'Alexander Hayes', email: 'alex.hayes@deepblue.systems', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80' },
  { name: 'Maya Lin-Patel', email: 'maya.patel@solaris.bio', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80' },
  { name: 'Christian Brooks', email: 'c.brooks@elevate.agency', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80' },
  { name: 'Isabella Rossi', email: 'isabella@novacraft.it', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=100&auto=format&fit=crop&q=80' },
];

/**
 * Seeded deterministic pseudo-random generator for reproducible and realistic data
 */
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

/**
 * Generate a rich, realistic pool of 650+ orders spanning the past 12 months up to today.
 */
export function generateRealisticOrders(): Order[] {
  const orders: Order[] = [];
  const now = new Date('2026-09-02T12:00:00Z');
  const totalOrdersToGenerate = 680;

  const paymentMethods: Order['paymentMethod'][] = ['Credit Card', 'Credit Card', 'Apple Pay', 'PayPal', 'Bank Transfer'];
  const shippingTypes: Order['shippingType'][] = ['Standard', 'Standard', 'Express', 'Next Day', 'Free'];
  const statuses: { status: OrderStatus; weight: number }[] = [
    { status: 'Delivered', weight: 0.68 },
    { status: 'Shipped', weight: 0.14 },
    { status: 'Processing', weight: 0.09 },
    { status: 'Cancelled', weight: 0.05 },
    { status: 'Returned', weight: 0.04 },
  ];

  for (let i = 0; i < totalOrdersToGenerate; i++) {
    const seed = i * 47.19 + 13;
    const r1 = pseudoRandom(seed);
    const r2 = pseudoRandom(seed + 1);
    const r3 = pseudoRandom(seed + 2);
    const r4 = pseudoRandom(seed + 3);
    const r5 = pseudoRandom(seed + 4);
    const r6 = pseudoRandom(seed + 5);

    // Days ago between 0 and 365 days (skewed toward recent months for realistic growth)
    const daysAgo = Math.floor(Math.pow(r1, 1.3) * 365);
    const orderDateObj = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const dateStr = orderDateObj.toISOString().split('T')[0];

    // Pick customer
    const custIdx = Math.floor(r2 * CUSTOMERS.length);
    const customer = CUSTOMERS[custIdx];

    // Pick city
    const cityIdx = Math.floor(r3 * CITIES.length);
    const cityObj = CITIES[cityIdx];

    // Pick product
    const prodIdx = Math.floor(r4 * PRODUCTS_CATALOG.length);
    const productObj = PRODUCTS_CATALOG[prodIdx];

    // Quantity: mostly 1, occasionally 2-4
    let quantity = 1;
    if (r5 > 0.72) quantity = 2;
    if (r5 > 0.93) quantity = 3;
    if (r5 > 0.98) quantity = 4;

    const unitPrice = productObj.unitPrice;
    const unitCost = productObj.cost;
    const revenue = Math.round(unitPrice * quantity * 100) / 100;
    const totalCost = Math.round(unitCost * quantity * 100) / 100;
    const profit = Math.round((revenue - totalCost) * 100) / 100;
    const profitMargin = Math.round((profit / revenue) * 1000) / 10;

    // Determine status (recent orders more likely processing/shipped)
    let status: OrderStatus = 'Delivered';
    if (daysAgo < 3) {
      status = r6 > 0.4 ? 'Processing' : 'Shipped';
    } else if (daysAgo < 10) {
      status = r6 > 0.6 ? 'Shipped' : 'Delivered';
    } else {
      if (r6 < 0.05) status = 'Cancelled';
      else if (r6 < 0.09) status = 'Returned';
      else if (r6 < 0.15) status = 'Processing';
      else status = 'Delivered';
    }

    const orderNum = `ORD-${2025000 + (totalOrdersToGenerate - i)}`;
    const orderId = `ord_${(i + 1).toString().padStart(4, '0')}`;

    orders.push({
      id: orderId,
      orderNumber: orderNum,
      customerName: customer.name,
      customerEmail: customer.email,
      customerAvatar: customer.avatar,
      product: productObj.name,
      productId: productObj.id,
      category: productObj.category,
      city: cityObj.city,
      state: cityObj.state,
      orderDate: dateStr,
      quantity,
      unitPrice,
      cost: totalCost,
      revenue,
      profit,
      profitMargin,
      status,
      paymentMethod: paymentMethods[Math.floor(r1 * paymentMethods.length)],
      shippingType: shippingTypes[Math.floor(r2 * shippingTypes.length)],
    });
  }

  // Sort descending by date
  return orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
}

export const INITIAL_ORDERS: Order[] = generateRealisticOrders();
