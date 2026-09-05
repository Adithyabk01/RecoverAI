import type { PaymentRecord, PaymentMethod, PaymentStatus, FailureReason } from '../types/payment';

// Mulberry32 deterministic pseudo-random number generator
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SEED = 20260904; // Fixed deterministic seed

const FIRST_NAMES = [
  'Aarav', 'Ananya', 'Rohan', 'Priya', 'Vikram', 'Neha', 'Aditya', 'Kavya',
  'Siddharth', 'Diya', 'Rahul', 'Isha', 'Arjun', 'Pooja', 'Varun', 'Sneha',
  'Karan', 'Meera', 'Dev', 'Tanvi', 'Rajesh', 'Shreya', 'Amit', 'Riya',
  'Manish', 'Simran', 'Akash', 'Kriti', 'Suresh', 'Swati'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Reddy', 'Malhotra', 'Gupta', 'Iyer', 'Nair',
  'Joshi', 'Chowdhury', 'Rao', 'Kumar', 'Singh', 'Deshmukh', 'Mehta', 'Bhat',
  'Kulkarni', 'Kapoor', 'Das', 'Saxena', 'Agrawal', 'Pillai', 'Shetty', 'Venkatesh'
];

const EMAIL_DOMAINS = ['gmail.com', 'yahoo.co.in', 'outlook.com', 'hotmail.com', 'icloud.com', 'enterprise.in'];

const FAILURE_REASONS: FailureReason[] = [
  'Temporary processing failure',
  'Insufficient funds',
  'Authentication failure',
  'Payment timeout',
  'Payment method issue',
  'Bank/server issue',
];

/**
 * Generate exactly 1,000 deterministic synthetic payment records.
 */
export function generateSyntheticPayments(): PaymentRecord[] {
  const random = mulberry32(SEED);
  const records: PaymentRecord[] = [];

  const now = new Date('2026-09-04T12:00:00Z').getTime();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  for (let i = 1; i <= 1000; i++) {
    // Pick customer
    const fnIdx = Math.floor(random() * FIRST_NAMES.length);
    const lnIdx = Math.floor(random() * LAST_NAMES.length);
    const firstName = FIRST_NAMES[fnIdx];
    const lastName = LAST_NAMES[lnIdx];
    const customerName = `${firstName} ${lastName}`;
    const domain = EMAIL_DOMAINS[Math.floor(random() * EMAIL_DOMAINS.length)];
    const customerEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(random() * 90 + 10)}@${domain}`;
    const customerId = `cust_${(1000 + Math.floor(random() * 8999)).toString()}`;

    // Transaction & Order IDs
    const hex = Math.floor(random() * 0xffffff).toString(16).padStart(6, '0');
    const transactionId = `pay_${hex}${i.toString().padStart(4, '0')}`;
    const orderId = `order_${Math.floor(random() * 899999 + 100000)}`;

    // Payment Method (Weighted: 50% UPI, 35% Card, 15% Net Banking)
    const pmRoll = random();
    let paymentMethod: PaymentMethod = 'UPI';
    if (pmRoll > 0.50 && pmRoll <= 0.85) paymentMethod = 'Card';
    else if (pmRoll > 0.85) paymentMethod = 'Net Banking';

    // Status (Weighted: 68% SUCCESS, 24% FAILED, 8% PENDING)
    const statusRoll = random();
    let status: PaymentStatus = 'SUCCESS';
    if (statusRoll > 0.68 && statusRoll <= 0.92) status = 'FAILED';
    else if (statusRoll > 0.92) status = 'PENDING';

    // Failure reason
    let failureReason: FailureReason | null = null;
    if (status === 'FAILED') {
      const frIdx = Math.floor(random() * FAILURE_REASONS.length);
      failureReason = FAILURE_REASONS[frIdx];
    } else if (status === 'PENDING') {
      // 50% of pending have an associated early issue
      if (random() > 0.5) {
        failureReason = FAILURE_REASONS[Math.floor(random() * FAILURE_REASONS.length)];
      }
    }

    // Realistic INR amount: ranging from ₹199 to ₹85,000
    // Use skewed distribution for realistic merchant ticket sizes
    let amount: number;
    const amountRoll = random();
    if (amountRoll < 0.45) {
      // Small transactions (e.g. subscriptions/retail ₹199 - ₹1,999)
      amount = Math.floor(199 + random() * 1800);
    } else if (amountRoll < 0.80) {
      // Medium transactions (e.g. e-commerce ₹2,000 - ₹12,000)
      amount = Math.floor(2000 + random() * 10000);
    } else {
      // High-ticket transactions (₹12,000 - ₹85,000)
      amount = Math.floor(12000 + random() * 73000);
    }

    // Attempt number (1 to 4)
    let attemptNumber = 1;
    if (status === 'FAILED') {
      attemptNumber = Math.floor(random() * 3) + 1; // 1, 2, 3
    } else if (status === 'SUCCESS') {
      attemptNumber = random() > 0.8 ? Math.floor(random() * 2) + 1 : 1;
    } else {
      attemptNumber = Math.floor(random() * 2) + 1;
    }

    // Timestamp within last 30 days
    const timeOffset = Math.floor(random() * thirtyDaysMs);
    const timestamp = new Date(now - timeOffset).toISOString();

    // Previous successful payments (customer history)
    const prevCount = Math.floor(random() * 15);
    const avgPrevAmount = Math.floor(300 + random() * 4000);
    const prevTotalAmount = prevCount * avgPrevAmount;

    records.push({
      transaction_id: transactionId,
      order_id: orderId,
      customer_id: customerId,
      customer_name: customerName,
      customer_email: customerEmail,
      amount,
      payment_method: paymentMethod,
      status,
      failure_reason: failureReason,
      attempt_number: attemptNumber,
      timestamp,
      previous_successful_payments: {
        count: prevCount,
        total_amount: prevTotalAmount,
      },
    });
  }

  // Sort descending by timestamp for clean display
  return records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
