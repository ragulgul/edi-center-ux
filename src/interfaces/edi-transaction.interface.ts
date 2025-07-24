export interface EdiTransaction {
  id: string;
  documentType: string;
  owner: string;
  tradingPartner: string;
  ediIsaId: string;
  gsaId: string;
  customerReferenceNumber: string;
  dateSentReceive: Date;
  acknowledgement: string;
  status: 'success' | 'pending' | 'error' | 'processing';
  orderId?: string;
  x12Content?: string;
}

export interface EdiFilters {
  searchText: string;
  fromDate: string;
  toDate: string;
  tradingPartner: string;
  status: string;
  documentType: string;
}

export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}