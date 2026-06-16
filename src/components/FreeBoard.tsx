import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, Trash2, Search, Smile, Sparkles, User, AlertCircle } from 'lucide-react';
import { Post } from '../types';

const INITIAL_POSTS: Post[] = [
  {
    id: ' Euler-123',
    name: '오일러와피자 🍕',
    content: '피자가 둥근 이유는 원의 넓이가 πr²이기 때문입니다! 만약 반지름이 r 대신 z이고 높이가 a인 피자라면 부피는 pi * z * z * a (pizza)가 되겠네요! 다들 알고 계셨나요? 😋',
    timestamp: Date.now() - 3600000 * 48,
  },
  {
    id: 'Math-Ghost-456',
    name: '방정식빌런 👻',
    content: '공통수학1 경우의 수 단원을 복습하다 보니, 매일 아침 옷장에서 상의 3개 중 1개, 하의 4개 중 1개를 골라입는 것도 곱의 법칙(3 × 4 = 12가지)이라는 걸 깨달았어요. 일상이 전부 수학이었네요!',
    timestamp: Date.now() - 3600000 * 20,
  },
  {
    id: 'IceCream-Lover-789',
    name: '민초단대장 🌿',
    content: '아이스크림 메이커 다 깼는데 공식설명이 정말 직관적이네요!! 4C2가 대충 6인 걸 외우기만 했지, 순열에서 중복 순서쌍(2!)을 상쇄하는 나누기를 해서 공식을 유도한다는 걸 시뮬레이터로 머리에 직접 새겼습니다.',
    timestamp: Date.now() - 3600000 * 3,
  },
];

export default function FreeBoard() {
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('math_portal_posts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_POSTS;
      }
    }
    return INITIAL_POSTS;
  });

  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('math_portal_posts', JSON.stringify(posts));
  }, [posts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showNotice('작성자 이름을 입력해 주세요!');
      return;
    }
    if (!content.trim()) {
      showNotice('내용을 최소 2자 이상 입력해 주세요!');
      return;
    }

    const newPost: Post = {
      id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      content: content.trim(),
      timestamp: Date.now(),
    };

    setPosts([newPost, ...posts]);
    setName('');
    setContent('');
    showNotice('의견이 성공적으로 등록되었습니다! 📝');
  };

  const handleDeletePost = (id: string) => {
    if (confirm('이 게시글을 정말로 삭제하시겠습니까?')) {
      setPosts(posts.filter((p) => p.id !== id));
      showNotice('게시글이 삭제되었습니다.');
    }
  };

  const handleClearAll = () => {
    if (confirm('주의: 모든 게시글 데이터를 초기화하고 기본 샘플로 복구할까요? 원하시는 경우 확인을 클릭하세요.')) {
      setPosts(INITIAL_POSTS);
      showNotice('기본 샘플 데이터로 복구되었습니다.');
    }
  };

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const formatDateTime = (timestamp: number) => {
    const d = new Date(timestamp);
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hr = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${yr}-${mo}-${day} ${hr}:${min}`;
  };

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const text = searchTerm.toLowerCase();
    return (
      post.name.toLowerCase().includes(text) ||
      post.content.toLowerCase().includes(text)
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-4 py-8"
      id="board-page-container"
    >
      {/* Title block */}
      <div className="mb-8" id="board-header">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <span className="text-emerald-500">📝</span> 자유 소통 게시판
            </h1>
            <p className="text-slate-600 mt-1">
              학습 피드백, 재미있는 수학 고찰, 질문 등을 자유롭게 등록해 주세요. 데이터는 웹 브라우저(`localStorage`)에 보존됩니다.
            </p>
          </div>
          <div>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors font-semibold flex items-center gap-1.5 border border-rose-200 shadow-sm text-xs"
              id="btn-board-reset-all"
            >
              <Trash2 className="w-4 h-4 text-rose-500" />
              게시판 초기화 (샘플 복구)
            </button>
          </div>
        </div>
      </div>

      {/* Main Board content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="board-layout">
        
        {/* Left Form Panel: 5 cols */}
        <div className="lg:col-span-5" id="board-input-panel">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-6" id="post-creator-card">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Smile className="w-5 h-5 text-emerald-500 animate-bounce" />
              새 글 작성하기
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4" id="post-editor-form">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">작성자 닉네임</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="수학을 사랑하는 학생..."
                    maxLength={15}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all font-semibold"
                    id="input-post-name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">한마디 내용</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="의견을 자유롭게 작성해 주세요. (수학 유머, 질문, 공부 팁 등)"
                  rows={5}
                  maxLength={400}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all leading-relaxed"
                  id="input-post-content"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md hover:shadow-lg scale-[1.01]"
                id="btn-submit-post"
              >
                <Send className="w-4 h-4" />
                의견 남기기 📝
              </button>
            </form>

            {/* Notification message popup inside selector container */}
            <AnimatePresence>
              {notification && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1.5"
                  id="board-alert-notif"
                >
                  <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{notification}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right List Panel: 7 cols */}
        <div className="lg:col-span-7 flex flex-col gap-4" id="board-posts-panel">
          
          {/* Post Filter bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex items-center gap-2 px-4" id="board-search-bar">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="작성자 또는 게시물 내용으로 검색..."
              className="w-full bg-transparent border-none text-sm outline-hidden text-slate-700 font-medium placeholder-slate-400"
              id="input-board-search"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold px-1.5 py-0.5 rounded-md hover:bg-slate-100"
                id="btn-clear-search"
              >
                Clear
              </button>
            )}
          </div>

          {/* Posts list container */}
          <div className="space-y-4" id="board-feed">
            <AnimatePresence mode="popLayout">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => {
                  // Generate custom avatars based on characters inside the name
                  const initialLetter = post.name.charAt(0);
                  const avatarColors = [
                    'bg-slate-700', 'bg-blue-600', 'bg-emerald-600', 'bg-pink-600', 'bg-amber-600', 'bg-purple-600', 'bg-teal-600'
                  ];
                  // Compute a simple hash to select flavor color
                  const hash = post.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                  const colorClass = avatarColors[hash % avatarColors.length];

                  return (
                    <motion.div
                      layout
                      key={post.id}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex gap-4"
                      id={`feed-item-${post.id}`}
                    >
                      {/* Name Avatar bubble */}
                      <div className={`w-10 h-10 rounded-full text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-sm ${colorClass}`}>
                        {initialLetter}
                      </div>

                      {/* Content panel */}
                      <div className="flex-1 space-y-2 leading-relaxed" id={`feed-content-box-${post.id}`}>
                        <div className="flex justify-between items-start" id={`feed-item-header-${post.id}`}>
                          <div>
                            <span className="font-bold text-slate-800 text-sm block">
                              {post.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium font-mono">
                              {formatDateTime(post.timestamp)}
                            </span>
                          </div>

                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-1.5 text-slate-350 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="게시물 삭제"
                            id={`btn-delete-${post.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed" id={`feed-text-${post.id}`}>
                          {post.content}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-400" id="feed-empty-state">
                  <AlertCircle className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-semibold">검색 조건과 일치하는 글이 없습니다.</p>
                  <p className="text-xs text-slate-400 mt-1">다른 키워드를 검색하거나, 멋진 수학적 생각을 맨 먼저 남겨보세요!</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
