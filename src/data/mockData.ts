import { UserProfile, WalletState, InvestmentPlan, ActiveInvestment, Transaction, ReferralMember, ChartDataPoint, NotificationItem, PlatformContacts } from '../types';

export const DEFAULT_CONTACTS: PlatformContacts = {
  mpesaPaybill: '505031',
  mpesaTillNumber: '892134',
  supportPhone: '+254 700 505 031',
  supportEmail: 'cheruyot.dennis@student.moringaschool.com',
  officeLocation: 'Delta Corner Towers, 7th Floor, Westlands, Nairobi, Kenya',
  whatsappSupport: '+254 700 505 031',
  telegramSupport: '@FortuneInvestmentKE',
  kesUsdExchangeRate: 130.00 // 1 USD = 130 KES
};

export const INITIAL_USER: UserProfile = {
  id: 'usr_89213',
  fullName: 'Dennis Cheruiyot',
  username: 'DennisFortune',
  email: 'cheruyot.dennis@student.moringaschool.com',
  phone: '+254 712 345 678',
  mpesaNumber: '0712345678',
  country: 'Kenya',
  referralCode: '505031',
  referredBy: 'AlphaCapital_KE (505031)',
  joinedDate: '2025-11-14',
  tier: 'Gold VIP',
  kycStatus: 'Verified',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  twoFactorEnabled: true,
  walletAddressUSDT: 'TXq7j8kP39LmNxR8w92Z0A1m4kVyTe6pQc'
};


export const INITIAL_WALLET: WalletState = {
  totalBalance: 34850.75,
  availableCash: 6450.25,
  activeInvested: 28400.50,
  totalEarnings: 12940.80,
  todayYield: 342.60,
  referralEarnings: 3120.00,
  pendingWithdrawals: 0
};

export const INVESTMENT_PLANS: InvestmentPlan[] = [
  {
    id: 'plan_silver',
    name: 'Silver Growth',
    tagline: 'Ideal for starter wealth & steady compounding',
    dailyRoi: 2.2, // 2.2% daily
    durationDays: 15,
    minDeposit: 100,
    maxDeposit: 2499,
    principalReturn: true,
    colorTheme: 'from-sky-500 to-blue-600',
    popular: false,
    features: [
      '2.20% Daily Yield Payout',
      '15 Days Capital Lock',
      'Principal 100% Returned',
      'Daily Automatic Settlement',
      'Instant Withdrawal Enabled',
      'Standard Support 24/7'
    ],
    totalInvestors: 1420,
    totalPoolValue: 428000
  },
  {
    id: 'plan_gold',
    name: 'Gold Accelerator',
    tagline: 'High-frequency algorithmic alpha yield generator',
    dailyRoi: 3.5, // 3.5% daily
    durationDays: 30,
    minDeposit: 2500,
    maxDeposit: 9999,
    principalReturn: true,
    colorTheme: 'from-blue-600 to-cyan-600',
    popular: true,
    features: [
      '3.50% Daily Yield Payout',
      '30 Days Cycle Duration',
      'Compound Growth Multiplier',
      'Principal Returned on Maturity',
      'Zero Fee Withdrawals',
      'Priority VIP Support'
    ],
    totalInvestors: 3840,
    totalPoolValue: 1895000
  },
  {
    id: 'plan_platinum',
    name: 'Platinum Elite Yield',
    tagline: 'Maximum leverage arbitrage for substantial portfolios',
    dailyRoi: 4.8, // 4.8% daily
    durationDays: 45,
    minDeposit: 10000,
    maxDeposit: 49999,
    principalReturn: true,
    colorTheme: 'from-indigo-600 to-sky-700',
    popular: false,
    features: [
      '4.80% Daily Yield Payout',
      '45 Days Cycle Duration',
      'Auto-Reinvest Daily Option',
      'Institutional Hedging Cover',
      'Direct Account Manager',
      'Unlimited Instant Payouts'
    ],
    totalInvestors: 950,
    totalPoolValue: 4620000
  },
  {
    id: 'plan_institutional',
    name: 'Sovereign Institutional',
    tagline: 'Dedicated algorithmic liquidity pool with maximum returns',
    dailyRoi: 6.2, // 6.2% daily
    durationDays: 60,
    minDeposit: 50000,
    maxDeposit: 500000,
    principalReturn: true,
    colorTheme: 'from-slate-900 to-blue-900',
    popular: false,
    features: [
      '6.20% Daily Yield Payout',
      '60 Days High-Yield Horizon',
      'Insured Principal Guarantee',
      'Private OTC Liquidity Desk',
      'Quarterly Dividend Bonus',
      'Executive Concierge 24/7'
    ],
    totalInvestors: 180,
    totalPoolValue: 12400000
  }
];

export const INITIAL_ACTIVE_INVESTMENTS: ActiveInvestment[] = [
  {
    id: 'inv_9041',
    planId: 'plan_gold',
    planName: 'Gold Accelerator (3.5% Daily)',
    investedAmount: 15000.00,
    dailyRoi: 3.5,
    dailyYieldAmount: 525.00,
    totalEarned: 6300.00,
    startDate: '2026-08-07',
    maturityDate: '2026-09-06',
    daysPassed: 12,
    totalDays: 30,
    status: 'ACTIVE',
    lastPayoutTime: 'Today at 00:00 UTC',
    autoReinvest: false
  },
  {
    id: 'inv_8820',
    planId: 'plan_silver',
    planName: 'Silver Growth (2.2% Daily)',
    investedAmount: 3400.50,
    dailyRoi: 2.2,
    dailyYieldAmount: 74.81,
    totalEarned: 748.10,
    startDate: '2026-08-09',
    maturityDate: '2026-08-24',
    daysPassed: 10,
    totalDays: 15,
    status: 'ACTIVE',
    lastPayoutTime: 'Today at 00:00 UTC',
    autoReinvest: true
  },
  {
    id: 'inv_7914',
    planId: 'plan_platinum',
    planName: 'Platinum Elite Yield (4.8% Daily)',
    investedAmount: 10000.00,
    dailyRoi: 4.8,
    dailyYieldAmount: 480.00,
    totalEarned: 5760.00,
    startDate: '2026-08-01',
    maturityDate: '2026-09-15',
    daysPassed: 18,
    totalDays: 45,
    status: 'ACTIVE',
    lastPayoutTime: 'Today at 00:00 UTC',
    autoReinvest: false
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_98124',
    type: 'ROI_PAYOUT',
    amount: 1079.81,
    currency: 'USDT',
    fee: 0,
    status: 'COMPLETED',
    timestamp: '2026-08-19 00:01 UTC',
    txHash: '0x8f72a1b94e3390fa41e784531889ab8c19902341bba67',
    methodOrAddress: 'Fortune Smart Contract Yield Engine',
    note: 'Daily automated ROI distribution (3 Active Plans)'
  },
  {
    id: 'tx_98012',
    type: 'DEPOSIT',
    amount: 500.00,
    currency: 'USD',
    fee: 0,
    status: 'COMPLETED',
    timestamp: '2026-08-18 19:15 UTC',
    txHash: 'SLD89X7Q21',
    methodOrAddress: 'M-PESA Express (STK Push: 254712345678)',
    note: 'Lipa Na M-PESA deposit KES 65,000 via Paybill 505031',
    mpesaReceiptNumber: 'SLD89X7Q21'
  },
  {
    id: 'tx_97645',
    type: 'REFERRAL_BONUS',
    amount: 280.00,
    currency: 'USDT',
    fee: 0,
    status: 'COMPLETED',
    timestamp: '2026-08-18 16:42 UTC',
    txHash: '0x12b04fec8794aa923982181734918e788bc554311099e',
    methodOrAddress: 'Affiliate Tier 1 (user: @crypto_kevin)',
    note: 'Direct 8% commission on $3,500 deposit'
  },
  {
    id: 'tx_96411',
    type: 'WITHDRAWAL',
    amount: 250.00,
    currency: 'USD',
    fee: 0,
    status: 'COMPLETED',
    timestamp: '2026-08-16 11:20 UTC',
    txHash: 'SKL491823M',
    methodOrAddress: 'M-PESA B2C Payout (254712345678)',
    note: 'Instant M-PESA withdrawal KES 32,500 to Dennis Cheruiyot',
    mpesaReceiptNumber: 'SKL491823M'
  },
  {
    id: 'tx_95209',
    type: 'INVESTMENT',
    amount: 15000.00,
    currency: 'USDT',
    fee: 0,
    status: 'COMPLETED',
    timestamp: '2026-08-07 09:15 UTC',
    txHash: '0x39fa0919248aa019280bba398402938174981014e7a',
    methodOrAddress: 'Gold Accelerator Plan #inv_9041',
    note: 'Locked for 30 days @ 3.50% daily rate'
  },
  {
    id: 'tx_94301',
    type: 'DEPOSIT',
    amount: 20000.00,
    currency: 'USDT',
    fee: 0,
    status: 'COMPLETED',
    timestamp: '2026-08-07 08:50 UTC',
    txHash: '0x99102438ea2019fe8290310238491834910293481239',
    methodOrAddress: 'USDT (TRC-20 Blockchain Network)',
    note: 'Instant deposit confirmed by 12 network blocks'
  }
];


export const INITIAL_REFERRALS: ReferralMember[] = [
  {
    id: 'ref_1',
    username: 'crypto_kevin',
    tierLevel: 1,
    joinedDate: '2026-08-18',
    activeDeposits: 3500,
    commissionEarned: 280,
    status: 'Active'
  },
  {
    id: 'ref_2',
    username: 'sarah_trader',
    tierLevel: 1,
    joinedDate: '2026-08-05',
    activeDeposits: 1500,
    commissionEarned: 120,
    status: 'Active'
  },
  {
    id: 'ref_3',
    username: 'david_growth',
    tierLevel: 1,
    joinedDate: '2026-07-29',
    activeDeposits: 12000,
    commissionEarned: 960,
    status: 'Active'
  },
  {
    id: 'ref_4',
    username: 'elena_fx',
    tierLevel: 2,
    joinedDate: '2026-08-10',
    activeDeposits: 5000,
    commissionEarned: 150,
    status: 'Active'
  },
  {
    id: 'ref_5',
    username: 'marco_invests',
    tierLevel: 2,
    joinedDate: '2026-08-12',
    activeDeposits: 8400,
    commissionEarned: 252,
    status: 'Active'
  },
  {
    id: 'ref_6',
    username: 'alex_nordic',
    tierLevel: 3,
    joinedDate: '2026-08-14',
    activeDeposits: 4000,
    commissionEarned: 40,
    status: 'Active'
  }
];

export const HISTORICAL_GROWTH_DATA: Record<string, ChartDataPoint[]> = {
  '7D': [
    { date: 'Aug 13', portfolioValue: 31200, investedCapital: 28400, totalProfit: 9840, dailyEarnings: 990 },
    { date: 'Aug 14', portfolioValue: 31950, investedCapital: 28400, totalProfit: 10450, dailyEarnings: 1020 },
    { date: 'Aug 15', portfolioValue: 32680, investedCapital: 28400, totalProfit: 11120, dailyEarnings: 1040 },
    { date: 'Aug 16', portfolioValue: 30800, investedCapital: 28400, totalProfit: 11480, dailyEarnings: 1050 }, // withdrawal of $2.5k
    { date: 'Aug 17', portfolioValue: 32100, investedCapital: 28400, totalProfit: 12150, dailyEarnings: 1060 },
    { date: 'Aug 18', portfolioValue: 33450, investedCapital: 28400, totalProfit: 12620, dailyEarnings: 1070 },
    { date: 'Aug 19', portfolioValue: 34850, investedCapital: 28400, totalProfit: 12940, dailyEarnings: 1080 },
  ],
  '1M': [
    { date: 'Jul 21', portfolioValue: 10000, investedCapital: 10000, totalProfit: 0, dailyEarnings: 0 },
    { date: 'Jul 26', portfolioValue: 11200, investedCapital: 10000, totalProfit: 1200, dailyEarnings: 240 },
    { date: 'Jul 31', portfolioValue: 12850, investedCapital: 10000, totalProfit: 2850, dailyEarnings: 330 },
    { date: 'Aug 05', portfolioValue: 14900, investedCapital: 10000, totalProfit: 4900, dailyEarnings: 410 },
    { date: 'Aug 10', portfolioValue: 27500, investedCapital: 25000, totalProfit: 7500, dailyEarnings: 880 },
    { date: 'Aug 15', portfolioValue: 32680, investedCapital: 28400, totalProfit: 11120, dailyEarnings: 1040 },
    { date: 'Aug 19', portfolioValue: 34850, investedCapital: 28400, totalProfit: 12940, dailyEarnings: 1080 }
  ],
  '3M': [
    { date: 'May 20', portfolioValue: 3000, investedCapital: 3000, totalProfit: 0, dailyEarnings: 65 },
    { date: 'Jun 10', portfolioValue: 5400, investedCapital: 4000, totalProfit: 1400, dailyEarnings: 110 },
    { date: 'Jul 01', portfolioValue: 8900, investedCapital: 6500, totalProfit: 2400, dailyEarnings: 190 },
    { date: 'Jul 20', portfolioValue: 13500, investedCapital: 10000, totalProfit: 3500, dailyEarnings: 280 },
    { date: 'Aug 01', portfolioValue: 21000, investedCapital: 15000, totalProfit: 6000, dailyEarnings: 550 },
    { date: 'Aug 19', portfolioValue: 34850, investedCapital: 28400, totalProfit: 12940, dailyEarnings: 1080 }
  ],
  '1Y': [
    { date: 'Sep 25', portfolioValue: 1000, investedCapital: 1000, totalProfit: 0, dailyEarnings: 22 },
    { date: 'Nov 25', portfolioValue: 3200, investedCapital: 2000, totalProfit: 1200, dailyEarnings: 55 },
    { date: 'Jan 26', portfolioValue: 7800, investedCapital: 5000, totalProfit: 2800, dailyEarnings: 140 },
    { date: 'Mar 26', portfolioValue: 14200, investedCapital: 9000, totalProfit: 5200, dailyEarnings: 310 },
    { date: 'May 26', portfolioValue: 22800, investedCapital: 16000, totalProfit: 6800, dailyEarnings: 580 },
    { date: 'Aug 26', portfolioValue: 34850, investedCapital: 28400, totalProfit: 12940, dailyEarnings: 1080 }
  ]
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Daily ROI Credited',
    message: '$1,079.81 has been added to your available cash balance from your active investment portfolios.',
    timestamp: '2 hours ago',
    read: false,
    type: 'payout'
  },
  {
    id: 'n2',
    title: 'Referral Commission Received',
    message: '$280.00 commission earned from @crypto_kevin via your referral link (#505031).',
    timestamp: '16 hours ago',
    read: false,
    type: 'referral'
  },
  {
    id: 'n3',
    title: 'Withdrawal Completed',
    message: 'Your withdrawal of $2,500 USDT has successfully settled to your TRC20 wallet.',
    timestamp: '3 days ago',
    read: true,
    type: 'deposit'
  },
  {
    id: 'n4',
    title: 'Security Verified',
    message: 'Two-Factor Authentication (2FA) is active and your KYC tier is Level 3 Verified.',
    timestamp: '1 week ago',
    read: true,
    type: 'security'
  }
];

export const CRYPTO_RATES = [
  { pair: 'USD / KES (M-PESA)', price: '130.00 KES', change: 'Live Rate', positive: true },
  { pair: 'BTC / USD', price: '$94,320.00', change: '+3.42%', positive: true },
  { pair: 'ETH / USD', price: '$3,180.45', change: '+2.18%', positive: true },
  { pair: 'USDT / USD', price: '$1.0002', change: '+0.01%', positive: true },
  { pair: 'FORTUNE Index', price: '$148.90', change: '+7.85%', positive: true },
  { pair: 'M-PESA Paybill', price: '505031', change: 'Active', positive: true },
];

