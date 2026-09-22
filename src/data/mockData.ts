import { UserProfile, WalletState, InvestmentPlan, ActiveInvestment, Transaction, ReferralMember, ChartDataPoint, NotificationItem, PlatformContacts } from '../types';

export const DEFAULT_CONTACTS: PlatformContacts = {
  mpesaPaybill: '505031',
  mpesaTillNumber: '1234',
  supportPhone: '+254 700 505 031',
  supportEmail: 'support@quantiqprime.com',
  officeLocation: 'Delta Corner Towers, 7th Floor, Westlands, Nairobi, Kenya',
  whatsappSupport: '+254 700 505 031',
  telegramSupport: '@QuantiqPrimeOfficial',
  kesUsdExchangeRate: 130.00, // 1 USD = 130 KES
  cryptoDepositWallets: {
    usdtTrc20: 'TY7Q6B92PqmK89vXZ01mNa4kVyTe6pQc99',
    usdtErc20: '0x89aF49321B008A2d319808389201a4e788bc5541',
    btc: 'bc1q9p8200193892019384910293481290a1841e7',
    eth: '0x4428019389201938920193849102934812903491'
  }
};

export const INITIAL_USER: UserProfile = {
  id: 'usr_89213',
  fullName: 'Executive Member',
  username: 'VIPInvestor',
  email: 'investor@quantiqprime.com',
  phone: '+254 712 345 678',
  mpesaNumber: '0712345678',
  country: 'Kenya',
  referralCode: '505031',
  referredBy: 'Quantiq Partner #505031',
  joinedDate: '2026-01-15',
  tier: 'Gold',
  kycStatus: 'Verified',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  twoFactorEnabled: true,
  walletAddressUSDT: 'TXq7j8kP39LmNxR8w92Z0A1m4kVyTe6pQc',
  isAdmin: false,
  role: 'user'
};



export const INITIAL_WALLET: WalletState = {
  totalBalance: 84850.00,
  availableCash: 14850.00,
  activeInvested: 70000.00,
  totalEarnings: 38450.00,
  todayYield: 5250.00,
  referralEarnings: 6000.00,
  pendingWithdrawals: 0
};

export const INVESTMENT_PLANS: InvestmentPlan[] = [
  {
    id: 'plan_bronze',
    name: 'Bronze',
    tagline: 'Ksh 5K - 30K Allocation • 10 Days Horizon • 7.5% Daily ROI',
    dailyRoi: 7.5, // 7.5% daily
    durationDays: 10,
    minDeposit: 5000,
    maxDeposit: 30000,
    principalReturn: true,
    colorTheme: 'from-amber-900 via-amber-800 to-amber-950',
    popular: false,
    features: [
      '7.50% Daily Automated Yield',
      '10 Days Cycle Duration',
      '10% Direct Referral Bonus on Referee Stake',
      'Principal 100% Returned on Maturity',
      'Instant Daily Settlement to M-PESA / Wallet',
      'Standard 24/7 Priority Support'
    ],
    totalInvestors: 2140,
    totalPoolValue: 14280000
  },
  {
    id: 'plan_silver',
    name: 'Silver',
    tagline: 'Ksh 30K - 100K Allocation • 15 Days Horizon • 7.5% Daily ROI',
    dailyRoi: 7.5, // 7.5% daily
    durationDays: 15,
    minDeposit: 30000,
    maxDeposit: 100000,
    principalReturn: true,
    colorTheme: 'from-slate-500 via-slate-400 to-slate-600',
    popular: true,
    features: [
      '7.50% Daily Automated Yield',
      '15 Days Cycle Duration',
      '10% Direct Referral Bonus on Referee Stake',
      'Principal 100% Returned on Maturity',
      'Zero Fee Instant M-PESA Withdrawals',
      'High-Frequency Algorithmic Yield'
    ],
    totalInvestors: 4890,
    totalPoolValue: 58950000
  },
  {
    id: 'plan_gold',
    name: 'Gold',
    tagline: 'Ksh 100K - 200K Allocation • 15 Days Horizon • 7.5% Daily ROI',
    dailyRoi: 7.5, // 7.5% daily
    durationDays: 15,
    minDeposit: 100000,
    maxDeposit: 200000,
    principalReturn: true,
    colorTheme: 'from-amber-600 via-yellow-500 to-amber-700',
    popular: false,
    features: [
      '7.50% Daily Automated Yield',
      '15 Days Cycle Duration',
      '10% Direct Referral Bonus on Referee Stake',
      'Insured Principal Capital Guarantee',
      'Direct Institutional Account Manager',
      'Unlimited Fast Liquidity Access'
    ],
    totalInvestors: 1250,
    totalPoolValue: 146200000
  },
  {
    id: 'plan_platinum',
    name: 'Platinum (VIP)',
    tagline: 'Ksh 200K - 500K Allocation • 20 Days Horizon • 7.5% Daily ROI',
    dailyRoi: 7.5, // 7.5% daily
    durationDays: 20,
    minDeposit: 200000,
    maxDeposit: 500000,
    principalReturn: true,
    colorTheme: 'from-slate-950 via-teal-950 to-amber-950',
    popular: false,
    features: [
      '7.50% Daily Automated Yield',
      '20 Days High-Yield Horizon',
      '10% Direct Referral Bonus on Referee Stake',
      'Dedicated Private Liquidity Desk',
      'Executive Concierge 24/7 Access',
      'Guaranteed 150% Net ROI + Capital'
    ],
    totalInvestors: 320,
    totalPoolValue: 384000000
  }
];


export const INITIAL_ACTIVE_INVESTMENTS: ActiveInvestment[] = [
  {
    id: 'inv_9041',
    planId: 'plan_silver',
    planName: 'Silver (Ksh 30K-100K @ 7.5% Daily)',
    investedAmount: 50000.00,
    dailyRoi: 7.5,
    dailyYieldAmount: 3750.00,
    totalEarned: 33750.00,
    startDate: '2026-08-18',
    maturityDate: '2026-09-02',
    daysPassed: 9,
    totalDays: 15,
    status: 'ACTIVE',
    lastPayoutTime: 'Today at 00:00 UTC',
    autoReinvest: false
  },
  {
    id: 'inv_8820',
    planId: 'plan_bronze',
    planName: 'Bronze (Ksh 5K-30K @ 7.5% Daily)',
    investedAmount: 20000.00,
    dailyRoi: 7.5,
    dailyYieldAmount: 1500.00,
    totalEarned: 9000.00,
    startDate: '2026-08-21',
    maturityDate: '2026-08-31',
    daysPassed: 6,
    totalDays: 10,
    status: 'ACTIVE',
    lastPayoutTime: 'Today at 00:00 UTC',
    autoReinvest: true
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_98124',
    type: 'ROI_PAYOUT',
    amount: 5250.00,
    currency: 'KES',
    fee: 0,
    status: 'COMPLETED',
    timestamp: '2026-08-27 00:01 EAT',
    txHash: '0x8f72a1b94e3390fa41e784531889ab8c19902341bba67',
    methodOrAddress: 'Quantiq Prime Algorithmic Engine',
    note: 'Daily automated 7.5% ROI distribution (2 Active Contracts)'
  },
  {
    id: 'tx_98012',
    type: 'DEPOSIT',
    amount: 65000.00,
    currency: 'KES',
    fee: 0,
    status: 'COMPLETED',
    timestamp: '2026-08-26 19:15 EAT',
    txHash: 'SLD89X7Q21',
    methodOrAddress: 'M-PESA Express (STK Push: 254712345678)',
    note: 'Lipa Na M-PESA deposit Ksh 65,000 via Paybill 505031',
    mpesaReceiptNumber: 'SLD89X7Q21'
  },
  {
    id: 'tx_97645',
    type: 'REFERRAL_BONUS',
    amount: 5000.00,
    currency: 'KES',
    fee: 0,
    status: 'COMPLETED',
    timestamp: '2026-08-26 16:42 EAT',
    txHash: '0x12b04fec8794aa923982181734918e788bc554311099e',
    methodOrAddress: 'Affiliate Direct (user: @crypto_kevin)',
    note: 'Direct 10% commission on referee Ksh 50,000 stake'
  },
  {
    id: 'tx_96411',
    type: 'WITHDRAWAL',
    amount: 32500.00,
    currency: 'KES',
    fee: 0,
    status: 'COMPLETED',
    timestamp: '2026-08-25 11:20 EAT',
    txHash: 'SKL491823M',
    methodOrAddress: 'M-PESA B2C Payout (254712345678)',
    note: 'Instant M-PESA withdrawal Ksh 32,500 to Verified Account',
    mpesaReceiptNumber: 'SKL491823M'
  },
  {
    id: 'tx_95209',
    type: 'INVESTMENT',
    amount: 50000.00,
    currency: 'KES',
    fee: 0,
    status: 'COMPLETED',
    timestamp: '2026-08-18 09:15 EAT',
    txHash: '0x39fa0919248aa019280bba398402938174981014e7a',
    methodOrAddress: 'Silver Yield Contract #inv_9041',
    note: 'Locked for 15 days @ 7.50% daily interest'
  },
  {
    id: 'tx_94301',
    type: 'DEPOSIT',
    amount: 70000.00,
    currency: 'KES',
    fee: 0,
    status: 'COMPLETED',
    timestamp: '2026-08-18 08:50 EAT',
    txHash: '0x99102438ea2019fe8290310238491834910293481239',
    methodOrAddress: 'Lipa Na M-PESA Paybill 505031',
    note: 'Instant deposit confirmed and credited'
  }
];


export const INITIAL_REFERRALS: ReferralMember[] = [
  {
    id: 'ref_1',
    username: 'crypto_kevin',
    tierLevel: 1,
    joinedDate: '2026-08-18',
    activeDeposits: 50000,
    commissionEarned: 5000, // 10% of 50000
    status: 'Active'
  },
  {
    id: 'ref_2',
    username: 'sarah_trader',
    tierLevel: 1,
    joinedDate: '2026-08-05',
    activeDeposits: 100000,
    commissionEarned: 10000, // 10% of 100000
    status: 'Active'
  },
  {
    id: 'ref_3',
    username: 'david_growth',
    tierLevel: 1,
    joinedDate: '2026-07-29',
    activeDeposits: 30000,
    commissionEarned: 3000, // 10% of 30000
    status: 'Active'
  },
  {
    id: 'ref_4',
    username: 'elena_fx',
    tierLevel: 2,
    joinedDate: '2026-08-10',
    activeDeposits: 20000,
    commissionEarned: 1000, // 5% tier 2
    status: 'Active'
  },
  {
    id: 'ref_5',
    username: 'marco_invests',
    tierLevel: 2,
    joinedDate: '2026-08-12',
    activeDeposits: 50000,
    commissionEarned: 2500, // 5% tier 2
    status: 'Active'
  },
  {
    id: 'ref_6',
    username: 'alex_nordic',
    tierLevel: 3,
    joinedDate: '2026-08-14',
    activeDeposits: 20000,
    commissionEarned: 400, // 2% tier 3
    status: 'Active'
  }
];

export const HISTORICAL_GROWTH_DATA: Record<string, ChartDataPoint[]> = {
  '7D': [
    { date: 'Aug 13', portfolioValue: 62000, investedCapital: 50000, totalProfit: 12000, dailyEarnings: 3750 },
    { date: 'Aug 14', portfolioValue: 65750, investedCapital: 50000, totalProfit: 15750, dailyEarnings: 3750 },
    { date: 'Aug 15', portfolioValue: 69500, investedCapital: 50000, totalProfit: 19500, dailyEarnings: 3750 },
    { date: 'Aug 16', portfolioValue: 73250, investedCapital: 50000, totalProfit: 23250, dailyEarnings: 3750 },
    { date: 'Aug 17', portfolioValue: 77000, investedCapital: 50000, totalProfit: 27000, dailyEarnings: 3750 },
    { date: 'Aug 18', portfolioValue: 80750, investedCapital: 70000, totalProfit: 30750, dailyEarnings: 5250 },
    { date: 'Aug 19', portfolioValue: 84850, investedCapital: 70000, totalProfit: 38450, dailyEarnings: 5250 },
  ],
  '1M': [
    { date: 'Jul 21', portfolioValue: 20000, investedCapital: 20000, totalProfit: 0, dailyEarnings: 1500 },
    { date: 'Jul 26', portfolioValue: 27500, investedCapital: 20000, totalProfit: 7500, dailyEarnings: 1500 },
    { date: 'Jul 31', portfolioValue: 35000, investedCapital: 20000, totalProfit: 15000, dailyEarnings: 1500 },
    { date: 'Aug 05', portfolioValue: 48000, investedCapital: 30000, totalProfit: 18000, dailyEarnings: 2250 },
    { date: 'Aug 10', portfolioValue: 59250, investedCapital: 40000, totalProfit: 19250, dailyEarnings: 3000 },
    { date: 'Aug 15', portfolioValue: 69500, investedCapital: 50000, totalProfit: 19500, dailyEarnings: 3750 },
    { date: 'Aug 19', portfolioValue: 84850, investedCapital: 70000, totalProfit: 38450, dailyEarnings: 5250 }
  ],
  '3M': [
    { date: 'May 20', portfolioValue: 10000, investedCapital: 10000, totalProfit: 0, dailyEarnings: 750 },
    { date: 'Jun 10', portfolioValue: 21250, investedCapital: 15000, totalProfit: 6250, dailyEarnings: 1125 },
    { date: 'Jul 01', portfolioValue: 35000, investedCapital: 25000, totalProfit: 10000, dailyEarnings: 1875 },
    { date: 'Jul 20', portfolioValue: 52500, investedCapital: 35000, totalProfit: 17500, dailyEarnings: 2625 },
    { date: 'Aug 01', portfolioValue: 68000, investedCapital: 50000, totalProfit: 18000, dailyEarnings: 3750 },
    { date: 'Aug 19', portfolioValue: 84850, investedCapital: 70000, totalProfit: 38450, dailyEarnings: 5250 }
  ],
  '1Y': [
    { date: 'Sep 25', portfolioValue: 5000, investedCapital: 5000, totalProfit: 0, dailyEarnings: 375 },
    { date: 'Nov 25', portfolioValue: 16250, investedCapital: 10000, totalProfit: 6250, dailyEarnings: 750 },
    { date: 'Jan 26', portfolioValue: 32500, investedCapital: 20000, totalProfit: 12500, dailyEarnings: 1500 },
    { date: 'Mar 26', portfolioValue: 48750, investedCapital: 30000, totalProfit: 18750, dailyEarnings: 2250 },
    { date: 'May 26', portfolioValue: 65000, investedCapital: 45000, totalProfit: 20000, dailyEarnings: 3375 },
    { date: 'Aug 26', portfolioValue: 84850, investedCapital: 70000, totalProfit: 38450, dailyEarnings: 5250 }
  ]
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Daily 7.5% ROI Credited',
    message: 'Ksh 5,250.00 has been added to your available balance from your active investment contracts.',
    timestamp: '2 hours ago',
    read: false,
    type: 'payout'
  },
  {
    id: 'n2',
    title: '10% Referral Commission Received',
    message: 'Ksh 5,000.00 direct bonus earned from @crypto_kevin via your referral link (#505031).',
    timestamp: '16 hours ago',
    read: false,
    type: 'referral'
  },
  {
    id: 'n3',
    title: 'M-PESA Withdrawal Settled',
    message: 'Your payout of Ksh 32,500 has been sent to M-PESA line 0712345678 (Receipt: SKL491823M).',
    timestamp: '3 days ago',
    read: true,
    type: 'mpesa'
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
  { pair: 'DAILY ROI', price: '7.50% FIXED', change: 'Automated', positive: true },
  { pair: 'REFERRAL BONUS', price: '10.00% DIRECT', change: 'On Stake', positive: true },
  { pair: 'M-PESA PAYBILL', price: '505031', change: 'Instant KES', positive: true },
  { pair: 'USDT / KES', price: 'Ksh 130.00', change: '+0.25%', positive: true },
  { pair: 'USD / KES', price: 'Ksh 129.50', change: '+0.15%', positive: true },
  { pair: 'BTC / KES', price: 'Ksh 12,480,000', change: '+4.12%', positive: true },
  { pair: 'ETH / KES', price: 'Ksh 428,500', change: '+3.28%', positive: true }
];


