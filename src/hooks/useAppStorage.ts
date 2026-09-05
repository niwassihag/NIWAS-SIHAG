import { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Topic, MockTest, SubjectType } from '../types';
import { INITIAL_TOPICS, INITIAL_MOCK_TESTS, DEFAULT_EXAM_DATE, SUBJECT_METAS } from '../data/initialData';
import { persistentStorage } from '../utils/persistentStorage';

const STORAGE_KEY_TOPICS = 'ssc_cgl_topics_v2';
const STORAGE_KEY_MOCKS = 'ssc_cgl_mocks_v2';
const STORAGE_KEY_EXAM_DATE = 'ssc_cgl_exam_date_v2';

// Migration keys from v1 if present
const LEGACY_STORAGE_KEY_TOPICS = 'ssc_cgl_topics_v1';
const LEGACY_STORAGE_KEY_MOCKS = 'ssc_cgl_mocks_v1';
const LEGACY_STORAGE_KEY_EXAM_DATE = 'ssc_cgl_exam_date_v1';

function loadInitialTopics(): Topic[] {
  try {
    const saved = persistentStorage.getItem(STORAGE_KEY_TOPICS) || persistentStorage.getItem(LEGACY_STORAGE_KEY_TOPICS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load topics from persistentStorage', e);
  }
  return INITIAL_TOPICS;
}

function loadInitialMocks(): MockTest[] {
  try {
    const saved = persistentStorage.getItem(STORAGE_KEY_MOCKS) || persistentStorage.getItem(LEGACY_STORAGE_KEY_MOCKS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.map((m: MockTest) => {
          if (!m.sections) {
            const isT1 = m.type.includes('Tier 1');
            const ratio = m.score / m.maxScore;
            if (isT1) {
              return {
                ...m,
                sections: {
                  math: Math.round(50 * ratio),
                  english: Math.round(50 * ratio),
                  gk: Math.round(50 * ratio),
                  reasoning: Math.round(50 * ratio),
                },
              };
            } else {
              return {
                ...m,
                sections: {
                  math: Math.round(90 * ratio),
                  english: Math.round(135 * ratio),
                  gk: Math.round(75 * ratio),
                  reasoning: Math.round(90 * ratio),
                },
              };
            }
          }
          return m;
        });
      }
    }
  } catch (e) {
    console.error('Failed to load mocks from persistentStorage', e);
  }
  return INITIAL_MOCK_TESTS;
}

function loadInitialExamDate(): string {
  try {
    const saved = persistentStorage.getItem(STORAGE_KEY_EXAM_DATE) || persistentStorage.getItem(LEGACY_STORAGE_KEY_EXAM_DATE);
    if (saved) return saved;
  } catch (e) {
    console.error('Failed to load exam date', e);
  }
  return DEFAULT_EXAM_DATE;
}

export function useAppStorage() {
  // Topics state - auto-loads last saved state
  const [topics, setTopics] = useState<Topic[]>(loadInitialTopics);

  // Mock Tests state - auto-loads last saved state
  const [mockTests, setMockTests] = useState<MockTest[]>(loadInitialMocks);

  // Exam Date state - auto-loads last saved state
  const [examDate, setExamDateState] = useState<string>(loadInitialExamDate);

  // Auto-sync with AndroidStorage bridge if native bridge connects slightly after first mount
  useEffect(() => {
    const checkBridge = () => {
      try {
        const savedTopics = persistentStorage.getItem(STORAGE_KEY_TOPICS);
        if (savedTopics) {
          const parsed = JSON.parse(savedTopics);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTopics((prev) => {
              // Only update if different
              if (JSON.stringify(prev) !== savedTopics) return parsed;
              return prev;
            });
          }
        }
        const savedMocks = persistentStorage.getItem(STORAGE_KEY_MOCKS);
        if (savedMocks) {
          const parsed = JSON.parse(savedMocks);
          if (Array.isArray(parsed)) {
            setMockTests((prev) => {
              if (JSON.stringify(prev) !== savedMocks) return parsed;
              return prev;
            });
          }
        }
        const savedDate = persistentStorage.getItem(STORAGE_KEY_EXAM_DATE);
        if (savedDate) {
          setExamDateState((prev) => (prev !== savedDate ? savedDate : prev));
        }
      } catch (_) {}
    };

    // Run check once on mount and also after 150ms in case bridge is delayed
    checkBridge();
    const t = setTimeout(checkBridge, 150);
    return () => clearTimeout(t);
  }, []);

  // Save to persistentStorage immediately on changes
  useEffect(() => {
    try {
      persistentStorage.setItem(STORAGE_KEY_TOPICS, JSON.stringify(topics));
    } catch (e) {
      console.error(e);
    }
  }, [topics]);

  useEffect(() => {
    try {
      persistentStorage.setItem(STORAGE_KEY_MOCKS, JSON.stringify(mockTests));
    } catch (e) {
      console.error(e);
    }
  }, [mockTests]);

  useEffect(() => {
    try {
      persistentStorage.setItem(STORAGE_KEY_EXAM_DATE, examDate);
    } catch (e) {
      console.error(e);
    }
  }, [examDate]);

  // Actions - guarantee immediate synchronous persistence
  const toggleTopic = useCallback((id: number) => {
    setTopics((prev) => {
      const next = prev.map((t) => {
        if (t.id === id) {
          const nextVal = !t.isDone;
          if (nextVal) {
            confetti({
              particleCount: 28,
              spread: 45,
              origin: { y: 0.8 },
              colors: ['#D4AF37', '#1A237E', '#64B5F6', '#81C784'],
              disableForReducedMotion: true,
            });
          }
          return { ...t, isDone: nextVal };
        }
        return t;
      });
      // Synchronous write to phone/browser storage
      try {
        persistentStorage.setItem(STORAGE_KEY_TOPICS, JSON.stringify(next));
      } catch (_) {}
      return next;
    });
  }, []);

  const setSubjectAllDone = useCallback((subject: SubjectType, status: boolean) => {
    setTopics((prev) => {
      const next = prev.map((t) => (t.subject === subject ? { ...t, isDone: status } : t));
      try {
        persistentStorage.setItem(STORAGE_KEY_TOPICS, JSON.stringify(next));
      } catch (_) {}
      return next;
    });
    if (status) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#D4AF37', '#1A237E', '#FFB74D'],
      });
    }
  }, []);

  const insertMock = useCallback((mock: Omit<MockTest, 'id'>) => {
    const newId = Date.now();
    const newMock: MockTest = {
      ...mock,
      id: newId,
    };
    setMockTests((prev) => {
      const next = [newMock, ...prev];
      try {
        persistentStorage.setItem(STORAGE_KEY_MOCKS, JSON.stringify(next));
      } catch (_) {}
      return next;
    });
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#D4AF37', '#1A237E', '#81C784'],
    });
  }, []);

  const deleteMock = useCallback((id: number) => {
    setMockTests((prev) => {
      const next = prev.filter((m) => m.id !== id);
      try {
        persistentStorage.setItem(STORAGE_KEY_MOCKS, JSON.stringify(next));
      } catch (_) {}
      return next;
    });
  }, []);

  const setExamDate = useCallback((newDate: string) => {
    setExamDateState(newDate);
    try {
      persistentStorage.setItem(STORAGE_KEY_EXAM_DATE, newDate);
    } catch (_) {}
  }, []);

  const resetAllData = useCallback(() => {
    setTopics(INITIAL_TOPICS);
    setMockTests(INITIAL_MOCK_TESTS);
    setExamDateState(DEFAULT_EXAM_DATE);
    localStorage.removeItem(STORAGE_KEY_TOPICS);
    localStorage.removeItem(STORAGE_KEY_MOCKS);
    localStorage.removeItem(STORAGE_KEY_EXAM_DATE);
  }, []);

  // Computed metrics
  const totalTopics = topics.length;
  const completedTopics = useMemo(() => topics.filter((t) => t.isDone).length, [topics]);
  const completionPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // Subject breakdowns
  const subjectStats = useMemo(() => {
    const subjects: SubjectType[] = ['Math', 'English', 'GK', 'Reasoning'];
    return subjects.map((subj) => {
      const subjTopics = topics.filter((t) => t.subject === subj);
      const done = subjTopics.filter((t) => t.isDone).length;
      const total = subjTopics.length;
      const percentage = total > 0 ? Math.round((done / total) * 100) : 0;
      const meta = SUBJECT_METAS[subj];
      return {
        subject: subj,
        displayName: meta.displayName,
        shortName: meta.shortName,
        total,
        done,
        percentage,
        color: meta.color,
        bgColor: meta.bgColor,
        borderColor: meta.borderColor,
      };
    });
  }, [topics]);

  // Mock test statistics
  const averageScorePercentage = useMemo(() => {
    if (mockTests.length === 0) return 0;
    const totalPercents = mockTests.reduce((acc, m) => {
      const pct = (m.score / m.maxScore) * 100;
      return acc + pct;
    }, 0);
    return Math.round(totalPercents / mockTests.length);
  }, [mockTests]);

  // Detailed mock history sorted chronologically
  const chronologicalMocks = useMemo(() => {
    return [...mockTests].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [mockTests]);

  // Last 6 mock tests sorted chronologically for quick chart display
  const last6MocksForChart = useMemo(() => {
    return chronologicalMocks.slice(-6);
  }, [chronologicalMocks]);

  // Subject-wise Mock Performance Analytics & Trends
  const subjectMockStats = useMemo<Record<SubjectType, {
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
  }>>(() => {
    const subjects: SubjectType[] = ['Math', 'English', 'GK', 'Reasoning'];
    const result: any = {};

    subjects.forEach((subj) => {
      const meta = SUBJECT_METAS[subj];
      const key = subj.toLowerCase() as 'math' | 'english' | 'gk' | 'reasoning';

      const percentages: number[] = [];

      chronologicalMocks.forEach((mock) => {
        const isT1 = mock.type.includes('Tier 1');
        const max = isT1 ? meta.tier1Max : meta.tier2Max;
        const score = mock.sections ? mock.sections[key] : (mock.score / mock.maxScore) * max;
        if (typeof score === 'number' && !isNaN(score)) {
          const pct = Math.round((score / max) * 100);
          percentages.push(pct);
        }
      });

      const totalAttempts = percentages.length;
      if (totalAttempts === 0) {
        result[subj] = {
          subject: subj,
          displayName: meta.displayName,
          shortName: meta.shortName,
          color: meta.color,
          avgPercentage: 0,
          highestPercentage: 0,
          latestPercentage: 0,
          trend: 'stable',
          trendDelta: 0,
          status: 'On Track',
          totalAttempts: 0,
        };
        return;
      }

      const avgPercentage = Math.round(percentages.reduce((a, b) => a + b, 0) / totalAttempts);
      const highestPercentage = Math.max(...percentages);
      const latestPercentage = percentages[percentages.length - 1];
      const prevPercentage = percentages.length > 1 ? percentages[percentages.length - 2] : latestPercentage;
      const trendDelta = latestPercentage - prevPercentage;

      let trend: 'improving' | 'declining' | 'stable' = 'stable';
      if (trendDelta > 1) trend = 'improving';
      else if (trendDelta < -1) trend = 'declining';

      let status: 'Strong' | 'Good' | 'On Track' | 'Needs Attention' = 'On Track';
      if (avgPercentage >= 80) status = 'Strong';
      else if (avgPercentage >= 70) status = 'Good';
      else if (avgPercentage >= 55) status = 'On Track';
      else status = 'Needs Attention';

      result[subj] = {
        subject: subj,
        displayName: meta.displayName,
        shortName: meta.shortName,
        color: meta.color,
        avgPercentage,
        highestPercentage,
        latestPercentage,
        trend,
        trendDelta,
        status,
        totalAttempts,
      };
    });

    return result;
  }, [chronologicalMocks]);

  // Exam Countdown calculation
  const countdown = useMemo(() => {
    try {
      const target = new Date(examDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, isPassed: true };
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      return { days, hours, minutes, isPassed: false };
    } catch {
      return { days: 0, hours: 0, minutes: 0, isPassed: false };
    }
  }, [examDate]);

  return {
    topics,
    mockTests,
    examDate,
    totalTopics,
    completedTopics,
    completionPercentage,
    subjectStats,
    averageScorePercentage,
    last6MocksForChart,
    chronologicalMocks,
    subjectMockStats,
    countdown,
    toggleTopic,
    setSubjectAllDone,
    insertMock,
    deleteMock,
    setExamDate,
  };
}
