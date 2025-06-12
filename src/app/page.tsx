'use client';

import React, { useState, useEffect } from 'react';
import PlayerList from '@/components/PlayerList';
import { Player, Transaction } from '@/types';
import { loadPlayers, savePlayers, loadTransactions, saveTransactions } from '@/utils/storage';
import { downloadCSV } from '@/utils/csv';

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [name, setName] = useState('');
  const [buyIn, setBuyIn] = useState('');

  useEffect(() => {
    const loadedPlayers = loadPlayers();
    const loadedTransactions = loadTransactions();
    setPlayers(loadedPlayers);
    setTransactions(loadedTransactions);
  }, []);

  const addPlayer = () => {
    const buyInAmount = parseFloat(buyIn);
    if (!name.trim() || buyInAmount <= 0) {
      alert('Please enter a valid name and buy-in amount.');
      return;
    }

    const newPlayer: Player = {
      name,
      chipStack: buyInAmount,
      totalBuyIn: buyInAmount,
      totalCashOut: 0,
    };

    const newTransaction: Transaction = {
      timestamp: new Date().toISOString(),
      playerName: name,
      action: 'Add Player',
      amount: buyInAmount,
    };

    const newPlayers = [...players, newPlayer];
    const newTransactions = [...transactions, newTransaction];

    savePlayers(newPlayers);
    saveTransactions(newTransactions);
    setPlayers(newPlayers);
    setTransactions(newTransactions);
    setName('');
    setBuyIn('');
  };

  const resetGame = () => {
    if (window.confirm('Are you sure you want to reset the game? This will clear all players, the pot, and the transaction log.')) {
      const newTransactions: Transaction[] = [];
      setPlayers([]);
      setTransactions(newTransactions);
      savePlayers([]);
      saveTransactions(newTransactions);
    }
  };

  const handleDownloadCSV = () => {
    downloadCSV(transactions, `all_transactions_${new Date().toISOString().replace(/[:.]/g, '-')}.csv`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-black">
      <h1 className="text-3xl font-bold text-white mb-4">Cash Game Manager</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow w-full max-w-md">
        <div className="mb-4">
          <label className="block font-bold text-white mb-1">Player Name:</label>
          <input
            type="text"
            className="w-full border border-gray-700 bg-gray-900 text-white p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter player name"
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold text-white mb-1">Buy-In Amount ($):</label>
          <input
            type="number"
            className="w-full border border-gray-700 bg-gray-900 text-white p-2 rounded"
            value={buyIn}
            onChange={(e) => setBuyIn(e.target.value)}
            placeholder="Enter buy-in amount"
            min="0"
          />
        </div>
        <div className="flex space-x-4">
          <button
            className="flex-1 bg-white text-black p-3 rounded hover:bg-gray-200"
            onClick={addPlayer}
          >
            Add Player
          </button>
          <button
            className="flex-1 bg-gray-700 text-white p-3 rounded hover:bg-gray-600"
            onClick={resetGame}
          >
            Reset Game
          </button>
        </div>
        <button
          className="w-full bg-gray-700 text-white p-3 rounded mt-4 hover:bg-gray-600"
          onClick={handleDownloadCSV}
        >
          Download Transaction Log
        </button>
      </div>
      <PlayerList
        players={players}
        setPlayers={setPlayers}
        transactions={transactions}
        setTransactions={setTransactions}
      />
    </main>
  );
}