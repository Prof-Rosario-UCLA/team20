// ScholarDetail.js
import React, { useEffect, useState } from 'react';
import { getScholarInfo } from './openAlex/api';

const ScholarDetail = ({ scholarId, onBack }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fail, setFail] = useState(false);

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
    <div className="bg-white border border-gray-300 p-6 rounded-md shadow-sm">
      <button
        onClick={onBack}
        className="mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-semibold mb-1">{data.display_name}</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 p-4 bg-slate-50 rounded">
          <p className="font-medium">Works: <span className="font-normal">{data.works_count}</span></p>
          <p className="font-medium">Citations: <span className="font-normal">{data.cited_by_count}</span></p>
        </div>
        <div className="flex-1 p-4 bg-slate-50 rounded">
          <p className="font-medium mb-1">Top Concepts:</p>
          {data.x_concepts?.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-gray-700">
              {data.x_concepts.slice(0, 5).map((c, i) => <li key={i}>{c.display_name}</li>)}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No data</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Recent Works</h3>
        {data.works?.length > 0 ? (
          <ul className="space-y-2">
            {data.works.map((w, i) => (
              <li key={i} className="p-3 border rounded bg-gray-50">
                <p className="font-medium">{w.title}</p>
                <p className="text-xs text-gray-500">{w.publication_year}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No recent works available.</p>
        )}
      </div>
    </div>
  );
};

export default ScholarDetail;
