import React, { useState, useEffect, useMemo } from "react";
import {
  Wallet,
  Calendar,
  MapPin,
  Ticket,
  Search,
  ShieldCheck,
  CheckCircle,
  Loader,
  Menu,
  X,
  ArrowRight,
  Zap,
  Globe,
  Lock,
  Coins,
  Eye,
  EyeOff,
  Gavel,
  AlertTriangle,
  Hash,
  ArrowLeft,
  Clock,
  Users,
  Trophy,
  Medal,
  DollarSign,
  Hourglass,
  Key,
  Check,
  RotateCcw,
  Send,
  Radio,
  Edit3,
  RefreshCw,
  Timer,
} from "lucide-react";

// --- CONFIGURATION ---
const USDT_PER_CHIP = 0.01; // Chip giá rẻ (tượng trưng), chỉ 0.01 USDT/chip

// --- CHIP DEFINITIONS ---
const CHIPS = [
  {
    value: 1,
    color: "bg-white border-gray-300 text-gray-800",
    ring: "border-gray-300",
  },
  {
    value: 5,
    color: "bg-red-500 border-red-700 text-white",
    ring: "border-white/30",
  },
  {
    value: 25,
    color: "bg-green-600 border-green-800 text-white",
    ring: "border-white/30",
  },
  {
    value: 100,
    color: "bg-gray-900 border-black text-white",
    ring: "border-yellow-500/50",
  },
  {
    value: 500,
    color: "bg-purple-600 border-purple-800 text-white",
    ring: "border-yellow-400",
  },
];

// --- HELPER: FUTURE DATE GENERATOR ---
const getFutureDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

// --- MOCK DATA ---
const CONCERTS = [
  {
    id: 1,
    artist: "The Midnight Protocol",
    title: "Neon Genesis Tour",
    date: "Nov 15, 2025",
    location: "My Dinh Stadium, Hanoi",
    minDeposit: 200,
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
    category: "Electronic",
    phase: "PARTICIPATION", // Changed from COMMIT
    deadline: getFutureDate(2),
    totalBidders: 124,
    description:
      "Experience the fusion of synthwave and blockchain in the biggest electronic event of the year.",
    leaderboard: [
      { bidder: "0xFa...91", bid: 500, isBluff: true },
      { bidder: "0xCa...22", bid: 450, isBluff: true },
      { bidder: "0xBb...11", bid: 420, isBluff: true },
    ],
  },
  {
    id: 2,
    artist: "Ether Waves",
    title: "Blockchain Symphony",
    date: "Dec 20, 2025",
    location: "Opera House, HCMC",
    minDeposit: 300,
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800",
    category: "Classical / Tech",
    phase: "REVEAL",
    deadline: getFutureDate(1),
    totalBidders: 89,
    description:
      "A night where classical music meets algorithmic composition. Exclusive access for DAO members.",
    leaderboard: [
      { bidder: "0x11...AA", bid: 1150, isBluff: false },
      { bidder: "0x22...BB", bid: 1100, isBluff: false },
      { bidder: "0x33...CC", bid: 1050, isBluff: false },
      { bidder: "0x44...DD", bid: 900, isBluff: false },
    ],
  },
  {
    id: 3,
    artist: "Crypto Punks Live",
    title: "Decentralized Rock",
    date: "Jan 05, 2026",
    location: "National Convention Center",
    minDeposit: 150,
    image:
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=800",
    category: "Rock",
    phase: "ENDED",
    totalBidders: 256,
    description:
      "Raw energy, uncensored lyrics, and true ownership. The first fully decentralized rock concert.",
    leaderboard: [
      { bidder: "YOU", bid: 850, isUser: true, isBluff: false },
      { bidder: "0x99...88", bid: 820, isBluff: false },
      { bidder: "0x77...66", bid: 790, isBluff: false },
      { bidder: "0x55...44", bid: 750, isBluff: false },
      { bidder: "0x33...22", bid: 700, isBluff: false },
    ],
  },
  {
    id: 4,
    artist: "Solana Summer",
    title: "Beach Vibes Festival",
    date: "Feb 14, 2026",
    location: "My Khe Beach, Da Nang",
    minDeposit: 180,
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=800",
    category: "Pop",
    phase: "ENDED",
    totalBidders: 302,
    description:
      "Sun, sea, and sound. Join the biggest beach party on the chain.",
    leaderboard: [
      { bidder: "0xAA...ZZ", bid: 2000, isBluff: false },
      { bidder: "0xBB...YY", bid: 1950, isBluff: false },
      { bidder: "0xCC...XX", bid: 1800, isBluff: false },
      { bidder: "0xDD...WW", bid: 1500, isBluff: false },
      { bidder: "YOU", bid: 400, isUser: true, isBluff: false },
    ],
  },
];

export default function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [usdtBalance, setUsdtBalance] = useState(5000.0);
  const [chipBalance, setChipBalance] = useState(1000);

  const [currentView, setCurrentView] = useState("landing");
  const [selectedConcert, setSelectedConcert] = useState(null);
  const [myTickets, setMyTickets] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showChipShop, setShowChipShop] = useState(false);
  const [userActions, setUserActions] = useState({});

  // Initialize simulated state
  useEffect(() => {
    setUserActions({
      2: {
        deposited: true,
        committed: true,
        revealed: false,
        savedN: 1180,
        savedPass: "123",
        bluffAmount: 1200,
      },
      3: {
        deposited: true,
        committed: true,
        revealed: true,
        status: "WON",
        savedN: 850,
        bluffAmount: 900,
      },
      4: {
        deposited: true,
        committed: true,
        revealed: true,
        status: "LOST",
        savedN: 400,
        bluffAmount: 450,
      },
    });
    setMyTickets([
      {
        id: 3,
        artist: "Crypto Punks Live",
        title: "Decentralized Rock",
        date: "Jan 05, 2026",
        location: "National Convention Center",
        tokenId: 88291,
        winningBid: 850,
        image: CONCERTS[2].image,
      },
    ]);
  }, []);

  const BRAND_BLUE = "text-[#1a3cff]";
  const BG_BLUE = "bg-[#1a3cff]";

  const showNotification = (msg, type) => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const connectWallet = () => {
    setTimeout(() => {
      const randomAddr =
        "0x" +
        Array(40)
          .fill(0)
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join("");
      setWalletAddress(
        `${randomAddr.substring(0, 6)}...${randomAddr.substring(38)}`
      );
      showNotification("Wallet connected!", "success");
    }, 800);
  };

  const buyChips = (amount) => {
    const cost = amount * USDT_PER_CHIP;
    if (usdtBalance < cost) {
      showNotification("Insufficient USDT balance", "error");
      return;
    }
    setUsdtBalance((prev) => prev - cost);
    setChipBalance((prev) => prev + amount);
    showNotification(
      `Purchased ${amount} Chips (Cost: ${cost} USDT)`,
      "success"
    );
    setShowChipShop(false);
  };

  const navigateToDetail = (concert) => {
    setSelectedConcert(concert);
    setCurrentView("detail");
    window.scrollTo(0, 0);
  };

  // --- COMPONENT: COUNTDOWN TIMER ---
  const CountdownTimer = ({ deadline }) => {
    const [timeLeft, setTimeLeft] = useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });

    useEffect(() => {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const end = new Date(deadline).getTime();
        const distance = end - now;

        if (distance < 0) {
          clearInterval(interval);
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        } else {
          setTimeLeft({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor(
              (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            ),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
          });
        }
      }, 1000);

      return () => clearInterval(interval);
    }, [deadline]);

    return (
      <div className="flex items-center space-x-2 text-xs font-mono bg-black/20 rounded-lg px-3 py-1 border border-white/10">
        <Clock size={12} className="text-red-400 animate-pulse" />
        <span className="text-red-300 font-bold uppercase mr-1">Ends in:</span>
        <span className="text-white font-bold">
          {String(timeLeft.days).padStart(2, "0")}d :{" "}
          {String(timeLeft.hours).padStart(2, "0")}h :{" "}
          {String(timeLeft.minutes).padStart(2, "0")}m :{" "}
          {String(timeLeft.seconds).padStart(2, "0")}s
        </span>
      </div>
    );
  };

  // --- COMPONENTS ---

  const CasinoChip = ({ value, size = "md", onClick, disabled }) => {
    const chipConfig = CHIPS.find((c) => c.value === value) || CHIPS[0];
    const sizeClasses =
      size === "sm"
        ? "w-8 h-8 text-[10px]"
        : size === "lg"
        ? "w-16 h-16 text-lg"
        : "w-12 h-12 text-xs";

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${chipConfig.color} ${sizeClasses} rounded-full border-4 border-dashed shadow-md flex items-center justify-center font-bold relative group transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <div
          className={`absolute inset-1 rounded-full border ${chipConfig.ring} opacity-50`}
        ></div>
        <span className="relative z-10">{value}</span>
      </button>
    );
  };

  const ChipShopModal = () => (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center">
            <Coins className="mr-2 text-orange-500" /> Buy Chips
          </h3>
          <button onClick={() => setShowChipShop(false)}>
            <X className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[10, 50, 100, 200, 500, 1000].map((amount) => (
            <button
              key={amount}
              onClick={() => buyChips(amount)}
              className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-xl transition-all"
            >
              <div className="flex -space-x-2 mb-2">
                <CasinoChip value={100} size="sm" />
                <CasinoChip value={25} size="sm" />
              </div>
              <span className="font-bold text-gray-900">{amount} Chips</span>
              <span className="text-xs text-gray-500 mt-1">
                Cost: {(amount * USDT_PER_CHIP).toFixed(2)} USDT
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const Leaderboard = ({ data, phase, draftBluff, broadcastedBluff }) => {
    const isEnded = phase === "ENDED";
    const isReveal = phase === "REVEAL";
    const title = isEnded
      ? "Final Winners"
      : isReveal
      ? "Live Real Bids (Revealing)"
      : "Live Bluff Board";

    // Logic to merge live draft/broadcast bid into leaderboard
    const displayData = useMemo(() => {
      let list = [...data];

      if (!isReveal && !isEnded) {
        list = list.filter((item) => !item.isUser);

        if (broadcastedBluff > 0) {
          list.push({
            bidder: "YOU",
            bid: broadcastedBluff,
            isUser: true,
            isBluff: true,
            isDraft: false,
          });
        } else if (draftBluff > 0 && phase === "PARTICIPATION") {
          list.push({
            bidder: "YOU (Draft)",
            bid: draftBluff,
            isUser: true,
            isBluff: true,
            isDraft: true,
          });
        }
      }

      return list.sort((a, b) => b.bid - a.bid);
    }, [data, draftBluff, broadcastedBluff, phase, isReveal, isEnded]);

    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-8 transition-all duration-300">
        <div
          className={`p-4 ${
            isEnded
              ? "bg-gray-900 text-white"
              : isReveal
              ? "bg-orange-600 text-white"
              : "bg-blue-50 text-blue-900"
          } flex justify-between items-center`}
        >
          <div className="flex items-center gap-2 font-bold">
            <Trophy
              size={18}
              className={
                isEnded || isReveal ? "text-yellow-400" : "text-blue-500"
              }
            />
            {title}
          </div>
          {!isEnded && !isReveal && (
            <div className="text-xs px-2 py-1 bg-white/50 rounded flex items-center gap-1">
              <Eye size={12} /> True bids hidden
            </div>
          )}
        </div>

        <div className="divide-y divide-gray-50">
          {displayData.map((row, index) => (
            <div
              key={index}
              className={`p-4 flex justify-between items-center transition-all duration-500 ${
                row.isUser
                  ? "bg-blue-100 border-l-4 border-blue-600 scale-[1.02] shadow-sm z-10"
                  : "hover:bg-gray-50"
              } ${index < 3 && (isEnded || isReveal) ? "bg-yellow-50/30" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    index === 0
                      ? "bg-yellow-100 text-yellow-700"
                      : index === 1
                      ? "bg-gray-100 text-gray-700"
                      : index === 2
                      ? "bg-orange-100 text-orange-700"
                      : "text-gray-400"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`font-mono text-sm ${
                      row.isUser ? "font-bold text-blue-800" : "text-gray-600"
                    }`}
                  >
                    {row.bidder}
                  </span>
                  {row.isDraft && broadcastedBluff === 0 && (
                    <span className="text-[10px] text-orange-500 font-bold italic">
                      Previewing...
                    </span>
                  )}
                  {row.isUser && !row.isDraft && phase === "PARTICIPATION" && (
                    <span className="text-[10px] text-green-600 font-bold flex items-center">
                      <Check size={10} className="mr-1" /> Broadcasted
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`font-bold ${
                    row.isUser ? "text-blue-800" : "text-gray-900"
                  } flex items-center justify-end gap-1`}
                >
                  {row.bid}{" "}
                  <div
                    className={`w-3 h-3 rounded-full ${
                      row.isUser
                        ? "bg-blue-500"
                        : row.isBluff
                        ? "bg-orange-500"
                        : "bg-gray-800"
                    }`}
                  ></div>
                </span>
                <p className="text-[10px] text-gray-400 uppercase">
                  {isEnded || isReveal ? "Real Bid" : "Bluff Value"}
                </p>
              </div>
            </div>
          ))}
          {displayData.length === 0 && (
            <div className="p-8 text-center text-gray-400 text-sm">
              No bids yet. Be the first!
            </div>
          )}
        </div>
      </div>
    );
  };

  const ConcertDetailPage = ({ concert, onBack }) => {
    const [step, setStep] = useState(1);
    const userState = userActions[concert.id] || {};

    // --- SEPARATE LOADING STATES ---
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [isCommitting, setIsCommitting] = useState(false);
    const [isGeneralLoading, setIsGeneralLoading] = useState(false);
    const [isEditingBid, setIsEditingBid] = useState(false);

    // Inputs
    const [bluffM, setBluffM] = useState(userState.bluffAmount || 0);
    const [broadcastedBluff, setBroadcastedBluff] = useState(
      userState.bluffAmount || 0
    );
    const [realN, setRealN] = useState(userState.savedN || "");
    const [password, setPassword] = useState(userState.savedPass || "");
    const [revealN, setRevealN] = useState("");
    const [revealPass, setRevealPass] = useState("");

    // --- DYNAMIC LEADERBOARD DATA FOR REVEAL PHASE ---
    const leaderboardData = useMemo(() => {
      let data = [...(concert.leaderboard || [])];
      if (
        concert.phase === "REVEAL" &&
        userState.revealed &&
        (userState.status === "VERIFIED" ||
          userState.status === "WON" ||
          userState.status === "LOST")
      ) {
        const exists = data.some((item) => item.isUser);
        if (!exists) {
          data.push({
            bidder: "YOU",
            bid: userState.savedN,
            isUser: true,
            isBluff: false,
          });
        }
      }
      return data;
    }, [
      concert.leaderboard,
      concert.phase,
      userState.revealed,
      userState.status,
      userState.savedN,
    ]);

    useEffect(() => {
      if (concert.phase === "ENDED") setStep(4);
      else if (concert.phase === "REVEAL") setStep(3);
      else if (userState.committed && !isEditingBid) setStep(3);
      else if (userState.deposited) setStep(2);
      else setStep(1);
    }, [concert, userState, isEditingBid]);

    const handleDeposit = () => {
      if (!walletAddress)
        return showNotification("Connect Wallet First", "error");
      if (usdtBalance < concert.minDeposit)
        return showNotification("Insufficient USDT", "error");
      setIsGeneralLoading(true);
      setTimeout(() => {
        setUsdtBalance((prev) => prev - concert.minDeposit);
        setUserActions((prev) => ({
          ...prev,
          [concert.id]: { ...prev[concert.id], deposited: true },
        }));
        setIsGeneralLoading(false);
        showNotification("Deposit staked successfully.", "success");
      }, 1000);
    };

    const addChipToBluff = (value) => {
      setBluffM((prev) => prev + value);
    };

    const clearBluff = () => setBluffM(0);

    const handleBroadcastBluff = () => {
      if (bluffM <= 0)
        return showNotification("Please select chips to bluff", "error");

      // Calculate chip difference to deduct (support refund if new bluff < old bluff)
      const oldBluff = userState.bluffAmount || 0;
      const chipsNeeded = bluffM - oldBluff;

      if (chipBalance < chipsNeeded) {
        return showNotification(
          `Insufficient chips. Need ${chipsNeeded} more.`,
          "error"
        );
      }

      setIsBroadcasting(true);
      setTimeout(() => {
        // DEDUCT CHIPS HERE (PUBLIC TRANSACTION)
        setChipBalance((prev) => prev - chipsNeeded);
        setBroadcastedBluff(bluffM);
        setIsBroadcasting(false);

        setUserActions((prev) => ({
          ...prev,
          [concert.id]: {
            ...prev[concert.id],
            bluffAmount: bluffM,
          },
        }));

        showNotification(
          `Bluff of ${bluffM} Chips broadcasted (Cost: ${chipsNeeded} chips)!`,
          "success"
        );
      }, 800);
    };

    const handleCommit = () => {
      const nVal = Number(realN);
      if (nVal <= 0 || !password)
        return showNotification("Fill all secret bid fields", "error");

      const currentBluff = broadcastedBluff > 0 ? broadcastedBluff : bluffM;
      if (broadcastedBluff <= 0)
        return showNotification(
          "You must Broadcast your Bluff first!",
          "error"
        );

      if (nVal >= currentBluff)
        return showNotification(
          "True Bid (N) must be less than Bluff (M)",
          "error"
        );

      // Removed chip deduction here as requested (Secret bid doesn't cost extra chips)

      setIsCommitting(true);
      setTimeout(() => {
        setUserActions((prev) => ({
          ...prev,
          [concert.id]: {
            ...prev[concert.id],
            committed: true,
            savedN: nVal,
            savedPass: password,
            bluffAmount: currentBluff,
          },
        }));

        setIsCommitting(false);
        setIsEditingBid(false);
        showNotification(
          userState.committed
            ? "Secret Bid Updated!"
            : "Bid Committed! Waiting for Reveal.",
          "success"
        );
      }, 1500);
    };

    const handleReveal = () => {
      setIsGeneralLoading(true);
      setTimeout(() => {
        const inputN = Number(revealN);
        if (
          inputN === Number(userState.savedN) &&
          revealPass === userState.savedPass
        ) {
          const isWinner = concert.id === 2 ? true : Math.random() > 0.5;
          const status = isWinner ? "WON" : "LOST";

          if (isWinner) {
            if (usdtBalance >= inputN) {
              setUsdtBalance((prev) => prev - inputN + concert.minDeposit);
              setUserActions((prev) => ({
                ...prev,
                [concert.id]: {
                  ...prev[concert.id],
                  revealed: true,
                  status: "VERIFIED",
                },
              }));
              showNotification(
                `Verified! Paid ${inputN} USDT. Deposit Refunded.`,
                "success"
              );
            } else {
              showNotification("Insufficient balance to pay for bid!", "error");
            }
          } else {
            setUsdtBalance((prev) => prev + concert.minDeposit);
            showNotification("You Lost. Deposit Refunded.", "error");
            setUserActions((prev) => ({
              ...prev,
              [concert.id]: {
                ...prev[concert.id],
                revealed: true,
                status: "LOST",
              },
            }));
          }
        } else {
          showNotification(
            "Incorrect Bid (N) or Password. Please try again.",
            "error"
          );
        }
        setIsGeneralLoading(false);
      }, 1500);
    };

    let badgeColor = "bg-gray-100 text-gray-600";
    if (concert.phase === "REGISTRATION")
      badgeColor = "bg-green-100 text-green-700";
    if (concert.phase === "PARTICIPATION")
      badgeColor = "bg-blue-100 text-blue-700";
    if (concert.phase === "REVEAL")
      badgeColor = "bg-orange-100 text-orange-700";
    if (concert.phase === "ENDED") badgeColor = "bg-gray-900 text-white";

    return (
      <div className="animate-fade-in pb-20">
        <button
          onClick={onBack}
          className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors font-medium"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Market
        </button>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* LEFT: Info */}
          <div className="lg:w-1/2 space-y-8">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video">
              <img
                src={concert.image}
                alt={concert.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider text-gray-900">
                {concert.category}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badgeColor}`}
                >
                  {concert.phase} Phase
                </div>
                {/* COUNTDOWN TIMER HERE */}
                {(concert.phase === "PARTICIPATION" ||
                  concert.phase === "REVEAL") &&
                  concert.deadline && (
                    <CountdownTimer deadline={concert.deadline} />
                  )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {concert.title}
              </h1>
              <p className={`text-xl font-medium ${BRAND_BLUE} mb-6`}>
                {concert.artist}
              </p>
              <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="flex items-start space-x-3">
                  <Calendar className="text-gray-400 mt-1" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">
                      Date
                    </p>
                    <p className="font-medium text-gray-900">{concert.date}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Lock className="text-gray-400 mt-1" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">
                      Min Deposit
                    </p>
                    <p className="font-medium text-gray-900">
                      {concert.minDeposit} USDT
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Action & Rank */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
              <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold flex items-center">
                    <Gavel className="mr-3" /> Console
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {step === 4
                      ? "Auction Closed"
                      : step === 3
                      ? "Reveal Phase"
                      : "Bidding Phase"}
                  </p>
                </div>
                {userState.status === "VERIFIED" && (
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    VERIFIED
                  </div>
                )}
                {userState.status === "WON" && (
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    YOU WON
                  </div>
                )}
                {userState.status === "LOST" && (
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    YOU LOST
                  </div>
                )}
              </div>

              <div className="p-8">
                {step !== 4 && (
                  <>
                    {step === 1 && (
                      <button
                        onClick={handleDeposit}
                        disabled={isGeneralLoading}
                        className="w-full py-4 bg-[#1a3cff] text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex justify-center items-center gap-2"
                      >
                        {isGeneralLoading ? (
                          <Loader className="animate-spin" />
                        ) : (
                          `Stake ${concert.minDeposit} USDT Deposit`
                        )}
                      </button>
                    )}

                    {step === 2 && (
                      <div className="space-y-8">
                        {concert.phase !== "PARTICIPATION" &&
                        concert.phase !== "REGISTRATION" ? (
                          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
                            <Clock className="mx-auto mb-2" size={32} />
                            <div>Bidding phase closed.</div>
                          </div>
                        ) : (
                          <>
                            {/* --- PART A: PUBLIC BLUFF --- */}
                            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                              <div className="flex justify-between items-center mb-4">
                                <h4 className="text-sm font-bold uppercase text-gray-500 flex items-center">
                                  <Globe size={16} className="mr-2" /> 1. Public
                                  Bluff
                                </h4>
                                <div className="flex items-center gap-2">
                                  <span className="text-3xl font-mono font-bold text-gray-900">
                                    {bluffM}
                                  </span>
                                  {bluffM > 0 && (
                                    <button
                                      onClick={clearBluff}
                                      className="p-1 hover:bg-gray-200 rounded-full"
                                    >
                                      <RotateCcw
                                        size={16}
                                        className="text-gray-500"
                                      />
                                    </button>
                                  )}
                                </div>
                              </div>

                              <div className="flex justify-center gap-3 flex-wrap mb-6">
                                {CHIPS.map((chip) => (
                                  <CasinoChip
                                    key={chip.value}
                                    value={chip.value}
                                    onClick={() => addChipToBluff(chip.value)}
                                  />
                                ))}
                              </div>

                              <button
                                onClick={handleBroadcastBluff}
                                disabled={isBroadcasting || bluffM === 0}
                                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                                  broadcastedBluff === bluffM && bluffM > 0
                                    ? "bg-[#1a3cff]/80 text-white cursor-default"
                                    : "bg-[#1a3cff] text-white hover:bg-blue-700 hover:shadow-lg"
                                }`}
                              >
                                {isBroadcasting ? (
                                  <Loader className="animate-spin" size={20} />
                                ) : broadcastedBluff === bluffM &&
                                  bluffM > 0 ? (
                                  <>
                                    <Check size={20} /> Bluff Broadcasted
                                  </>
                                ) : (
                                  <>
                                    <Send size={20} /> Broadcast Bluff
                                  </>
                                )}
                              </button>
                            </div>

                            {/* --- PART B: SECRET BID --- */}
                            <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-2 opacity-10">
                                <Lock size={64} className="text-blue-900" />
                              </div>

                              <h4 className="text-sm font-bold uppercase text-blue-600 mb-4 flex items-center">
                                <Lock size={16} className="mr-2" /> 2. Secret
                                Commitment
                              </h4>

                              <div className="space-y-4">
                                <div>
                                  <label className="text-xs text-blue-500 font-bold block mb-1">
                                    True Bid Amount (N)
                                  </label>
                                  <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-blue-200 focus-within:border-blue-500 transition-colors">
                                    <DollarSign
                                      size={16}
                                      className="text-blue-400 mr-2"
                                    />
                                    <input
                                      type="number"
                                      value={realN}
                                      onChange={(e) => setRealN(e.target.value)}
                                      placeholder="0"
                                      className="w-full bg-transparent outline-none font-mono text-lg font-bold text-blue-900 placeholder-blue-200"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="text-xs text-blue-500 font-bold block mb-1">
                                    Secret Password
                                  </label>
                                  <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-blue-200 focus-within:border-blue-500 transition-colors">
                                    <Key
                                      size={16}
                                      className="text-blue-400 mr-2"
                                    />
                                    <input
                                      type="password"
                                      value={password}
                                      onChange={(e) =>
                                        setPassword(e.target.value)
                                      }
                                      placeholder="Enter password"
                                      className="w-full bg-transparent outline-none font-mono text-lg text-blue-900 placeholder-blue-200"
                                    />
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={handleCommit}
                                disabled={isCommitting}
                                className="w-full mt-6 py-4 bg-[#1a3cff] text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                              >
                                {isCommitting ? (
                                  <Loader className="animate-spin" size={20} />
                                ) : userState.committed ? (
                                  "Update Sealed Bid"
                                ) : (
                                  "Seal & Commit Bid"
                                )}
                              </button>
                              <p className="text-[10px] text-center text-blue-400 mt-2">
                                Note: True Bid (N) must be less than Bluff (M).
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-4">
                        {concert.phase !== "REVEAL" ? (
                          <div className="text-center py-10 bg-blue-50/50 rounded-xl border border-dashed border-blue-200">
                            <Hourglass
                              className="mx-auto text-blue-400 mb-3 animate-pulse"
                              size={48}
                            />
                            <h4 className="text-blue-900 font-bold text-lg mb-1">
                              Bid Placed Successfully
                            </h4>
                            <p className="text-blue-600 text-sm px-8 mb-4">
                              Waiting for Reveal Phase...
                            </p>

                            <button
                              onClick={() => setIsEditingBid(true)}
                              className="px-6 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors flex items-center mx-auto"
                            >
                              <Edit3 size={14} className="mr-2" /> Change Secret
                              Bid
                            </button>
                          </div>
                        ) : !userState.revealed ? (
                          <>
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                              <Key
                                className="text-blue-500 shrink-0 mt-0.5"
                                size={20}
                              />
                              <div>
                                <h4 className="text-blue-900 font-bold text-sm uppercase mb-1">
                                  Demo Mode Active
                                </h4>
                                <p className="text-blue-700 text-sm">
                                  Simulated Bid: <strong>1180 Chips</strong>
                                  <br />
                                  Password: <strong>123</strong>
                                </p>
                              </div>
                            </div>

                            <div className="bg-yellow-50 p-3 text-sm text-yellow-800 rounded-lg">
                              Confirm your bid to verify results.
                            </div>
                            <input
                              type="number"
                              value={revealN}
                              onChange={(e) => setRevealN(e.target.value)}
                              placeholder="Confirm True Bid (N)"
                              className="w-full p-3 border rounded-lg"
                            />
                            <input
                              type="password"
                              value={revealPass}
                              onChange={(e) => setRevealPass(e.target.value)}
                              placeholder="Confirm Password"
                              className="w-full p-3 border rounded-lg"
                            />
                            <button
                              onClick={handleReveal}
                              disabled={isGeneralLoading}
                              className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold"
                            >
                              {isGeneralLoading ? (
                                <Loader className="animate-spin" />
                              ) : (
                                "Verify & Reveal"
                              )}
                            </button>
                          </>
                        ) : (
                          <div className="text-center py-10 bg-green-50/50 rounded-xl border border-green-200 animate-fade-in">
                            <Check
                              className="mx-auto text-green-500 mb-3"
                              size={56}
                            />
                            <h4 className="text-green-800 font-bold text-2xl mb-2">
                              Verified & Bid Recorded
                            </h4>
                            <p className="text-gray-600 mb-4 px-4">
                              You have successfully verified your bid of{" "}
                              <strong>{userState.savedN} Chips</strong>.
                              <br />
                              Your deposit has been refunded.
                            </p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                              <Clock size={14} /> Waiting for Final Results
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {step === 4 && userState.status === "WON" && (
                  <div className="text-center py-10 bg-green-50 rounded-xl border border-green-200">
                    <CheckCircle
                      className="mx-auto text-green-500 mb-4"
                      size={48}
                    />
                    <h4 className="text-green-800 font-bold text-xl">
                      Victory!
                    </h4>
                    <p className="text-green-600">Ticket secured!</p>
                  </div>
                )}
              </div>
            </div>

            <Leaderboard
              data={leaderboardData} // Pass the dynamic real-data list
              phase={concert.phase}
              draftBluff={step === 2 ? bluffM : 0}
              broadcastedBluff={broadcastedBluff}
            />
          </div>
        </div>
      </div>
    );
  };

  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 relative overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `linear-gradient(#1a3cff 0.5px, transparent 0.5px), linear-gradient(90deg, #1a3cff 0.5px, transparent 0.5px)`,
            backgroundSize: "40px 40px",
            transform:
              "perspective(500px) rotateX(60deg) translateY(-100px) scale(2)",
            transformOrigin: "top center",
          }}
        ></div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap'); body { font-family: 'Montserrat', sans-serif; }`}</style>

      {/* Chip Shop Modal */}
      {showChipShop && <ChipShopModal />}

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-24 right-4 z-[80] px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-3 animate-slide-in-right ${
            notification.type === "success"
              ? "bg-green-50 border-l-4 border-green-500"
              : "bg-red-50 border-l-4 border-red-500"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="text-green-600" size={24} />
          ) : (
            <AlertTriangle className="text-red-600" size={24} />
          )}
          <div>
            <h4
              className={`font-bold ${
                notification.type === "success"
                  ? "text-green-800"
                  : "text-red-800"
              }`}
            >
              {notification.type === "success" ? "Success" : "Alert"}
            </h4>
            <p className="text-sm text-gray-600">{notification.msg}</p>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => setCurrentView("landing")}
          >
            <span
              className={`text-2xl md:text-3xl font-light tracking-tighter ${BRAND_BLUE}`}
            >
              Latent<span className="font-bold">Bidding</span>
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => setCurrentView("market")}
              className={`text-sm font-medium ${
                currentView === "market" ? "text-blue-600" : "text-gray-500"
              }`}
            >
              MARKET
            </button>
            <button
              onClick={() => setCurrentView("my-tickets")}
              className={`text-sm font-medium ${
                currentView === "my-tickets" ? "text-blue-600" : "text-gray-500"
              }`}
            >
              ASSETS
            </button>
            {!walletAddress ? (
              <button
                onClick={connectWallet}
                className={`px-6 py-2.5 rounded-full ${BG_BLUE} text-white font-semibold shadow-lg hover:bg-blue-700 transition-all flex items-center space-x-2`}
              >
                <Wallet size={18} />
                <span>Connect</span>
              </button>
            ) : (
              <div className="flex items-center space-x-3 pl-6 border-l border-gray-200">
                <div className="flex flex-col items-end mr-2">
                  <span className="text-xs font-bold text-gray-900">
                    {usdtBalance.toFixed(2)} USDT
                  </span>
                  <div
                    className="flex items-center text-xs text-orange-500 font-bold cursor-pointer hover:underline"
                    onClick={() => setShowChipShop(true)}
                  >
                    <Coins size={10} className="mr-1" /> {chipBalance} Chips (+)
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="font-mono text-sm text-gray-700">
                    {walletAddress}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-8 py-12 relative z-10 min-h-[600px]">
        {currentView === "landing" && (
          <div className="flex flex-col items-center justify-center pt-10 pb-20 animate-fade-in">
            <div className="text-center max-w-4xl mx-auto px-4">
              <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-8">
                <Zap size={14} className="text-[#1a3cff]" />
                <span className="text-xs font-bold tracking-wide text-[#1a3cff] uppercase">
                  Commit-Reveal Protocol
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-light tracking-tighter text-gray-900 mb-8 leading-[0.9]">
                Fair <span className="font-bold text-[#1a3cff]">Auctions</span>
                <br />
                Zero <span className="font-bold text-gray-400">Spam</span>
              </h1>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setCurrentView("market")}
                  className={`px-10 py-4 rounded-full ${BG_BLUE} text-white text-lg font-bold shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all`}
                >
                  Start Bidding
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === "market" && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {CONCERTS.map((concert) => {
                let badgeColor = "bg-gray-100 text-gray-600";
                if (concert.phase === "REGISTRATION")
                  badgeColor = "bg-green-100 text-green-700";
                if (concert.phase === "PARTICIPATION")
                  badgeColor = "bg-blue-100 text-blue-700";
                if (concert.phase === "REVEAL")
                  badgeColor = "bg-orange-100 text-orange-700";
                if (concert.phase === "ENDED")
                  badgeColor = "bg-gray-900 text-white";

                return (
                  <div
                    key={concert.id}
                    onClick={() => navigateToDetail(concert)}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full cursor-pointer transform hover:-translate-y-1"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <div
                        className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badgeColor}`}
                      >
                        {concert.phase}
                      </div>
                      <img
                        src={concert.image}
                        alt={concert.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1 group-hover:text-[#1a3cff] transition-colors">
                        {concert.title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4">
                        {concert.artist}
                      </p>
                      <div className="border-t border-gray-50 pt-4 mt-auto text-center text-sm font-bold text-[#1a3cff] flex items-center justify-center">
                        View {concert.phase === "ENDED" ? "Results" : "Auction"}{" "}
                        <ArrowRight size={16} className="ml-1" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentView === "detail" && selectedConcert && (
          <ConcertDetailPage
            concert={selectedConcert}
            onBack={() => setCurrentView("market")}
          />
        )}

        {currentView === "my-tickets" && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-3xl font-light mb-8 flex items-center">
              <Ticket className={`mr-3 ${BRAND_BLUE}`} size={32} /> Digital
              Assets
            </h2>
            <div className="space-y-6">
              {myTickets.map((ticket, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 relative overflow-hidden"
                >
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1.5 ${BG_BLUE}`}
                  ></div>
                  <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={ticket.image}
                      alt={ticket.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {ticket.title}
                        </h3>
                        <p className={`font-medium ${BRAND_BLUE}`}>
                          {ticket.artist}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-mono border border-blue-100">
                        <ShieldCheck size={14} />
                        <span>ID: #{ticket.tokenId}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                      <Gavel size={14} /> Winning Bid:{" "}
                      <span className="font-bold text-gray-900">
                        {ticket.winningBid} Chips
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
