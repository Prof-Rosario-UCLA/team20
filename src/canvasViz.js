// canvasViz.js
import React, { useEffect, useRef } from 'react';

const CitationTrendChart = ({ scholarData }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !scholarData) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio;
    const bounds = canvas.getBoundingClientRect();
    canvas.width = bounds.width * dpr;
    canvas.height = bounds.height * dpr;
    ctx.scale(dpr, dpr);

    const width = bounds.width;
    const height = bounds.height;
    const margin = 50;

    let data = scholarData.counts_by_year || [];
    data = data.sort((a, b) => a.year - b.year).slice(-5);
    if (data.length === 0) {
      const now = new Date().getFullYear();
      data = Array.from({ length: 5 }, (_, i) => ({ year: now - 4 + i, cited_by_count: 0 }));
    }

    const max = Math.max(...data.map(d => d.cited_by_count)) * 1.3;

    ctx.font = 'bold 18px Georgia';
    ctx.fillStyle = '#232';
    ctx.textAlign = 'center';
    ctx.fillText('Citations Over the Past 5 Years', width / 2, 25);

    const yTicks = 4;
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#567';
    ctx.textAlign = 'right';
    for (let i = 0; i <= yTicks; i++) {
      const y = margin + ((yTicks - i) / yTicks) * (height - margin * 2);
      const label = Math.round((i / yTicks) * max);
      ctx.beginPath();
      ctx.moveTo(margin, y);
      ctx.lineTo(width - margin, y);
      ctx.stroke();
      ctx.fillText(label.toLocaleString(), margin - 6, y);
    }

    ctx.beginPath();
    data.forEach((d, i) => {
      const x = margin + (i / (data.length - 1)) * (width - margin * 2);
      const y = height - margin - (d.cited_by_count / max) * (height - margin * 2);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 2;
    ctx.stroke();

    data.forEach((d, i) => {
      const x = margin + (i / (data.length - 1)) * (width - margin * 2);
      const y = height - margin - (d.cited_by_count / max) * (height - margin * 2);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#4f46e5';
      ctx.fill();
    });
  }, [scholarData]);

  return (
    <div className="my-6">
      <h3 className="text-base font-medium mb-3">Citation Trends</h3>
      <div className="bg-blue-50 p-3 border">
        <canvas
          ref={canvasRef}
          className="w-full h-72"
          style={{ width: '100%', height: '300px' }}
          aria-label="Citations Over the Past 5 Years"
        />
      </div>
    </div>
  );
};

export default CitationTrendChart;
