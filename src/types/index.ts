export interface Property {
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  image: string;
  imageAlt: string;
  tokenPrice: number;
  totalTokens: number;
  availableTokens: number;
  roiAnnual: number;
  rentYield: number;
  appreciationRate: number;
  status: "active" | "funded" | "coming_soon";
  network: string;
  contractAddress: string;
  propertyType: "residential" | "commercial" | "mixed";
  description: string;
  totalValue: number;
  minInvestment: number;
}

export interface PortfolioItem {
  propertyId: string;
  tokensOwned: number;
  purchasePrice: number;
  currentValue: number;
  yieldEarned: number;
  purchaseDate: string;
}

export interface Transaction {
  id: string;
  type: "buy" | "sell" | "yield" | "transfer";
  propertyId: string;
  propertyName: string;
  amount: number;
  tokens: number;
  timestamp: string;
  status: "pending" | "confirmed" | "failed";
  txHash: string;
  gasUsed: number;
  confirmations: number;
  network: string;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  balance: number;
  network: string;
}
