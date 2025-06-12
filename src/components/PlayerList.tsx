'use client';

import React from 'react';
import { Player, Transaction } from '@/types';
import { savePlayers, saveTransactions } from '@/utils/storage';

interface PlayerListProps {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, setPlayers, transactions, setTransactions }) => {
  const saveData = (newPlayers: Player[], newTransactions: Transaction[]) => {
    savePlayers(newPlayers);
    saveTransactions(newTransactions);
    setPlayers(newPlayers);
    setTransactions(newTransactions);
  };

  const removePlayer = (index: number) => {
    const cashOut = prompt(`Enter cash-out amount for ${players[index].name} ($):`, players[index].chipStack.toString());
    if (cashOut !== null) {
      const cashOutAmount = parseFloat(cashOut) || 0;
      const newPlayers = [...players];
      newPlayers[index].totalCashOut = cashOutAmount;
      const newTransaction: Transaction = {
        timestamp: new Date().toISOString(),
        playerName: players[index].name,
        action: 'Remove Player',
        amount: cashOutAmount,
      };
      const newTransactions = [...transactions, newTransaction];
      newPlayers.splice(index, 1);
      saveData(newPlayers, newTransactions);
    }
  };

  const additionalBuyIn = (index: number) => {
    const buyIn = prompt(`Enter additional buy-in amount for ${players[index].name} ($):`);
    if (buyIn !== null) {
      const buyInAmount = parseFloat(buyIn) || 0;
      if (buyInAmount > 0) {
        const newPlayers = [...players];
        newPlayers[index].chipStack += buyInAmount;
        newPlayers[index].totalBuyIn += buyInAmount;
        const newTransaction: Transaction = {
          timestamp: new Date().toISOString(),
          playerName: players[index].name,
          action: 'Buy-In',
          amount: buyInAmount,
        };
        const newTransactions = [...transactions, newTransaction];
        saveData(newPlayers, newTransactions);
      }
    }
  };

  const cashOut = (index: number) => {
    const cashOut = prompt(`Enter cash-out amount for ${players[index].name} ($):`, players[index].chipStack.toString());
    if (cashOut !== null) {
      const cashOutAmount = parseFloat(cashOut) || 0;
      if (cashOutAmount >= 0) {
        const newPlayers = [...players];
        newPlayers[index].chipStack -= cashOutAmount;
        newPlayers[index].totalCashOut += cashOutAmount;
        const newTransaction: Transaction = {
          timestamp: new Date().toISOString(),
          playerName: players[index].name,
          action: 'Cash-Out',
          amount: cashOutAmount,
        };
        const newTransactions = [...transactions, newTransaction];
        saveData(newPlayers, newTransactions);
      }
    }
  };

  const totalPot = players.reduce((sum, player) => sum + player.chipStack, 0);

  return (
    <div className="mt-4 w-full max-w-md">
      {players.map((player, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-gray-700 bg-gray-800"
        >
          <span className="text-lg text-white">
            {player.name}: ${player.chipStack.toFixed(2)} (Buy-In: ${player.totalBuyIn.toFixed(2)}, Cash-Out: $
            {player.totalCashOut.toFixed(2)}, Net: ${(player.totalCashOut - player.totalBuyIn).toFixed(2)})
          </span>
          <div className="flex flex-row mt-2 smCREMENT:0 sm:mt-0 space-x-2">
            <button
              className="bg-white text-black px-3 py-2 rounded hover:bg-gray-200"
              onClick={() => additionalBuyIn(index)}
            >
              Buy-In
            </button>
            <button
              className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => cashOut(index)}
            >
              Cash Out
            </button>
            <button
              className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => removePlayer(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <p className="text-lg font-bold text-white mt-4">Total Pot: ${totalPot.toFixed(2)}</p>
    </div>
  );
};

export default PlayerList;