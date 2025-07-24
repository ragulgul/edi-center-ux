import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { EdiService } from '../../services/edi.service';
import { EdiTransaction, EdiFilters } from '../../interfaces/edi-transaction.interface';
import { EdiFiltersComponent } from '../edi-filters/edi-filters.component';
import { EdiTableComponent } from '../edi-table/edi-table.component';
import { X12ViewerComponent } from '../x12-viewer/x12-viewer.component';

@Component({
  selector: 'app-edi-center',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    EdiFiltersComponent, 
    EdiTableComponent,
    X12ViewerComponent
  ],
  template: `
    <div class="edi-center">
      <div class="header">
        <h1 class="title">EDI Center</h1>
        <p class="subtitle">Manage and monitor your EDI transactions</p>
      </div>

      <app-edi-filters 
        (filtersChange)="onFiltersChange($event)"
        [loading]="loading">
      </app-edi-filters>

      <div class="results-section">
        <div class="results-header">
          <h2 class="results-title">Transactions</h2>
          <span class="results-count">{{ filteredTransactions.length }} transactions found</span>
        </div>

        <app-edi-table 
          [transactions]="filteredTransactions"
          [loading]="loading"
          (viewX12)="onViewX12($event)"
          (viewOrder)="onViewOrder($event)"
          (resendTransaction)="onResendTransaction($event)"
          (reloadTransaction)="onReloadTransaction($event)">
        </app-edi-table>
      </div>

      <app-x12-viewer 
        *ngIf="selectedTransaction"
        [transaction]="selectedTransaction"
        (close)="closeX12Viewer()">
      </app-x12-viewer>
    </div>
  `,
  styles: [`
    .edi-center {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
      background: #f8fafc;
      min-height: 100vh;
    }

    .header {
      margin-bottom: 32px;
    }

    .title {
      font-size: 32px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
      line-height: 1.2;
    }

    .subtitle {
      font-size: 16px;
      color: #64748b;
      margin: 0;
      line-height: 1.5;
    }

    .results-section {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 1px solid #e2e8f0;
      background: #f8fafc;
    }

    .results-title {
      font-size: 20px;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .results-count {
      font-size: 14px;
      color: #64748b;
      background: #e2e8f0;
      padding: 6px 12px;
      border-radius: 20px;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .edi-center {
        padding: 16px;
      }

      .title {
        font-size: 24px;
      }

      .results-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
    }
  `]
})
export class EdiCenterComponent implements OnInit, OnDestroy {
  filteredTransactions: EdiTransaction[] = [];
  loading: boolean = false;
  selectedTransaction: EdiTransaction | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(private ediService: EdiService) {}

  ngOnInit() {
    this.loadTransactions({
      searchText: '',
      fromDate: '',
      toDate: '',
      tradingPartner: '',
      status: '',
      documentType: ''
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFiltersChange(filters: EdiFilters) {
    this.loadTransactions(filters);
  }

  private loadTransactions(filters: EdiFilters) {
    this.loading = true;
    this.ediService.getTransactions(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe(transactions => {
        this.filteredTransactions = transactions;
        this.loading = false;
      });
  }

  onViewX12(transaction: EdiTransaction) {
    this.selectedTransaction = transaction;
  }

  onViewOrder(transaction: EdiTransaction) {
    console.log('Navigating to Order Center for order:', transaction.orderId);
    // Here you would navigate to the Order Center with the specific order ID
    // Example: this.router.navigate(['/order-center', transaction.orderId]);
  }

  onResendTransaction(transaction: EdiTransaction) {
    if (confirm(`Are you sure you want to resend transaction ${transaction.customerReferenceNumber}?`)) {
      this.ediService.resendTransaction(transaction.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(success => {
          if (success) {
            console.log('Transaction resent successfully');
            // Show success message
          }
        });
    }
  }

  onReloadTransaction(transaction: EdiTransaction) {
    if (confirm(`Are you sure you want to reload transaction ${transaction.customerReferenceNumber}?`)) {
      this.ediService.reloadTransaction(transaction.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(success => {
          if (success) {
            console.log('Transaction reloaded successfully');
            // Show success message and refresh data
            this.onFiltersChange({
              searchText: '',
              fromDate: '',
              toDate: '',
              tradingPartner: '',
              status: '',
              documentType: ''
            });
          }
        });
    }
  }

  closeX12Viewer() {
    this.selectedTransaction = null;
  }
}