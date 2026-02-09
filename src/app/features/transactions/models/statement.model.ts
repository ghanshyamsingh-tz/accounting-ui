/**
 * Account statement response model
 * 
 * Represents a statement of account transactions for a given period,
 * including opening/closing balances and all transactions.
 */
export interface AccountStatement {
  /**
   * Account identifier
   */
  accountId: string;

  /**
   * Account name
   */
  accountName: string;

  /**
   * Statement period start date (ISO 8601)
   */
  periodStart: string;

  /**
   * Statement period end date (ISO 8601)
   */
  periodEnd: string;

  /**
   * Opening balance in USD (decimal)
   */
  openingBalance: number;

  /**
   * Closing balance in USD (decimal)
   */
  closingBalance: number;

  /**
   * List of transactions in the period
   */
  transactions: StatementTransaction[];

  /**
   * Total number of transactions
   */
  totalCount: number;

  /**
   * Current page number
   */
  page: number;

  /**
   * Page size
   */
  pageSize: number;
}

/**
 * Individual transaction in a statement
 * 
 * Represents a single transaction entry with debit/credit amounts
 * and source information.
 */
export interface StatementTransaction {
  /**
   * Unique transaction identifier
   */
  id: string;

  /**
   * Transaction date and time (ISO 8601)
   */
  transactionDate: string;

  /**
   * Ledger account name (e.g., "AccountsReceivable", "ServiceRevenue", "Cash")
   */
  ledgerAccount: string;

  /**
   * Debit amount in USD (decimal)
   */
  debitAmount: number;

  /**
   * Credit amount in USD (decimal)
   */
  creditAmount: number;

  /**
   * Transaction description
   */
  description: string;

  /**
   * Source type (e.g., "RideCharge", "Payment")
   */
  sourceType: string;

  /**
   * Reference to source transaction (nullable)
   */
  sourceReferenceId: string | null;
}
