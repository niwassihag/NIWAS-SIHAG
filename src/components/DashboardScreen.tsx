import React, { useState } from 'react';
import { Calendar, Award, CheckCircle2, ChevronRight, TrendingUp, Clock, Edit2 } from 'lucide-react';
import { ScreenTab, SubjectType, MockTest } from '../types';
import { SubjectPerformanceChart } from './SubjectPerformanceChart';

interface DashboardScreenProps {
  totalTopics: number;
  completedTopics: number;
  completionPercentage: number;
  subjectStats: {
    subject: SubjectType;
    displayName: string;
    shortName: string;
    total: number;
    done: number;
    percentage: number;
    color: string;
    bgColor: string;
    borderColor: string;
  }[];
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
  averageScorePercentage: number;
  last6MocksForChart: {
    id: number;
    type: string;
    date: string;
    score: number;
    maxScore: number;
    note: string;
  }[];
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    isPassed: boolean;
  };
  examDate: string;
  onSetExamDate: (date: string) => void;
  onNavigateTab: (tab: ScreenTab, subject?: SubjectType) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  totalTopics,
  completedTopics,
  completionPercentage,
  subjectStats,
  mockTests,
  subjectMockStats,
  averageScorePercentage,
  last6MocksForChart,
  countdown,
  examDate,
  onSetExamDate,
  onNavigateTab,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(examDate);

  const handleSaveDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate) {
      onSetExamDate(selectedDate);
      setShowDatePicker(false);
    }
  };

  // SVG circular gauge calculation
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div id="dashboard-screen" className="flex flex-col gap-4 p-4 pb-20 text-[#1E293B]">
      {/* Exam Countdown Card */}
      <div
        id="exam-countdown-card"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A237E] to-[#283593] p-4 text-white shadow-md border border-[#3949AB]/30"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm text-[#D4AF37]">
              <Clock className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-xs font-semibold tracking-wider text-blue-200 uppercase">Target SSC CGL Exam</h2>
              <p className="text-xs text-white/70">
                {new Date(examDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
          <button
            id="btn-edit-exam-date"
            onClick={() => {
              setSelectedDate(examDate);
              setShowDatePicker(true);
            }}
            className="flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-white/20 active:scale-95"
            title="Change Target Exam Date"
          >
            <Edit2 className="h-3 w-3 text-[#D4AF37]" />
            <span>Set Date</span>
          </button>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-white/10 p-2 backdrop-blur-sm">
            <div className="text-2xl font-black text-white">{countdown.isPassed ? 0 : countdown.days}</div>
            <div className="text-[10px] font-medium text-blue-200 uppercase">Days Left</div>
          </div>
          <div className="rounded-xl bg-white/10 p-2 backdrop-blur-sm">
            <div className="text-2xl font-black text-white">{countdown.isPassed ? 0 : countdown.hours}</div>
            <div className="text-[10px] font-medium text-blue-200 uppercase">Hours</div>
          </div>
          <div className="rounded-xl bg-white/10 p-2 backdrop-blur-sm">
            <div className="text-2xl font-black text-white">{countdown.isPassed ? 0 : countdown.minutes}</div>
            <div className="text-[10px] font-medium text-blue-200 uppercase">Mins</div>
          </div>
        </div>
      </div>

      {/* Preparation Overview: Overall Syllabus & Average Mock Score */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Total Completion Circular Gauge */}
        <div
          id="syllabus-completion-card"
          className="rounded-2xl bg-white p-4 shadow-sm border border-[#E2E8F0] flex items-center justify-between cursor-pointer transition hover:border-[#D4AF37]/50"
          onClick={() => onNavigateTab('Syllabus')}
        >
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Syllabus Progress</div>
            <div className="text-2xl font-bold text-[#1A237E] mt-0.5">{completionPercentage}%</div>
            <p className="text-xs text-slate-500 mt-1">
              <span className="font-semibold text-slate-700">{completedTopics}</span> of {totalTopics} topics done
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#D4AF37] mt-2">
              View Syllabus <ChevronRight className="h-3 w-3" />
            </span>
          </div>

          <div className="relative flex items-center justify-center">
            <svg className="h-28 w-28 -rotate-90 transform" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="transition-all duration-1000 ease-out"
                stroke="#D4AF37"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-lg font-black text-[#1A237E]">{completionPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Average Mock Score Card */}
        <div
          id="mock-average-card"
          className="rounded-2xl bg-white p-4 shadow-sm border border-[#E2E8F0] flex flex-col justify-between cursor-pointer transition hover:border-blue-400"
          onClick={() => onNavigateTab('Mock Tests')}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Mock Performance</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Award className="h-4 w-4" />
              </span>
            </div>
            <div className="text-2xl font-bold text-[#1A237E] mt-1">{averageScorePercentage}%</div>
            <p className="text-xs text-slate-500 mt-1">
              Average across {last6MocksForChart.length} recorded attempts
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-medium">
            <span>Log or review tests</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>

      {/* Per-Subject Progress Bars */}
      <div id="subject-progress-section" className="rounded-2xl bg-white p-4 shadow-sm border border-[#E2E8F0]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-800">Subject-wise Completion</h3>
          <span className="text-xs text-slate-500 font-medium">4 Core Pillars</span>
        </div>

        <div className="flex flex-col gap-3">
          {subjectStats.map((subj) => (
            <div
              key={subj.subject}
              id={`subject-progress-${subj.subject.toLowerCase()}`}
              className="cursor-pointer group"
              onClick={() => onNavigateTab('Syllabus', subj.subject)}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: subj.color }}
                  />
                  <span className="group-hover:text-[#1A237E] transition">{subj.displayName}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <span className="font-bold text-slate-800">{subj.done}/{subj.total}</span>
                  <span className="text-slate-400">({subj.percentage}%)</span>
                </div>
              </div>

              {/* Progress bar container */}
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${subj.percentage}%`,
                    backgroundColor: subj.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mini Bar Chart of Last 6 Mock Scores */}
      <div id="mock-chart-section" className="rounded-2xl bg-white p-4 shadow-sm border border-[#E2E8F0]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Recent Mock Trajectory</h3>
            <p className="text-xs text-slate-500">Normalized percentage of last attempts</p>
          </div>
          <button
            onClick={() => onNavigateTab('Mock Tests')}
            className="text-xs font-semibold text-[#1A237E] hover:underline"
          >
            View All
          </button>
        </div>

        {last6MocksForChart.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No mock tests recorded yet. Tap "Mock Tests" to add your first score!
          </div>
        ) : (
          <div className="flex items-end justify-between gap-2 pt-6 pb-2 h-44">
            {last6MocksForChart.map((mock, idx) => {
              const pct = Math.round((mock.score / mock.maxScore) * 100);
              const isPrelims = mock.type.includes('Tier 1');
              return (
                <div key={mock.id || idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-900 text-white text-[10px] rounded px-1.5 py-0.5 whitespace-nowrap mb-1 shadow">
                    {mock.score}/{mock.maxScore} ({pct}%)
                  </div>

                  {/* Score label above bar */}
                  <span className="text-[11px] font-bold text-slate-700">{mock.score}</span>

                  {/* Vertical bar */}
                  <div className="w-full max-w-[28px] h-28 bg-slate-100 rounded-t-md relative flex items-end overflow-hidden">
                    <div
                      className={`w-full rounded-t-md transition-all duration-500 ${
                        isPrelims ? 'bg-[#1A237E]' : 'bg-[#D4AF37]'
                      }`}
                      style={{ height: `${Math.min(100, Math.max(10, pct))}%` }}
                    />
                  </div>

                  {/* Date label below bar */}
                  <div className="text-[10px] font-medium text-slate-500 text-center leading-tight">
                    {new Date(mock.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>

                  {/* Tier pill */}
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded font-semibold ${
                      isPrelims ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {isPrelims ? 'T1' : 'T2'}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Legend */}
        <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded bg-[#1A237E]" />
            <span>Tier 1 (Prelims /200)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded bg-[#D4AF37]" />
            <span>Tier 2 (Mains /390)</span>
          </div>
        </div>
      </div>

      {/* Subject-Wise Performance Progress Chart & Breakdown */}
      <SubjectPerformanceChart
        mockTests={mockTests}
        subjectMockStats={subjectMockStats}
        onNavigateToMocks={() => onNavigateTab('Mock Tests')}
      />

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xs rounded-2xl bg-white p-5 shadow-xl border border-slate-200">
            <div className="flex items-center gap-2 text-[#1A237E] font-bold text-base mb-1">
              <Calendar className="h-5 w-5 text-[#D4AF37]" />
              <h3>Set SSC CGL Exam Date</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Your countdown timer will adjust automatically based on this target date.
            </p>

            <form onSubmit={handleSaveDate} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Select Exam Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm text-slate-800 focus:border-[#1A237E] focus:outline-none focus:ring-1 focus:ring-[#1A237E]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowDatePicker(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white rounded-lg bg-[#1A237E] hover:bg-[#283593] shadow-xs active:scale-95"
                >
                  Save Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
