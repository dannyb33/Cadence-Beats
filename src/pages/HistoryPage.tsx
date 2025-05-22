import React from 'react';
import { useRunHistory } from '../context/RunHistoryContext';
import BPMChart from '../components/BPMChart';
import { History, Trash2 } from 'lucide-react';

const HistoryPage: React.FC = () => {
  const { runs, clearHistory } = useRunHistory();

  if (runs.length === 0) {
    return (
      <div className="mt-12 text-center">
        <History className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Run History Yet</h2>
        <p className="text-gray-600">
          Complete your first run to start tracking your progress!
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Run History</h1>
        <button
          onClick={clearHistory}
          className="flex items-center px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear History
        </button>
      </div>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg BPM</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Songs Played</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {runs.map((run) => (
              <tr key={run.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(run.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {Math.round(run.duration / 60)} minutes
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {Math.round(run.avgBPM)} BPM
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {run.songsPlayed}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {runs.length > 1 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">BPM Trends</h2>
          <BPMChart runs={runs} />
        </div>
      )}
    </div>
  );
};

export default HistoryPage;