import React, { useEffect, useState } from 'react';

let wasmModule = null;
let wasmMemory = null;
let wasmReady = false;
let initializing = false;

const initWasm = async () => {
  if (wasmReady) return true;

  if (initializing) {
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (!initializing) {
          clearInterval(check);
          resolve(wasmReady);
        }
      }, 100);
    });
  }

  initializing = true;

  try {
    wasmMemory = new WebAssembly.Memory({ initial: 2 });
    const resp = await fetch('/assembly/ten-citations.wasm');
    const buffer = await resp.arrayBuffer();

    const { instance } = await WebAssembly.instantiate(buffer, {
      env: {
        memory: wasmMemory,
        abort: () => {}
      }
    });

    wasmModule = instance.exports;
    wasmReady = true;
  } catch {
    wasmReady = false;
  } finally {
    initializing = false;
  }

  return wasmReady;
};

const calculateCits = async (scholarData) => {
  const yearCounts = scholarData.counts_by_year || [];
  const vals = yearCounts.map((d) => d.cited_by_count || 0);

  const ok = await initWasm();
  if (!ok || !wasmModule || !wasmMemory) {
    throw new Error("WASM not ready yet");
  }

  const memView = new Int32Array(wasmMemory.buffer);
  const ptr = 1024;

  vals.forEach((val, i) => {
    memView[ptr / 4 + i] = val;
  });

  const totalCitations = wasmModule.addRecentPublications(ptr, vals.length);
  return { totalCitations, usingWasm: true };
};

const WasmStats = ({ scholarData }) => {
  const [citations, setCitations] = useState(null);

  useEffect(() => {
    initWasm();
  }, []);

  useEffect(() => {
    const load = async () => {
      const result = await calculateCits(scholarData);
      setCitations(result.totalCitations);
    };

    load();
  }, [scholarData]);

  return (
    <div className="border border-gray-200 p-4 rounded">
      <div className="text-sm text-gray-600 mb-1">Citations for recent 10 years</div>
      <div className="text-xl font-semibold text-gray-900">{citations}</div>
    </div>
  );
};

export default WasmStats;
