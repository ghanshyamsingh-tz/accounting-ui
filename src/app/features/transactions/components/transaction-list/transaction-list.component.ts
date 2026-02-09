import { Component, OnInit, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TransactionsApiService } from '../../services/transactions-api.service';
import { TenantService } from '../../../../core/services/tenant.service';
import { StatementTransaction } from '../../models/statement.model';
import { SourceType } from '../../models/source-type.enum';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { TransactionRowComponent } from '../transaction-row/transaction-row.component';
import { TransactionFiltersComponent } from '../transaction-filters/transaction-filters.component';
import { CurrencyDecimalPipe } from '../../../../shared/pipes/currency-decimal.pipe';
import { createPaginationState, updatePaginationFromResponse, resetToFirstPage } from '../../../../core/utils/pagination.util';
import { createLoadingState, setLoading, setError } from '../../../../core/utils/loading-state.util';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [
    CommonModule,
    PaginationComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    TransactionRowComponent,
    TransactionFiltersComponent,
    CurrencyDecimalPipe
  ],
  templateUrl: './transaction-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionListComponent implements OnInit {
  private transactionsApi = inject(TransactionsApiService);
  private tenantService = inject(TenantService);
  private route = inject(ActivatedRoute);

  accountId = signal<string>('');
  ledgerEntries = signal<StatementTransaction[]>([]);
  accountName = signal<string>('');
  openingBalance = signal<number>(0);
  closingBalance = signal<number>(0);
  loadingState = createLoadingState();
  pagination = createPaginationState();

  // Filters
  startDate = signal<string | undefined>(undefined);
  endDate = signal<string | undefined>(undefined);
  sourceType = signal<SourceType | undefined>(undefined);
  linkedInvoiceId = signal<string | undefined>(undefined);

  ngOnInit(): void {
    // Debug: Check route hierarchy
    console.log('Current route:', this.route);
    console.log('Parent route:', this.route.parent);
    console.log('Parent.parent route:', this.route.parent?.parent);
    
    // Get accountId from parent route (accounts/:id)
    // Route structure: accounts/:id -> transactions (lazy) -> '' (component)
    const parentWithId = this.route.parent?.parent || this.route.parent;
    
    if (parentWithId) {
      parentWithId.params.subscribe(params => {
        console.log('Parent params:', params);
        const id = params['id'];
        if (id) {
          console.log('Found accountId:', id);
          this.accountId.set(id);
          this.loadLedgerEntries();
        }
      });
    }

    // Subscribe to query params for filters
    this.route.queryParams.subscribe(queryParams => {
      const invoiceId = queryParams['invoiceId'];
      this.linkedInvoiceId.set(invoiceId);
      
      if (this.accountId() && invoiceId) {
        this.loadLedgerEntries();
      }
    });
  }

  loadLedgerEntries(): void {
    const tenantId = this.tenantService.getCurrentTenantId();
    if (!tenantId) {
      setError(this.loadingState, 'No tenant selected');
      return;
    }

    setLoading(this.loadingState, true);

    this.transactionsApi.getLedgerEntries(
      tenantId,
      this.accountId(),
      this.pagination.currentPage(),
      this.pagination.pageSize(),
      this.startDate(),
      this.endDate(),
      this.sourceType(),
      this.linkedInvoiceId()
    ).subscribe({
      next: (statement) => {
        // Set transactions from statement
        this.ledgerEntries.set(statement.transactions || []);
        this.accountName.set(statement.accountName || '');
        this.openingBalance.set(statement.openingBalance || 0);
        this.closingBalance.set(statement.closingBalance || 0);
        
        // Calculate total pages
        const totalPages = Math.ceil(statement.totalCount / statement.pageSize) || 1;
        
        this.pagination.currentPage.set(statement.page || 1);
        this.pagination.totalPages.set(totalPages);
        this.pagination.totalItems.set(statement.totalCount || 0);
        this.pagination.pageSize.set(statement.pageSize || 50);
        this.pagination.hasNext.set((statement.page || 1) < totalPages);
        this.pagination.hasPrevious.set((statement.page || 1) > 1);
        
        setLoading(this.loadingState, false);
      },
      error: (err) => {
        console.error('Failed to load statement:', err);
        setError(this.loadingState, 'Failed to load transactions. Please try again.');
      }
    });
  }

  onPageChange(page: number): void {
    this.pagination.currentPage.set(page);
    this.loadLedgerEntries();
  }

  onFiltersChange(filters: { startDate?: string; endDate?: string; sourceType?: SourceType }): void {
    this.startDate.set(filters.startDate);
    this.endDate.set(filters.endDate);
    this.sourceType.set(filters.sourceType);
    resetToFirstPage(this.pagination);
    this.loadLedgerEntries();
  }

  onRetry(): void {
    this.loadLedgerEntries();
  }

  trackByLedgerEntryId(index: number, entry: StatementTransaction): string {
    return entry.id;
  }
}
