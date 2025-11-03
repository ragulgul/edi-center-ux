import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { EdiService } from '../../services/edi.service';
import { EdiFilters } from '../../interfaces/edi-transaction.interface';

@Component({
  selector: 'app-edi-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filters-container">
      <div class="filters-header">
      <div class="header-actions">
        <button 
            class="toggle-button" 
            (click)="toggleFilters()"
            [disabled]="loading">
            <svg viewBox="0 0 20 20" fill="currentColor" [class.rotated]="!filtersExpanded">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
            {{ filtersExpanded ? 'Hide' : 'Show' }} Filters
          </button>
        <button 
          class="clear-button" 
          (click)="clearFilters()"
          [disabled]="loading">
          Clear All
        </button>
        </div>
      </div>

      <div class="filters-grid" [class.collapsed]="!filtersExpanded">
        <!-- Search -->
        <div class="filter-group full-width">
          <label class="filter-label">Search</label>
          <div class="search-input-container">
            <input 
              type="text" 
              class="filter-input search-input"
              placeholder="Search by customer reference, acknowledgement, or EDI/ISA ID..."
              [(ngModel)]="filters.searchText"
              (input)="onSearchChange($event)"
              [disabled]="loading">
            <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <!-- Date Range -->
        <div class="filter-group">
          <label class="filter-label">From Date</label>
          <input 
            type="date" 
            class="filter-input"
            [(ngModel)]="filters.fromDate"
            (change)="onFilterChange()"
            [disabled]="loading">
        </div>

        <div class="filter-group">
          <label class="filter-label">To Date</label>
          <input 
            type="date" 
            class="filter-input"
            [(ngModel)]="filters.toDate"
            (change)="onFilterChange()"
            [disabled]="loading">
        </div>

        <!-- Trading Partner -->
        <div class="filter-group">
          <label class="filter-label">Trading Partner</label>
          <select 
            class="filter-input"
            [(ngModel)]="filters.tradingPartner"
            (change)="onFilterChange()"
            [disabled]="loading">
            <option value="">All Partners</option>
            <option *ngFor="let partner of tradingPartners" [value]="partner">{{ partner }}</option>
          </select>
        </div>

        <!-- Document Type -->
        <div class="filter-group">
          <label class="filter-label">Document Type</label>
          <select 
            class="filter-input"
            [(ngModel)]="filters.documentType"
            (change)="onFilterChange()"
            [disabled]="loading">
            <option value="">All Types</option>
            <option *ngFor="let type of documentTypes" [value]="type">{{ type }}</option>
          </select>
        </div>

        <!-- Status -->
        <div class="filter-group">
          <label class="filter-label">Status</label>
          <select 
            class="filter-input"
            [(ngModel)]="filters.status"
            (change)="onFilterChange()"
            [disabled]="loading">
            <option value="">All Statuses</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="error">Error</option>
            <option value="processing">Processing</option>
          </select>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filters-container {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .filters-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .filters-title {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .toggle-button {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #2563eb;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .toggle-button:hover:not(:disabled) {
      background: #1d4ed8;
    }

    .toggle-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .toggle-button svg {
      width: 16px;
      height: 16px;
      transition: transform 0.2s ease;
    }

    .toggle-button svg.rotated {
      transform: rotate(-90deg);
    }

    .clear-button {
      background: #f1f5f9;
      color: #475569;
      border: 1px solid #e2e8f0;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .clear-button:hover:not(:disabled) {
      background: #e2e8f0;
      color: #334155;
    }

    .clear-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      align-items: end;
      transition: all 0.3s ease;
      overflow: hidden;
    }

    .filters-grid.collapsed {
      max-height: 0;
      opacity: 0;
      margin-top: 0;
      padding-top: 0;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .filter-label {
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 6px;
    }

    .filter-input {
      padding: 12px 16px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s ease;
      background: white;
    }

    .filter-input:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .filter-input:disabled {
      background: #f9fafb;
      color: #9ca3af;
      cursor: not-allowed;
    }

    .search-input-container {
      position: relative;
    }

    .search-input {
      padding-left: 44px;
    }

    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      color: #9ca3af;
      pointer-events: none;
    }

    @media (max-width: 768px) {
      .filters-container {
        padding: 16px;
      }

      .filters-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .filters-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .header-actions {
        width: 100%;
        justify-content: space-between;
      }
    }
  `]
})
export class EdiFiltersComponent implements OnInit {
  @Output() filtersChange = new EventEmitter<EdiFilters>();
  @Input() loading: boolean = false;

  filtersExpanded: boolean = true;

  filters: EdiFilters = {
    searchText: '',
    fromDate: '',
    toDate: '',
    tradingPartner: '',
    status: '',
    documentType: ''
  };

  tradingPartners: string[] = [];
  documentTypes: string[] = [];
  
  private searchSubject = new Subject<string>();

  constructor(private ediService: EdiService) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchText => {
      this.filters.searchText = searchText;
      this.emitFilters();
    });
  }

  ngOnInit() {
    this.setDefaultDateRange();
    this.loadDropdownData();
    this.emitFilters();
  }

  private setDefaultDateRange() {
    const today = new Date();
    const januaryFirst = new Date(2025, 0, 1); // January 1, 2025
    
    this.filters.fromDate = januaryFirst.toISOString().split('T')[0];
    this.filters.toDate = today.toISOString().split('T')[0];
  }

  private loadDropdownData() {
    this.ediService.getTradingPartners().subscribe(partners => {
      this.tradingPartners = partners;
    });

    this.ediService.getDocumentTypes().subscribe(types => {
      this.documentTypes = types;
    });
  }

  onSearchChange(event: any) {
    this.searchSubject.next(event.target.value);
  }

  onFilterChange() {
    this.emitFilters();
  }

  toggleFilters() {
    this.filtersExpanded = !this.filtersExpanded;
  }

  clearFilters() {
    this.filters = {
      searchText: '',
      fromDate: '',
      toDate: '',
      tradingPartner: '',
      status: '',
      documentType: ''
    };
    this.setDefaultDateRange();
    this.emitFilters();
  }

  private emitFilters() {
    this.filtersChange.emit({ ...this.filters });
  }
}