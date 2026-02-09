import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatementTransaction } from '../../models/statement.model';
import { CurrencyDecimalPipe } from '../../../../shared/pipes/currency-decimal.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';

@Component({
  selector: '[app-transaction-row]',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyDecimalPipe,
    DateFormatPipe
  ],
  templateUrl: './transaction-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionRowComponent {
  @Input({ required: true }) transaction!: StatementTransaction;
  @Input({ required: true }) accountId!: string;
}
