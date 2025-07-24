import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EdiTransaction } from '../../interfaces/edi-transaction.interface';

@Component({
  selector: 'app-x12-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="onOverlayClick($event)">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="header-content">
            <h2 class="modal-title">X12 Transaction Viewer</h2>
            <div class="transaction-info">
              <span class="info-item">
                <strong>Reference:</strong> {{ transaction.customerReferenceNumber }}
              </span>
              <span class="info-item">
                <strong>Type:</strong> {{ transaction.documentType }}
              </span>
              <span class="info-item">
                <strong>Partner:</strong> {{ transaction.tradingPartner }}
              </span>
            </div>
          </div>
          <button class="close-button" (click)="close.emit()" title="Close">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="x12-content">
            <div class="content-header">
              <h3>X12 Content</h3>
              <button class="copy-button" (click)="copyContent()" [class.copied]="copied">
                <svg *ngIf="!copied" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
                </svg>
                <svg *ngIf="copied" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                {{ copied ? 'Copied!' : 'Copy' }}
              </button>
            </div>
            <div class="x12-display">
              <pre class="x12-text">{{ formatX12Content(transaction.x12Content || '') }}</pre>
            </div>
          </div>

          <div class="transaction-details">
            <h3>Transaction Details</h3>
            <div class="details-grid">
              <div class="detail-item">
                <label>EDI/ISA ID</label>
                <span>{{ transaction.ediIsaId }}</span>
              </div>
              <div class="detail-item">
                <label>GSA ID</label>
                <span>{{ transaction.gsaId }}</span>
              </div>
              <div class="detail-item">
                <label>Date Sent/Receive</label>
                <span>{{ transaction.dateSentReceive | date:'MMM dd, yyyy HH:mm' }}</span>
              </div>
              <div class="detail-item">
                <label>Acknowledgement</label>
                <span class="acknowledgement">{{ transaction.acknowledgement }}</span>
              </div>
              <div class="detail-item">
                <label>Status</label>
                <span class="status-badge" [ngClass]="'status-' + transaction.status">
                  {{ getStatusDisplay(transaction.status) }}
                </span>
              </div>
              <div class="detail-item" *ngIf="transaction.orderId">
                <label>Order ID</label>
                <span class="order-link">{{ transaction.orderId }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="footer-button secondary" (click)="close.emit()">
            Close
          </button>
          <button class="footer-button primary" (click)="downloadX12()">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
            Download X12
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      width: 100%;
      max-width: 800px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 24px;
      border-bottom: 1px solid #e2e8f0;
    }

    .header-content {
      flex: 1;
    }

    .modal-title {
      font-size: 20px;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 12px 0;
    }

    .transaction-info {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }

    .info-item {
      font-size: 14px;
      color: #64748b;
    }

    .info-item strong {
      color: #374151;
    }

    .close-button {
      background: none;
      border: none;
      padding: 8px;
      cursor: pointer;
      color: #64748b;
      border-radius: 6px;
      transition: all 0.2s ease;
      margin-left: 16px;
    }

    .close-button:hover {
      background: #f1f5f9;
      color: #374151;
    }

    .close-button svg {
      width: 20px;
      height: 20px;
    }

    .modal-body {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .x12-content {
      flex: 1;
    }

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .content-header h3 {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .copy-button {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      color: #475569;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .copy-button.copied {
      background: #dcfce7;
      border-color: #bbf7d0;
      color: #166534;
    }

    .copy-button svg {
      width: 14px;
      height: 14px;
    }

    .copy-button:hover:not(.copied) {
      background: #e2e8f0;
      color: #334155;
    }

    .x12-display {
      background: #1e293b;
      border-radius: 8px;
      padding: 16px;
      overflow-x: auto;
    }

    .x12-text {
      color: #e2e8f0;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 12px;
      line-height: 1.5;
      margin: 0;
      white-space: pre-wrap;
      word-break: break-all;
    }

    .transaction-details h3 {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 16px 0;
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .detail-item label {
      font-size: 12px;
      font-weight: 500;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .detail-item span {
      font-size: 14px;
      color: #1e293b;
      font-weight: 500;
    }

    .acknowledgement {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 12px !important;
      background: #f1f5f9;
      padding: 4px 8px;
      border-radius: 4px;
      display: inline-block;
    }

    .status-badge {
      padding: 4px 10px !important;
      border-radius: 12px;
      font-size: 11px !important;
      font-weight: 600 !important;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      display: inline-block;
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

    .order-link {
      color: #2563eb !important;
      text-decoration: underline;
      cursor: pointer;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 24px;
      border-top: 1px solid #e2e8f0;
    }

    .footer-button {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 16px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .footer-button svg {
      width: 16px;
      height: 16px;
    }

    .footer-button.primary {
      background: #2563eb;
      color: white;
    }

    .footer-button.primary:hover {
      background: #1d4ed8;
    }

    .footer-button.secondary {
      background: #f1f5f9;
      color: #475569;
      border: 1px solid #e2e8f0;
    }

    .footer-button.secondary:hover {
      background: #e2e8f0;
      color: #334155;
    }

    @media (max-width: 768px) {
      .modal-overlay {
        padding: 16px;
      }

      .modal-header {
        padding: 20px;
      }

      .modal-body {
        padding: 20px;
      }

      .modal-footer {
        padding: 20px;
      }

      .transaction-info {
        flex-direction: column;
        gap: 8px;
      }

      .details-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class X12ViewerComponent {
  @Input() transaction!: EdiTransaction;
  @Output() close = new EventEmitter<void>();

  copied: boolean = false;

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  formatX12Content(content: string): string {
    // Format X12 content by replacing common delimiters with line breaks for readability
    return content
      .replace(/~/g, '~\n')
      .replace(/\*([A-Z]{2,3})\*/g, '\n*$1*')
      .trim();
  }

  copyContent() {
    if (this.transaction.x12Content) {
      navigator.clipboard.writeText(this.transaction.x12Content).then(() => {
        this.copied = true;
        setTimeout(() => this.copied = false, 2000);
      });
    }
  }

  downloadX12() {
    if (this.transaction.x12Content) {
      const blob = new Blob([this.transaction.x12Content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `X12_${this.transaction.customerReferenceNumber}_${this.transaction.documentType}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
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