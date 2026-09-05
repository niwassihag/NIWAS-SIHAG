import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Calendar,
  Award,
  FileText,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  X,
  LineChart,
  ListFilter,
  Calculator,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { MockTest, MockTier, SubjectType } from '../types';
import { SUBJECT_METAS } from '../data/initialData';
import { SubjectPerformanceChart } from './SubjectPerformanceChart';

interface MockScreenProps {
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
  onInsertMock: (mock: Omit<MockTest, 'id'>) => void;
  onDeleteMock: (id: number) => void;
}

export const MockScreen: React.FC<MockScreenProps> = ({
  mockTests,
  subjectMockStats,
  onInsertMock,
  onDeleteMock,
}) => {
  const [activeView, setActiveView] = useState<'tests' | 'analytics'>('tests');
  const [showAddModal, setShowAddModal] = useState(false);
  const [tier, setTier] = useState<MockTier>('Tier 1 (Prelims)');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Sectional scores
  const [mathScore, setMathScore] = useState('');
  const [englishScore, setEnglishScore] = useState('');
  const [gkScore, setGkScore] = useState('');
  const [reasoningScore, setReasoningScore] = useState('');
  const [computerScore, setComputerScore] = useState('');

  // Total & Mode
  const [score, setScore] = useState('');
  const [maxScore, setMaxScore] = useState('200');
  const [useSectionalInput, setUseSectionalInput] = useState(true);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  // When tier changes, adjust max marks
  const handleTierChange = (selectedTier: MockTier) => {
    setTier(selectedTier);
    if (selectedTier === 'Tier 1 (Prelims)') {
      setMaxScore('200');
    } else {
      setMaxScore('390');
    }
  };

  // Auto calculate total when sectional scores change
  useEffect(() => {
    if (!useSectionalInput) return;
    const m = parseFloat(mathScore) || 0;
    const e = parseFloat(englishScore) || 0;
    const g = parseFloat(gkScore) || 0;
    const r = parseFloat(reasoningScore) || 0;

    if (mathScore !== '' || englishScore !== '' || gkScore !== '' || reasoningScore !== '') {
      const total = m + e + g + r;
      setScore(total.toString());
    }
  }, [mathScore, englishScore, gkScore, reasoningScore, useSectionalInput]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numScore = parseFloat(score);
    const numMaxScore = parseFloat(maxScore);

    if (isNaN(numScore) || isNaN(numMaxScore)) {
      setError('Please enter valid numeric marks.');
      return;
    }
    if (numScore < 0) {
      setError('Score cannot be negative.');
      return;
    }
    if (numScore > numMaxScore) {
      setError(`Score (${numScore}) cannot exceed maximum marks (${numMaxScore}).`);
      return;
    }

    // Prepare sectional scores
    const isT1 = tier === 'Tier 1 (Prelims)';
    const mMax = isT1 ? 50 : 90;
    const eMax = isT1 ? 50 : 135;
    const gMax = isT1 ? 50 : 75;
    const rMax = isT1 ? 50 : 90;

    let parsedMath = parseFloat(mathScore);
    let parsedEnglish = parseFloat(englishScore);
    let parsedGk = parseFloat(gkScore);
    let parsedReasoning = parseFloat(reasoningScore);
    let parsedComp = parseFloat(computerScore);

    // If sectional input was skipped, extrapolate evenly
    if (!useSectionalInput || (isNaN(parsedMath) && isNaN(parsedEnglish) && isNaN(parsedGk) && isNaN(parsedReasoning))) {
      const ratio = numScore / numMaxScore;
      parsedMath = Math.round(mMax * ratio);
      parsedEnglish = Math.round(eMax * ratio);
      parsedGk = Math.round(gMax * ratio);
      parsedReasoning = Math.round(rMax * ratio);
    } else {
      parsedMath = isNaN(parsedMath) ? 0 : parsedMath;
      parsedEnglish = isNaN(parsedEnglish) ? 0 : parsedEnglish;
      parsedGk = isNaN(parsedGk) ? 0 : parsedGk;
      parsedReasoning = isNaN(parsedReasoning) ? 0 : parsedReasoning;

      // Validate section limits
      if (parsedMath > mMax) {
        setError(`Math marks cannot exceed ${mMax}.`);
        return;
      }
      if (parsedEnglish > eMax) {
        setError(`English marks cannot exceed ${eMax}.`);
        return;
      }
      if (parsedGk > gMax) {
        setError(`GK marks cannot exceed ${gMax}.`);
        return;
      }
      if (parsedReasoning > rMax) {
        setError(`Reasoning marks cannot exceed ${rMax}.`);
        return;
      }
    }

    onInsertMock({
      type: tier,
      date,
      score: numScore,
      maxScore: numMaxScore,
      sections: {
        math: parsedMath,
        english: parsedEnglish,
        gk: parsedGk,
        reasoning: parsedReasoning,
        ...(tier === 'Tier 2 (Mains)' && !isNaN(parsedComp) ? { computer: parsedComp } : {}),
      },
      note: note.trim(),
    });

    // Reset form
    setMathScore('');
    setEnglishScore('');
    setGkScore('');
    setReasoningScore('');
    setComputerScore('');
    setScore('');
    setNote('');
    setShowAddModal(false);
  };

  // Sorted mocks: latest date first
  const sortedMocks = [...mockTests].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Quick stats
  const prelimsMocks = mockTests.filter((m) => m.type === 'Tier 1 (Prelims)');
  const mainsMocks = mockTests.filter((m) => m.type === 'Tier 2 (Mains)');

  const calcAvg = (list: MockTest[]) => {
    if (list.length === 0) return 0;
    const total = list.reduce((acc, m) => acc + (m.score / m.maxScore) * 100, 0);
    return Math.round(total / list.length);
  };

  const prelimsAvg = calcAvg(prelimsMocks);
  const mainsAvg = calcAvg(mainsMocks);

  return (
    <div id="mock-screen" className="relative flex flex-col h-full p-4 pb-24 text-[#1E293B]">
      {/* Top Navigation Switcher */}
      <div className="flex items-center justify-between gap-2 mb-3 bg-slate-200/70 p-1 rounded-2xl">
        <button
          onClick={() => setActiveView('tests')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold transition ${
            activeView === 'tests'
              ? 'bg-white text-[#1A237E] shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ListFilter className="h-3.5 w-3.5" />
          <span>Tests & Sectional Log</span>
        </button>

        <button
          onClick={() => setActiveView('analytics')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold transition ${
            activeView === 'analytics'
              ? 'bg-white text-[#1A237E] shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <LineChart className="h-3.5 w-3.5" />
          <span>Subject Progress Chart</span>
        </button>
      </div>

      {/* Header Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
        <div className="rounded-xl bg-white p-3 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Logged</span>
          <div className="text-xl font-bold text-[#1A237E] mt-0.5">{mockTests.length}</div>
          <span className="text-[10px] text-slate-400">Pre & Mains Tests</span>
        </div>

        <div className="rounded-xl bg-white p-3 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Prelims Avg</span>
          <div className="text-xl font-bold text-blue-700 mt-0.5">{prelimsAvg > 0 ? `${prelimsAvg}%` : 'N/A'}</div>
          <span className="text-[10px] text-slate-400">{prelimsMocks.length} attempts (/200)</span>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-xl bg-white p-3 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Mains Avg</span>
          <div className="text-xl font-bold text-amber-600 mt-0.5">{mainsAvg > 0 ? `${mainsAvg}%` : 'N/A'}</div>
          <span className="text-[10px] text-slate-400">{mainsMocks.length} attempts (/390)</span>
        </div>
      </div>

      {/* VIEW 1: Test Log with Detailed Sectional Scores */}
      {activeView === 'tests' ? (
        <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-bold text-slate-800">Recorded Tests History</h2>
            <span className="text-xs text-slate-500 font-medium">{sortedMocks.length} tests</span>
          </div>

          {sortedMocks.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center bg-white/60">
              <Award className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">No mock tests recorded yet</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Click the gold "+" button below to log your first Pre or Mains score with sectional breakdown!
              </p>
            </div>
          ) : (
            sortedMocks.map((test) => {
              const pct = Math.round((test.score / test.maxScore) * 100);
              const isPrelims = test.type.includes('Tier 1');

              // Section max marks
              const mathMax = isPrelims ? 50 : 90;
              const englishMax = isPrelims ? 50 : 135;
              const gkMax = isPrelims ? 50 : 75;
              const reasoningMax = isPrelims ? 50 : 90;

              const mathVal = test.sections ? test.sections.math : Math.round((test.score / test.maxScore) * mathMax);
              const englishVal = test.sections ? test.sections.english : Math.round((test.score / test.maxScore) * englishMax);
              const gkVal = test.sections ? test.sections.gk : Math.round((test.score / test.maxScore) * gkMax);
              const reasoningVal = test.sections ? test.sections.reasoning : Math.round((test.score / test.maxScore) * reasoningMax);

              return (
                <div
                  key={test.id}
                  id={`mock-card-${test.id}`}
                  className="rounded-2xl bg-white p-3.5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPrelims
                            ? 'bg-blue-50 text-blue-800 border border-blue-200/60'
                            : 'bg-amber-50 text-amber-800 border border-amber-200/60'
                        }`}
                      >
                        {test.type}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Calendar className="h-3 w-3" />
                        {new Date(test.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Delete Button */}
                    <button
                      id={`btn-delete-mock-${test.id}`}
                      onClick={() => onDeleteMock(test.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Delete mock record"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Score & Badge */}
                  <div className="mt-2 flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black text-[#1A237E]">{test.score}</span>
                      <span className="text-xs font-semibold text-slate-400">/{test.maxScore}</span>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        pct >= 75
                          ? 'bg-emerald-50 text-emerald-700'
                          : pct >= 60
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>

                  {/* Sectional Scores Breakdown Grid */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                      <span>Sectional Scores</span>
                      <span>{isPrelims ? 'Tier 1 (/50 each)' : 'Tier 2 (Session 1)'}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {/* Math */}
                      <div className="rounded-xl bg-red-50/50 p-2 border border-red-100/70">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                          <span className="text-red-700 font-bold">Math</span>
                          <span>{Math.round((mathVal / mathMax) * 100)}%</span>
                        </div>
                        <div className="text-xs font-black text-slate-800 mt-0.5">
                          {mathVal}<span className="text-[10px] text-slate-400 font-normal">/{mathMax}</span>
                        </div>
                      </div>

                      {/* English */}
                      <div className="rounded-xl bg-blue-50/50 p-2 border border-blue-100/70">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                          <span className="text-blue-700 font-bold">English</span>
                          <span>{Math.round((englishVal / englishMax) * 100)}%</span>
                        </div>
                        <div className="text-xs font-black text-slate-800 mt-0.5">
                          {englishVal}<span className="text-[10px] text-slate-400 font-normal">/{englishMax}</span>
                        </div>
                      </div>

                      {/* GK */}
                      <div className="rounded-xl bg-emerald-50/50 p-2 border border-emerald-100/70">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                          <span className="text-emerald-700 font-bold">GK</span>
                          <span>{Math.round((gkVal / gkMax) * 100)}%</span>
                        </div>
                        <div className="text-xs font-black text-slate-800 mt-0.5">
                          {gkVal}<span className="text-[10px] text-slate-400 font-normal">/{gkMax}</span>
                        </div>
                      </div>

                      {/* Reasoning */}
                      <div className="rounded-xl bg-amber-50/50 p-2 border border-amber-100/70">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                          <span className="text-amber-700 font-bold">Reasoning</span>
                          <span>{Math.round((reasoningVal / reasoningMax) * 100)}%</span>
                        </div>
                        <div className="text-xs font-black text-slate-800 mt-0.5">
                          {reasoningVal}<span className="text-[10px] text-slate-400 font-normal">/{reasoningMax}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tier 2 Computer Module if present */}
                    {!isPrelims && test.sections?.computer !== undefined && (
                      <div className="mt-1.5 text-[10px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg flex items-center justify-between">
                        <span>Computer Knowledge Module (Qualifying)</span>
                        <span className="font-bold text-[#1A237E]">{test.sections.computer}/60 Marks</span>
                      </div>
                    )}
                  </div>

                  {/* Optional Note */}
                  {test.note && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-start gap-1.5 text-xs text-slate-600 bg-slate-50/60 rounded-lg p-2">
                      <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <p className="line-clamp-2 italic">{test.note}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* VIEW 2: Subject Performance Progress Chart */
        <div className="flex-1 overflow-y-auto">
          <SubjectPerformanceChart
            mockTests={mockTests}
            subjectMockStats={subjectMockStats}
            onNavigateToMocks={() => setActiveView('tests')}
          />
        </div>
      )}

      {/* Floating Action Button (+) with Gold Accent */}
      <button
        id="btn-add-mock"
        onClick={() => {
          setError('');
          setShowAddModal(true);
        }}
        className="fixed bottom-20 right-6 z-30 flex h-13 w-13 items-center justify-center rounded-full bg-[#D4AF37] text-white shadow-lg hover:bg-[#C59F2D] active:scale-95 transition-all"
        title="Log Mock Test with Sectional Scores"
      >
        <Plus className="h-6 w-6 stroke-[2.5]" />
      </button>

      {/* Add Mock Modal Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md max-h-[92vh] flex flex-col rounded-3xl bg-white p-5 shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1A237E]/10 text-[#1A237E]">
                  <Award className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Log Mock Test Result</h3>
                  <p className="text-[11px] text-slate-500">Record score with subject sectional breakdown</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-red-50 p-2 text-xs text-red-600 shrink-0">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="mt-3 flex flex-col gap-3 overflow-y-auto pr-1">
              {/* Stage Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Exam Stage</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleTierChange('Tier 1 (Prelims)')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                      tier === 'Tier 1 (Prelims)'
                        ? 'bg-[#1A237E] text-white border-[#1A237E] shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Tier 1 (Prelims /200)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTierChange('Tier 2 (Mains)')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                      tier === 'Tier 2 (Mains)'
                        ? 'bg-[#1A237E] text-white border-[#1A237E] shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Tier 2 (Mains /390)
                  </button>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Test Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-800 focus:border-[#1A237E] focus:outline-none"
                  required
                />
              </div>

              {/* Sectional Scores Input Toggle & Fields */}
              <div className="rounded-2xl bg-slate-50/80 p-3 border border-slate-200/90">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Calculator className="h-3.5 w-3.5 text-[#1A237E]" />
                    <span className="text-xs font-bold text-slate-800">
                      Sectional Scores ({tier === 'Tier 1 (Prelims)' ? 'Pre' : 'Mains'})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUseSectionalInput(!useSectionalInput)}
                    className="text-[10px] font-semibold text-blue-700 hover:underline"
                  >
                    {useSectionalInput ? 'Quick Total Mode' : 'Sectional Mode'}
                  </button>
                </div>

                {useSectionalInput ? (
                  <div className="grid grid-cols-2 gap-2">
                    {/* Math */}
                    <div>
                      <label className="text-[11px] font-bold text-red-700 block mb-0.5">
                        Math / Quant ({tier === 'Tier 1 (Prelims)' ? 'max 50' : 'max 90'})
                      </label>
                      <input
                        type="number"
                        step="0.25"
                        placeholder={tier === 'Tier 1 (Prelims)' ? 'e.g. 42' : 'e.g. 75'}
                        value={mathScore}
                        onChange={(e) => setMathScore(e.target.value)}
                        className="w-full rounded-xl border border-red-200 bg-white p-2 text-xs text-slate-900 font-bold focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    {/* English */}
                    <div>
                      <label className="text-[11px] font-bold text-blue-700 block mb-0.5">
                        English ({tier === 'Tier 1 (Prelims)' ? 'max 50' : 'max 135'})
                      </label>
                      <input
                        type="number"
                        step="0.25"
                        placeholder={tier === 'Tier 1 (Prelims)' ? 'e.g. 44' : 'e.g. 108'}
                        value={englishScore}
                        onChange={(e) => setEnglishScore(e.target.value)}
                        className="w-full rounded-xl border border-blue-200 bg-white p-2 text-xs text-slate-900 font-bold focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    {/* GK */}
                    <div>
                      <label className="text-[11px] font-bold text-emerald-700 block mb-0.5">
                        GK / Awareness ({tier === 'Tier 1 (Prelims)' ? 'max 50' : 'max 75'})
                      </label>
                      <input
                        type="number"
                        step="0.25"
                        placeholder={tier === 'Tier 1 (Prelims)' ? 'e.g. 24' : 'e.g. 38'}
                        value={gkScore}
                        onChange={(e) => setGkScore(e.target.value)}
                        className="w-full rounded-xl border border-emerald-200 bg-white p-2 text-xs text-slate-900 font-bold focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    {/* Reasoning */}
                    <div>
                      <label className="text-[11px] font-bold text-amber-700 block mb-0.5">
                        Reasoning ({tier === 'Tier 1 (Prelims)' ? 'max 50' : 'max 90'})
                      </label>
                      <input
                        type="number"
                        step="0.25"
                        placeholder={tier === 'Tier 1 (Prelims)' ? 'e.g. 48' : 'e.g. 78'}
                        value={reasoningScore}
                        onChange={(e) => setReasoningScore(e.target.value)}
                        className="w-full rounded-xl border border-amber-200 bg-white p-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    {/* Tier 2 Computer Knowledge (Qualifying) */}
                    {tier === 'Tier 2 (Mains)' && (
                      <div className="col-span-2 mt-1 pt-1 border-t border-slate-200">
                        <label className="text-[11px] font-bold text-purple-700 block mb-0.5">
                          Computer Knowledge (Qualifying, max 60 marks)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          placeholder="e.g. 40"
                          value={computerScore}
                          onChange={(e) => setComputerScore(e.target.value)}
                          className="w-full rounded-xl border border-purple-200 bg-white p-2 text-xs text-slate-900 font-bold focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 italic">
                    Entering overall total only. Sectional marks will be estimated proportionately.
                  </p>
                )}
              </div>

              {/* Total Score & Max Marks */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">Total Score</label>
                    {useSectionalInput && (
                      <span className="text-[10px] text-emerald-600 font-semibold">Auto-calculated</span>
                    )}
                  </div>
                  <input
                    type="number"
                    step="0.25"
                    placeholder="e.g. 158"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-800 font-black text-base focus:border-[#1A237E] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Max Marks</label>
                  <input
                    type="number"
                    value={maxScore}
                    onChange={(e) => setMaxScore(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-800 focus:border-[#1A237E] focus:outline-none bg-slate-50"
                    required
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Performance Notes <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Good score in Quant algebra, GK static questions were tough..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-800 focus:border-[#1A237E] focus:outline-none resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white rounded-xl bg-[#1A237E] hover:bg-[#283593] shadow-xs active:scale-95 transition"
                >
                  Save Test Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
