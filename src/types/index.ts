export interface Player {
  name: string;
  chipStack: number;
  totalBuyIn: number;
  totalCashOut: number;
}

export interface Transaction {
  timestamp: string;
  playerName: string;
  action: 'Add Player' | 'Buy-In' | 'Cash-Out' | 'Remove Player';
  amount: number;
}