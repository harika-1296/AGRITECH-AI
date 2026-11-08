import { AppProvider, useApp } from '@/lib/appContext';
import { Sidebar } from '@/components/Sidebar';
import { LandingPage } from '@/pages/LandingPage';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { VoiceAssistantPage } from '@/pages/VoiceAssistantPage';
import { AgentOrchestrationPage } from '@/pages/AgentOrchestrationPage';
import { MarketIntelligencePage } from '@/pages/MarketIntelligencePage';
import { CalculatorPage } from '@/pages/CalculatorPage';
import { StorageIntelligencePage } from '@/pages/StorageIntelligencePage';
import { RecommendationPage } from '@/pages/RecommendationPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { Mic } from 'lucide-react';
import type { PageKey } from '@/lib/types';

function MobileAskButton() {
  const { setPage, farmer } = useApp();
  if (!farmer.onboarded) return null;
  return (
    <button
      onClick={() => setPage('voice')}
      className="fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-forest-600 text-white shadow-cardLg transition hover:bg-forest-700 active:scale-95 lg:hidden"
      aria-label="Ask AgriTech AI"
    >
      <Mic size={24} />
    </button>
  );
}

function PageRouter() {
  const { page, farmer, setPage } = useApp();

  // Guard: require onboarding for app pages (except landing & onboarding)
  const requiresOnboarding: PageKey[] = ['dashboard', 'voice', 'agents', 'market', 'calculator', 'storage', 'recommendation', 'profile'];
  if (requiresOnboarding.includes(page) && !farmer.onboarded) {
    return <OnboardingPage />;
  }

  switch (page) {
    case 'landing': return <LandingPage />;
    case 'onboarding': return <OnboardingPage />;
    case 'dashboard': return <DashboardPage />;
    case 'voice': return <VoiceAssistantPage />;
    case 'agents': return <AgentOrchestrationPage />;
    case 'market': return <MarketIntelligencePage />;
    case 'calculator': return <CalculatorPage />;
    case 'storage': return <StorageIntelligencePage />;
    case 'recommendation': return <RecommendationPage />;
    case 'profile': return <ProfilePage />;
    default: return <LandingPage />;
  }
}

function Shell() {
  const { page } = useApp();
  return (
    <div className="min-h-screen bg-cream-50">
      <Sidebar />
      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          <div key={page} className="animate-fade-in">
            <PageRouter />
          </div>
        </div>
      </main>
      <MobileAskButton />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}

export default App;
