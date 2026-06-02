/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

function useAnimatedNumber(targetValue: number, duration: number = 800) {
  const [currentValue, setCurrentValue] = useState(targetValue);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = currentValue;

    if (startValue === targetValue) return;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // 부드러운 감속 곡선 (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const nextValue = Math.floor(startValue + (targetValue - startValue) * easeProgress);
      
      setCurrentValue(nextValue);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCurrentValue(targetValue);
      }
    };

    const animFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animFrame);
  }, [targetValue, duration]);

  return currentValue;
}
import { 
  Ticket, 
  CheckCircle2, 
  Users, 
  Clock, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  X, 
  Trophy, 
  Gift, 
  TrendingUp, 
  Smartphone,
  Info,
  Plane,
  CreditCard,
  Coffee,
  ShoppingBag,
  Coins,
  Plus,
  Minus,
  Sparkles,
  Flame,
  HelpCircle,
  Calendar,
  Share2,
  Menu
} from 'lucide-react';

const getPrizeIcon = (id: string) => {
  switch (id) {
    case 'p1': return <Plane className="w-6 h-6" />;
    case 'p2': return <TrendingUp className="w-6 h-6" />;
    case 'p3': return <Smartphone className="w-6 h-6" />;
    case 'p4': return <CreditCard className="w-6 h-6" />;
    case 'p5': return <Coffee className="w-6 h-6" />;
    case 'p6': return <ShoppingBag className="w-6 h-6" />;
    case 'p7': return <Coins className="w-6 h-6" />;
    default: return <Gift className="w-6 h-6" />;
  }
};
import { Mission, Prize, UserStatus } from './types';

// Mock Data
const INITIAL_MISSIONS: Mission[] = [
  { id: '1', title: '투혼 딜리버리', condition: '매일 출석 체크', tickets: 1, status: 'completed' },
  { id: '2', title: '신규 계좌 개설', condition: '최초 계좌 개설 완료하기', tickets: 5, status: 'available' },
  { id: '3', title: '앱 로그인', condition: 'MTS 앱 월 10회 이상 접속', tickets: 1, status: 'pending' },
  { id: '4', title: '투혼쇼핑', condition: '투혼 쇼핑몰 방문하기 (최대 30회)', tickets: 1, status: 'available' },
  { id: '5', title: '자산 규모 달성', condition: '평가 잔고 1천만 원 이상 유지', tickets: 5, status: 'pending' },
  { id: '6', title: '자산 규모 달성', condition: '평가 잔고 5천만 원 이상 유지', tickets: 15, status: 'available' },
  { id: '7', title: '국내 주식 거래', condition: '일일 국내 체결 500만원 이상', tickets: 3, status: 'pending' },
  { id: '8', title: '해외 주식 거래', condition: '일일 해외 체결 100만원 이상', tickets: 1, status: 'available' },
];

const PRIZES: Prize[] = [
  { 
    id: 'p1', 
    category: 'GRAND', 
    title: '해외여행 패키지 (동남아 2인)', 
    subtitle: '200만 원 상당 / 현금 대체 가능', 
    requiredTickets: 10, 
    benefit: '1명 당첨', 
    participants: 1204, 
    deadlineDays: 14 
  },
  { 
    id: 'p2', 
    category: 'GRAND', 
    title: '삼성전자 주식 100주', 
    subtitle: '시세 기준 / 이벤트 계좌 입고', 
    requiredTickets: 10, 
    benefit: '1명 당첨', 
    participants: 3421, 
    deadlineDays: 14 
  },
  { 
    id: 'p3', 
    category: 'LUCKY', 
    title: '애플 아이패드 (최신형)', 
    subtitle: '130만 원 상당', 
    requiredTickets: 5, 
    benefit: '3명 당첨', 
    participants: 8521, 
    deadlineDays: 7 
  },
  { 
    id: 'p4', 
    category: 'LUCKY', 
    title: 'MTS 수수료 무료권 (1년)', 
    subtitle: '국내 주식 수수료 무료', 
    requiredTickets: 3, 
    benefit: '3명 당첨', 
    participants: 5210, 
    deadlineDays: 7 
  },
  { 
    id: 'p6', 
    category: 'LUCKY', 
    title: '편의점 상품권',  
    subtitle: '3만 원권 (즉시 문자 발송)', 
    requiredTickets: 2, 
    benefit: '50명 당첨', 
    participants: 24532, 
    deadlineDays: 3 
  },
  { 
    id: 'p7', 
    category: 'LUCKY', 
    title: '포인트 3,000P 경품', 
    subtitle: '포인트 3,000P 경품응모신청', 
    requiredTickets: 1, 
    benefit: '500명 추첨', 
    participants: 48291, 
    deadlineDays: 3 
  },
];

export default function App() {
  const [user, setUser] = useState<UserStatus>({ name: '송아리', tickets: 5, points: 3000 });
  const [activeFooterTab, setActiveFooterTab] = useState('');

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Mission guide modal state
  const [showMissionGuideModal, setShowMissionGuideModal] = useState(false);

  // Custom Toast state and helpers
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'info' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('공유 링크가 클립보드에 복사되었습니다! 🔗', 'success');
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.position = 'fixed';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        showToast('공유 링크가 복사되었습니다! 🔗', 'success');
      } catch (fallbackErr) {
        showToast('링크 복사에 실패했습니다. 직접 공유해 주세요.', 'error');
      }
      document.body.removeChild(textArea);
    }
  };

  const handleShareEvent = async () => {
    const shareData = {
      title: '투혼 티켓 페스티벌 🎫',
      text: '스타벅스쿠폰, 아이폰15, 하와이 여행권까지! 친구야, 투혼 티켓 페스티벌 미션 완료하고 대박 경품에 응모해보자! 🎁',
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        showToast('이벤트가 성공적으로 공유되었습니다! 🎉', 'success');
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          copyToClipboard(shareData.url);
        }
      }
    } else {
      copyToClipboard(shareData.url);
    }
  };

  // Sparkle Animation state and effect for Ticket count increase
  const [showSparkle, setShowSparkle] = useState(false);
  const [sparkleKey, setSparkleKey] = useState(0);
  const [ticketDelta, setTicketDelta] = useState(0);
  const prevTicketsRef = useRef(user.tickets);

  useEffect(() => {
    if (user.tickets > prevTicketsRef.current) {
      setTicketDelta(user.tickets - prevTicketsRef.current);
      setShowSparkle(true);
      setSparkleKey(prev => prev + 1);
      const timer = setTimeout(() => {
        setShowSparkle(false);
      }, 1500);
      prevTicketsRef.current = user.tickets;
      return () => clearTimeout(timer);
    }
    prevTicketsRef.current = user.tickets;
  }, [user.tickets]);

  // Animated numbers for smooth counting up/down transition
  const animatedTickets = useAnimatedNumber(user.tickets, 800);
  const animatedPoints = useAnimatedNumber(user.points || 0, 800);
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);

  // Find Today's Recommended Mission (the uncompleted one with highest ticket efficiency)
  const recommendedMissionId = (() => {
    const uncompleted = missions.filter(m => m.status !== 'completed');
    if (uncompleted.length > 0) {
      return uncompleted.reduce((max, cur) => cur.tickets > max.tickets ? cur : max, uncompleted[0]).id;
    }
    // Fallback if all are completed, return the highest overall
    if (missions.length > 0) {
      return missions.reduce((max, cur) => cur.tickets > max.tickets ? cur : max, missions[0]).id;
    }
    return null;
  })();
  const [showHistory, setShowHistory] = useState(false);
  const [showDetailGuide, setShowDetailGuide] = useState(false);
  const [showAllPrizes, setShowAllPrizes] = useState(false);
  const [applyingPrizeId, setApplyingPrizeId] = useState<string | null>(null);
  const [history, setHistory] = useState<{ id: string; title: string; date: string }[]>([]);
  const [pointHistory, setPointHistory] = useState<{ id: string; title: string; amount: number; date: string; type: 'plus' | 'minus'; remark?: string }[]>([
    { id: 'pt1', title: '이벤트 가입 축하금', amount: 1000, date: '05/28 10:00', type: 'plus', remark: '자동 지급' },
    { id: 'pt2', title: '포인트 3,000P 지급 경품 당첨', amount: 3000, date: '06/01 09:15', type: 'plus', remark: '실시간 자동 지급' }
  ]);
  const [showPointStore, setShowPointStore] = useState(false);
  const [selectedStoreItem, setSelectedStoreItem] = useState<{
    id: string;
    title: string;
    cost: number;
    iconType: 'ticket' | 'stock' | 'coffee';
    description: string;
  } | null>(null);
  const [exchangeStatus, setExchangeStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [successCode, setSuccessCode] = useState<string>('');

  const [selectedApplyPrize, setSelectedApplyPrize] = useState<Prize | null>(null);
  const [applyStatus, setApplyStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [applyCode, setApplyCode] = useState<string>('');
  const [randomWinningAmount, setRandomWinningAmount] = useState<number>(0);
  const [applyQuantity, setApplyQuantity] = useState<number>(1);
  const [myAppliedTickets, setMyAppliedTickets] = useState<Record<string, number>>({
    p1: 2,
    p2: 0,
    p3: 5,
    p4: 1,
    p6: 3,
    p7: 0
  });

  const handleApply = (prize: Prize) => {
    setSelectedApplyPrize(prize);
    setApplyStatus('idle');
    setRandomWinningAmount(0);
    setApplyQuantity(user.tickets > 0 ? 1 : 0);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codeStr = 'TX-';
    for (let i = 0; i < 4; i++) {
      codeStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setApplyCode(codeStr);
  };

  const handleConfirmApply = () => {
    if (!selectedApplyPrize) return;

    if (user.tickets < applyQuantity || applyQuantity <= 0) {
      alert('응모권 수량이 부족하거나 올바르지 않습니다.');
      setSelectedApplyPrize(null);
      return;
    }

    setApplyStatus('processing');

    setTimeout(() => {
      // Trigger confetti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#fde047', '#ec4899', '#10b981']
      });

      setUser(prev => {
        const nextTickets = prev.tickets - applyQuantity;
        return {
          ...prev,
          tickets: nextTickets
        };
      });

      // Update myAppliedTickets count
      setMyAppliedTickets(prev => ({
        ...prev,
        [selectedApplyPrize.id]: (prev[selectedApplyPrize.id] || 0) + applyQuantity
      }));

      const now = new Date();
      const dateStr = `${now.getMonth() + 1}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      setHistory(prev => [
        { id: Math.random().toString(), title: `${selectedApplyPrize.title} (${applyQuantity}장 응모)`, date: dateStr },
        ...prev
      ]);

      setApplyStatus('success');
    }, 1500);
  };

  const handleMissionAction = (missionId: string) => {
    setMissions(prev => prev.map(m => {
      if (m.id === missionId) {
        if (m.status === 'pending') {
          // Simulate completing the mission
          alert('미션이 완료되었습니다! 응모권을 받으세요.');
          return { ...m, status: 'available' };
        }
        if (m.status === 'available') {
          // Claim the tickets
          setUser(u => ({ ...u, tickets: u.tickets + m.tickets }));
          alert(`${m.tickets}장의 응모권이 지급되었습니다!`);
          return { ...m, status: 'completed' };
        }
      }
      return m;
    }));
  };

  const handleExchangeClick = (productId: string, title: string, cost: number, iconType: 'ticket' | 'stock' | 'coffee', description: string) => {
    if ((user.points || 0) < cost) {
      alert('포인트가 부족합니다!');
      return;
    }

    setSelectedStoreItem({
      id: productId,
      title,
      cost,
      iconType,
      description
    });
    setExchangeStatus('idle');

    // Generate unique barcode values
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codeStr = '';
    for (let i = 0; i < 4; i++) {
      codeStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    codeStr += '-';
    for (let i = 0; i < 4; i++) {
      codeStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    codeStr += '-';
    for (let i = 0; i < 4; i++) {
      codeStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCouponCode(codeStr);
  };

  const [couponCode, setCouponCode] = useState<string>('');

  const handleConfirmExchange = () => {
    if (!selectedStoreItem) return;
    const { id, title, cost } = selectedStoreItem;

    if ((user.points || 0) < cost) {
      alert('포인트가 부족합니다!');
      setSelectedStoreItem(null);
      return;
    }

    setExchangeStatus('processing');

    setTimeout(() => {
      // Trigger confetti
      confetti({
        particleCount: 150,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#10b981', '#fde047', '#3b82f6']
      });

      setUser(prev => ({
        ...prev,
        points: (prev.points || 0) - cost,
        tickets: id === 'shop_ticket' ? prev.tickets + 1 : prev.tickets
      }));

      const now = new Date();
      const dateStr = `${now.getMonth() + 1}/${now.getDate()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      setPointHistory(prev => [
        {
          id: Math.random().toString(),
          title: `'${title}' 상품 교환`,
          amount: cost,
          date: dateStr,
          type: 'minus',
          remark: '포인트 상점 이용'
        },
        ...prev
      ]);

      setExchangeStatus('success');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-200 flex justify-center font-sans">
      <div className="w-full max-w-[480px] bg-slate-50 shadow-2xl min-h-screen relative overflow-hidden flex flex-col pb-0">
        {/* Header Banner */}
        <header className="relative bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 text-white pt-12 pb-24 overflow-hidden shrink-0">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-6 relative z-10"
        >
          <div className="flex flex-col items-center text-center">
            <motion.div
              animate={{ 
                rotate: [0, -5, 5, -5, 5, 0],
                y: [0, -10, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mb-6 relative"
            >
              <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-150" />
              <Ticket className="w-24 h-24 text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,0.5)]" />
            </motion.div>
            
            <h1 className="text-3xl md:text-4xl font-giants font-bold mb-2 tracking-tight text-white italic">투혼 티켓 페스티벌</h1>
            <p className="text-blue-100 mb-8 opacity-90 font-giants">미션을 완료하고 대박 경품의 주인공이 되세요!</p>
            
            {/* Status Card */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-blue-100 text-sm font-medium font-giants">나의 보유 현황</span>
                <button 
                  onClick={() => setShowHistory(true)}
                  className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                >
                  <span className="font-giants font-medium">내역 보기</span> <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              
              <div className="flex items-baseline gap-2 justify-center mb-5 font-giants">
                <span className="text-lg font-bold">{user.name}</span>
                <span className="text-sm opacity-80">고객님의 실시간 보유 자산</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-1">
                {/* Tickets Asset Button */}
                <div className={`bg-white/10 rounded-2xl p-4 border transition-all duration-500 text-center relative overflow-hidden group ${
                  showSparkle 
                    ? 'border-yellow-300 bg-white/20 scale-105 shadow-[0_0_20px_rgba(253,224,71,0.4)]' 
                    : 'border-white/10'
                }`}>
                  {/* Glowing Sweep effect when sparkling */}
                  {showSparkle && (
                    <motion.div 
                      key={`glow-sweep-${sparkleKey}`}
                      initial={{ x: '-150%', skewX: -15 }}
                      animate={{ x: '150%' }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/2 h-full z-10"
                    />
                  )}

                  <div className="text-[11px] text-blue-200 font-giants mb-1 flex items-center justify-center gap-1 relative z-10">
                    <Ticket className={`w-3.5 h-3.5 transition-transform duration-300 ${showSparkle ? 'text-yellow-200 scale-125 rotate-12' : 'text-yellow-300'}`} />
                    내 응모권
                  </div>
                  
                  <div className="text-3xl font-black text-yellow-300 font-giants relative z-10 flex items-center justify-center gap-0.5">
                    <span className="inline-block relative">
                      {animatedTickets}
                      {/* Floating dynamic numeric indicator (+X) */}
                      {showSparkle && (
                        <motion.span
                          key={`floating-delta-${sparkleKey}`}
                          initial={{ opacity: 0, y: 10, scale: 0.5 }}
                          animate={{ opacity: [0, 1, 1, 0], y: -26, scale: [0.8, 1.3, 1.3, 0.9] }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                          className="absolute -top-3.5 -right-6 text-[10px] font-black text-yellow-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] bg-amber-500/90 px-1 py-0.5 rounded leading-none"
                        >
                          +{ticketDelta > 0 ? ticketDelta : 1}
                        </motion.span>
                      )}
                    </span>
                    <span className="text-base ml-0.5 font-bold italic">장</span>
                  </div>

                  {/* Sparkle Particles Bursting Container */}
                  {showSparkle && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                      {Array.from({ length: 8 }).map((_, i) => {
                        const angle = (i * 45) + (Math.random() * 20 - 10);
                        const radius = 35 + Math.random() * 25;
                        const x = Math.cos((angle * Math.PI) / 180) * radius;
                        const y = Math.sin((angle * Math.PI) / 180) * radius - 15;
                        
                        return (
                          <motion.div
                            key={`sparkle-${sparkleKey}-${i}`}
                            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                            animate={{ 
                              x: x, 
                              y: y, 
                              opacity: [1, 1, 0], 
                              scale: [0.4, 1.0, 0],
                              rotate: [0, 180]
                            }}
                            transition={{ 
                              duration: 0.8 + Math.random() * 0.4, 
                              ease: "easeOut" 
                            }}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs select-none"
                          >
                            ⭐
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Points Asset Button */}
                <div className="bg-white/10 rounded-2xl p-4 border border-white/10 text-center relative overflow-hidden group">
                  <div className="text-[11px] text-blue-200 font-giants mb-1 flex items-center justify-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-emerald-300" />
                    내 포인트
                  </div>
                  <div className="text-3xl font-black text-emerald-300 font-giants">
                    <span>
                      {animatedPoints.toLocaleString()}
                    </span>
                    <span className="text-base ml-0.5 font-bold italic">P</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-blue-100/70 font-giants">※ 미션 달성 시 실시간 자동 반영 및 지급 완료</p>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full -ml-48 -mb-48 blur-3xl opacity-30" />
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 -mt-12 relative z-20 space-y-10">
        
        {/* Mission Section - Modern Bento Board */}
        <section id="missions-section" className="bg-white rounded-3xl shadow-xl p-6 border border-slate-100 mx-4">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-giants font-bold">응모권 모으기 미션</h2>
              <button
                onClick={() => setShowMissionGuideModal(true)}
                className="flex items-center gap-1 bg-indigo-50/70 hover:bg-indigo-100/80 text-[10px] font-bold text-indigo-600 px-2.5 py-1 rounded-full border border-indigo-100/30 transition-all active:scale-95 shrink-0"
              >
                <HelpCircle className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                <span>미션 기준 안내</span>
              </button>
            </div>
            <div className="flex bg-slate-50 px-3 py-1 rounded-full items-center gap-1.5 border border-slate-100">
              <span className="text-[9px] font-black text-indigo-500 font-giants italic">BOOST</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {missions.map((mission, index) => {
              const isLarge = index === 0 || index === 1; // First two missions are larger headers
              return (
                <motion.div 
                  key={mission.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => mission.status !== 'completed' && handleMissionAction(mission.id)}
                  className={`relative p-4 rounded-3xl border-2 transition-all cursor-pointer overflow-hidden flex flex-col justify-between min-h-[140px] group ${
                    mission.status === 'completed' 
                      ? 'bg-slate-50 border-slate-100 opacity-60' 
                      : recommendedMissionId === mission.id
                        ? 'border-amber-400 bg-gradient-to-br from-amber-50/70 to-white/95 shadow-[0_6px_20px_rgba(245,158,11,0.08)] ring-2 ring-amber-400/20'
                        : 'bg-white border-slate-50 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50'
                  } ${isLarge ? 'col-span-1' : 'col-span-1'}`}
                >
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <div className={`text-[10px] font-black font-giants italic px-2 py-0.5 rounded-lg ${
                        mission.status === 'completed' ? 'bg-indigo-100 text-indigo-600' : 
                        mission.status === 'available' ? 'bg-yellow-400 text-indigo-950' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {mission.status === 'completed' ? 'DONE' : mission.status === 'available' ? 'GET' : 'WAIT'}
                      </div>
                      {recommendedMissionId === mission.id && mission.status !== 'completed' && (
                        <span className="inline-flex items-center gap-0.5 text-[8px] font-black text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-md font-giants shrink-0 shadow-sm shadow-amber-100/50 animate-bounce">
                          <Sparkles className="w-2.5 h-2.5 text-amber-500 fill-current" />
                          오늘의 추천
                        </span>
                      )}
                    </div>
                    {mission.status === 'available' && (
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }} 
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-2 h-2 bg-red-500 rounded-full shrink-0" 
                      />
                    )}
                  </div>

                  {/* Mission Title & Simple Description */}
                  <div className="mb-4 flex-1">
                    <h3 className="font-bold text-slate-800 text-[13.5px] leading-snug font-giants line-clamp-1">
                      {mission.title}
                    </h3>
                    <p className="text-[10.5px] text-slate-400 font-giants font-medium mt-1 leading-snug line-clamp-2">
                      {mission.condition}
                    </p>
                  </div>

                  {/* Footer Info */}
                  <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                      <span className="text-[14px] font-black text-indigo-600 font-giants">+{mission.tickets}</span>
                      <span className="text-[8px] text-slate-400 font-medium">TICKETS</span>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      mission.status === 'completed' ? 'bg-indigo-600 text-white' : 
                      mission.status === 'available' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-300'
                    }`}>
                      {mission.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Subtle Background Pattern */}
                  {recommendedMissionId === mission.id && mission.status !== 'completed' ? (
                    <div className="absolute top-0 right-0 -mr-2 -mt-2 w-16 h-16 bg-amber-100/40 rounded-full blur-2xl group-hover:bg-amber-200/50 transition-colors" />
                  ) : (
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 w-12 h-12 bg-slate-50/50 rounded-full blur-2xl group-hover:bg-indigo-50/50 transition-colors" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Point History Section */}
        <section className="bg-white rounded-3xl shadow-xl p-6 border border-slate-100 mx-4">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center">
              <h2 className="text-lg font-giants font-bold">포인트 내역</h2>
            </div>
            <button
              onClick={() => setShowPointStore(!showPointStore)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold font-giants border transition-all active:scale-95 shadow-sm ${
                showPointStore
                  ? 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-100'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>포인트 사용처 {showPointStore ? '닫기' : '보기'}</span>
            </button>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
                <Coins className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 font-bold font-giants leading-none mb-1">TOTAL BALANCE</p>
                <p className="text-xs text-slate-500 leading-none truncate font-giants">누적 자동 지급 포인트</p>
              </div>
            </div>
            <div className="text-right whitespace-nowrap">
              <span className="text-xl font-black text-emerald-600 font-giants">{(user.points || 0).toLocaleString()} P</span>
            </div>
          </div>

          {/* Collapsible Point Store (Integrated Point Store) */}
          <AnimatePresence initial={false}>
            {showPointStore && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden mb-5 border-b border-dashed border-slate-100 pb-5"
              >
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold font-giants text-slate-700">🛒 포인트 백분 활용처</span>
                    <span className="text-[9px] font-black text-indigo-600 font-giants italic">EXCHANGE</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-4 font-giants leading-relaxed">
                    적립된 포인트는 아래 상품들로 <strong className="text-indigo-600">즉시 교환</strong>하여 유용하게 활용할 수 있습니다.
                  </p>

                  <div className="space-y-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    {/* Point Item 1: Ticket Booster */}
                    <div className="bg-white rounded-xl p-3 border border-slate-100 flex items-center justify-between group">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-indigo-950 font-black shadow-sm shrink-0">
                          <Ticket className="w-4 h-4 text-indigo-950" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-800 text-[11px] truncate">응모권 1장 즉시 충전</h4>
                          <p className="text-[9px] text-slate-400 mt-0.5 truncate">보유 포인트로 응모권을 즉시 추가 수령!</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <button
                          onClick={() => handleExchangeClick('shop_ticket', '응모권 1장 즉시 충전', 1000, 'ticket', '보유중인 누적 포인트를 사용해 즉시 원하는 실시간 경품에 도전할 수 있는 응모권 1장을 수령합니다. 교환 확정 시 응모권 수량이 실시간으로 +1 증가합니다.')}
                          disabled={(user.points || 0) < 1000}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black font-giants transition-all active:scale-95 ${
                            (user.points || 0) >= 1000 
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm' 
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          1,000 P
                        </button>
                      </div>
                    </div>

                    {/* Point Item 2: Stock Voucher */}
                    <div className="bg-white rounded-xl p-3 border border-slate-100 flex items-center justify-between group">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-black shadow-sm shrink-0 border border-emerald-100">
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-800 text-[11px] truncate">주식상품권 2,000원</h4>
                          <p className="text-[9px] text-slate-400 mt-0.5 truncate">계좌에 등록하여 주식 투자금액으로 사용</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <button
                          onClick={() => handleExchangeClick('shop_stock_voucher', '주식상품권 2,000원', 2000, 'stock', '2,000원의 주식매수 투자금액으로 예치됩니다.')}
                          disabled={(user.points || 0) < 2000}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black font-giants transition-all active:scale-95 ${
                            (user.points || 0) >= 2000 
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm' 
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          2,000 P
                        </button>
                      </div>
                    </div>

                    {/* Point Item 3: Coffee Coupon */}
                    <div className="bg-white rounded-xl p-3 border border-slate-100 flex items-center justify-between group">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 bg-amber-50 text-amber-700 rounded-lg flex items-center justify-center font-black shadow-sm shrink-0 border border-amber-100">
                          <Coffee className="w-4 h-4 text-amber-700" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-800 text-[11px] truncate">커피 교환권</h4>
                          <p className="text-[9px] text-slate-400 mt-0.5 truncate">등록된 휴대폰 번호로 모바일 쿠폰 발송</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <button
                          onClick={() => handleExchangeClick('shop_coffee', '커피 교환권', 2000, 'coffee', '가맹 제휴 카페 매장에서 실물 커피 음료(아메리카노 Tall 사이즈 기준)로 1:1 편리하게 맞교환할 수 있는 기프티콘 모바일 상품권입니다. 교환 즉시 등록된 연락처로 MMS 모바일 상품권이 전송 완료됩니다.')}
                          disabled={(user.points || 0) < 2000}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black font-giants transition-all active:scale-95 ${
                            (user.points || 0) >= 2000 
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm' 
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          2,000 P
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Point Transactions List */}
          <div className="flex items-center mb-3">
            <span className="text-xs font-bold font-giants text-slate-600">📋 적립 및 사용 내역</span>
          </div>

          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 no-scrollbar divide-y divide-slate-100/60">
            {pointHistory.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="pt-2.5 first:pt-0 flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-1.5 h-7 rounded-full shrink-0 ${
                    item.type === 'plus' ? 'bg-emerald-400' : 'bg-rose-400'
                  }`} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5 min-w-0">
                      <span className="font-bold text-slate-700 text-xs truncate">{item.title}</span>
                      {item.remark && (
                        <span className="text-[8px] bg-indigo-50 text-indigo-500 px-1 py-[1.5px] rounded font-bold font-giants shrink-0">
                          {item.remark}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-400 font-medium font-mono">{item.date}</span>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className={`text-xs font-black font-giants ${
                    item.type === 'plus' ? 'text-emerald-500' : 'text-rose-500'
                  }`}>
                    {item.type === 'plus' ? '+' : '-'}{item.amount.toLocaleString()} P
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Prize Section - Icon Centric Simple Design */}
        <section className="space-y-4 mx-4">
          <div className="flex items-center">
            <h2 className="text-lg font-giants font-bold">응모하기 상품 리스트</h2>
          </div>
          
          <div className="flex flex-col gap-3">
            {(showAllPrizes ? PRIZES : PRIZES.slice(0, 3)).map((prize, index) => (
              <motion.div
                key={prize.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 hover:border-indigo-100 transition-colors"
              >
                {/* Prize Icon Area */}
                <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ${
                  prize.category === 'GRAND' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 
                  prize.category === 'LUCKY' ? 'bg-slate-50 text-slate-500' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {getPrizeIcon(prize.id)}
                </div>

                {/* Prize Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-slate-800 text-sm whitespace-nowrap truncate">
                      {prize.title}
                    </h3>
                    {prize.deadlineDays > 0 && (
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        D-{prize.deadlineDays}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mb-2">
                    {prize.subtitle}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-medium text-indigo-500">{prize.benefit}</span>
                  </div>
                </div>

                {/* Action */}
                <div className="shrink-0">
                  <button
                    onClick={() => handleApply(prize)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-[11px] transition-all active:scale-95 min-w-[64px] ${
                      prize.category === 'GRAND' 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-100' 
                        : 'bg-slate-900 text-white hover:bg-black shadow-sm'
                    }`}
                  >
                    응모
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {!showAllPrizes && PRIZES.length > 3 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowAllPrizes(true)}
              className="w-full py-4 bg-white rounded-2xl border border-slate-100 text-slate-400 text-[11px] font-bold font-giants flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
            >
              경품 더보기 <ChevronDown className="w-3.5 h-3.5" />
            </motion.button>
          )}

          {showAllPrizes && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowAllPrizes(false)}
              className="w-full py-4 text-slate-400 text-[10px] font-bold font-giants flex items-center justify-center gap-1 hover:text-slate-600 transition-colors"
            >
              접기 <ChevronUp className="w-3 h-3" />
            </motion.button>
          )}

          {/* Event Share Banner */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-indigo-50/80 via-blue-50/50 to-indigo-50/40 rounded-2xl p-4 border border-indigo-100/60 relative overflow-hidden flex items-center justify-between gap-3 shadow-sm hover:shadow-md transition-all mt-6"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-100/50">
                <Share2 className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-800 text-[12.5px] font-giants">
                  이벤트 친구에게 소문내기 📣
                </h3>
                <p className="text-[10px] text-slate-500 font-giants font-medium mt-[2px] truncate">
                  친구에게 공유하고 대박 경품에 응모해보세요!
                </p>
              </div>
            </div>
            <button
              onClick={handleShareEvent}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-[10.5px] shadow-sm flex items-center gap-1 transition-all active:scale-95 whitespace-nowrap shrink-0 font-giants"
            >
              <Share2 className="w-3 h-3" />
              <span>공유하기</span>
            </button>
          </motion.div>
        </section>

        {/* Footer info */}
        <footer className="mt-16 pt-8 border-t border-slate-200 text-slate-400 text-xs leading-relaxed pb-6">
          <div 
            onClick={() => setShowDetailGuide(true)}
            className="flex items-center justify-between mb-4 text-slate-500 cursor-pointer hover:text-indigo-600 transition-all bg-indigo-50/50 hover:bg-indigo-50 hover:shadow-sm p-4 rounded-2xl border border-slate-100/80"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-500 shrink-0" />
              <div className="text-left font-giants">
                <span className="font-extrabold text-slate-700 block text-[12.5px]">이벤트 상세 가이드 및 유의사항</span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">상세 참여 요건, 경품 지급 및 유의사례 보기</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10.5px] font-bold text-indigo-600 bg-white px-2.5 py-1.5 rounded-xl border border-indigo-100/60 shadow-sm shrink-0 font-giants">
              상세 보기 <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </footer>
      </main>

      {/* Stock App Bottom Navigation Footer */}
      <div className="sticky bottom-0 left-0 right-0 z-40 w-full mt-auto">
        <div className="bg-[#000531] text-white flex items-center h-[62px] px-3 font-giants text-[12px] relative select-none w-full border-t border-slate-900 shadow-[0_-4px_16px_rgba(0,0,0,0.2)] shrink-0">
          {/* 전체메뉴 */}
          <button 
            onClick={() => showToast('전체메뉴는 준비 중인 서비스입니다.', 'info')}
            className="flex flex-col items-center justify-center w-14 shrink-0 transition-all active:scale-95 text-white h-full"
          >
            <Menu className="w-5 h-5 mb-0.5 text-white" />
            <span className="text-[11px] font-bold text-slate-300">전체메뉴</span>
          </button>

          {/* Divider */}
          <div className="h-5 w-[1px] bg-slate-700/60 mx-1 shrink-0" />

          {/* Normal Tabs */}
          <div className="flex-1 flex justify-around items-center h-full">
            {['홈', '관심종목', '주식현재가', '주식차트', '주식주문', '주식잔고'].map((tab) => {
              const isActive = tab === activeFooterTab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveFooterTab(tab);
                    showToast(`'${tab}' 화면으로 이동 시뮬레이션 중!`, 'info');
                  }}
                  className="relative h-full flex flex-col justify-center items-center px-1 shrink-0 transition-colors"
                >
                  {isActive && (
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-[18px] h-[2px] bg-slate-200 rounded-full" />
                  )}
                  <span className={`text-[12px] font-extrabold ${isActive ? 'text-white' : 'text-slate-400'} tracking-tight`}>
                    {tab}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Scroll to top */}
          <button 
            onClick={handleScrollToTop}
            className="flex items-center justify-center w-10 h-full border-l border-slate-800/80 hover:bg-slate-800/20 active:scale-90 transition-transform ml-1 shrink-0"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-4.5 h-4.5 text-white" />
          </button>
        </div>
      </div>

      {/* History Popup */}
      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold font-giants italic">내 응모 내역</h3>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <div className="p-0 text-center overflow-y-auto max-h-[400px]">
                {history.length > 0 ? (
                  <div className="divide-y divide-slate-50">
                    {history.map(item => (
                      <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="text-left">
                          <p className="font-bold text-slate-800 text-sm">{item.title}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{item.date} 응모 완료</p>
                        </div>
                        <div className="px-3 py-1 bg-indigo-50 rounded-full">
                          <span className="text-[10px] font-bold text-indigo-600 italic">Processing</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 space-y-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                      <Ticket className="w-8 h-8 text-slate-300" />
                    </div>
                    <div>
                      <p className="text-slate-800 font-medium">아직 참여한 내역이 없습니다.</p>
                      <p className="text-sm text-slate-500 mt-1">응모권을 모아 경품에 도전해보세요!</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 bg-slate-50 mt-auto">
                <button 
                  onClick={() => setShowHistory(false)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors"
                >
                  확인
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Event Detail Guide Popup Modal */}
      <AnimatePresence>
        {showDetailGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailGuide(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-500" />
                  <h3 className="text-base font-black font-giants italic text-slate-800">이벤트 상세 가이드</h3>
                </div>
                <button 
                  onClick={() => setShowDetailGuide(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto">
                {/* Section 1: Target and Period */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black text-rose-500 tracking-wider uppercase font-giants">01. 이벤트 기간 및 대상</h4>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/80 space-y-3 font-giants text-xs text-slate-600">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-400">이벤트 기간</span>
                      <span className="font-extrabold text-slate-800">2026. 06. 01 ~ 2026. 06. 30</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-400">이벤트 대상</span>
                      <span className="font-extrabold text-indigo-600">당사 MTS 앱 설치 및 로그인 완료 회원</span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Ticket Guide */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-black text-indigo-500 tracking-wider uppercase font-giants">02. 응모권 획득 가이드</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed font-giants">
                    다양한 데일리/스페셜 미션 수행 시 즉시 응모권이 자동 지급됩니다. 응모권을 모아 실시간 즉결 경품 교환이나 한정판 럭셔리 실물 경품에 응모하세요!
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/20 border border-indigo-100/20">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-[10px] font-black text-indigo-600 font-giants shrink-0">1</span>
                      <div className="text-xs">
                        <p className="font-extrabold text-slate-700 font-giants">미션 즉시 지급</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed font-giants">
                          출석 체크, 로그인 등 정해진 미션을 달성하고 <strong className="text-indigo-650">"받기"</strong> 누르면 즉시 응모권이 지급됩니다.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/20 border border-indigo-100/20">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-[10px] font-black text-indigo-600 font-giants shrink-0">2</span>
                      <div className="text-xs">
                        <p className="font-extrabold text-slate-700 font-giants">포인트 상점 교환</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed font-giants">
                          데일리 미션 또는 이벤트 당첨 시 적립되는 <strong className="text-emerald-500">포인트(P)</strong>를 활용해 교환 탭에서 응모권을 상시 장당 500P에 교환할 수 있습니다.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-indigo-50/20 border border-indigo-100/20">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-[10px] font-black text-indigo-600 font-giants shrink-0">3</span>
                        <div className="text-xs min-w-0">
                          <p className="font-extrabold text-slate-700 font-giants">미션 상태별 기준 안내</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-giants truncate">WAIT / GET / DONE의 상세 조건 설명</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowMissionGuideModal(true)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[10px] shadow-sm transition-all active:scale-95 whitespace-nowrap shrink-0 font-giants"
                      >
                        자세히 보기
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section 3: Prize Types */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-black text-amber-500 tracking-wider uppercase font-giants">03. 경품 유형 및 추첨 안내</h4>
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="p-3.5 bg-amber-50/40 rounded-2xl border border-amber-100/40">
                      <p className="font-extrabold text-amber-800 text-[11.5px] flex items-center gap-1 font-giants mb-1">
                        🎁 즉석 실시간 교환
                      </p>
                      <p className="text-[10.5px] text-slate-500 leading-normal font-giants">
                        커피 쿠폰, 주머니 포인트 등은 당첨 즉시 내역에서 바코드 혹은 적립금으로 사용 가능합니다.
                      </p>
                    </div>
                    <div className="p-3.5 bg-indigo-50/40 rounded-2xl border border-indigo-100/40">
                      <p className="font-extrabold text-indigo-800 text-[11.5px] flex items-center gap-1 font-giants mb-1">
                        🏆 한정판 추첨 응모
                      </p>
                      <p className="text-[10.5px] text-slate-500 leading-normal font-giants">
                        명품 가방, 맥북 프로, 하와이 여행권 등은 응모 장수가 많을수록 추첨 당첨률이 자동 합산 상승합니다.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 4: Details Checklist */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black text-slate-500 tracking-wider uppercase font-giants">04. 기타 꼭 확인하세요!</h4>
                  <ul className="space-y-1.5 text-[10.5px] text-slate-500 list-disc pl-4 leading-relaxed font-giants">
                    <li>양도 불가: 적립된 응모권과 포인트는 타인 정보로 합산이나 양도가 불가하며 즉시 회수되지 않습니다.</li>
                    <li>불이익 예방: 이벤트 종료 후 당첨 연락처 등의 식별 정보 오기입은 경품 재전송 사유에 해당하지 않습니다.</li>
                    <li>체결 기준 적용: 주식 거래 실적은 주문 접수가 아닌 체결 완료를 기준으로 정상 반영됩니다.</li>
                    <li>본 이벤트는 당사 사정에 따라 예고 없이 조기 종료되거나 변경될 수 있습니다.</li>
                    <li>제세공과금(22%)은 고객이 부담하며, 경품 가액에 따라 종합소득세 신고 대상이 될 수 있습니다.</li>
                    <li>비정상적인 방법으로 참여하거나 타인의 명의를 도용할 경우 당첨이 취소될 수 있습니다.</li>
                    <li>당첨자 발표는 이벤트 종료 후 2주 이내에 개별 안내(카카오 알림톡 등) 및 앱 내 공지됩니다.</li>
                    <li>주식 경품의 경우 입고일 기준 주가에 따라 가액이 변동될 수 있습니다.</li>
                  </ul>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 shrink-0">
                <button 
                  onClick={() => setShowDetailGuide(false)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors cursor-pointer text-sm font-giants"
                >
                  가이드 확인 완료
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Point Store Exchange Popup Modal */}
      <AnimatePresence>
        {selectedStoreItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => exchangeStatus !== 'processing' && setSelectedStoreItem(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-[360px] bg-white rounded-[28px] shadow-2xl overflow-hidden flex flex-col border border-slate-100"
            >
              {/* Top Close Button */}
              <div className="p-5 pb-0 flex items-center justify-between">
                <span className="text-[10px] font-black text-indigo-600 font-giants italic bg-indigo-50 px-2 py-0.5 rounded-full">POINT STORE</span>
                {exchangeStatus !== 'processing' && (
                  <button 
                    onClick={() => setSelectedStoreItem(null)}
                    className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                )}
              </div>

              {/* Step 1: Confirm Page */}
              {exchangeStatus === 'idle' && (
                <div className="p-6 pt-3 flex flex-col items-center">
                  {/* Icon view */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3.5 ${
                    selectedStoreItem.iconType === 'ticket' ? 'bg-yellow-400 text-indigo-950 shadow-md shadow-yellow-100' :
                    selectedStoreItem.iconType === 'stock' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    {selectedStoreItem.iconType === 'ticket' && <Ticket className="w-7 h-7" />}
                    {selectedStoreItem.iconType === 'stock' && <TrendingUp className="w-7 h-7" />}
                    {selectedStoreItem.iconType === 'coffee' && <Coffee className="w-7 h-7" />}
                  </div>

                  <h3 className="text-sm font-black text-slate-800 text-center font-giants mb-1">
                    {selectedStoreItem.title}
                  </h3>
                  <div className="text-[11px] text-indigo-600 font-black font-giants mb-3">
                    {selectedStoreItem.cost.toLocaleString()} P 사용
                  </div>
                  
                  <p className="text-[11px] text-slate-500 text-center leading-relaxed mb-5 font-giants text-pretty px-2 leading-relaxed">
                    {selectedStoreItem.description}
                  </p>

                  {/* Asset Math Card */}
                  <div className="w-full bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-2 mb-5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 font-giants">보유 포인트</span>
                      <span className="font-extrabold text-slate-700 font-mono">{(user.points || 0).toLocaleString()} P</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 font-giants">차감 포인트</span>
                      <span className="font-extrabold text-rose-500 font-mono">-{selectedStoreItem.cost.toLocaleString()} P</span>
                    </div>
                    <div className="w-full h-px bg-slate-100" />
                    <div className="flex justify-between items-center text-[11px] pt-0.5">
                      <span className="font-bold text-slate-800 font-giants">차감 후 잔여 포인트</span>
                      <span className="font-black text-indigo-600 font-mono text-xs leading-none">
                        {((user.points || 0) - selectedStoreItem.cost).toLocaleString()} P
                      </span>
                    </div>
                  </div>

                  {/* Accept action */}
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => setSelectedStoreItem(null)}
                      className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-bold rounded-xl transition-colors font-giants active:scale-95 transition-transform"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleConfirmExchange}
                      className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100 transition-colors font-giants active:scale-95 transition-transform"
                    >
                      교환하기
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Processing view */}
              {exchangeStatus === 'processing' && (
                <div className="p-10 flex flex-col items-center justify-center min-h-[280px]">
                  {/* Animated Outer Circles */}
                  <div className="relative flex items-center justify-center mb-6">
                    <div className="w-14 h-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                    <Gift className="absolute w-5 h-5 text-indigo-600 animate-pulse" />
                  </div>
                  <h4 className="text-xs font-black text-slate-800 font-giants text-center mb-1 animate-pulse">
                    모바일 상품권 안전 발급 중...
                  </h4>
                  <p className="text-[9px] text-slate-400 font-giants text-center">
                    잠시만 기다려 주십시오. 실시간 발송 데이터를 결속 생성 중입니다.
                  </p>
                </div>
              )}

              {/* Step 3: Success Receipt View */}
              {exchangeStatus === 'success' && (
                <div className="p-6 pt-3 flex flex-col items-center">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  
                  <h4 className="text-sm font-black text-emerald-600 font-giants mb-1">
                    포인트 교환 신청 완료!
                  </h4>
                  <p className="text-[10px] text-slate-400 font-giants text-center mb-4 leading-normal px-2">
                    포인트 차감이 정상 완료되었습니다.<br />선택하신 상품권 발급이 완료되었습니다.
                  </p>

                  {/* Simulated Mobile Ticket / Coupon UI */}
                  <div className="w-full bg-slate-50 rounded-2xl border border-slate-200 p-4 relative overflow-hidden flex flex-col items-center mb-5">
                    {/* Ticket Circle cutouts */}
                    <div className="absolute top-1/2 -left-2.5 w-5 h-5 bg-white border border-slate-200 rounded-full -translate-y-1/2" />
                    <div className="absolute top-1/2 -right-2.5 w-5 h-5 bg-white border border-slate-200 rounded-full -translate-y-1/2" />
                    
                    {/* Voucher Header */}
                    <div className="text-center pb-2.5 border-b border-dashed border-slate-200 w-full mb-3">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono">DIGITAL VOUCHER</span>
                      <p className="text-xs font-extrabold text-slate-700 mt-0.5">{selectedStoreItem.title}</p>
                    </div>

                    <div className="text-center pt-2 w-full">
                      {selectedStoreItem.id === 'shop_ticket' ? (
                        <p className="text-[9px] text-blue-600 font-giants font-semibold">
                          ※ 응모권 1장이 즉시 자동 합산 지급되었습니다!
                        </p>
                      ) : selectedStoreItem.id === 'shop_stock_voucher' ? (
                        <p className="text-[9px] text-emerald-600 font-giants">
                          ※ 등록된 계좌번호로 주식상품권이 발급됩니다.
                        </p>
                      ) : (
                        <p className="text-[9px] text-amber-600 font-giants">
                          ※ 등록된 회원 휴대폰 번호로 모바일 쿠폰 MMS 전송 완료!
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Accept Close */}
                  <button
                    onClick={() => setSelectedStoreItem(null)}
                    className="w-full py-3 bg-slate-900 hover:bg-black font-semibold text-white text-xs rounded-xl transition-colors font-giants shadow-sm active:scale-95 transition-transform"
                  >
                    확인하고 닫기
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sweepstakes/Prize Apply Selection Modal */}
      <AnimatePresence>
        {selectedApplyPrize && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => applyStatus !== 'processing' && setSelectedApplyPrize(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-[360px] bg-white rounded-[28px] shadow-2xl overflow-hidden flex flex-col border border-slate-100"
            >
              {/* Top Close Button */}
              <div className="p-5 pb-0 flex items-center justify-between">
                <span className="text-[10px] font-black text-indigo-600 font-giants italic bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  {selectedApplyPrize.category === 'GRAND' ? '🏆 GRAND DRAW' : selectedApplyPrize.category === 'LUCKY' ? '🍀 LUCKY DRAW' : '⚡ INSTANT WIN'}
                </span>
                {applyStatus !== 'processing' && (
                  <button 
                    onClick={() => setSelectedApplyPrize(null)}
                    className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                )}
              </div>

              {/* Step 1: Confirmation View with Interactive Ticket Counter and Pool Stats */}
              {applyStatus === 'idle' && (
                <div className="p-6 pt-3 flex flex-col items-center">
                  {/* Icon View */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-sm border ${
                    selectedApplyPrize.category === 'GRAND' ? 'bg-indigo-600 text-white shadow-indigo-100' :
                    selectedApplyPrize.category === 'LUCKY' ? 'bg-slate-50 text-slate-600 border-slate-100' :
                    'bg-emerald-50 text-emerald-600 border-emerald-100'
                  }`}>
                    {getPrizeIcon(selectedApplyPrize.id)}
                  </div>

                  <h3 className="text-sm font-black text-slate-800 text-center font-giants mb-0.5">
                    {selectedApplyPrize.title}
                  </h3>
                  <div className="text-[10px] text-slate-400 font-giants mb-3 text-center">
                    {selectedApplyPrize.subtitle}
                  </div>

                  {/* Dynamic Ticket Registrations Stats Card */}
                  <div className="grid grid-cols-2 gap-2.5 w-full mb-4">
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2.5 text-center flex flex-col items-center justify-center">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-giants mb-0.5">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>전체 참여 응모권</span>
                      </div>
                      <span className="text-xs font-black text-slate-800 font-mono">
                        {((selectedApplyPrize.participants * 3) + (myAppliedTickets[selectedApplyPrize.id] || 0)).toLocaleString()}장
                      </span>
                    </div>
                    <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-2xl p-2.5 text-center flex flex-col items-center justify-center">
                      <div className="flex items-center gap-1 text-[10px] text-indigo-500 font-giants mb-0.5">
                        <Ticket className="w-3 h-3 text-indigo-500" />
                        <span>나의 누적 응모</span>
                      </div>
                      <span className="text-xs font-black text-indigo-600 font-mono">
                        {(myAppliedTickets[selectedApplyPrize.id] || 0).toLocaleString()}장
                      </span>
                    </div>
                  </div>

                  {/* Interactive Quantity Selection Module (소모 방식이 아닌 직접 지정) */}
                  <div className="w-full bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col items-center mb-4">
                    <label className="text-[10px] font-black text-indigo-600 font-giants uppercase tracking-wide mb-2.5">
                      응모할 응모권 수량 선택
                    </label>

                    <div className="flex items-center justify-between w-[200px] mb-3">
                      <button
                        onClick={() => setApplyQuantity(prev => Math.max(1, prev - 1))}
                        disabled={applyQuantity <= 1 || user.tickets === 0}
                        className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all active:scale-90 ${
                          applyQuantity <= 1 || user.tickets === 0
                            ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <div className="flex items-baseline gap-1 select-none">
                        <span className="text-2xl font-black font-giants text-slate-800 leading-none">
                          {user.tickets === 0 ? 0 : applyQuantity}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500 font-giants">장</span>
                      </div>

                      <button
                        onClick={() => setApplyQuantity(prev => Math.min(user.tickets, prev + 1))}
                        disabled={applyQuantity >= user.tickets || user.tickets === 0}
                        className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all active:scale-90 ${
                          applyQuantity >= user.tickets || user.tickets === 0
                            ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quick Selection Shortcuts */}
                    {user.tickets > 0 && (
                      <div className="flex flex-wrap justify-center gap-1.5 w-full pt-1.5 border-t border-dashed border-slate-200">
                        <button
                          onClick={() => setApplyQuantity(prev => Math.min(user.tickets, prev + 1))}
                          className="px-2 py-1 bg-white hover:bg-slate-100 text-[10px] font-giants font-bold text-slate-600 rounded-lg border border-slate-200 active:scale-95 transition-all"
                        >
                          +1장
                        </button>
                        <button
                          onClick={() => setApplyQuantity(prev => Math.min(user.tickets, prev + 5))}
                          disabled={user.tickets < 5}
                          className="px-2 py-1 bg-white hover:bg-slate-100 text-[10px] font-giants font-bold text-slate-600 rounded-lg border border-slate-200 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          +5장
                        </button>
                        <button
                          onClick={() => setApplyQuantity(prev => Math.min(user.tickets, prev + 10))}
                          disabled={user.tickets < 10}
                          className="px-2 py-1 bg-white hover:bg-slate-100 text-[10px] font-giants font-bold text-slate-600 rounded-lg border border-slate-200 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          +10장
                        </button>
                        <button
                          onClick={() => setApplyQuantity(user.tickets)}
                          className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-[10px] font-giants font-black text-indigo-600 rounded-lg border border-indigo-100/30 active:scale-95 transition-all"
                        >
                          최대 {user.tickets}장
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Calculator Widget */}
                  <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 mb-4">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 font-giants">보유 응모권</span>
                      <span className="font-extrabold text-slate-700 font-mono">{user.tickets}장</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 font-giants">응모 소모권</span>
                      <span className={`font-extrabold font-mono ${user.tickets === 0 ? 'text-slate-400' : 'text-rose-500'}`}>
                        -{user.tickets === 0 ? 0 : applyQuantity}장
                      </span>
                    </div>
                    <div className="w-full h-px bg-slate-100" />
                    <div className="flex justify-between items-center text-[11px] pt-0.5">
                      <span className="font-bold text-slate-800 font-giants">응모 후 남는 응모권</span>
                      {user.tickets > 0 ? (
                        <span className="font-black text-indigo-600 font-mono text-xs leading-none">
                          {user.tickets - applyQuantity}장
                        </span>
                      ) : (
                        <span className="font-black text-rose-500 font-mono text-xs leading-none">
                          수량 부족 (필요: 1장)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Warning Messages / Guides */}
                  {user.tickets === 0 ? (
                    <div className="w-full bg-rose-50 text-rose-600 rounded-xl p-3 border border-rose-100 text-[10px] font-giants leading-relaxed mb-5 flex gap-2">
                      <Info className="w-3.5 h-3.5 shrink-0 text-rose-500 mt-0.5" />
                      <p>
                        응모권이 부족합니다! 상단의 <strong>응모권 모으기 미션을 완료</strong>하고 실시간으로 응모권을 채워 보세요.
                      </p>
                    </div>
                  ) : (
                    <ul className="w-full space-y-1 text-[10px] text-slate-400 text-left font-giants list-disc list-inside mb-5 px-1 leading-normal pb-0.5">
                      <li>응모 수량이 많을수록 당첨 확률이 실시간 비례하여 증가합니다!</li>
                      <li>당첨자 개별 공지는 마감일 직후 공식 문자 및 푸시로 전송됩니다.</li>
                    </ul>
                  )}

                  {/* Selection Choices */}
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => setSelectedApplyPrize(null)}
                      className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-bold rounded-xl transition-colors font-giants active:scale-95 transition-transform"
                    >
                      취소
                    </button>
                    {user.tickets > 0 ? (
                      <button
                        onClick={handleConfirmApply}
                        className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100 transition-colors font-giants active:scale-95 transition-transform"
                      >
                        응모하기
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedApplyPrize(null);
                          // Smooth scroll helper to missions if suitable
                          const missionSection = document.getElementById('missions-section');
                          if (missionSection) {
                            missionSection.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="flex-1 py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-md transition-colors font-giants active:scale-95 transition-transform"
                      >
                        미션 확인하기
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Processing Spinner View */}
              {applyStatus === 'processing' && (
                <div className="p-10 flex flex-col items-center justify-center min-h-[290px]">
                  <div className="relative flex items-center justify-center mb-6">
                    <div className="w-14 h-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                    <Ticket className="absolute w-5 h-5 text-indigo-600 animate-pulse" />
                  </div>
                  <h4 className="text-xs font-black text-slate-800 font-giants text-center mb-1 animate-pulse">
                    응모권 보안 인증 및 서명 중...
                  </h4>
                  <p className="text-[9px] text-slate-400 font-giants text-center">
                    전산 전송 및 추첨 등록 처리가 진행 중입니다. 잠시만 대기해 주세요.
                  </p>
                </div>
              )}

              {/* Step 3: Success Voucher Receipt View */}
              {applyStatus === 'success' && (
                <div className="p-6 pt-3 flex flex-col items-center">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>

                  <h3 className="text-sm font-black text-emerald-600 font-giants mb-1">
                    경품 응모 신청 완료!
                  </h3>
                  
                  <p className="text-[10px] text-slate-400 font-giants text-center mb-4 leading-normal px-2">
                    고객님의 행운 응모권 번호가 추첨 시스템에 성공적으로 등록되었습니다!
                  </p>

                  {/* Virtual Pass Stub UI with Jagged Edge Styles */}
                  <div className="w-full bg-slate-50 rounded-2xl border border-slate-200 p-4 relative overflow-hidden flex flex-col items-center mb-5">
                    {/* Stub side cutouts */}
                    <div className="absolute top-1/2 -left-2.5 w-5 h-5 bg-white border border-slate-200 rounded-full -translate-y-1/2" />
                    <div className="absolute top-1/2 -right-2.5 w-5 h-5 bg-white border border-slate-200 rounded-full -translate-y-1/2" />

                    {/* Voucher Header */}
                    <div className="text-center pb-2.5 border-b border-dashed border-slate-200 w-full mb-3">
                      <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest font-mono">
                        EVENT SWEEPSTAKES TICKET
                      </span>
                      <p className="text-xs font-black text-slate-800 mt-1">{selectedApplyPrize.title}</p>
                    </div>

                    {/* Content metrics */}
                    <div className="w-full space-y-1.5 text-[10px] text-slate-500 font-giants pb-0.5">
                      <div className="flex justify-between">
                        <span>응모한 수량</span>
                        <span className="font-bold text-slate-800">-{applyQuantity}장</span>
                      </div>
                      <div className="flex justify-between">
                        <span>남은 응모권</span>
                        <span className="font-bold text-indigo-600">{user.tickets}장</span>
                      </div>
                    </div>
                  </div>

                  {/* Complete Action */}
                  <button
                    onClick={() => setSelectedApplyPrize(null)}
                    className="w-full py-3 bg-slate-900 hover:bg-black font-semibold text-white text-xs rounded-xl shadow-sm active:scale-95 transition-transform font-giants"
                  >
                    확인하고 닫기
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mission Status Criteria Modal */}
      <AnimatePresence>
        {showMissionGuideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMissionGuideModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-[360px] bg-white rounded-[28px] shadow-2xl overflow-hidden flex flex-col border border-slate-100"
            >
              {/* Top Close Button */}
              <div className="p-5 pb-0 flex items-center justify-between">
                <span className="text-[10px] font-black text-indigo-600 font-giants italic bg-indigo-50 px-2.5 py-0.5 rounded-full">MISSION STATUS</span>
                <button 
                  onClick={() => setShowMissionGuideModal(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-full transition-colors active:scale-90"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="p-6 pt-3 flex flex-col">
                <div className="flex items-center gap-2 mb-4 justify-center">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Info className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 text-center font-giants">
                    미션 상태별 기준 안내
                  </h3>
                </div>

                <p className="text-[11px] text-slate-500 text-center leading-relaxed mb-5 font-giants">
                  데일리 및 스페셜 미션은 총 3가지 단계의 라이프사이클을 가집니다. 조건 달성 시 즉시 수령받으실 수 있습니다.
                </p>

                {/* Status items stack */}
                <div className="space-y-3 mb-6">
                  {/* WAIT */}
                  <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100/60 shadow-sm">
                    <span className="shrink-0 bg-slate-200 text-slate-650 font-black px-2 py-0.5 rounded text-[8.5px] font-giants self-start mt-0.5 text-center min-w-[42px]">
                      WAIT
                    </span>
                    <div className="text-xs">
                      <p className="font-extrabold text-slate-700 font-giants">도전 중 단계</p>
                      <p className="text-[10px] text-slate-500 font-giants mt-1 leading-normal">
                        현재 미션 조건 달성을 위해 진행 중인 상태입니다. 미션 카드를 클릭하여 시뮬레이션을 완료하면 완료 가능합니다.
                      </p>
                    </div>
                  </div>

                  {/* GET */}
                  <div className="flex items-start gap-3 p-3.5 bg-yellow-50/50 rounded-2xl border border-yellow-250/70 shadow-sm ring-1 ring-amber-400/5">
                    <span className="shrink-0 bg-yellow-400 text-indigo-950 font-black px-2 py-0.5 rounded text-[8.5px] font-giants self-start mt-0.5 text-center min-w-[42px]">
                      GET
                    </span>
                    <div className="text-xs">
                      <p className="font-extrabold text-slate-700 font-giants">받기 대기 단계</p>
                      <p className="text-[10px] text-slate-500 font-giants mt-1 leading-normal">
                        목표 조건이 달성되어 보상 획득이 가능한 상태입니다. 미션 카드를 클릭하면 즉시 응모권이 지급됩니다!
                      </p>
                    </div>
                  </div>

                  {/* DONE */}
                  <div className="flex items-start gap-3 p-3.5 bg-indigo-50/20 rounded-2xl border border-indigo-100/20 shadow-sm">
                    <span className="shrink-0 bg-indigo-100 text-indigo-650 font-black px-2 py-0.5 rounded text-[8.5px] font-giants self-start mt-0.5 text-center min-w-[42px]">
                      DONE
                    </span>
                    <div className="text-xs">
                      <p className="font-extrabold text-slate-700 font-giants">지급 완료 단계</p>
                      <p className="text-[10px] text-slate-500 font-giants mt-1 leading-normal">
                        미션을 기한 내 완수하고 보상 응모권 수령까지 완료한 상태입니다. 더 이상의 참여 및 교환은 불가합니다.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowMissionGuideModal(true && setShowMissionGuideModal(false))}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100 transition-colors font-giants active:scale-95 transition-transform"
                >
                  확인 완료
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-slate-900/95 backdrop-blur-md text-white text-[11.5px] px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700/50 max-w-[340px] w-[90%]"
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span className="font-giants font-semibold tracking-tight">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
