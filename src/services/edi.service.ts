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
      dateSentReceive: new Date('2025-07-24T01:46:00'),
      acknowledgement: 'WINLAND_997_20250724014607.OUT',
      status: 'success',
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
      dateSentReceive: new Date('2025-07-24T01:46:00'),
      acknowledgement: 'WINLAND_997_20250724014614.OUT',
      status: 'success',
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
      dateSentReceive: new Date('2025-07-24T02:01:00'),
      acknowledgement: 'WINLAND_997_20250724020107.OUT',
      status: 'pending',
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
      dateSentReceive: new Date('2025-07-23T02:00:00'),
      acknowledgement: 'WINLAND_997_20250724020057.OUT',
      status: 'error',
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
      dateSentReceive: new Date('2025-07-23T01:46:00'),
      acknowledgement: 'WINLAND_997_20250724014600.OUT',
      status: 'processing',
      x12Content: 'ISA*00*          *00*          *ZZ*SENDER_ID      *ZZ*RECEIVER_ID    *250723*0146*U*00401*000017616*0*P*>~'
    },
    {
      id: '6',
      documentType: '850',
      owner: 'WINLAND',
      tradingPartner: 'HOME_DEPOT',
      ediIsaId: '000017617',
      gsaId: '1979',
      customerReferenceNumber: '000257588',
      dateSentReceive: new Date('2025-07-22T14:30:00'),
      acknowledgement: 'WINLAND_997_20250722143000.OUT',
      status: 'success',
      x12Content: 'ISA*00*          *00*          *ZZ*SENDER_ID      *ZZ*RECEIVER_ID    *250722*1430*U*00401*000017617*0*P*>~'
    },
    {
      id: '7',
      documentType: '855',
      owner: 'WINLAND',
      tradingPartner: 'LOWES',
      ediIsaId: '000017618',
      gsaId: '1980',
      customerReferenceNumber: '000257589',
      dateSentReceive: new Date('2025-07-22T09:15:00'),
      acknowledgement: 'WINLAND_997_20250722091500.OUT',
      status: 'error',
      x12Content: 'ISA*00*          *00*          *ZZ*SENDER_ID      *ZZ*RECEIVER_ID    *250722*0915*U*00401*000017618*0*P*>~'
    },
    {
      id: '8',
      documentType: '940',
      owner: 'WINLAND',
      tradingPartner: 'BEST_BUY',
      ediIsaId: '000017619',
      gsaId: '1981',
      customerReferenceNumber: '000257590',
      dateSentReceive: new Date('2025-07-21T16:45:00'),
      acknowledgement: 'WINLAND_997_20250721164500.OUT',
      status: 'pending',
      x12Content: 'ISA*00*          *00*          *ZZ*SENDER_ID      *ZZ*RECEIVER_ID    *250721*1645*U*00401*000017619*0*P*>~'
    },
    {
      id: '9',
      documentType: '856',
      owner: 'WINLAND',
      tradingPartner: 'MENARDS',
      ediIsaId: '000017620',
      gsaId: '1982',
      customerReferenceNumber: '000257591',
      dateSentReceive: new Date('2025-07-21T11:20:00'),
      acknowledgement: 'WINLAND_997_20250721112000.OUT',
      status: 'success',
      x12Content: 'ISA*00*          *00*          *ZZ*SENDER_ID      *ZZ*RECEIVER_ID    *250721*1120*U*00401*000017620*0*P*>~'
    },
    {
      id: '10',
      documentType: '810',
      owner: 'WINLAND',
      tradingPartner: 'AMAZON',
      ediIsaId: '000017621',
      gsaId: '1983',
      customerReferenceNumber: '000257592',
      dateSentReceive: new Date('2025-07-20T13:10:00'),
      acknowledgement: 'WINLAND_997_20250720131000.OUT',
      status: 'processing',
      x12Content: 'ISA*00*          *00*          *ZZ*SENDER_ID      *ZZ*RECEIVER_ID    *250720*1310*U*00401*000017621*0*P*>~'
    },
    {
      id: '11',
      documentType: '997',
      owner: 'WINLAND',
      tradingPartner: 'TARGET',
      ediIsaId: '000017622',
      gsaId: '1984',
      customerReferenceNumber: '000257593',
      dateSentReceive: new Date('2025-07-20T08:30:00'),
      acknowledgement: 'WINLAND_997_20250720083000.OUT',
      status: 'success',
      x12Content: 'ISA*00*          *00*          *ZZ*SENDER_ID      *ZZ*RECEIVER_ID    *250720*0830*U*00401*000017622*0*P*>~'
    },
    {
      id: '12',
      documentType: '850',
      owner: 'WINLAND',
      tradingPartner: 'WALMART',
      ediIsaId: '000017623',
      gsaId: '1985',
      customerReferenceNumber: '000257594',
      dateSentReceive: new Date('2025-07-19T15:25:00'),
      acknowledgement: 'WINLAND_997_20250719152500.OUT',
      status: 'error',
      x12Content: 'ISA*00*          *00*          *ZZ*SENDER_ID      *ZZ*RECEIVER_ID    *250719*1525*U*00401*000017623*0*P*>~'
    },
    {
      id: '13',
      documentType: '940',
      owner: 'WINLAND',
      tradingPartner: 'COSTCO',
      ediIsaId: '000017624',
      gsaId: '1986',
      customerReferenceNumber: '000257595',
      dateSentReceive: new Date('2025-07-19T10:40:00'),
      acknowledgement: 'WINLAND_997_20250719104000.OUT',
      status: 'success',
      x12Content: 'ISA*00*          *00*          *ZZ*SENDER_ID      *ZZ*RECEIVER_ID    *250719*1040*U*00401*000017624*0*P*>~'
    },
    {
      id: '14',
      documentType: '856',
      owner: 'WINLAND',
      tradingPartner: 'HOME_DEPOT',
      ediIsaId: '000017625',
      gsaId: '1987',
      customerReferenceNumber: '000257596',
      dateSentReceive: new Date('2025-07-18T17:55:00'),
      acknowledgement: 'WINLAND_997_20250718175500.OUT',
      status: 'pending',
      x12Content: 'ISA*00*          *00*          *ZZ*SENDER_ID      *ZZ*RECEIVER_ID    *250718*1755*U*00401*000017625*0*P*>~'
    },
    {
      id: '15',
      documentType: '810',
      owner: 'WINLAND',
      tradingPartner: 'LOWES',
      ediIsaId: '000017626',
      gsaId: '1988',
      customerReferenceNumber: '000257597',
      dateSentReceive: new Date('2025-07-18T12:15:00'),
      acknowledgement: 'WINLAND_997_20250718121500.OUT',
      status: 'processing',
      x12Content: 'ISA*00*          *00*          *ZZ*SENDER_ID      *ZZ*RECEIVER_ID    *250718*1215*U*00401*000017626*0*P*>~'
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
    console.log('EdiService.getTransactions called with filters:', filters);
    return of(this.mockTransactions).pipe(
      delay(300),
      map(transactions => {
        console.log('Total mock transactions:', transactions.length);
        let filtered = this.filterTransactions(transactions, filters);
        console.log('Filtered transactions:', filtered.length);
        if (sortConfig) {
          filtered = this.sortTransactions(filtered, sortConfig);
        }
        console.log('Final transactions to return:', filtered.length);
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
    console.log('Filtering transactions with:', filters);
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

      const matches = matchesSearch && matchesTradingPartner && matchesStatus && 
             matchesDocumentType && matchesFromDate && matchesToDate;
      
      if (!matches) {
        console.log('Transaction filtered out:', transaction.customerReferenceNumber, {
          matchesSearch,
          matchesTradingPartner,
          matchesStatus,
          matchesDocumentType,
          matchesFromDate,
          matchesToDate
        });
      }
      
      return matches;
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