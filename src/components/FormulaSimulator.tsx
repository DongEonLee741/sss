import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronRight, ChevronLeft, Play, ArrowDown, Sparkles, Check, Info } from 'lucide-react';
import { PermutationCard, Basket } from '../types';

const ALPHABET = ['A', 'B', 'C', 'D'];

const BASKETS: Basket[] = [
  {
    id: 'abc',
    letters: ['A', 'B', 'C'],
    label: '{ A, B, C }',
    permutations: [
      ['A', 'B', 'C'], ['A', 'C', 'B'],
      ['B', 'A', 'C'], ['B', 'C', 'A'],
      ['C', 'A', 'B'], ['C', 'B', 'A']
    ]
  },
  {
    id: 'abd',
    letters: ['A', 'B', 'D'],
    label: '{ A, B, D }',
    permutations: [
      ['A', 'B', 'D'], ['A', 'D', 'B'],
      ['B', 'A', 'D'], ['B', 'D', 'A'],
      ['D', 'A', 'B'], ['D', 'B', 'A']
    ]
  },
  {
    id: 'acd',
    letters: ['A', 'C', 'D'],
    label: '{ A, C, D }',
    permutations: [
      ['A', 'C', 'D'], ['A', 'D', 'C'],
      ['C', 'A', 'D'], ['C', 'D', 'A'],
      ['D', 'A', 'C'], ['D', 'C', 'A']
    ]
  },
  {
    id: 'bcd',
    letters: ['B', 'C', 'D'],
    label: '{ B, C, D }',
    permutations: [
      ['B', 'C', 'D'], ['B', 'D', 'C'],
      ['C', 'B', 'D'], ['C', 'D', 'B'],
      ['D', 'B', 'C'], ['D', 'C', 'B']
    ]
  },
];

// Helper to flatten permutations
const ALL_PERMUTATIONS: PermutationCard[] = BASKETS.flatMap((basket) =>
  basket.permutations.map((perm, index) => ({
    id: `${basket.id}-${index}`,
    letters: perm as [string, string, string],
    basketId: basket.id,
  }))
);

export default function FormulaSimulator() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [hoveredBasketId, setHoveredBasketId] = useState<string | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [isClassifying, setIsClassifying] = useState<boolean>(false);
  const [classificationProgress, setClassificationProgress] = useState<number>(-1); // -1: not started, 0-24: index processed

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      if (currentStep - 1 < 3) {
        setClassificationProgress(-1);
      }
    }
  };

  const startClassification = () => {
    setIsClassifying(true);
    setClassificationProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setClassificationProgress(progress);
      if (progress >= 24) {
        clearInterval(interval);
        setIsClassifying(false);
      }
    }, 80);
  };

  const getStepText = (step: number) => {
    switch (step) {
      case 1:
        return '순열 관찰 (4P3 = 24)';
      case 2:
        return '바구니 준비 (4C3)';
      case 3:
        return '분류 작업 (나누기 3!)';
      case 4:
        return '조합 완성 (4C3 = 4)';
      default:
        return '';
    }
  };

  // Check if a card has been "slid" into its basket in step 3
  const isSlidIn = (cardIndex: number) => {
    if (currentStep < 3) return false;
    if (currentStep === 4) return true;
    return classificationProgress >= cardIndex;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-4 py-8"
      id="simulator-page"
    >
      {/* Top Header */}
      <div className="mb-8" id="simulator-header">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
          <span className="text-blue-500">🔍</span> 순열에서 조합으로 공식 유도 시뮬레이터
        </h1>
        <p className="text-slate-600 mt-1">
          4개의 문자 <strong>A, B, C, D</strong> 중에서 <strong>3개를 택하는 순열(<sub>4</sub>P<sub>3</sub> = 24가지)</strong>을 
          <strong>조합(<sub>4</sub>C<sub>3</sub> = 4가지)</strong>으로 수축 정리하며 공식 유도 원리를 이해해 봅니다.
        </p>
      </div>

      {/* Progress timeline */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-center gap-4" id="stepper-timeline">
        <div className="flex gap-1.5 md:gap-3 flex-wrap" id="breadcrumb-steps">
          {[1, 2, 3, 4].map((step) => {
            const isActive = currentStep === step;
            const isCompleted = currentStep > step;
            return (
              <div key={step} className="flex items-center" id={`breadcrumb-step-${step}`}>
                <button
                  onClick={() => {
                    setCurrentStep(step);
                    if (step < 3) setClassificationProgress(-1);
                  }}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? '✓' : step}
                </button>
                <span className={`text-xs ml-2 font-semibold ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
                  {getStepText(step)}
                </span>
                {step < 4 && <ChevronRight className="w-4 h-4 text-slate-350 mx-2 hidden sm:block" />}
              </div>
            );
          })}
        </div>

        <div className="flex gap-2">
          <button
            disabled={currentStep === 1}
            onClick={handlePrev}
            className={`px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors ${
              currentStep === 1 ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-50' : 'hover:bg-slate-50 text-slate-700'
            }`}
            id="btn-step-prev"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            이전 단계
          </button>
          <button
            disabled={currentStep === 4}
            onClick={handleNext}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs ${
              currentStep === 4 ? 'opacity-40 cursor-not-allowed bg-slate-300' : ''
            }`}
            id="btn-step-next"
          >
            다음 단계
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main step container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="simulator-main-content">
        
        {/* Left Interactive Playground (7 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6" id="simulator-canvas">
          
          {/* STEP 1: All 24 Permutations */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex-1"
              id="step-1-content"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  1단계: 순서가 있는 순열 (<sub>4</sub>P<sub>3</sub> = 24가지)
                </h3>
                <span className="text-xs bg-blue-50 text-blue-600 font-bold px-2 py-1 rounded border border-blue-150">
                  총 24개 수식 카드
                </span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                4개의 문자 중 3개를 골라 한 줄로 세우는 순열입니다. 
                <span className="text-blue-600 font-medium ml-1">카드에 마우스를 대면 같은 문자로 구성된 순열끼리 강조 표시됩니다.</span>
              </p>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3" id="permutations-grid">
                {ALL_PERMUTATIONS.map((card, idx) => {
                  const isHoveredGroup = hoveredBasketId === card.basketId;
                  const isSelfHovered = hoveredCardId === card.id;

                  // Define group pastel background colors
                  const groupColors: Record<string, string> = {
                    abc: 'border-pink-200 bg-pink-50/50 hover:bg-pink-100 text-pink-700',
                    abd: 'border-amber-200 bg-amber-50/50 hover:bg-amber-100 text-amber-700',
                    acd: 'border-teal-200 bg-teal-50/50 hover:bg-teal-100 text-teal-700',
                    bcd: 'border-purple-200 bg-purple-50/50 hover:bg-purple-100 text-purple-700',
                  };

                  return (
                    <div
                      key={card.id}
                      onMouseEnter={() => {
                        setHoveredBasketId(card.basketId);
                        setHoveredCardId(card.id);
                      }}
                      onMouseLeave={() => {
                        setHoveredBasketId(null);
                        setHoveredCardId(null);
                      }}
                      className={`p-3 rounded-xl border text-center transition-all duration-300 font-mono text-base font-bold flex flex-col justify-center items-center shadow-xs select-none cursor-pointer ${
                        isHoveredGroup
                          ? `${groupColors[card.basketId]} scale-[1.05] ring-2 ring-indigo-400/20`
                          : 'border-slate-150 bg-white text-slate-600 hover:text-slate-800 hover:border-slate-300'
                      }`}
                      id={`p-card-${card.id}`}
                    >
                      <div className="flex gap-0.5 justify-center mb-1">
                        {card.letters.map((letter, i) => (
                          <span
                            key={i}
                            className={`w-4 h-4 text-[10px] rounded flex items-center justify-center text-white ${
                              letter === 'A' ? 'bg-red-400' :
                              letter === 'B' ? 'bg-blue-400' :
                              letter === 'C' ? 'bg-green-400' : 'bg-orange-400'
                            }`}
                          >
                            {letter}
                          </span>
                        ))}
                      </div>
                      <span className="text-sm tracking-widest">{card.letters.join('')}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Prepping Baskets */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex-1"
              id="step-2-content"
            >
              <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                2단계: 순서가 없는 조합 바구니 준비 (<sub>4</sub>C<sub>3</sub> = 4가지)
              </h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                조합은 <strong>순서쌍의 모양({`순서`})에 연연치 않고 대상을 꾸러미({`집합`}) 채로 간주</strong>합니다.
                {` 따라서 {A, B, C, D}에서 3글자를 택하면 중복되지 않는 다음 4가지 바구니만이 유효합니다.`}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="baskets-empty-grid">
                {BASKETS.map((basket) => {
                  const styleMap: Record<string, string> = {
                    abc: 'border-pink-200 bg-pink-50/20 text-pink-700',
                    abd: 'border-amber-200 bg-amber-50/20 text-amber-700',
                    acd: 'border-teal-200 bg-teal-50/20 text-teal-700',
                    bcd: 'border-purple-200 bg-purple-50/20 text-purple-700',
                  };

                  return (
                    <div
                      key={basket.id}
                      className={`p-5 rounded-2xl border-2 border-dashed ${styleMap[basket.id]} flex flex-col justify-center items-center text-center`}
                      id={`empty-basket-${basket.id}`}
                    >
                      <span className="text-3xl mb-2">🧺</span>
                      <h4 className="text-lg font-extrabold tracking-wider">{basket.label} 바구니</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        이 바구니 속 가구원들은 서로 뒤바뀐 전후 순서를 인정하지 않고 하나의 가문으로 단결합니다.
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 3 & STEP 4: Classification Simulation */}
          {(currentStep === 3 || currentStep === 4) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex-1 flex flex-col justify-between"
              id="step-3-content"
            >
              <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    {currentStep === 3 ? '3단계: 24개 순열을 조합 바구니로 마이그레이션' : '4단계: 조합의 정답 산출 완료 (4C3 = 4)'}
                  </h3>
                  {currentStep === 3 && (
                    <button
                      disabled={isClassifying || classificationProgress >= 24}
                      onClick={startClassification}
                      className={`px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-md ${
                        classificationProgress >= 24
                          ? 'bg-slate-300 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 transition-colors'
                      }`}
                      id="btn-run-classify"
                    >
                      <Play className="w-3.5 h-3.5" />
                      {classificationProgress === -1 ? '분류 작업 시작하기' : isClassifying ? '분류 진행 중...' : '분류 작업 재개'}
                    </button>
                  )}
                </div>

                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  {currentStep === 3 
                    ? '24가지 모든 순열 카드가 알맞은 알맹이(A, B, C, D) 조합을 담은 바구니로 떨어져 내려갑니다. 각 바구니에 정확히 몇 개씩 밀봉되는지 확인하십시오!'
                    : '결과를 관찰하십시오! 24개 순열 카드가 4개의 조합 바구니에 정확히 6개(= 3!)씩 가두어졌습니다. 즉, 순열 개수를 3!개로 나누면 조합 개수가 계산됩니다.'}
                </p>

                {/* Classification Canvas: Two areas */}
                {/* Permutation Stack Reservoir (if Step 3 and not all classified) */}
                {currentStep === 3 && classificationProgress < 24 && (
                  <div className="border border-indigo-100 bg-indigo-50/30 rounded-2xl p-4 mb-6" id="stack-reservoir">
                    <div className="flex justify-between text-xs text-indigo-700 font-bold mb-2">
                      <span>대기 중인 순열 데크 ({Math.max(0, 24 - (classificationProgress + 1))}개)</span>
                      <span>과정율: {Math.round((Math.max(0, classificationProgress + 1) / 24) * 100)}%</span>
                    </div>

                    <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto p-1 border border-indigo-200/50 bg-white rounded-xl" id="reservoir-grid">
                      {ALL_PERMUTATIONS.map((card, idx) => {
                        const isSlid = isSlidIn(idx);
                        if (isSlid) return null;
                        return (
                          <div
                            key={card.id}
                            className="px-2.5 py-1 bg-slate-50 border border-slate-150 rounded text-xs font-mono font-bold text-slate-500"
                            id={`res-card-${card.id}`}
                          >
                            {card.letters.join('')}
                          </div>
                        );
                      })}
                      {classificationProgress >= 23 && (
                        <span className="text-xs text-slate-400 italic mx-auto">모든 순열 카드가 바구니로 분류 이송 완료되었습니다!</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Loaded Baskets showing card lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="baskets-loaded-grid">
                  {BASKETS.map((basket) => {
                    // Find classified cards belonging to this basket
                    const classifiedInBasket = ALL_PERMUTATIONS.filter(
                      (card, idx) => card.basketId === basket.id && isSlidIn(idx)
                    );

                    const styleMap: Record<string, string> = {
                      abc: 'border-pink-200 bg-pink-50/10 text-pink-700 text-pink-600',
                      abd: 'border-amber-200 bg-amber-50/10 text-amber-700 text-amber-600',
                      acd: 'border-teal-200 bg-teal-50/10 text-teal-700 text-teal-600',
                      bcd: 'border-purple-200 bg-purple-50/10 text-purple-700 text-purple-600',
                    };

                    const badgeColor: Record<string, string> = {
                      abc: 'bg-pink-100 border border-pink-200',
                      abd: 'bg-amber-100 border border-amber-200',
                      acd: 'bg-teal-100 border border-teal-200',
                      bcd: 'bg-purple-100 border border-purple-200',
                    };

                    const isFull = classifiedInBasket.length === 6;

                    return (
                      <div
                        key={basket.id}
                        className={`p-4 rounded-2xl border-2 transition-all duration-300 shrink-0 ${styleMap[basket.id]} ${
                          isFull ? 'shadow-md border-solid bg-white' : 'border-dashed'
                        }`}
                        id={`loaded-basket-${basket.id}`}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-sm font-bold flex items-center gap-1.5">
                            <span>🧺</span>
                            <strong>{basket.label}</strong>組合
                          </h4>
                          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${badgeColor[basket.id]}`}>
                            {classifiedInBasket.length} / 6 카딩
                          </span>
                        </div>

                        {/* Classified letters list inside this basket */}
                        <div className="grid grid-cols-3 gap-1.5" id={`basket-grid-items-${basket.id}`}>
                          {classifiedInBasket.map((card) => (
                            <motion.div
                              layoutId={`card-motion-${card.id}`}
                              key={card.id}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="p-1 px-1.5 rounded-lg border border-slate-200 bg-slate-50 text-center text-xs font-mono font-bold text-slate-700 shadow-xs flex items-center justify-center gap-1"
                              id={`active-p-card-${card.id}`}
                            >
                              <span className="text-[10px] text-slate-505 tracking-wide">{card.letters.join('')}</span>
                            </motion.div>
                          ))}
                        </div>

                        {classifiedInBasket.length === 0 && (
                          <div className="text-center py-4 text-xs text-slate-400 italic" id={`basket-empty-msg-${basket.id}`}>
                            도입 대기 중입니다...
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Progress info footer */}
              {currentStep === 3 && (
                <div className="mt-4 bg-slate-50 p-2 border border-slate-150 rounded-xl text-center text-xs text-slate-500 font-semibold" id="classify-status">
                  분류된 누적 순열 카드: <strong>{Math.max(0, classificationProgress + 1)}</strong> / 24개
                </div>
              )}
            </motion.div>
          )}

        </div>

        {/* Right Math Explainer Sidebar (4 cols) */}
        <div className="lg:col-span-4" id="simulator-math-info">
          
          {/* Card for Formula Derivation explanation */}
          <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col justify-between h-full" id="derivation-explainer">
            <div className="space-y-6" id="derivation-body">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider" id="derivation-badge">
                <Info className="w-4 h-4" />
                <span>공식 유도 핵심 메커니즘</span>
              </div>

              {currentStep === 1 && (
                <div className="space-y-4" id="explainer-step1">
                  <h3 className="text-lg font-bold text-white">순열의 원소 산출</h3>
                  <p className="text-xs text-slate-350 leading-relaxed">
                    서로 다른 4개 문자(A, B, C, D)에서 3개를 뽑아 <span className="text-blue-300">순서를 배열</span>하는 경우의 수는 다음과 같습니다.
                  </p>
                  <p className="font-mono bg-slate-800 text-center py-3 rounded-xl border border-slate-700 text-lg text-blue-300 font-semibold">
                    <sub>4</sub>P<sub>3</sub> = 4 × 3 × 2 = <span className="text-xl font-extrabold text-white">24가지</span>
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    첫 자리에 놓을 수 있는 것 4개, 둘째 자리 3개, 셋째 자리 2개를 순차 곱한 산출물입니다.
                  </p>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4" id="explainer-step2">
                  <h3 className="text-lg font-bold text-white">순서 무력화: 조합 바구니</h3>
                  <p className="text-xs text-slate-350 leading-relaxed">
                    그러나{' '}
                    <span className="text-amber-300 font-semibold">
                      조합은 순서와 상관없이 한 꾸러미에 들어있는 원소 자체만으로 같은 것
                    </span>
                    으로 평가합니다.
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    예컨대, <strong>ABC, ACB, BAC, BCA, CAB, CBA</strong>는 순열에서는 6가지 모두 엄밀히 구별되지만, 조합 관점에서는 그저 <strong className="text-white">{`{A, B, C}`}</strong>라는 단 하나의 조합 바구니에 해당합니다.
                  </p>
                  <div className="p-3.5 bg-slate-800 border border-slate-700 rounded-xl" id="equivalence-list">
                    <span className="text-[10px] text-slate-400 block mb-1">동일 조합 계열 (3! = 6개)</span>
                    <span className="font-mono text-sm text-amber-200 tracking-wider">ABC, ACB, BAC, BCA, CAB, CBA</span>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4" id="explainer-step3">
                  <h3 className="text-lg font-bold text-white">나누기 3!의 위대한 원험</h3>
                  <p className="text-xs text-slate-350 leading-relaxed">
                    전체 24개 순열을 각 바구니에 골고루 분류하면, 각 바구니에 <strong>정확히 6개씩</strong>의 순서 역전형 카드들이 들어갑니다.
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    이 6이라는 수는 어디서 나왔을까요? 바로 바구니에 들어갈 <strong>3개 원소를 자기들끼리 줄 세우는 경우의 수(3! = 3 × 2 × 1 = 6)</strong>입니다!
                  </p>
                  <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-center" id="divide-ratio-info">
                    <span className="text-xs text-indigo-300 font-bold block mb-1">분류 비례식</span>
                    <span className="font-mono text-lg font-bold text-white">24개 / 6개 = 4바구니</span>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4" id="explainer-step4">
                  <h3 className="text-lg font-bold text-white">조합공식 <sub>n</sub>C<sub>r</sub> 정립</h3>
                  <p className="text-xs text-slate-350 leading-relaxed">
                    최종적으로 중복되는 순서 유발 요소를 나누어 상쇄함으로써 조합 공식을 깔끔하게 이끌어냅니다.
                  </p>

                  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 text-center mt-3" id="derivation-final-math-formula">
                    <span className="text-[10px] text-slate-400 block mb-1.5">조합 계산 공식</span>
                    <div className="text-lg font-extrabold text-blue-300 font-mono">
                      <sub>n</sub>C<sub>r</sub> = 
                      <div className="inline-flex flex-col align-middle text-center mx-1"><span className="border-b border-slate-600 pb-0.5 px-1"><sub>n</sub>P<sub>r</sub></span><span className="pt-0.5">r!</span></div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    이 시뮬레이션에서는 n=4, r=3 이므로:<br />
                    <strong><sub>4</sub>C<sub>3</sub> = <sub>4</sub>P<sub>3</sub> / 3! = 24 / 6 = 4가지</strong> 조합바구니가 됩니다.
                  </p>
                </div>
              )}
            </div>

            {/* Quick action card selector */}
            <div className="mt-8 pt-4 border-t border-slate-800 text-xs text-slate-500" id="step-timeline-nav">
              {currentStep === 4 ? (
                <div className="text-emerald-400 font-bold flex items-center gap-1 justify-center py-2" id="explainer-complete-msg">
                  <Check className="w-4 h-4" />
                  <span>공식 유도 원리를 완전히 정복했습니다!</span>
                </div>
              ) : (
                <div className="text-slate-400 text-center italic" id="explainer-nav-hint">
                  {`상단의 [다음 단계] 버튼을 눌러 공식을 완성해 가세요.`}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
