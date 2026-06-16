import React from 'react';
import { motion } from 'motion/react';
import { IceCream, Calculator, Wrench, MessageSquare, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

interface HomeProps {
  setActiveTab: (tab: string) => void;
}

export default function Home({ setActiveTab }: HomeProps) {
  const cards = [
    {
      id: 'icecream',
      title: '아이스크림 조합 메이커 🍦',
      subtitle: '4가지 토핑 중 2개를 골라 나만의 아이스크림을 만들고, 중복 없는 6가지 조합(4C2)을 수집해 보세요.',
      icon: IceCream,
      color: 'from-pink-50 to-orange-50 hover:from-pink-100 hover:to-orange-100 border-pink-100 text-pink-600',
      badge: '시뮬레이션 1',
      url: 'https://ker-ice-cream-combination-maker-441108459094.asia-south1.run.app',
    },
    {
      id: 'simulator',
      title: '공식 유도 시뮬레이터 🔍',
      subtitle: '순열(nPr) 24가지 카드가 조합(nCr) 바구니 4개에 6개씩 나누어 담기는 과정을 직접 보며 공식을 이해해 보세요.',
      icon: Calculator,
      color: 'from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-100 text-blue-600',
      badge: '시뮬레이션 2',
      url: 'https://service-441108459094.asia-south1.run.app',
    },
    {
      id: 'tools',
      title: '학습 및 수업 도구 🛠️',
      subtitle: '정밀하고 시각적인 모둠용 타이머와 기발한 애니메이션을 곁들인 학생 제비뽑기 추첨 도구입니다.',
      icon: Wrench,
      color: 'from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 border-amber-100 text-amber-600',
      badge: '유틸리티',
    },
    {
      id: 'board',
      title: '자유 수학 게시판 📝',
      subtitle: '수학 유머, 질문, 자유로운 소감 등을 남기고 친구들과 의견을 실시간으로 나누는 공간입니다.',
      icon: MessageSquare,
      color: 'from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border-emerald-100 text-emerald-600',
      badge: '게시판',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto px-4 py-8"
      id="home-page-container"
    >
      {/* Hero Header Section */}
      <div className="text-center mb-12 relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent p-10 rounded-3xl border border-orange-100" id="hero-header">
        <motion.div
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute -top-12 -right-12 w-48 h-48 bg-orange-300/20 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-12 -left-12 w-56 h-56 bg-amber-300/20 rounded-full blur-3xl pointer-events-none"
        />

        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 shadow-sm" id="class-badge">
          <BookOpen className="w-3.5 h-3.5" />
          <span>고등학교 공통수학1 - 경우의 수와 조합</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight mb-4" id="home-main-title">
          이선생의 이런 수학 <span className="text-orange-500">(공통수학1)</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium" id="home-subtitle">
          경우의 수와 조합의 원리를 직관적이고 시각적으로 직접 탐구하며 감각을 깨우는 공간입니다. 🍦🔍
        </p>
      </div>

      {/* Quick Navigation Cards Grid */}
      <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2 px-2" id="nav-section-title">
        <Sparkles className="w-5 h-5 text-orange-500" />
        마법 같은 수학 실험실에 입장해 보세요
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="navigation-grid">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          const CardContent = (
            <>
              {/* Decorative background icon */}
              <div className="absolute right-[-10px] bottom-[-10px] text-slate-500/5 group-hover:text-slate-500/10 transition-colors duration-300">
                <Icon className="w-40 h-40 stroke-[1]" />
              </div>

              <div>
                <div className="flex justify-between items-start mb-4" id={`nav-card-head-${card.id}`}>
                  <span className="text-xs font-bold uppercase tracking-wider bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full text-slate-600 shadow-xs border border-slate-100">
                    {card.badge}
                  </span>
                  <div className="p-3 bg-white rounded-xl shadow-md border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-orange-600 transition-colors duration-200">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {card.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-1 text-sm font-bold mt-4 text-slate-700 group-hover:text-amber-700 transition-colors duration-200">
                실험 보러 가기 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </>
          );

          if (card.url) {
            return (
              <motion.a
                key={card.id}
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className={`group relative cursor-pointer p-6 rounded-2xl border bg-gradient-to-br ${card.color} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between h-56`}
                id={`nav-card-${card.id}`}
              >
                {CardContent}
              </motion.a>
            );
          }

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              onClick={() => setActiveTab(card.id)}
              className={`group relative cursor-pointer p-6 rounded-2xl border bg-gradient-to-br ${card.color} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between h-56`}
              id={`nav-card-${card.id}`}
            >
              {CardContent}
            </motion.div>
          );
        })}
      </div>

      {/* Educational Guide Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 p-6 rounded-2xl bg-white border border-slate-200 shadow-md"
        id="edu-intro-card"
      >
        <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
          💡 이 공간을 처음 이용하시는 학생 및 선생님께
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed space-y-2">
          공통수학1의 <strong className="text-slate-800">합의 법칙과 곱의 법칙</strong>, 그리고 이들이 모여 탄생하는 <strong className="text-slate-800">순열(Permutation)과 조합(Combination)</strong>은 단순한 공식 암기 과목이 아닙니다.<br />
          이곳에서는 실생활의 <strong>아이스크림 수집 게임</strong>을 통해 <em>순서가 없는 대상을 뽑는 행위</em>인 조합의 실체를 익히고, 
          <strong>유도 시뮬레이터</strong>를 통해 <em>순서가 있는 순열에서 순서의 의미를 제거(r!로 나누기)</em>하여 조합 공식이 왜 유도되는지를 원초적으로 관찰할 수 있습니다.<br />
          수업 중에는 <strong>타이머와 랜덤 추첨 도구</strong>를 활용해 보며, 배우고 느낀 점은 언제든 <strong>자유 게시판</strong>에 적어보세요!
        </p>
      </motion.div>
    </motion.div>
  );
}
