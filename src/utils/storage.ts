import { Player, Transaction } from '@/types';

export const loadPlayers = (): Player[] => {
  try {
    const players = localStorage.getItem('allPlayers');
    return players ? JSON.parse(players) : [];
  } catch (error) {
    console.error('Error loading players:', error);
    return [];
  }
};

export const savePlayers = (players: Player[]): void => {
  try {
    localStorage.setItem('allPlayers', JSON.stringify(players));
  } catch (error) {
    console.error('Error saving players:', error);
  }
};

export const loadTransactions = (): Transaction[] => {
  try {
    const transactions = localStorage.getItem('allTransactions');
    return transactions ? JSON.parse(transactions) : [];
  } catch (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem('allTransactions', JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions:', error);
  }
};