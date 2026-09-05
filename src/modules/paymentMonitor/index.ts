import type { PaymentRecord } from '../../types/payment';
import { generateSyntheticPayments } from '../../services/syntheticData';

export interface PaymentMonitorConfig {
  autoRefreshIntervalMs?: number;
}

export class PaymentMonitor {
  private records: PaymentRecord[] = [];

  constructor() {
    this.records = generateSyntheticPayments();
  }

  public getPayments(): PaymentRecord[] {
    return this.records;
  }

  public getPaymentById(id: string): PaymentRecord | undefined {
    return this.records.find((r) => r.transaction_id === id);
  }
}
