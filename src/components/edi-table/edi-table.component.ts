import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EdiTransaction, SortConfig } from '../../interfaces/edi-transaction.interface';

@Component({
  selector: 'app-edi-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-container">
      <div class="table-wrapper" *ngIf="!loading; else loadingTemplate">
        <table class="edi-table">
          <thead>
            <tr>
              <th class="sortable" (click)="onSort('documentType')">
                Document Type
                <span class="sort-indicator" [ngClass]="getSortClass('documentType')">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z"/>
                  </svg>
                </span>
              </th>
              <th class="sortable" (click)="onSort('owner')">
                Owner
                <span class="sort-indicator" [ngClass]="getSortClass('owner')">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z"/>
                  </svg>
                </span>
              </th>
              <th class="sortable" (click)="onSort('tradingPartner')">
                Trading Partner
                <span class="sort-indicator" [ngClass]="getSortClass('tradingPartner')">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z"/>
                  </svg>
                </span>
              </th>
              <th class="sortable" (click)="onSort('ediIsaId')">
                EDI/ISA ID
                <span class="sort-indicator" [ngClass]="getSortClass('ediIsaId')">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z"/>
                  </svg>
                </span>
              </th>
              <th class="sortable" (click)="onSort('gsaId')">
                GSA ID
                <span class="sort-indicator" [ngClass]="getSortClass('gsaId')">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z"/>
                  </svg>
                </span>
              </th>
              <th class="sortable" (click)="onSort('customerReferenceNumber')">
                Customer Reference
                <span class="sort-indicator" [ngClass]="getSortClass('customerReferenceNumber')">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z"/>
                  </svg>
                </span>
              </th>
              <th class="sortable" (click)="onSort('dateSentReceive')">
                Date Sent/Receive
                <span class="sort-indicator" [ngClass]="getSortClass('dateSentReceive')">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z"/>
                  </svg>
                </span>
              </th>
              <th class="sortable" (click)="onSort('time')">
                Time
                <span class="sort-indicator" [ngClass]="getSortClass('time')">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z"/>
                  </svg>
                </span>
              </th>
              <th class="sortable" (click)="onSort('status')">
                Status
                <span class="sort-indicator" [ngClass]="getSortClass('status')">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z"/>
                  </svg>
                </span>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let transaction of transactions; trackBy: trackByTransactionId" class="table-row">
              <td class="document-type">{{ transaction.documentType }}</td>
              <td class="owner">{{ transaction.owner }}</td>
              <td class="trading-partner">{{ transaction.tradingPartner }}</td>
              <td class="edi-id">{{ transaction.ediIsaId }}</td>
              <td class="gsa-id">{{ transaction.gsaId }}</td>
              <td class="reference-number">{{ transaction.customerReferenceNumber }}</td>
              <td class="date">{{ transaction.dateSentReceive | date:'MM/dd/yyyy' }}</td>
              <td class="time">{{ transaction.time }}</td>
              <td class="status">
                <span 
                  class="status-badge"
                  [ngClass]="'status-' + transaction.status">
                  {{ getStatusDisplay(transaction.status) }}
                </span>
              </td>
              <td class="actions">
                <div class="action-buttons">
                  <button 
                    class="action-btn primary"
                    (click)="viewX12.emit(transaction)"
                    title="View X12 Content">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                    </svg>
                    X12
                  </button>
                  
                  <button 
                    class="action-btn secondary"
                    (click)="viewOrder.emit(transaction)"
                    title="View Order"
                    *ngIf="transaction.orderId">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
                    </svg>
                    Order
                  </button>
                  
                  <button 
                    class="action-btn warning"
                    (click)="resendTransaction.emit(transaction)"
                    title="Resend Transaction">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
                    </svg>
                    Resend
                  </button>
                  
                  <button 
                    class="action-btn info"
                    (click)="reloadTransaction.emit(transaction)"
                    title="Reload Transaction">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
                    </svg>
                    Reload
                  </button>
                </div>
              </td>
            </tr>
            
            <tr *ngIf="transactions.length === 0" class="no-data-row">
              <td colspan="10" class="no-data">
                <div class="no-data-content">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                  <p>No transactions found</p>
                  <span>Try adjusting your search criteria</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <ng-template #loadingTemplate>
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading transactions...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .table-container {
      background: white;
    }

    .table-wrapper {
      overflow-x: auto;
      border-radius: 0 0 12px 12px;
    }

    .edi-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }

    .edi-table thead {
      background: #f8fafc;
      border-bottom: 2px solid #e2e8f0;
    }

    .edi-table th {
      padding: 16px 12px;
      text-align: left;
      font-weight: 600;
      color: #374151;
      white-space: nowrap;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      position: relative;
    }

    .edi-table th.sortable {
      cursor: pointer;
      user-select: none;
      transition: background-color 0.2s ease;
    }

    .edi-table th.sortable:hover {
      background: #e2e8f0;
    }

    .sort-indicator {
      display: inline-flex;
      align-items: center;
      margin-left: 6px;
      opacity: 0.4;
      transition: all 0.2s ease;
    }

    .sort-indicator svg {
      width: 14px;
      height: 14px;
    }

    .sort-indicator.sort-asc {
      opacity: 1;
      color: #2563eb;
      transform: rotate(0deg);
    }

    .sort-indicator.sort-desc {
      opacity: 1;
      color: #2563eb;
      transform: rotate(180deg);
    }

    .sort-indicator.sort-none {
      opacity: 0.3;
    }

    .sortable:hover .sort-indicator {
      opacity: 0.7;
    }

    .edi-table td {
      padding: 16px 12px;
      border-bottom: 1px solid #f1f5f9;
      color: #1e293b;
      vertical-align: middle;
    }

    .table-row {
      transition: background-color 0.2s ease;
    }

    .table-row:hover {
      background: #f8fafc;
    }

    .document-type {
      font-weight: 600;
      color: #2563eb;
    }

    .owner {
      font-weight: 500;
    }

    .trading-partner {
      font-weight: 500;
      color: #059669;
    }

    .reference-number {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 13px;
      background: #f1f5f9;
      padding: 4px 8px;
      border-radius: 4px;
      display: inline-block;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status-success {
      background: #dcfce7;
      color: #166534;
    }

    .status-error {
      background: #fef2f2;
      color: #dc2626;
    }

    .status-pending {
      background: #fef3c7;
      color: #d97706;
    }

    .status-processing {
      background: #dbeafe;
      color: #2563eb;
    }

    .action-buttons {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .action-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px 10px;
      border: none;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .action-btn svg {
      width: 14px;
      height: 14px;
    }

    .action-btn.primary {
      background: #2563eb;
      color: white;
    }

    .action-btn.primary:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
    }

    .action-btn.secondary {
      background: #64748b;
      color: white;
    }

    .action-btn.secondary:hover {
      background: #475569;
      transform: translateY(-1px);
    }

    .action-btn.warning {
      background: #f59e0b;
      color: white;
    }

    .action-btn.warning:hover {
      background: #d97706;
      transform: translateY(-1px);
    }

    .action-btn.info {
      background: #0ea5e9;
      color: white;
    }

    .action-btn.info:hover {
      background: #0284c7;
      transform: translateY(-1px);
    }

    .no-data-row td {
      border: none;
      padding: 48px 12px;
    }

    .no-data {
      text-align: center;
    }

    .no-data-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      color: #64748b;
    }

    .no-data-content svg {
      width: 48px;
      height: 48px;
      stroke-width: 1.5;
    }

    .no-data-content p {
      font-size: 18px;
      font-weight: 500;
      margin: 0;
      color: #374151;
    }

    .no-data-content span {
      font-size: 14px;
      margin: 0;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 24px;
      color: #64748b;
    }

    .loading-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #e2e8f0;
      border-top: 3px solid #2563eb;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 1200px) {
      .action-buttons {
        flex-direction: column;
        gap: 4px;
      }

      .action-btn {
        justify-content: center;
        width: 100%;
      }
    }

    @media (max-width: 768px) {
      .edi-table th,
      .edi-table td {
        padding: 12px 8px;
      }

      .action-btn {
        padding: 8px;
        font-size: 11px;
      }

      .action-btn svg {
        width: 12px;
        height: 12px;
      }
    }
  `]
})
export class EdiTableComponent {
  @Input() transactions: EdiTransaction[] = [];
  @Input() loading: boolean = false;
  
  @Output() sortChange = new EventEmitter<SortConfig>();
  @Output() viewX12 = new EventEmitter<EdiTransaction>();
  @Output() viewOrder = new EventEmitter<EdiTransaction>();
  @Output() resendTransaction = new EventEmitter<EdiTransaction>();
  @Output() reloadTransaction = new EventEmitter<EdiTransaction>();

  currentSort: SortConfig = { column: 'dateSentReceive', direction: 'desc' };

  trackByTransactionId(index: number, transaction: EdiTransaction): string {
    return transaction.id;
  }

  onSort(column: string) {
    if (this.currentSort.column === column) {
      // Toggle direction if same column
      this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      // New column, default to ascending
      this.currentSort = { column, direction: 'asc' };
    }
    this.sortChange.emit(this.currentSort);
  }

  getSortClass(column: string): string {
    if (this.currentSort.column !== column) {
      return 'sort-none';
    }
    return this.currentSort.direction === 'asc' ? 'sort-asc' : 'sort-desc';
  }

  getStatusDisplay(status: string): string {
    switch (status) {
      case 'success': return 'Success';
      case 'error': return 'Error';
      case 'pending': return 'Pending';
      case 'processing': return 'Processing';
      default: return status;
    }
  }
}