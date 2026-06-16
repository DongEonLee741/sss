import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Users, Play, Pause, RotateCcw, Sparkles, Plus, Minus, Shuffle, Trash2, Check, AlertTriangle } from 'lucide-react';

const DEFAULT_STUDENTS = '김철수, 이영희, 박선우, 최민지, 정하늘, 윤동현, 강혜린, 송준우, 한소희, 홍길동';

export default function ClassroomTools() {
  // --- TIMER STATE CONTROL ---
  const [minutes, setMinutes] = useState<number>(3);
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [totalInitialSeconds, setTotalInitialSeconds] = useState<number>(180);
  const [timeLeft, setTimeLeft] = useState<number>(180);
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync timeLeft when input changes while timer is non-active
  useEffect(() => {
    if (!isActive) {
      const calculated = minutes * 60 + seconds;
      setTimeLeft(calculated);
      setTotalInitialSeconds(calculated);
    }
  }, [minutes, seconds, isActive]);

  // Handle timer tick interval
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsActive(false);
            setIsTimeUp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const handleStartPause = () => {
    if (timeLeft <= 0) return;
    setIsActive(!isActive);
    setIsTimeUp(false);
  };

  const handleResetTimer = () => {
    setIsActive(false);
    const calculated = minutes * 60 + seconds;
    setTimeLeft(calculated);
    setIsTimeUp(false);
  };

  const setQuickTime = (mins: number) => {
    setIsActive(false);
    setMinutes(mins);
    setSeconds(0);
    setTimeLeft(mins * 60);
    setTotalInitialSeconds(mins * 60);
    setIsTimeUp(false);
  };

  const formatTime = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- STUDENT SELECTOR STATE CONTROL ---
  const [rawNames, setRawNames] = useState<string>(DEFAULT_STUDENTS);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [rollingName, setRollingName] = useState<string>('');
  const [winner, setWinner] = useState<string | null>(null);

  // Parse names properly (split by comma, whitespace, or newlines)
  const getCandidateList = (): string[] => {
    return rawNames
      .split(/[,;\n\s]+/)
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
  };

  const handleDrawStudent = () => {
    const list = getCandidateList();
    if (list.length === 0) {
      alert('추첨할 학생의 이름을 입력해 주세요!');
      return;
    }

    setIsRolling(true);
    setWinner(null);

    let rollingCount = 0;
    const maxRolls = 15;
    const intervalTime = 100; // ms

    const triggerRoll = () => {
      const randomIndex = Math.floor(Math.random() * list.length);
      setRollingName(list[randomIndex]);
      rollingCount++;

      if (rollingCount < maxRolls) {
        setTimeout(triggerRoll, intervalTime + rollingCount * 12); // slow down effect
      } else {
        const finalWinnerIndex = Math.floor(Math.random() * list.length);
        const finalWinner = list[finalWinnerIndex];
        setWinner(finalWinner);
        setIsRolling(false);
      }
    };

    triggerRoll();
  };

  // Helper to remove winner from list
  const handleRemoveWinner = () => {
    if (!winner) return;
    const list = getCandidateList();
    const updated = list.filter((n) => n !== winner);
    setRawNames(updated.join(', '));
    setWinner(null);
  };

  // Timer helper values
  const progressPercentage = totalInitialSeconds > 0 ? (timeLeft / totalInitialSeconds) * 105 : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-4 py-8"
      id="classroom-tools-page"
    >
      {/* Page Header */}
      <div className="mb-8" id="tools-header">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
          <span className="text-amber-500">🛠️</span> 고효율 디지털 수업 도구
        </h1>
        <p className="text-slate-600 mt-1">
          수업 운영 시 즉시 활용할 수 있는 직관적인 집중력 모둠 타이머와 제비뽑기 추첨기입니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="tools-layout-grid">
        
        {/* LEFT CARD: CLASSROOM TIMER */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between" id="timer-tool-card">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Timer className="w-5 h-5 text-indigo-500" />
              1. 집중력 모둠 타이머 (Timer)
            </h2>

            {/* Timer visual layout screen */}
            <div
              className={`p-6 rounded-2xl border flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden ${
                isTimeUp
                  ? 'border-red-400 bg-red-50/50 animate-pulse'
                  : isActive
                  ? 'border-indigo-200 bg-indigo-50/10'
                  : 'border-slate-150 bg-slate-50/30'
              }`}
              id="timer-plate"
            >
              {/* Circular progress background */}
              <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
                <div
                  className="w-56 h-56 rounded-full border-8 border-indigo-600 transition-all duration-500"
                  style={{ transform: `scale(${timeLeft / (totalInitialSeconds || 1)})` }}
                />
              </div>

              {/* Digital countdown */}
              <div className="text-6xl font-extrabold font-mono text-slate-800 tabular-nums z-10" id="digital-clock">
                {formatTime(timeLeft)}
              </div>

              {isTimeUp && (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="text-red-600 font-bold text-sm mt-3 flex items-center gap-1 bg-white border border-red-200 px-3 py-1 rounded-full shadow-sm z-10"
                  id="time-up-warning-label"
                >
                  <AlertTriangle className="w-4 h-4 animate-bounce" />
                  <span>시간이 다 되었습니다! 모둠 토의를 멈춰주세요. ⏳</span>
                </motion.div>
              )}

              {/* Time setter interface if NOT running */}
              {!isActive && (
                <div className="mt-4 flex items-center gap-4 z-10 bg-white/80 p-2 py-1.5 rounded-xl border border-slate-200 shadow-xs" id="time-setter-controls">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setMinutes((m) => Math.max(0, m - 1))}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-mono text-slate-700 w-12 text-center font-bold">
                      {minutes}분
                    </span>
                    <button
                      onClick={() => setMinutes((m) => m + 1)}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-slate-300">|</span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSeconds((s) => (s >= 10 ? s - 10 : 50))}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-mono text-slate-700 w-12 text-center font-bold">
                      {seconds}초
                    </span>
                    <button
                      onClick={() => setSeconds((s) => (s < 50 ? s + 10 : 0))}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Presets Buttons */}
            <div className="mt-4" id="presets-container">
              <span className="text-xs font-bold text-slate-500 block mb-2">⏱️ 수업 전용 퀵 추천 시간</span>
              <div className="grid grid-cols-4 gap-2" id="quick-time-buttons-grid">
                {[1, 3, 5, 10].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setQuickTime(mins)}
                    className="p-2 border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-705 transition-colors shadow-xs"
                    id={`quick-set-${mins}m`}
                  >
                    {mins}분
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons footer */}
          <div className="mt-8 grid grid-cols-2 gap-4" id="timer-action-buttons">
            <button
              onClick={handleStartPause}
              className={`py-3 px-5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-all text-sm select-none ${
                isActive
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
              id="btn-control-timer"
            >
              {isActive ? (
                <>
                  <Pause className="w-4.5 h-4.5" />
                  <span>일시정지</span>
                </>
              ) : (
                <>
                  <Play className="w-4.5 h-4.5" />
                  <span>시작하기</span>
                </>
              )}
            </button>

            <button
              onClick={handleResetTimer}
              className="py-3 px-5 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-2 border border-slate-200 transition-colors text-sm"
              id="btn-reset-timer"
            >
              <RotateCcw className="w-4.5 h-4.5" />
              <span>타이머 정돈</span>
            </button>
          </div>
        </div>

        {/* RIGHT CARD: STUDENT SELECTOR */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between" id="selector-tool-card">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Users className="w-5 h-5 text-indigo-500" />
              2. 무작위 학생 제비뽑기 (Selector)
            </h2>

            {/* Candidates raw input area */}
            <div className="flex flex-col gap-2" id="selector-input-area">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500">지목 후보 명단 (띄어쓰기 또는 쉼표 구분)</span>
                <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
                  {getCandidateList().length}명 감지됨
                </span>
              </div>

              <textarea
                value={rawNames}
                disabled={isRolling}
                onChange={(e) => setRawNames(e.target.value)}
                placeholder="학생 이름을 작성해 주세요..."
                className="w-full p-3 border border-slate-200 rounded-xl text-sm font-sans focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-h-[140px] resize-none leading-relaxed"
                id="student-names-textarea"
              />

              <div className="flex justify-end" id="draw-helper-actions">
                <button
                  disabled={isRolling}
                  onClick={() => setRawNames('')}
                  className="text-xs text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1 p-1 bg-white hover:bg-rose-50 border border-slate-100 shadow-sm rounded-lg"
                  id="btn-clear-names"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  비우기
                </button>
              </div>
            </div>

            {/* Animated Rolling Selector Screen */}
            <div className="mt-4" id="rolling-playground">
              <AnimatePresence mode="wait">
                {isRolling && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-6 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 rounded-2xl border border-orange-200 text-center flex flex-col items-center justify-center"
                    id="rolling-screen"
                  >
                    <Shuffle className="w-8 h-8 text-orange-500 animate-spin mb-2" />
                    <span className="text-xl font-extrabold text-slate-800 tracking-wider">
                      {rollingName}
                    </span>
                    <span className="text-xs text-slate-400 mt-2">지목 후보들의 대열을 무작위 셔플링 중...</span>
                  </motion.div>
                )}

                {winner && !isRolling && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 text-center flex flex-col items-center justify-center shadow-lg relative"
                    id="winner-announce-card"
                  >
                    <div className="absolute top-2 right-2 text-2xl animate-bounce">👑</div>
                    <div className="text-xs font-bold text-indigo-600 flex items-center gap-1.5 mb-1 bg-white px-2.5 py-0.5 rounded-full border border-indigo-150">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
                      축하합니다! 오늘의 당첨자
                    </div>
                    <div className="text-3xl font-extrabold text-indigo-950 my-2 tracking-wide text-center" id="winner-name">
                      ✨ {winner} ✨
                    </div>

                    <div className="flex gap-2 mt-4" id="winner-action-buttons-box">
                      <button
                        onClick={handleRemoveWinner}
                        className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors border border-rose-200 shadow-xs"
                        id="btn-exclude-winner"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        명단에서 제외하기
                      </button>
                      <button
                        onClick={() => setWinner(null)}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
                        id="btn-dismiss-winner"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        확인 완료
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Action buttons footer */}
          <div className="mt-8" id="selector-footer-action">
            <button
              disabled={isRolling || getCandidateList().length === 0}
              onClick={handleDrawStudent}
              className={`w-full py-4.5 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 select-none text-base transition-all duration-350 shadow-md ${
                isRolling || getCandidateList().length === 0
                  ? 'bg-slate-200 text-slate-400 border-slate-300 ring-transparent cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white hover:scale-[1.01] ring-2 ring-orange-500/20 cursor-pointer'
              }`}
              id="btn-pick-student"
            >
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span>추첨하기! 🎉</span>
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
