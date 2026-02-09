/**
 * Enumeration of transaction source types.
 * 
 * Identifies the origin of a ledger entry, determining whether it represents
 * a charge (ride) or a payment (credit).
 * 
 * @remarks
 * - RideCharge: Debit entry from a completed ride (increases amount owed)
 * - Payment: Credit entry from a customer payment (decreases amount owed)
 * 
 * @example
 * ```typescript
 * // Filter for ride charges only
 * transactionsService.getLedgerEntries(
 *   tenantId,
 *   accountId,
 *   1,
 *   50,
 *   undefined,
 *   undefined,
 *   SourceType.RideCharge
 * );
 * 
 * // Determine entry type for display
 * const isCharge = entry.sourceType === SourceType.RideCharge;
 * const icon = isCharge ? '↓' : '↑';
 * const color = isCharge ? 'red' : 'green';
 * ```
 */
export enum SourceType {
  RideCharge = 'RideCharge',
  Payment = 'Payment'
}
