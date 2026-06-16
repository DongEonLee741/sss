import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Home as HomeIcon, IceCream, Calculator, Wrench, MessageSquare, GraduationCap, Menu, X } from 'lucide-react';
import Home from './components/Home';
import IceCreamMaker from './components/IceCreamMaker';
import FormulaSimulator from './components/FormulaSimulator';
import ClassroomTools from './components/ClassroomTools';
import FreeBoard from './components/FreeBoard';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // List of all navigation tabs
  const navItems = [
    { id: 'home', label: '🏠 홈', icon: HomeIcon },
    { id: 'icecream', label: '🍦 아이스크림 메이커', icon: IceCream, url: 'https://ker-ice-cream-combination-maker-441108459094.asia-south1.run.app' },
    { id: 'simulator', label: '🔍 공식 시뮬레이터', icon: Calculator, url: 'https://service-441108459094.asia-south1.run.app' },
    { id: 'tools', label: '🛠️ 수업 도구', icon: Wrench },
    { id: 'board', label: '📝 자유 게시판', icon: MessageSquare },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={handleTabClick} />;
      case 'icecream':
        return <IceCreamMaker />;
      case 'simulator':
        return <FormulaSimulator />;
      case 'tools':
        return <ClassroomTools />;
      case 'board':
        return <FreeBoard />;
      default:
        return <Home setActiveTab={handleTabClick} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between" id="app-wrapper">
      {/* 1. Header Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs" id="main-navigation-bar">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            
            {/* Left Brand Identity */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleTabClick('home')}
              id="brand-identity"
            >
              <div className="w-9 h-9 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-slate-800 tracking-tight text-base sm:text-lg block">
                  이선생의 이런 수학
                </span>
                <span className="text-[10px] text-orange-600 font-bold block -mt-0.5 tracking-wider uppercase">
                  공통수학1 경우의 수 & 조합
                </span>
              </div>
            </div>

            {/* Desktop Navigation Link tabs */}
            <nav className="hidden lg:flex items-center gap-1.5" id="desktop-nav-menu">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const IconComp = item.icon;
                
                if (item.url) {
                  return (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                      id={`nav-item-${item.id}`}
                    >
                      <span>{item.label}</span>
                    </a>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? 'text-indigo-650 bg-indigo-50/70 border border-indigo-100 shadow-xs scale-102 scale-[1.01]'
                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                    id={`nav-item-${item.id}`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="active-indicator"
                        className="absolute bottom-0 left-3 right-3 h-0.5 bg-indigo-600 rounded-full"
                        style={{ bottom: '-3px' }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Mobile Menu Open Trigger */}
            <div className="lg:hidden" id="mobile-menu-trigger-container">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-xl cursor-pointer"
                id="btn-toggle-mobile-menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden border-t border-slate-200 bg-white shadow-lg overflow-hidden"
              id="mobile-navigation-drawer"
            >
              <div className="px-4 py-3 space-y-1.5 flex flex-col" id="mobile-drawer-items">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  
                  if (item.url) {
                    return (
                      <a
                        key={item.id}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-left w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between transition-colors cursor-pointer text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                        id={`mobile-nav-item-${item.id}`}
                      >
                        <span>{item.label}</span>
                      </a>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`text-left w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                      id={`mobile-nav-item-${item.id}`}
                    >
                      <span>{item.label}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. Main Page Content Block */}
      <main className="flex-grow bg-slate-50" id="main-portal-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            id="page-renderer-animator"
          >
            {renderActiveContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Global Footer Banner */}
      <footer className="bg-white border-t border-slate-200 py-8" id="global-footer">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500" id="footer-details">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="font-extrabold text-slate-700">이선생의 이런 수학</span>
              <span>|</span>
              <span>경우의 수와 조합 온라인 연구실</span>
            </div>
            <div className="text-xs text-slate-400">
              © 2026 Lee&apos;s Math Lab. All rights reserved. 본 웹앱의 소스코드 및 교안 저작권은 이선생에게 있습니다.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
