// src/pages/TileSearchPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Loader, AlertCircle } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Tile } from '../types';

export const TileSearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchCode, setSearchCode] = useState(searchParams.get('code') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Tile[]>([]);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setSearchCode(code);
      handleSearch(code);
    }
  }, [searchParams]);

  const handleSearch = async (code?: string) => {
    const searchTerm = (code || searchCode).trim().toUpperCase();
    
    if (!searchTerm) {
      setError('Please enter a tile code');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResults([]);

      // Search by tile code
      const q = query(
        collection(db, 'tiles'),
        where('tileCode', '==', searchTerm)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError('No tiles found with this code. Please check and try again.');
        return;
      }

      const tiles = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Tile[];

      setResults(tiles);

      // If only one result, redirect directly
      if (tiles.length === 1) {
        navigate(`/tile/${tiles[0].id}`);
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            🔍 Find Tile by Code
          </h1>

          {/* Search Form */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Tile Code
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="e.g., MAR60X60WH"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-lg"
                disabled={loading}
              />
              <button
                onClick={() => handleSearch()}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                Search
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">Not Found</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Search Results */}
          {results.length > 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">
                Multiple tiles found ({results.length})
              </h3>
              {results.map((tile) => (
                <button
                  key={tile.id}
                  onClick={() => navigate(`/tile/${tile.id}`)}
                  className="w-full p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={tile.imageUrl}
                      alt={tile.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{tile.name}</h4>
                      <p className="text-sm text-gray-600">{tile.size}</p>
                      <p className="text-sm text-gray-500 font-mono">{tile.tileCode}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">₹{tile.price}</p>
                      <p className="text-xs text-gray-500">per sq.ft</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Help Text */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-900 text-sm font-medium mb-2">
              📋 Where to find the tile code?
            </p>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Check the QR code sticker on the tile display</li>
              <li>• Look at the product label on tile boxes</li>
              <li>• Ask showroom staff for the tile code</li>
              <li>• Codes are usually format: ABC12X34DE</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};