// ScholarDetail.js
import React, { useEffect, useState } from 'react';
import { getScholarInfo } from './openAlex/api';
import CitationChart from './canvasViz';

const ScholarDetail = ({ scholarId, onBack }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fail, setFail] = useState(false);
  const [activeTab, setActiveTab] = useState('chart');

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const res = await getScholarInfo(scholarId);
        if (active) setData(res);
      } catch {
        if (active) setFail(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => { active = false };
  }, [scholarId]);

  if (loading) return <div className="py-8 text-center text-gray-500">Loading...</div>;
  if (fail) return <div className="p-4 border border-red-300 bg-red-100 text-red-700">Error loading profile.</div>;
  if (!data) return null;

  return (
    <div className="bg-white border border-gray-300 p-6 rounded-md shadow-sm h-full flex flex-col">
      <button
        onClick={onBack}
        className="mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-semibold mb-1">{data.display_name}</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 p-2 rounded">
          <p className="font-medium">Publications: <span className="font-normal">{data.works_count}</span></p>
          <p className="font-medium">Citations: <span className="font-normal">{data.cited_by_count}</span></p>
        </div>
        <div className="flex-1 p-2">
          <p className="font-medium mb-1">Research Interests:</p>
          {data.x_concepts?.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {data.x_concepts.slice(0, 5).map((c, i) => (
                <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1">
                  {c.display_name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No data</p>
          )}
        </div>
      </div>
      
      <div className="flex border-b mb-2">
        <button 
          className={`px-3 ${activeTab === 'chart' ? 'border-b-2 border-blue-600 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('chart')}
        >
          Citation Trends
        </button>
        <button 
          className={`px-3 ${activeTab === 'publications' ? 'border-b-2 border-blue-600 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('publications')}
        >
          Publications
        </button>
      </div>

      <div className="flex-1">
        {activeTab === 'chart' && (
          <div className="h-full">
            <CitationChart scholarData={data} />
          </div>
        )}
        
        {activeTab === 'publications' && (
          <div className="h-full">
            <h3 className="text-lg font-bold mb-2">Recent Publications</h3>
              <div className="space-y-2">
                {data.works.map((w, i) => (
                  <div key={i} className="p-2 border bg-gray-50">
                    <p>{w.title}</p>
                    <p className="text-xs text-gray-500">{w.publication_year}</p>
                  </div>
                ))}
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarDetail;