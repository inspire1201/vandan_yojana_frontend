

import React, { useEffect, useRef, useMemo, memo } from 'react';
import Chart, { Chart as ChartJS } from 'chart.js/auto';

// === Types ===
interface RawCountData {
  c20?: number | string;
  c21?: number | string;
  c22?: number | string;
  c23?: number | string;
  c25?: number | string;
  c26?: number | string;
  c27?: number | string;
  c28?: number | string;
}

interface ApiData {
  first?: RawCountData;
  second?: RawCountData;
}

interface EconomicStatusChartProps {
  data: ApiData;
}

// === Default Categories ===
const CATEGORIES = [
  { key: 'improved' as const, label: 'आर्थिक स्थिति सुधर गयी है', color: '#22c55e' },
  { key: 'same' as const, label: 'आर्थिक स्थिति पहले जैसी ही है', color: '#f97316' },
  { key: 'somewhat' as const, label: 'कुछ कह नहीं सकते', color: '#eab308' },
  { key: 'noResponse' as const, label: 'कोई प्रतिक्रिया नहीं', color: '#3b82f6' },
] as const;

// === Safe Number Conversion ===
const toNumber = (val: any): number => {
  const num = Number(val);
  return isNaN(num) || num < 0 ? 0 : Math.floor(num);
};

// === Main Component ===
const EconomicStatusChart: React.FC<EconomicStatusChartProps> = memo(({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  // === Extract and Validate Data ===
  const dataRows = useMemo(() => {
    const first = data.first || {};
    const second = data.second || {};

    const row1 = {
      improved: toNumber(first.c20),
      same: toNumber(first.c22),
      somewhat: toNumber(first.c21),
      noResponse: toNumber(first.c23),
    };

    const row2 = {
      improved: toNumber(second.c25),
      same: toNumber(second.c27),
      somewhat: toNumber(second.c26),
      noResponse: toNumber(second.c28),
    };

    const total = {
      improved: row1.improved + row2.improved,
      same: row1.same + row2.same,
      somewhat: row1.somewhat + row2.somewhat,
      noResponse: row1.noResponse + row2.noResponse,
    };

    return [
      { sno: 1, type: 'महिला लाभार्थी', counts: row1 },
      { sno: 2, type: 'लाभार्थी के परिवार से', counts: row2 },
      { sno: '#', type: 'Total', counts: total },
    ] as const;
  }, [data]);

  // === Compute Totals (excluding Total row) ===
  const totals = useMemo(() => {
    return dataRows.reduce((acc, row) => {
      if (typeof row.sno === 'number') {
        acc.improved += row.counts.improved;
        acc.same += row.counts.same;
        acc.somewhat += row.counts.somewhat;
        acc.noResponse += row.counts.noResponse;
      }
      return acc;
    }, { improved: 0, same: 0, somewhat: 0, noResponse: 0 });
  }, [dataRows]);

  const overallTotal = Object.values(totals).reduce((a, b) => a + b, 0);

  // === Table Data with Percentages ===
  const tableData = useMemo(() => {
    return dataRows.map(row => {
      const total =
        row.counts.improved +
        row.counts.same +
        row.counts.somewhat +
        row.counts.noResponse;

      const percent = (count: number) =>
        total > 0 ? ((count / total) * 100).toFixed(0) : '0';

      return {
        sno: row.sno,
        type: row.type,
        overall: total,
        improved: `${row.counts.improved} (${percent(row.counts.improved)}%)`,
        same: `${row.counts.same} (${percent(row.counts.same)}%)`,
        somewhat: `${row.counts.somewhat} (${percent(row.counts.somewhat)}%)`,
        noResponse: `${row.counts.noResponse} (${percent(row.counts.noResponse)}%)`,
      };
    });
  }, [dataRows]);

  // === Chart Data ===
  const { labels, dataset, colors } = useMemo(() => {
    return {
      labels: CATEGORIES.map(c => c.label),
      dataset: CATEGORIES.map(c => totals[c.key]),
      colors: CATEGORIES.map(c => c.color),
    };
  }, [totals]);

  // === Legend Items ===
  const legendItems = CATEGORIES.map(cat => {
    const count = totals[cat.key];
    const percent = overallTotal > 0 ? ((count / overallTotal) * 100).toFixed(0) : '0';
    return (
      <div key={cat.key} className="inline-flex items-center gap-2 text-sm">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: cat.color }}
          aria-hidden="true"
        />
        <span>
          {cat.label}: <strong>{count}</strong> ({percent}%)
        </span>
      </div>
    );
  });

  // === Chart Effect ===
  useEffect(() => {
    if (!chartRef.current || overallTotal === 0) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy old chart
    chartInstanceRef.current?.destroy();

    chartInstanceRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data: dataset,
          backgroundColor: colors,
          borderColor: '#ffffff',
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const value = ctx.parsed;
                const percent = overallTotal > 0 ? ((value / overallTotal) * 100).toFixed(1) : '0';
                return `${ctx.label}: ${value} (${percent}%)`;
              },
            },
          },
        },
      },
    });

    return () => {
      chartInstanceRef.current?.destroy();
      chartInstanceRef.current = null;
    };
  }, [labels, dataset, colors, overallTotal]);

  // === Render ===
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-orange-300">
      {/* Title */}
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        आर्थिक स्थिति में सुधार
      </h1>

      {/* Table */}
      <div className="overflow-x-auto mb-6 rounded-md border border-gray-300">
        <table className="min-w-full bg-green-50">
          <thead>
            <tr className="bg-green-100">
              {['SNO', 'टाइप', 'ओवर ऑल', ...CATEGORIES.map(c => c.label)].map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-green-200"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr
                key={i}
                className={`${i % 2 === 0 ? 'bg-green-50' : 'bg-white'} hover:bg-green-100 transition-colors`}
              >
                <td className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-green-200">
                  {row.sno}
                </td>
                <td className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-green-200">
                  {row.type}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">
                  {row.overall}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.improved}</td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.same}</td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.somewhat}</td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">{row.noResponse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pie Chart */}
      <div className="relative h-80 mb-6 bg-green-50 rounded-md p-4 border border-green-200">
        {overallTotal === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>कोई डेटा उपलब्ध नहीं</p>
          </div>
        ) : (
          <canvas ref={chartRef} />
        )}
      </div>

      {/* Custom Legend */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-700">
        {legendItems}
      </div>
    </div>
  );
});

EconomicStatusChart.displayName = 'EconomicStatusChart';

export default EconomicStatusChart;