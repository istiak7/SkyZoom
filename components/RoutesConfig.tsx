import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Trash2, Search, X, Pencil, Save, Eraser } from 'lucide-react';
import { routeService, RouteDefinition } from '../services/routeService';

export const RoutesConfig: React.FC = () => {
  const [routes, setRoutes] = useState<RouteDefinition[]>([]);
  const [searchOrigin, setSearchOrigin] = useState('');
  const [searchDest, setSearchDest] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ origin: '', destination: '' });
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      const data = await routeService.getAll();
      setRoutes(data.filter(r => !r.isRemoved));
    } catch (error) {
      console.error('Failed to load routes:', error);
    }
  };

  const filteredRoutes = useMemo(() => {
    return routes.filter(route => {
      const matchOrigin = route.origin.toLowerCase().includes(searchOrigin.toLowerCase());
      const matchDest = route.destination.toLowerCase().includes(searchDest.toLowerCase());
      return matchOrigin && matchDest;
    });
  }, [routes, searchOrigin, searchDest]);

  const handleClearSearch = () => {
    setSearchOrigin('');
    setSearchDest('');
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await routeService.search(searchOrigin, searchDest);
      setRoutes(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ origin: '', destination: '' });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (route: RouteDefinition) => {
    setEditingId(route.id);
    setFormData({ origin: route.origin, destination: route.destination });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.origin || !formData.destination) {
      setFormError('Both Origin and Destination are required.');
      return;
    }

    const originUpper = formData.origin.toUpperCase();
    const destUpper = formData.destination.toUpperCase();

    try {
      if (editingId) {
        await routeService.update(editingId, originUpper, destUpper);
      } else {
        await routeService.create(originUpper, destUpper);
      }
      setIsModalOpen(false);
      loadRoutes();
    } catch (error) {
      console.error('Save failed:', error);
      setFormError('Failed to save route. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        await routeService.delete(id);
        loadRoutes();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row items-end lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1">
            <div className="space-y-1 flex-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Search Origin</label>
              <input 
                type="text" 
                value={searchOrigin}
                onChange={(e) => setSearchOrigin(e.target.value)}
                placeholder="e.g. BKK"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all uppercase"
              />
            </div>
            <div className="space-y-1 flex-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Search Destination</label>
              <input 
                type="text" 
                value={searchDest}
                onChange={(e) => setSearchDest(e.target.value)}
                placeholder="e.g. DAC"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all uppercase"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto justify-end mt-4 lg:mt-0">
            <button 
              onClick={handleClearSearch}
              className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-2 text-sm"
            >
              <Eraser size={16} />
              CLEAR
            </button>
            <button 
              onClick={handleSearch}
              className="px-5 py-2.5 bg-rose-400 hover:bg-rose-500 text-white font-bold rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-2 text-sm"
            >
              <Search size={16} />
              SEARCH
            </button>
            
            <div className="w-px h-8 bg-gray-300 mx-2 hidden sm:block"></div>

            <button 
              onClick={openAddModal}
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-2 text-sm"
            >
              <Plus size={18} />
              ADD CONFIG
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-indigo-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider text-center w-16">SL</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Origin</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Destination</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredRoutes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No routes found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredRoutes.map((route, index) => (
                  <tr key={route.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono text-center">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm font-mono font-bold border border-gray-200">
                        {route.origin}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                       <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm font-mono font-bold border border-gray-200">
                        {route.destination}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openEditModal(route)}
                          className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(route.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-indigo-900">
                {editingId ? 'Edit Config' : 'Add Config'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-white rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Origin</label>
                  <input 
                    type="text" 
                    value={formData.origin}
                    onChange={(e) => setFormData({...formData, origin: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all uppercase"
                    placeholder="e.g. BKK"
                    maxLength={3}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Destination</label>
                  <input 
                    type="text" 
                    value={formData.destination}
                    onChange={(e) => setFormData({...formData, destination: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all uppercase"
                    placeholder="e.g. DAC"
                    maxLength={3}
                  />
                </div>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {formError}
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
