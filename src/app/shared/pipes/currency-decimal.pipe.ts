import { Pipe, PipeTransform } from '@angular/core';

/**
 * Currency formatting pipe for decimal dollar amounts.
 * 
 * Transforms decimal dollar values into properly formatted currency strings
 * with the $ symbol. Unlike currencyFormat pipe which expects cents,
 * this pipe expects decimal dollar amounts.
 * 
 * @remarks
 * - Expects amounts as decimal numbers (e.g., 100.50 for $100.50)
 * - Supports negative values
 * - Handles null/undefined gracefully
 * 
 * @example
 * ```html
 * <!-- Basic usage -->
 * <span>{{ 540.00 | currencyDecimal }}</span>
 * <!-- Output: "$540.00" -->
 * 
 * <!-- Negative amount -->
 * <span>{{ -150.75 | currencyDecimal }}</span>
 * <!-- Output: "-$150.75" -->
 * 
 * <!-- Null handling -->
 * <span>{{ null | currencyDecimal }}</span>
 * <!-- Output: "$0.00" -->
 * ```
 */
@Pipe({
  name: 'currencyDecimal',
  standalone: true
})
export class CurrencyDecimalPipe implements PipeTransform {
  /**
   * Transforms decimal dollar amounts into formatted USD currency strings.
   * 
   * @param amount - The dollar amount to format (null/undefined treated as 0)
   * @returns Formatted currency string with $ symbol
   * 
   * @example
   * ```typescript
   * transform(540.00); // Returns: "$540.00"
   * transform(-150.75); // Returns: "-$150.75"
   * transform(null); // Returns: "$0.00"
   * ```
   */
  transform(amount: number | null | undefined): string {
    if (amount === null || amount === undefined) {
      return '$0.00';
    }

    const isNegative = amount < 0;
    const absolute = Math.abs(amount);
    const formatted = absolute.toFixed(2);

    return isNegative ? `-$${formatted}` : `$${formatted}`;
  }
}
