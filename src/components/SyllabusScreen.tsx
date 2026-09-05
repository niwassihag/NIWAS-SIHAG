import React, { useState } from 'react';
import { Check, Search, RotateCcw, CheckCheck, Filter } from 'lucide-react';
import { Topic, SubjectType } from '../types';
import { SUBJECT_METAS } from '../data/initialData';

interface SyllabusScreenProps {
  topics: Topic[];
  activeSubject: SubjectType;
  onSelectSubject: (subject: SubjectType) => void;
  onToggleTopic: (id: number) => void;
  onSetSubjectAllDone: (subject: SubjectType, status: boolean) => void;
}

export const SyllabusScreen: React.FC<SyllabusScreenProps> = ({
  topics,
  activeSubject,
  onSelectSubject,
  onToggleTopic,
  onSetSubjectAllDone,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'done' | 'pending'>('all');

  const subjects: SubjectType[] = ['Math', 'English', 'GK', 'Reasoning'];
  const currentMeta = SUBJECT_METAS[activeSubject];

  const currentSubjectTopics = topics.filter((t) => t.subject === activeSubject);
  const doneCount = currentSubjectTopics.filter((t) => t.isDone).length;
  const totalCount = currentSubjectTopics.length;
  const percentage = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const filteredTopics = currentSubjectTopics.filter((topic) => {
    const matchesSearch = topic.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterMode === 'done') return topic.isDone;
    if (filterMode === 'pending') return !topic.isDone;
    return true;
  });

  return (
    <div id="syllabus-screen" className="flex flex-col h-full pb-20 text-[#1E293B]">
      {/* Top TabRow for Subjects (Material 3 TabRow style) */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-xs">
        <div className="grid grid-cols-4">
          {subjects.map((subj) => {
            const isSelected = activeSubject === subj;
            const meta = SUBJECT_METAS[subj];
            const subjTopics = topics.filter((t) => t.subject === subj);
            const sDone = subjTopics.filter((t) => t.isDone).length;

            return (
              <button
                key={subj}
                id={`tab-subject-${subj.toLowerCase()}`}
                onClick={() => onSelectSubject(subj)}
                className={`relative flex flex-col items-center justify-center py-3 px-1 transition-all ${
                  isSelected ? 'text-[#1A237E] font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: meta.color }}
                  />
                  <span className="text-xs sm:text-sm font-semibold">{meta.shortName}</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {sDone}/{subjTopics.length}
                </span>

                {/* Tab Indicator */}
                {isSelected && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: '#D4AF37' }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Header Card */}
      <div className="p-4 bg-white/70 backdrop-blur-xs border-b border-slate-200">
        <div className="flex items-center justify-between mb-1.5">
          <div>
            <h2 className="text-sm font-bold text-slate-900">{currentMeta.displayName}</h2>
            <p className="text-xs text-slate-500">{currentMeta.description}</p>
          </div>
          <div className="text-right">
            <span className="text-base font-black text-[#1A237E]">{percentage}%</span>
            <div className="text-[10px] text-slate-500 font-medium">
              {doneCount} of {totalCount} completed
            </div>
          </div>
        </div>

        {/* Progress bar with gold accent / subject color */}
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden mt-2">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              backgroundColor: percentage === 100 ? '#81C784' : currentMeta.color,
            }}
          />
        </div>

        {/* Search and Action Bar */}
        <div className="mt-3 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${currentMeta.shortName} topics...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#1A237E] focus:outline-none"
            />
          </div>

          {/* Quick Mark All / Reset actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSetSubjectAllDone(activeSubject, true)}
              title="Mark all topics as done"
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-green-700 transition"
            >
              <CheckCheck className="h-4 w-4" />
            </button>
            <button
              onClick={() => onSetSubjectAllDone(activeSubject, false)}
              title="Reset all topics to pending"
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-amber-700 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-2.5 flex items-center gap-1.5">
          <Filter className="h-3 w-3 text-slate-400 mr-0.5" />
          {(['all', 'pending', 'done'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize transition ${
                filterMode === mode
                  ? 'bg-[#1A237E] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {mode} {mode === 'all' ? `(${currentSubjectTopics.length})` : mode === 'done' ? `(${doneCount})` : `(${totalCount - doneCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Checklist List */}
      <div className="flex-1 p-4 overflow-y-auto">
        {filteredTopics.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No topics found matching your criteria.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredTopics.map((topic, index) => {
              const isChecked = topic.isDone;

              return (
                <div
                  key={topic.id}
                  id={`topic-item-${topic.id}`}
                  onClick={() => onToggleTopic(topic.id)}
                  className={`group flex items-center gap-3 rounded-xl p-3 border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-amber-50/40 border-amber-200/60 text-slate-700'
                      : 'bg-white border-slate-200/80 text-slate-800 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  {/* Register Index Number */}
                  <span className="text-[11px] font-mono text-slate-400 w-5 text-center">
                    {index + 1}.
                  </span>

                  {/* Material 3 / Register Checkbox */}
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${
                      isChecked
                        ? 'bg-[#D4AF37] border-[#D4AF37] text-white shadow-xs'
                        : 'border-slate-300 bg-white group-hover:border-slate-400'
                    }`}
                  >
                    {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>

                  {/* Topic Title */}
                  <div className="flex-1">
                    <span
                      className={`text-sm font-medium transition ${
                        isChecked ? 'line-through text-slate-400' : 'text-slate-800'
                      }`}
                    >
                      {topic.name}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isChecked
                        ? 'bg-amber-100/70 text-amber-800 font-bold'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isChecked ? 'Completed' : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
