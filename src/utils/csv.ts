import { Transaction } from '@/types';

export const generateCSV = (transactions: Transaction[]): string => {
  const headers = 'Timestamp,Player Name,Action,Amount\n';
  const rows = transactions
    .map((t) => `${t.timestamp},${t.playerName},${t.action},${t.amount.toFixed(2)}`)
    .join('\n');
  return headers + rows;
};

export const downloadCSV = (transactions: Transaction[], filename: string): void => {
  const csv = generateCSV(transactions);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};