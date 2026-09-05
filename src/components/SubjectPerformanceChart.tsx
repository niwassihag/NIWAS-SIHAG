import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Award, HelpCircle, BarChart3, LineChart, Sparkles } from 'lucide-react';
import { MockTest, SubjectType, MockTier } from '../types';
import { SUBJECT_METAS } from '../data/initialData';

interface SubjectPerformanceChartProps {
  mockTests: MockTest[];
  subjectMockStats: Record<SubjectType, {
    subject: SubjectType;
    displayName: string;
    shortName: string;
    color: string;
    avgPercentage: number;
    highestPercentage: number;
    latestPercentage: number;
    trend: 'improving' | 'declining' | 'stable';
    trendDelta: number;
    status: 'Strong' | 'Good' | 'On Track' | 'Needs Attention';
    totalAttempts: number;
  }>;
  onNavigateToMocks?: () => void;
}

export const SubjectPerformanceChart: React.FC<SubjectPerformanceChartProps> = ({
  mockTests,
  subjectMockStats,
  onNavigateToMocks,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<'ALL' | SubjectType>('ALL');
  const [selectedStage, setSelectedStage] = useState<'ALL' | MockTier>('ALL');
  const [hoveredPoint, setHoveredPoint] = useState<{
    test: MockTest;
    subject: SubjectType;
    score: number;
    max: number;
    pct: number;
    x: number;
    y: number;
  } | null>(null);

  // Filter and sort tests chronologically
  const filteredMocks = mockTests
    .filter((m) => (selectedStage === 'ALL' ? true : m.type === selectedStage))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const subjects: SubjectType[] = ['Math', 'English', 'GK', 'Reasoning'];

  // Helper to extract score & max for any test and subject
  const getSubjectScore = (test: MockTest, subj: SubjectType) => {
    const isT1 = test.type.includes('Tier 1');
    const max = isT1 ? SUBJECT_METAS[subj].tier1Max : SUBJECT_METAS[subj].tier2Max;
    const key = subj.toLowerCase() as 'math' | 'english' | 'gk' | 'reasoning';
    let score = 0;
    if (test.sections && typeof test.sections[key] === 'number') {
      score = test.sections[key];
    } else {
      score = Math.round((test.score / test.maxScore) * max);
    }
    const pct = Math.round((score / max) * 100);
    return { score, max, pct };
  };

  // Dimensions for SVG Chart
  const svgWidth = 460;
  const svgHeight = 180;
  const paddingLeft = 36;
  const paddingRight = 24;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Calculate coordinates
  const getX = (index: number) => {
    if (filteredMocks.length <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (index / (filteredMocks.length - 1)) * chartWidth;
  };

  const getY = (percentage: number) => {
    const clamped = Math.max(0, Math.min(100, percentage));
    return paddingTop + chartHeight - (clamped / 100) * chartHeight;
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm border border-[#E2E8F0]">
      {/* Title and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#1A237E]/10 text-[#1A237E]">
              <LineChart className="h-3.5 w-3.5" />
            </span>
            <h3 className="text-sm font-bold text-slate-800">Subject Performance Progress</h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Track sectional marks and accuracy across all Pre and Mains mock tests
          </p>
        </div>

        {/* Stage Filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setSelectedStage('ALL')}
            className={`px-2 py-1 text-[10px] font-bold rounded-lg transition ${
              selectedStage === 'ALL'
                ? 'bg-white text-[#1A237E] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Stages
          </button>
          <button
            onClick={() => setSelectedStage('Tier 1 (Prelims)')}
            className={`px-2 py-1 text-[10px] font-bold rounded-lg transition ${
              selectedStage === 'Tier 1 (Prelims)'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Pre (/200)
          </button>
          <button
            onClick={() => setSelectedStage('Tier 2 (Mains)')}
            className={`px-2 py-1 text-[10px] font-bold rounded-lg transition ${
              selectedStage === 'Tier 2 (Mains)'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Mains (/390)
          </button>
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedSubject('ALL')}
          className={`px-2.5 py-1 text-xs font-bold rounded-xl whitespace-nowrap transition border ${
            selectedSubject === 'ALL'
              ? 'bg-[#1A237E] text-white border-[#1A237E] shadow-xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          All 4 Subjects
        </button>

        {subjects.map((subj) => {
          const meta = SUBJECT_METAS[subj];
          const isSelected = selectedSubject === subj;
          return (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-xl whitespace-nowrap transition border ${
                isSelected
                  ? 'text-slate-900 border-slate-400 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              style={{
                backgroundColor: isSelected ? meta.bgColor : undefined,
                borderColor: isSelected ? meta.color : undefined,
              }}
            >
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: meta.color }}
              />
              <span>{subj}</span>
            </button>
          );
        })}
      </div>

      {/* SVG Multi-Line Trend Chart */}
      {filteredMocks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
          No mock tests match the selected stage filter.
        </div>
      ) : (
        <div className="relative w-full overflow-hidden rounded-xl bg-slate-50/70 border border-slate-100 p-2">
          {/* Active Hover Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute z-20 pointer-events-none bg-slate-900 text-white text-[11px] rounded-xl p-2.5 shadow-xl border border-slate-700 backdrop-blur-sm -translate-x-1/2 -translate-y-full mb-2"
              style={{
                left: `${(hoveredPoint.x / svgWidth) * 100}%`,
                top: `${(hoveredPoint.y / svgHeight) * 100}%`,
              }}
            >
              <div className="flex items-center justify-between gap-3 text-[10px] text-slate-300 font-semibold border-b border-slate-800 pb-1">
                <span>{new Date(hoveredPoint.test.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                <span className="text-[#D4AF37]">{hoveredPoint.test.type}</span>
              </div>
              <div className="mt-1 flex items-center justify-between gap-4 font-bold text-xs">
                <span style={{ color: SUBJECT_METAS[hoveredPoint.subject].color }}>
                  {hoveredPoint.subject}
                </span>
                <span>
                  {hoveredPoint.score}/{hoveredPoint.max} ({hoveredPoint.pct}%)
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Total Test: {hoveredPoint.test.score}/{hoveredPoint.test.maxScore} (
                {Math.round((hoveredPoint.test.score / hoveredPoint.test.maxScore) * 100)}%)
              </div>
            </div>
          )}

          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto overflow-visible select-none"
          >
            {/* Horizontal Grid Lines */}
            {[25, 50, 75, 100].map((pct) => {
              const y = getY(pct);
              return (
                <g key={pct}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={svgWidth - paddingRight}
                    y2={y}
                    stroke="#E2E8F0"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingLeft - 6}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[9px] fill-slate-400 font-mono"
                  >
                    {pct}%
                  </text>
                </g>
              );
            })}

            {/* Baseline 0 */}
            <line
              x1={paddingLeft}
              y1={getY(0)}
              x2={svgWidth - paddingRight}
              y2={getY(0)}
              stroke="#CBD5E1"
              strokeWidth="1"
            />
            <text
              x={paddingLeft - 6}
              y={getY(0) + 3}
              textAnchor="end"
              className="text-[9px] fill-slate-400 font-mono"
            >
              0%
            </text>

            {/* X-axis Test Date Labels */}
            {filteredMocks.map((test, index) => {
              const x = getX(index);
              const label = new Date(test.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });
              const isT1 = test.type.includes('Tier 1');
              return (
                <g key={test.id}>
                  <line
                    x1={x}
                    y1={paddingTop}
                    x2={x}
                    y2={getY(0)}
                    stroke="#F1F5F9"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={svgHeight - 14}
                    textAnchor="middle"
                    className="text-[9px] fill-slate-500 font-medium"
                  >
                    {label}
                  </text>
                  <text
                    x={x}
                    y={svgHeight - 3}
                    textAnchor="middle"
                    className={`text-[8px] font-bold ${
                      isT1 ? 'fill-blue-600' : 'fill-amber-600'
                    }`}
                  >
                    {isT1 ? 'Pre' : 'Mains'}
                  </text>
                </g>
              );
            })}

            {/* Trend Lines per Subject */}
            {subjects.map((subj) => {
              if (selectedSubject !== 'ALL' && selectedSubject !== subj) return null;
              const meta = SUBJECT_METAS[subj];

              const points = filteredMocks.map((test, index) => {
                const { score, max, pct } = getSubjectScore(test, subj);
                const x = getX(index);
                const y = getY(pct);
                return { x, y, score, max, pct, test, subj };
              });

              const pathData = points.reduce((acc, pt, i) => {
                if (i === 0) return `M ${pt.x} ${pt.y}`;
                // Smooth line using simple bezier approximation or clean lines
                return `${acc} L ${pt.x} ${pt.y}`;
              }, '');

              return (
                <g key={subj}>
                  {/* Connecting Line */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={meta.color}
                    strokeWidth={selectedSubject === subj ? '3' : '2'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-300"
                  />

                  {/* Data Point Circles */}
                  {points.map((pt, idx) => (
                    <g key={idx}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={selectedSubject === subj ? '5' : '3.5'}
                        fill="#FFFFFF"
                        stroke={meta.color}
                        strokeWidth="2.5"
                        className="cursor-pointer transition-transform hover:scale-150"
                        onMouseEnter={() =>
                          setHoveredPoint({
                            test: pt.test,
                            subject: subj,
                            score: pt.score,
                            max: pt.max,
                            pct: pt.pct,
                            x: pt.x,
                            y: pt.y,
                          })
                        }
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    </g>
                  ))}
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* Subject-Wise Performance Summary Cards */}
      <div className="grid grid-cols-2 gap-2 mt-1">
        {subjects.map((subj) => {
          const stats = subjectMockStats[subj];
          const meta = SUBJECT_METAS[subj];
          const isSelected = selectedSubject === subj;

          return (
            <div
              key={subj}
              onClick={() => setSelectedSubject(selectedSubject === subj ? 'ALL' : subj)}
              className={`rounded-xl p-3 cursor-pointer transition border ${
                isSelected
                  ? 'border-slate-800 shadow-xs ring-1 ring-slate-400'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
              style={{ backgroundColor: isSelected ? meta.bgColor : '#FFFFFF' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: meta.color }}
                  />
                  <span className="text-xs font-bold text-slate-800">{subj}</span>
                </div>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    stats.status === 'Strong'
                      ? 'bg-emerald-50 text-emerald-700'
                      : stats.status === 'Good'
                      ? 'bg-blue-50 text-blue-700'
                      : stats.status === 'On Track'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {stats.status}
                </span>
              </div>

              {/* Average & Trend */}
              <div className="mt-2 flex items-baseline justify-between">
                <div className="text-lg font-black text-[#1A237E]">
                  {stats.avgPercentage}%
                  <span className="text-[10px] font-medium text-slate-400 ml-1">avg</span>
                </div>

                <div className="flex items-center gap-0.5 text-xs font-semibold">
                  {stats.trend === 'improving' && (
                    <span className="text-emerald-600 flex items-center text-[10px]">
                      <TrendingUp className="h-3 w-3 mr-0.5" />+{stats.trendDelta}%
                    </span>
                  )}
                  {stats.trend === 'declining' && (
                    <span className="text-red-500 flex items-center text-[10px]">
                      <TrendingDown className="h-3 w-3 mr-0.5" />
                      {stats.trendDelta}%
                    </span>
                  )}
                  {stats.trend === 'stable' && (
                    <span className="text-slate-400 flex items-center text-[10px]">
                      <Minus className="h-3 w-3 mr-0.5" />
                      Stable
                    </span>
                  )}
                </div>
              </div>

              {/* Sectional limits info */}
              <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-100 pt-1">
                <span>Pre: max {meta.tier1Max}m</span>
                <span>Mains: max {meta.tier2Max}m</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
