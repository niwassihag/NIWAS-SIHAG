import React, { useState } from 'react';
import { useAppStorage } from './hooks/useAppStorage';
import { ScreenTab, SubjectType } from './types';
import { AndroidEmulatorFrame } from './components/AndroidEmulatorFrame';
import { DashboardScreen } from './components/DashboardScreen';
import { SyllabusScreen } from './components/SyllabusScreen';
import { MockScreen } from './components/MockScreen';
import { SplashScreen } from './components/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentTab, setCurrentTab] = useState<ScreenTab>('Dashboard');
  const [activeSubject, setActiveSubject] = useState<SubjectType>('Math');

  const {
    topics,
    mockTests,
    examDate,
    totalTopics,
    completedTopics,
    completionPercentage,
    subjectStats,
    averageScorePercentage,
    last6MocksForChart,
    subjectMockStats,
    countdown,
    toggleTopic,
    setSubjectAllDone,
    insertMock,
    deleteMock,
    setExamDate,
  } = useAppStorage();

  const handleNavigateFromDashboard = (tab: ScreenTab, subject?: SubjectType) => {
    setCurrentTab(tab);
    if (subject) {
      setActiveSubject(subject);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans antialiased text-slate-100 selection:bg-[#D4AF37] selection:text-slate-950">
      {/* Native App Splash Screen */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* Mobile Application Screen Container */}
      <AndroidEmulatorFrame
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        completedCount={completedTopics}
        totalCount={totalTopics}
      >
        {/* Tab 1: Dashboard */}
        {currentTab === 'Dashboard' && (
          <DashboardScreen
            totalTopics={totalTopics}
            completedTopics={completedTopics}
            completionPercentage={completionPercentage}
            subjectStats={subjectStats}
            mockTests={mockTests}
            subjectMockStats={subjectMockStats}
            averageScorePercentage={averageScorePercentage}
            last6MocksForChart={last6MocksForChart}
            countdown={countdown}
            examDate={examDate}
            onSetExamDate={setExamDate}
            onNavigateTab={handleNavigateFromDashboard}
          />
        )}

        {/* Tab 2: Syllabus */}
        {currentTab === 'Syllabus' && (
          <SyllabusScreen
            topics={topics}
            activeSubject={activeSubject}
            onSelectSubject={setActiveSubject}
            onToggleTopic={toggleTopic}
            onSetSubjectAllDone={setSubjectAllDone}
          />
        )}

        {/* Tab 3: Mock Tests */}
        {currentTab === 'Mock Tests' && (
          <MockScreen
            mockTests={mockTests}
            subjectMockStats={subjectMockStats}
            onInsertMock={insertMock}
            onDeleteMock={deleteMock}
          />
        )}
      </AndroidEmulatorFrame>
    </div>
  );
}
