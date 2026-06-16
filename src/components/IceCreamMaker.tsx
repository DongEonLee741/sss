import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw, Layers, CheckCircle2, RotateCcw, AlertCircle, HelpCircle } from 'lucide-react';
import { Topping, IceCreamCombo } from '../types';

const TOPPINGS: Topping[] = [
  { id: 'strawberry', name: '딸기 🍓', emoji: '🍓', color: 'bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-300' },
  { id: 'chocolate', name: '초콜릿 🍫', emoji: '🍫', color: 'bg-amber-100 text-amber-900 hover:bg-amber-200 border-amber-300' },
  { id: 'banana', name: '바나나 🍌', emoji: '🍌', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300' },
  { id: 'mint', name: '민트 🌿', emoji: '🌿', color: 'bg-teal-100 text-teal-800 hover:bg-teal-200 border-teal-300' },
];

const INITIAL_COMBOS = (): IceCreamCombo[] => {
  const combos: IceCreamCombo[] = [];
  for (let i = 0; i < TOPPINGS.length; i++) {
    for (let j = i + 1; j < TOPPINGS.length; j++) {
      const top1 = TOPPINGS[i];
      const top2 = TOPPINGS[j];
      combos.push({
        id: `${top1.id}_${top2.id}`,
        toppingIds: [top1.id, top2.id].sort() as [string, string],
        toppings: [top1, top2],
        found: false,
      });
    }
  }
  return combos;
};

export default function IceCreamMaker() {
  const [combos, setCombos] = useState<IceCreamCombo[]>(() => {
    const saved = localStorage.getItem('math_portal_combos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_COMBOS();
      }
    }
    return INITIAL_COMBOS();
  });

  const [selected, setSelected] = useState<Topping[]>([]);
  const [isMixing, setIsMixing] = useState(false);
  const [mixingStep, setMixingStep] = useState(0); // 0: idle, 1: pour, 2: swirl, 3: ready
  const [showDuplicateWarning, setShowDuplicateWarning] = useState<string | null>(null);
  const [lastMixedCombo, setLastMixedCombo] = useState<IceCreamCombo | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [explainHelp, setExplainHelp] = useState(false);

  useEffect(() => {
    localStorage.setItem('math_portal_combos', JSON.stringify(combos));
  }, [combos]);

  const handleSelectTopping = (topping: Topping) => {
    if (selected.find((t) => t.id === topping.id)) {
      setSelected(selected.filter((t) => t.id !== topping.id));
    } else {
      if (selected.length < 2) {
        setSelected([...selected, topping]);
      } else {
        // Replace the second topping or shift
        setSelected([selected[1], topping]);
      }
    }
    setShowDuplicateWarning(null);
  };

  const handleMix = () => {
    if (selected.length !== 2) return;

    setIsMixing(true);
    setMixingStep(1);
    setShowDuplicateWarning(null);

    // Timeline for compounding mixing animations
    setTimeout(() => {
      setMixingStep(2); // swirling
    }, 700);

    setTimeout(() => {
      setMixingStep(3); // ready
      const sortedIds = selected.map((t) => t.id).sort();
      const comboId = `${sortedIds[0]}_${sortedIds[1]}`;

      const matchedIndex = combos.findIndex((c) => c.id === comboId);
      if (matchedIndex !== -1) {
        const item = combos[matchedIndex];
        if (item.found) {
          setShowDuplicateWarning(`중복 조합 발생! '${item.toppings[0].name} + ${item.toppings[1].name}'는 이미 발견한 아이스크림입니다.`);
          setLastMixedCombo(item);
        } else {
          const updated = [...combos];
          updated[matchedIndex] = { ...item, found: true, timestamp: Date.now() };
          setCombos(updated);
          setLastMixedCombo(updated[matchedIndex]);

          // Check if all found
          const isAllFound = updated.every((c) => c.found);
          if (isAllFound) {
            setTimeout(() => {
              setShowCelebration(true);
            }, 800);
          }
        }
      }
      setIsMixing(false);
    }, 1800);
  };

  const resetAll = () => {
    if (confirm('모든 수집 기록을 초기화하고 다시 시작하시겠습니까?')) {
      const resetCombos = INITIAL_COMBOS();
      setCombos(resetCombos);
      setSelected([]);
      setLastMixedCombo(null);
      setShowDuplicateWarning(null);
      setShowCelebration(false);
    }
  };

  const totalFound = combos.filter((c) => c.found).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-4 py-8"
      id="icecream-container"
    >
      {/* Title section */}
      <div className="mb-8" id="icecream-header">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <span className="text-pink-500">🍦</span> 아이스크림 조합 메이커
            </h1>
            <p className="text-slate-600 mt-1">
              4가지 토핑(딸기, 초콜릿, 바나나, 민트) 중에서 순서 상관없이 <strong className="text-pink-600">2가지를 선택(4C2)</strong>하여 아이스크림을 만들어 보세요.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setExplainHelp(!explainHelp)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors font-medium flex items-center gap-1.5 shadow-sm text-sm"
              id="btn-explain-math"
            >
              <HelpCircle className="w-4 h-4 text-slate-600" />
              수학적 해설 보기
            </button>
            <button
              onClick={resetAll}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors font-medium flex items-center gap-1.5 border border-rose-200 shadow-sm text-sm"
              id="btn-reset-maker"
            >
              <RotateCcw className="w-4 h-4" />
              기록 초기화
            </button>
          </div>
        </div>

        {/* Explain helper animation block */}
        <AnimatePresence>
          {explainHelp && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-4"
              id="math-explain-box"
            >
              <div className="p-5 bg-gradient-to-r from-pink-500/10 to-orange-500/10 rounded-2xl border border-pink-100">
                <h3 className="font-bold text-slate-800 text-base mb-2">💡 왜 총 조합의 수가 6개일까요?</h3>
                <div className="text-sm text-slate-700 space-y-2 leading-relaxed">
                  <p>
                    수학에서 순서 없이 4개 중 2개를 고르는 것을 <strong>조합(Combination)</strong>이라고 하며, 기호로 <strong><sub>4</sub>C<sub>2</sub></strong>라 씁니다.
                  </p>
                  <p className="font-mono bg-white/80 px-4 py-2 rounded-lg inline-block border border-pink-200 font-semibold text-pink-700">
                    <sub>4</sub>C<sub>2</sub> = (4 × 3) / (2 × 1) = 12 / 2 = 6가지
                  </p>
                  <p>
                    만약 <em>순서가 중요했다면(순열, <sub>4</sub>P<sub>2</sub>)</em> &quot;딸기 먼저 올리고 초콜릿 올리기&quot;와 &quot;초콜릿 먼저 올리고 딸기 올리기&quot;를 다른 것으로 세어 총 12가지가 되었을 것입니다. 
                    하지만 컵에 올려 뒤섞는 아이스크림에서는 두 종류의 토핑이 결국 같아지므로, 순서의 수인 2! (2 × 1)으로 나누어 정확히 <strong>6가지</strong> 조합이 탄생합니다!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main interactive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="icecream-game-grid">
        
        {/* Left Side: Topping Selector & Mixer (8 cols) */}
        <div className="lg:col-span-7 space-y-6" id="left-game-area">
          {/* Card: SELECTOR */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
              토핑을 2가지 골라 보세요
            </h2>
            <div className="grid grid-cols-2 shadow-xs gap-3" id="topping-button-grid">
              {TOPPINGS.map((topping) => {
                const isSelected = selected.some((t) => t.id === topping.id);
                return (
                  <button
                    key={topping.id}
                    disabled={isMixing}
                    onClick={() => handleSelectTopping(topping)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-300 relative flex items-center justify-between ${topping.color} ${
                      isSelected
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20 scale-[1.02] font-bold shadow-md'
                        : 'border-slate-150 grayscale-20 hover:grayscale-0 hover:scale-[1.01]'
                    }`}
                    id={`topping-select-${topping.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl select-none" id={`emoji-${topping.id}`}>{topping.emoji}</span>
                      <span className="text-base font-semibold">{topping.name.split(' ')[0]}</span>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white" id={`checked-${topping.id}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Hint message */}
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500" id="topping-count-hint">
              <span>현재 선택된 토핑 수: <strong>{selected.length}</strong> / 2개</span>
              {selected.length === 2 && (
                <span className="text-indigo-600 font-semibold animate-pulse">🍦 조합하기 버튼을 누를 수 있습니다!</span>
              )}
            </div>
          </div>

          {/* Card: MIXING TUMBLER */}
          <div className="bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden" id="mixing-station">
            
            {/* Visual mixing beaker */}
            <div className="relative w-48 h-52 border-4 border-slate-300 rounded-b-[40px] rounded-t-lg bg-white shadow-inner flex flex-col justify-end p-4 overflow-hidden" id="icecream-beaker">
              
              {/* Mixing details */}
              <AnimatePresence>
                {/* Visual swirling liquid or soft colors if mixing */}
                {isMixing && mixingStep >= 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-tr from-rose-200 via-yellow-100 to-teal-100 animate-spin"
                    style={{ borderRadius: 'inherit', animationDuration: '3s' }}
                    id="mixing-swirl-liquid"
                  />
                )}
              </AnimatePresence>

              {/* Inside beaker: Selected toppings */}
              <div className="flex flex-col gap-2 items-center justify-center w-full h-full z-10" id="beaker-contents">
                {selected.length === 0 && !isMixing && (
                  <div className="text-center text-slate-400 p-2" id="beaker-empty-state">
                    <p className="text-3xl mb-2">🥣</p>
                    <p className="text-xs">토핑을 선택하면<br />컵에 담깁니다.</p>
                  </div>
                )}

                {/* Topping 1 sliding down */}
                {selected.length >= 1 && (
                  <motion.div
                    key={selected[0].id}
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 120 }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${selected[0].color}`}
                    id="falling-topping-1"
                  >
                    <span>{selected[0].emoji}</span>
                    <span>{selected[0].name.split(' ')[0]}</span>
                  </motion.div>
                )}

                {/* Topping 2 sliding down */}
                {selected.length === 2 && (
                  <motion.div
                    key={selected[1].id}
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 120, delay: 0.1 }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${selected[1].color}`}
                    id="falling-topping-2"
                  >
                    <span>{selected[1].emoji}</span>
                    <span>{selected[1].name.split(' ')[0]}</span>
                  </motion.div>
                )}

                {/* Mixer text badge */}
                {isMixing && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                    className="absolute bg-indigo-600 text-white rounded-lg px-3 py-1 text-xs font-bold shadow-md z-20"
                    id="mixing-text-badge"
                  >
                    {mixingStep === 1 ? '🎨 토핑 쏟아붓는 중...' : '🌀 마법처럼 위아래로 섞는 중...'}
                  </motion.div>
                )}
              </div>

              {/* Bottom decorative ice cream scoop base */}
              <div className="w-full h-6 bg-amber-200 border-t border-amber-300 rounded-b-[24px]"></div>
            </div>

            {/* Controls */}
            <div className="mt-6 w-full max-w-sm" id="mixing-beaker-controls">
              <button
                disabled={selected.length !== 2 || isMixing}
                onClick={handleMix}
                className={`w-full py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ring-2 ring-offset-2 ${
                  selected.length === 2 && !isMixing
                    ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:from-pink-600 hover:to-orange-600 ring-pink-500/20 shadow-lg scale-[1.01]'
                    : 'bg-slate-200 text-slate-400 border-slate-300 ring-transparent cursor-not-allowed'
                }`}
                id="btn-mix-toppings"
              >
                {isMixing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>달콤함 믹싱 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <span>아이스크림 조합하기 🍦</span>
                  </>
                )}
              </button>
            </div>

            {/* Results Display Area */}
            <div className="mt-4 h-12 w-full flex items-center justify-center text-center px-4" id="mixing-alert-container">
              {showDuplicateWarning && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-amber-50 border border-amber-200 rounded-lg p-2 flex items-center gap-2 text-xs font-bold text-amber-800"
                  id="duplicate-warning-box"
                >
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{showDuplicateWarning}</span>
                </motion.div>
              )}

              {lastMixedCombo && !showDuplicateWarning && !isMixing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center gap-2 text-xs text-emerald-800 font-semibold"
                  id="success-mix-box"
                >
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                  <span>
                    🎉 발견 성공! <strong>{lastMixedCombo.toppings[0].emoji} {lastMixedCombo.toppings[0].name.split(' ')[0]} + {lastMixedCombo.toppings[1].emoji} {lastMixedCombo.toppings[1].name.split(' ')[0]}</strong> 조합 완성을 축하합니다!
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Collection Checklist (5 cols) */}
        <div className="lg:col-span-5" id="right-game-area">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-full flex flex-col justify-between" id="collection-checklist-card">
            <div>
              <div className="flex justify-between items-center mb-4" id="collection-checklist-header">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-500" />
                  실험실 조합 도감 (Chamber)
                </h2>
                <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full border border-indigo-150">
                  {totalFound} / 6 발견
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6 overflow-hidden" id="progress-bar-container">
                <div
                  className="bg-gradient-to-r from-pink-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(totalFound / 6) * 105}%` }}
                />
              </div>

              {/* Checklist list */}
              <div className="space-y-2.5" id="combinations-checklist">
                {combos.map((combo) => {
                  return (
                    <div
                      key={combo.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                        combo.found
                          ? 'border-emerald-100 bg-emerald-50/50 text-slate-800'
                          : 'border-slate-150 bg-slate-50 text-slate-400'
                      }`}
                      id={`checklist-item-${combo.id}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                            combo.found ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-400'
                          }`}
                        >
                          {combo.found ? '✓' : '?'}
                        </div>
                        <div className="flex items-center gap-1.5" id={`labels-${combo.id}`}>
                          {combo.found ? (
                            <>
                              <span className="text-lg">{combo.toppings[0].emoji}</span>
                              <span className="text-sm font-semibold">{combo.toppings[0].name.split(' ')[0]}</span>
                              <span className="text-slate-400 font-light">+</span>
                              <span className="text-lg">{combo.toppings[1].emoji}</span>
                              <span className="text-sm font-semibold">{combo.toppings[1].name.split(' ')[0]}</span>
                            </>
                          ) : (
                            <span className="text-sm font-medium tracking-wide text-slate-400 italic">
                              미확인 아이스크림 레시피
                            </span>
                          )}
                        </div>
                      </div>

                      {combo.found ? (
                        <span className="text-[10px] font-mono text-slate-400 bg-white border border-slate-150 px-1.5 py-0.5 rounded">
                          성공!
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400">발견 대기</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Education Footer box */}
            <div className="mt-8 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-500 leading-relaxed" id="combo-footer-note">
              <span className="font-bold text-slate-700 display-block mb-1">💡 탐구 포인트 :</span>
              {'딸기와 민트를 섞어 만드는 레시피는 순서에 상관없이 하나의 가짓수로 셉니다. 똑같이 4개에서 2개를 고르는 조합의 가치, 즉 '}
              <strong className="text-slate-700"><sub>4</sub>C<sub>2</sub></strong>는 항상 빈틈없이 정확한 <strong>6가지</strong>만이 존재함을 확인하십시오.
            </div>
          </div>
        </div>

      </div>

      {/* MODAL: Celebration Modal when completed 6/6 combinations */}
      <AnimatePresence>
        {showCelebration && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto" id="celebration-modal-overlay">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full text-center border-4 border-amber-300 shadow-2xl relative"
              id="celebration-modal"
            >
              {/* Confetti decoration circles */}
              <div className="absolute top-4 left-4 text-3xl animate-bounce">🎈</div>
              <div className="absolute top-4 right-4 text-3xl animate-bounce delay-100">🎉</div>
              <div className="absolute bottom-4 left-4 text-3xl animate-bounce delay-200">✨</div>
              <div className="absolute bottom-4 right-4 text-3xl animate-bounce delay-150">🥳</div>

              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-lg">
                🏆
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
                축하합니다! 도감 완성! 🎉
              </h2>
              <p className="text-sm font-semibold text-pink-600 mb-6">
                6가지의 모든 아이스크림 조합을 남김없이 찾아냈습니다!
              </p>

              {/* Formula Panel inside modal */}
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-200 text-left space-y-3 mb-6" id="cele-formula-panel">
                <h3 className="font-bold text-orange-950 text-sm flex items-center gap-1.5">
                  📐 4C2 = 6 공식 완전 분석
                </h3>
                <p className="text-xs text-orange-900 leading-relaxed">
                  4가지 토핑 중 2가지를 뽑는 경우의 수:
                </p>
                
                {/* Visual mathematical grid showing the proof */}
                <div className="bg-white rounded-xl p-3 border border-orange-100 flex items-center justify-center" id="math-proof">
                  <div className="font-mono text-center">
                    <span className="text-xs text-slate-400">조합 공식 (nCr)</span>
                    <div className="text-lg font-extrabold text-orange-600 mt-0.5">
                      <sub>4</sub>C<sub>2</sub> = <div className="inline-flex flex-col align-middle text-center mx-1"><span className="border-b border-orange-400 pb-0.5 px-1 font-bold"><sub>4</sub>P<sub>2</sub></span><span className="pt-0.5 font-bold">2!</span></div> = <div className="inline-flex flex-col align-middle text-center mx-1"><span className="border-b border-orange-400 pb-0.5 px-1 font-bold">4 × 3</span><span className="pt-0.5 font-bold">2 × 1</span></div> = <span className="font-extrabold text-indigo-600 text-xl ml-1">6</span>
                    </div>
                  </div>
                </div>

                <ul className="text-xs text-orange-900 list-disc pl-4 space-y-1">
                  <li><strong>분자 (<sub>4</sub>P<sub>2</sub> = 12):</strong> 철저히 순서를 따져 첫 번째 토핑과 두 번째 토핑을 고르는 순열 가짓수</li>
                  <li><strong>분모 (2! = 2):</strong> {`딸기-초코, 초코-딸기 기하 순서쌍과 같이 순서가 뒤집힌 두 조합이 실제론 '동일한 맛'이므로 중복을 정화하기 위한 인자`}</li>
                  <li>결과적으로, 순서 구분을 완전히 지운 <strong>6가지 고유 조합</strong>만이 남습니다.</li>
                </ul>
              </div>

              <div className="flex gap-3 justify-center" id="cele-actions">
                <button
                  onClick={() => setShowCelebration(false)}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-semibold shadow-md transition-colors"
                  id="btn-close-cele"
                >
                  기념 닫기
                </button>
                <button
                  onClick={() => {
                    const resetCombos = INITIAL_COMBOS();
                    setCombos(resetCombos);
                    setSelected([]);
                    setLastMixedCombo(null);
                    setShowCelebration(false);
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white rounded-xl text-sm font-semibold shadow-md transition-all"
                  id="btn-retry-make"
                >
                  처음부터 다시하기 🔁
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
