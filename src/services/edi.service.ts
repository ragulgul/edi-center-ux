import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { EdiTransaction, EdiFilters, SortConfig } from '../interfaces/edi-transaction.interface';

@Injectable({
  providedIn: 'root'
})
export class EdiService {
  private mockTransactions: EdiTransaction[] = [
    {
      id: '1',
      documentType: '940',
      owner: 'WINLAND',
      tradingPartner: 'WALMART',
      ediIsaId: '000017612',
      gsaId: '1974',
      customerReferenceNumber: '000257147',
      dateSentReceive: new Date('2025-07-24'),
      time: '01:46 AM',
      acknowledgement: 'WINLAND_997_20250724014607.OUT',
      status: 'success',
      orderId: 'ORD-001',
      x12Content: 'ISA*00*          *00*          *ZZ*SENDER_ID      *ZZ*RECEIVER_ID    *250724*0146*U*00401*000017612*0*P*>~'
    },
    {
      id: '2',
      documentType: '940',
      owner: 'WINLAND',
      tradingPartner: 'TARGET',
      ediIsaId: '000017613',
      gsaId: '1975',
      customerReferenceNumber: '000275756',
      dateSentReceive: new Date('2025-07-24'),
      time: '01:46 AM',
      acknowledgement: 'WINLAND_997_20250724014614.OUT',
      status: 'success',
      orderId: 'ORD-002',
      x12Content: 'ISA*00*          *00*          *ZZ*SENDER_ID      *ZZ*RECEIVER_ID    *250724*0146*U*00401*000017613*0*P*>~'
    },
    {
      id: '3',
      documentType: '940',
      owner: 'WINLAND',
      tradingPartner: 'AMAZON',
      ediIsaId: '000017614',
      gsaId: '1976',
      customerReferenceNumber: '000257149',
      dateSentReceive: new Date('2025-07-24'),
      time: '02:01 AM',
      acknowledgement: 'WINLAND_997_20250724020107.OUT',
      status: 'pending',
      orderId: 'ORD-003',
      x12Content: 'ISA*00*          *00*          *ZZ*SENDER_ID      *ZZ*RECEIVER_ID    *250724*0201*U*00401*000017614*0*P*>~'
    },
    {
      id: '4',
      documentType: '856',
      owner: 'WINLAND',
      tradingPartner: 'COSTCO',
      ediIsaId: '000017615',
      gsaId: '1977',
      customerReferenceNumber: '000257144',
      dateSentReceive: new Date('2025-07-23'),
      time: '02:00 AM',
      acknowledgement: 'WINLAND_997_20250724020057.OUT',
      status: 'error',
      orderId: 'ORD-004',
      x12Content: 'ISA*00*          *00*          *ZZ*SENDER_ID      *ZZ*RECEIVER_ID    *250723*0200*U*00401*000017615*0*P*>~'
    },
    {
      id: '5',
      documentType: '810',
      owner: 'WINLAND',
      tradingPartner: 'WALMART',
      ediIsaId: '000017616',
      gsaId: '1978',
      customerReferenceNumber: '000257587',
      dateSentReceive: new Date('2025-07-23'),
      time: '01:46 AM',
      acknowledgement: 'WINLAND_997_20250724014600.OUT',
      status: 'processing',
      orderId: 'ORD-005',
      x12Content: 'ISA*00*          *00*          *ZZ*SENDER_ID      *ZZ*RECEIVER_ID    *250723*0146*U*00401*000017616*0*P*>~'
    }
  ];

  private filtersSubject = new BehaviorSubject<EdiFilters>({
    searchText: '',
    fromDate: '',
    toDate: '',
    tradingPartner: '',
    status: '',
    documentType: ''
  });

  getTransactions(filters: EdiFilters, sortConfig?: SortConfig): Observable<EdiTransaction[]> {
    return of(this.mockTransactions).pipe(
      delay(300),
      map(transactions => {
        let filtered = this.filterTransactions(transactions, filters);
        if (sortConfig) {
          filtered = this.sortTransactions(filtered, sortConfig);
        }
        return filtered;
      })
    );
  }

  getTradingPartners(): Observable<string[]> {
    const partners = [...new Set(this.mockTransactions.map(t => t.tradingPartner))];
    return of(partners).pipe(delay(100));
  }

  getDocumentTypes(): Observable<string[]> {
    const types = [...new Set(this.mockTransactions.map(t => t.documentType))];
    return of(types).pipe(delay(100));
  }

  resendTransaction(transactionId: string): Observable<boolean> {
    console.log(`Resending transaction ${transactionId}`);
    return of(true).pipe(delay(1000));
  }

  reloadTransaction(transactionId: string): Observable<boolean> {
    console.log(`Reloading transaction ${transactionId}`);
    return of(true).pipe(delay(1000));
  }

  private filterTransactions(transactions: EdiTransaction[], filters: EdiFilters): EdiTransaction[] {
    return transactions.filter(transaction => {
      const matchesSearch = !filters.searchText || 
        transaction.customerReferenceNumber.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        transaction.acknowledgement.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        transaction.ediIsaId.toLowerCase().includes(filters.searchText.toLowerCase());

      const matchesTradingPartner = !filters.tradingPartner || 
        transaction.tradingPartner === filters.tradingPartner;

      const matchesStatus = !filters.status || transaction.status === filters.status;

      const matchesDocumentType = !filters.documentType || 
        transaction.documentType === filters.documentType;

      const matchesFromDate = !filters.fromDate || 
        transaction.dateSentReceive >= new Date(filters.fromDate);

      const matchesToDate = !filters.toDate || 
        transaction.dateSentReceive <= new Date(filters.toDate);

      return matchesSearch && matchesTradingPartner && matchesStatus && 
             matchesDocumentType && matchesFromDate && matchesToDate;
    });
  }

  private sortTransactions(transactions: EdiTransaction[], sortConfig: SortConfig): EdiTransaction[] {
    return [...transactions].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortConfig.column) {
        case 'documentType':
          aValue = a.documentType;
          bValue = b.documentType;
          break;
        case 'owner':
          aValue = a.owner;
          bValue = b.owner;
          break;
        case 'tradingPartner':
          aValue = a.tradingPartner;
          bValue = b.tradingPartner;
          break;
        case 'ediIsaId':
          aValue = a.ediIsaId;
          bValue = b.ediIsaId;
          break;
        case 'gsaId':
          aValue = a.gsaId;
          bValue = b.gsaId;
          break;
        case 'customerReferenceNumber':
          aValue = a.customerReferenceNumber;
          bValue = b.customerReferenceNumber;
          break;
        case 'dateSentReceive':
          aValue = a.dateSentReceive.getTime();
          bValue = b.dateSentReceive.getTime();
          break;
        case 'time':
          aValue = a.time;
          bValue = b.time;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'acknowledgement':
          aValue = a.acknowledgement;
          bValue = b.acknowledgement;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
}