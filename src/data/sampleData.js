export const restaurant = {
  name: 'Highway Spice Junction',
  tagline: 'NH-48 · Open 24×7',
  estimatedWait: 12
}

export const menu = [
  { id: 1, name: 'Butter Chicken',        price: 320, veg: false, popular: true,  category: 'mains',     emoji: '🍗', gradient: ['#fbbf24', '#f43f5e'], rating: 4.7, reviews: 286, prepTime: 18, tag: "Chef's special", description: 'Slow-cooked tomato gravy, butter, mild kashmiri chilli' },
  { id: 2, name: 'Paneer Butter Masala',  price: 280, veg: true,  popular: true,  category: 'mains',     emoji: '🧀', gradient: ['#fdba74', '#ef4444'], rating: 4.6, reviews: 312, prepTime: 14, tag: 'Bestseller',      description: 'Cottage cheese in a rich cashew-tomato gravy' },
  { id: 3, name: 'Veg Biryani',           price: 220, veg: true,  popular: false, category: 'biryani',   emoji: '🍚', gradient: ['#fde047', '#f59e0b'], rating: 4.4, reviews: 198, prepTime: 22, tag: null,              description: 'Long-grain basmati, saffron, mint, fried onions' },
  { id: 4, name: 'Chicken Biryani',       price: 280, veg: false, popular: true,  category: 'biryani',   emoji: '🍛', gradient: ['#f59e0b', '#c2410c'], rating: 4.8, reviews: 421, prepTime: 25, tag: 'Most loved',      description: 'Dum-cooked basmati with bone-in chicken, raita & salan' },
  { id: 5, name: 'Tandoori Roti',         price:  25, veg: true,  popular: false, category: 'breads',    emoji: '🫓', gradient: ['#fde68a', '#fbbf24'], rating: 4.3, reviews:  92, prepTime:  6, tag: null,              description: 'Fresh from the tandoor, charred edges' },
  { id: 6, name: 'Butter Naan',           price:  45, veg: true,  popular: false, category: 'breads',    emoji: '🍞', gradient: ['#fef3c7', '#facc15'], rating: 4.5, reviews: 140, prepTime:  6, tag: null,              description: 'Soft naan brushed with white butter' },
  { id: 7, name: 'Masala Dosa',           price: 140, veg: true,  popular: true,  category: 'breakfast', emoji: '🥞', gradient: ['#fde047', '#f97316'], rating: 4.6, reviews: 274, prepTime: 10, tag: 'Breakfast pick',  description: 'Crispy dosa, spiced potato filling, coconut chutney' },
  { id: 8, name: 'Filter Coffee',         price:  60, veg: true,  popular: false, category: 'drinks',    emoji: '☕', gradient: ['#a16207', '#292524'], rating: 4.7, reviews: 156, prepTime:  4, tag: null,              description: 'South Indian filter decoction with hot milk' },
  { id: 9, name: 'Gulab Jamun (2 pc)',    price:  80, veg: true,  popular: false, category: 'desserts',  emoji: '🍮', gradient: ['#f59e0b', '#92400e'], rating: 4.6, reviews: 168, prepTime:  3, tag: 'Sweet finish',    description: 'Warm milk dumplings in rose-cardamom syrup' },
  { id:10, name: 'Mango Lassi',           price:  90, veg: true,  popular: false, category: 'drinks',    emoji: '🥭', gradient: ['#fde047', '#f59e0b'], rating: 4.5, reviews: 134, prepTime:  3, tag: null,              description: 'Thick yogurt smoothie with Alphonso mango pulp' }
]

export const menuCategories = [
  { key: 'all',       label: 'All',       emoji: '🍽️' },
  { key: 'mains',     label: 'Mains',     emoji: '🍗' },
  { key: 'biryani',   label: 'Biryani',   emoji: '🍚' },
  { key: 'breads',    label: 'Breads',    emoji: '🫓' },
  { key: 'breakfast', label: 'Breakfast', emoji: '🥞' },
  { key: 'desserts',  label: 'Desserts',  emoji: '🍮' },
  { key: 'drinks',    label: 'Drinks',    emoji: '☕' }
]

export const customerLanding = {
  rating:        4.7,
  reviewsCount:  '2.4k',
  hygieneRating: 5,
  todayOpen:     '7:00 AM – 11:30 PM',
  ordersToday:   87,
  liveCovers:    14,
  promo: {
    title: 'Weekend combo',
    sub:   'Biryani + Lassi @ ₹299',
    code:  'WKND299'
  }
}

export const trustBadges = [
  { icon: 'ShieldCheck', label: 'FSSAI · 5★ hygiene' },
  { icon: 'Lock',        label: '100% secure payment' },
  { icon: 'Sparkles',    label: 'Fresh daily prep' },
  { icon: 'Headphones',  label: 'Live order tracking' }
]

export const liveQueue = [
  { token: 'T-1042', name: 'Rahul Sharma',  people: 2, status: 'Preparing', type: 'Dine-in', amount: 560, payment: 'Paid',    minutes:  4, priority: false },
  { token: 'T-1043', name: 'Aarti Mehta',   people: 4, status: 'Accepted',  type: 'Dine-in', amount: 980, payment: 'Paid',    minutes:  8, priority: false },
  { token: 'T-1044', name: 'Vikram Singh',  people: 1, status: 'Ready',     type: 'Express', amount: 320, payment: 'Paid',    minutes:  0, priority: true  },
  { token: 'T-1045', name: 'Neha Iyer',     people: 3, status: 'New',       type: 'Dine-in', amount: 740, payment: 'Pending', minutes: 12, priority: false },
  { token: 'T-1046', name: 'Karan Patel',   people: 2, status: 'New',       type: 'Parcel',  amount: 460, payment: 'Paid',    minutes: 10, priority: false },
  { token: 'T-1047', name: 'Sneha Reddy',   people: 1, status: 'Preparing', type: 'Express', amount: 280, payment: 'Paid',    minutes:  6, priority: true  }
]

export const todaysOrders = [
  { token: 'T-1031', name: 'Manish Verma',  type: 'Dine-in', amount: 540, payment: 'Paid',    status: 'Served',    time: '09:42' },
  { token: 'T-1032', name: 'Pooja Nair',    type: 'Express', amount: 380, payment: 'Paid',    status: 'Served',    time: '09:58' },
  { token: 'T-1033', name: 'Imran Khan',    type: 'Parcel',  amount: 260, payment: 'Paid',    status: 'Completed', time: '10:11' },
  { token: 'T-1034', name: 'Divya Joshi',   type: 'Dine-in', amount: 720, payment: 'Pending', status: 'Preparing', time: '10:24' },
  { token: 'T-1035', name: 'Suresh Babu',   type: 'Express', amount: 460, payment: 'Paid',    status: 'Ready',     time: '10:38' },
  { token: 'T-1036', name: 'Anjali Rao',    type: 'Dine-in', amount: 880, payment: 'Paid',    status: 'Served',    time: '10:55' },
  { token: 'T-1037', name: 'Rohit Desai',   type: 'Parcel',  amount: 320, payment: 'Failed',  status: 'New',       time: '11:02' },
  { token: 'T-1038', name: 'Meera Pillai',  type: 'Dine-in', amount: 640, payment: 'Paid',    status: 'Served',    time: '11:14' },
  { token: 'T-1039', name: 'Arjun Kapoor',  type: 'Express', amount: 280, payment: 'Paid',    status: 'Ready',     time: '11:29' },
  { token: 'T-1040', name: 'Kavya Menon',   type: 'Dine-in', amount: 520, payment: 'Paid',    status: 'Preparing', time: '11:41' }
]

export const revenueByHour = [
  { hour: '8 AM',  revenue:  2400 },
  { hour: '9 AM',  revenue:  3800 },
  { hour: '10 AM', revenue:  5200 },
  { hour: '11 AM', revenue:  6800 },
  { hour: '12 PM', revenue:  9200 },
  { hour: '1 PM',  revenue: 11400 },
  { hour: '2 PM',  revenue:  8600 }
]

export const dashboardStats = {
  totalOrders: 87,
  tokensGenerated: 92,
  expressOrders: 24,
  parcelOrders: 18,
  paidOrders: 79,
  pendingPayments: 8,
  revenue: 47400,
  avgWaitMinutes: 11,
  activeQueue: 14
}

/* alert strip across the top of the owner dashboard.
   Restaurant-flavored: kitchen + payments + customer ops, not CRM. */
export const dashboardAlerts = [
  {
    id: 'wallet',
    tone: 'amber',
    title: 'WhatsApp credits: 4,280 left',
    sub: 'Used for order-ready pings and re-engagement. Recharge before the weekend rush.'
  },
  {
    id: 'pending',
    tone: 'amber',
    title: 'Pending payments: ₹4,640',
    sub: '8 dine-in tokens still unpaid. Tap to remind from the Staff screen.'
  },
  {
    id: 'lowstock',
    tone: 'amber',
    title: 'Butter Chicken running low',
    sub: '~6 portions remaining at current pace. Flag to kitchen to prep next batch.'
  }
]

/* eight headline restaurant KPIs.
   base = numeric value; format tells the renderer how to display it after scaling. */
export const dashboardKpis = [
  { key: 'revenue',   label: "Today's revenue", base: 47400, format: 'inr',  delta: 12.4, sub: 'Target ₹42,000',   spark: [22, 24, 26, 28, 31, 33, 36, 38, 40, 42, 45, 47] },
  { key: 'orders',    label: 'Total orders',     base:    87, format: 'n',    delta: 8.1,  sub: '92 tokens issued',  spark: [42, 48, 53, 56, 60, 64, 68, 72, 76, 80, 84, 87] },
  { key: 'tokens',    label: 'Active tokens',    base:    14, format: 'n',    delta: 4.2,  sub: 'in live queue',     spark: [9, 10, 12, 13, 11, 12, 13, 14, 15, 14, 14, 14]  },
  { key: 'wait',      label: 'Avg waiting time', base:    11, format: 'min',  delta: -6.4, sub: 'down from 13 min',  spark: [16, 15, 15, 14, 14, 13, 13, 12, 12, 11, 11, 11] },
  { key: 'express',   label: 'Express orders',   base:    24, format: 'n',    delta: 18.6, sub: '312 highway scans', spark: [6, 8, 10, 11, 13, 14, 16, 18, 19, 21, 22, 24]   },
  { key: 'parcel',    label: 'Parcel orders',    base:    18, format: 'n',    delta: 3.2,  sub: '4 pickup pending',  spark: [4, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 18]      },
  { key: 'pending',   label: 'Pending payments', base:  4640, format: 'inr',  delta: -5.8, sub: '8 unpaid tokens',   spark: [82, 80, 78, 76, 74, 75, 73, 72, 71, 70, 69, 65] },
  { key: 'completed', label: 'Completed orders', base:    62, format: 'n',    delta: 9.7,  sub: 'served & cleared',  spark: [28, 32, 36, 40, 44, 48, 50, 53, 56, 58, 60, 62] }
]

export const liveQueueStatus = {
  currentToken:     'T-1047',
  nextToken:        'T-1048',
  waitingCustomers: 9,
  seatedCustomers:  14,
  completedTokens:  78,
  avgWaitMinutes:   11
}

export const kitchenStatus = {
  new:        4,
  preparing:  7,
  ready:      3,
  delayed:    1,
  completed: 62
}

export const liveOrderFlow = [
  { id: 'ORD-2041', type: 'QR Order',     customer: 'Rahul Sharma',  amount: 560, payment: 'Paid',    status: 'Preparing' },
  { id: 'ORD-2042', type: 'Express Food', customer: 'Vikram Singh',  amount: 320, payment: 'Paid',    status: 'Ready'     },
  { id: 'ORD-2043', type: 'Parcel',       customer: 'Karan Patel',   amount: 460, payment: 'Pending', status: 'New'       },
  { id: 'ORD-2044', type: 'Counter Bill', customer: 'Walk-in #18',   amount: 240, payment: 'Paid',    status: 'Served'    },
  { id: 'ORD-2045', type: 'QR Order',     customer: 'Aarti Mehta',   amount: 980, payment: 'Paid',    status: 'Accepted'  },
  { id: 'ORD-2046', type: 'Express Food', customer: 'Sneha Reddy',   amount: 280, payment: 'Paid',    status: 'Preparing' },
  { id: 'ORD-2047', type: 'Parcel',       customer: 'Meera Pillai',  amount: 640, payment: 'Paid',    status: 'Ready'     },
  { id: 'ORD-2048', type: 'Counter Bill', customer: 'Walk-in #19',   amount: 380, payment: 'Failed',  status: 'New'       }
]

export const revenueBreakdown = [
  { source: 'QR orders',      value: 22400, color: '#2563eb' },
  { source: 'Express orders', value: 11200, color: '#16a34a' },
  { source: 'Parcel orders',  value:  8400, color: '#0ea5a4' },
  { source: 'Counter billing',value:  5400, color: '#d97706' }
]

export const paymentCollection = [
  { mode: 'UPI',      amount: 21800, txns: 42, color: '#7c3aed' },
  { mode: 'Cash',     amount: 12400, txns: 19, color: '#0f766e' },
  { mode: 'Card',     amount:  8200, txns: 11, color: '#2563eb' },
  { mode: 'Online',   amount:  3400, txns:  6, color: '#0ea5a4' },
  { mode: 'Pending',  amount:  4640, txns:  8, color: '#d97706' },
  { mode: 'Failed',   amount:   320, txns:  1, color: '#dc2626' },
  { mode: 'Refunds',  amount:   180, txns:  1, color: '#64748b' }
]

export const peakHourPerformance = [
  { period: 'Morning', range: '8–11 AM',  orders: 18, revenue:  9800 },
  { period: 'Lunch',   range: '11–3 PM',  orders: 42, revenue: 22400 },
  { period: 'Evening', range: '3–7 PM',   orders: 14, revenue:  6800 },
  { period: 'Night',   range: '7–11 PM',  orders: 13, revenue:  8400 }
]

export const operationalAlerts = [
  { id: 1, severity: 'high',   icon: 'AlertOctagon',title: '2 orders delayed > 15 min', sub: 'T-1042, T-1039 — flag kitchen' },
  { id: 2, severity: 'high',   icon: 'Wallet',      title: 'Pending payments ₹4,640',    sub: '8 dine-in tokens unpaid' },
  { id: 3, severity: 'medium', icon: 'ChefHat',     title: 'High kitchen load',          sub: '11 active tickets · 1 delayed' },
  { id: 4, severity: 'medium', icon: 'Clock',       title: 'Long wait at counter',       sub: 'Avg 14 min for last 6 covers' },
  { id: 5, severity: 'info',   icon: 'Truck',       title: 'Express arrival in 6 min',   sub: 'T-1052 · Sneha Reddy · 2.4 km' },
  { id: 6, severity: 'info',   icon: 'ShoppingBag', title: 'Parcel P-2031 ready',        sub: 'Pickup pending · 4 min' }
]

export const quickActions = [
  { label: 'Call next token',  icon: 'Bell',        tone: 'brand'   },
  { label: 'Generate bill',    icon: 'Receipt',     tone: 'emerald' },
  { label: 'Add manual order', icon: 'Plus',        tone: 'slate'   },
  { label: 'Kitchen orders',   icon: 'ChefHat',     tone: 'amber'   },
  { label: 'Payment report',   icon: 'Wallet',      tone: 'violet'  },
  { label: 'Create parcel',    icon: 'ShoppingBag', tone: 'cyan'    },
  { label: 'Daily report',     icon: 'Download',    tone: 'slate'   }
]

/* 6-month restaurant revenue trend with a flat target line.
   Values are in ₹ lakh (the chart formats them as ₹XL). */
export const monthlyRevenue = [
  { month: 'Dec', revenue: 9.8,  target: 14 },
  { month: 'Jan', revenue: 11.2, target: 14 },
  { month: 'Feb', revenue: 12.6, target: 14 },
  { month: 'Mar', revenue: 13.4, target: 14 },
  { month: 'Apr', revenue: 14.8, target: 14 },
  { month: 'May', revenue: 15.6, target: 14 }
]

/* order pipeline funnel for the right column of the owner dashboard:
   token issued → accepted → cooking → ready → handed to customer. */
export const orderPipeline = [
  { stage: 'Tokens issued', count: 92, color: '#2f6fff' },
  { stage: 'Accepted',      count: 87, color: '#b08a3a' },
  { stage: 'Preparing',     count: 71, color: '#0f766e' },
  { stage: 'Ready',         count: 64, color: '#15803d' },
  { stage: 'Served',        count: 58, color: '#166534' }
]

/* revenue-impact features. numbers shown in /admin "smart features"
   strip and on the highway and re-engagement pages. */
export const revenueImpact = {
  totalToday: 8740,
  upsell: {
    amount: 3240,
    orders: 28,
    aovLift: 9.4,
    suggestions: [
      { id: 'naan2',   name: 'Butter Naan ×2',     addOn: 90,  conversion: 32 },
      { id: 'lassi',   name: 'Sweet Lassi',        addOn: 60,  conversion: 21 },
      { id: 'gulab',   name: 'Gulab Jamun (2 pc)', addOn: 80,  conversion: 18 }
    ]
  },
  repeat: {
    amount: 4100,
    customers: 12,
    monthRecovered: 15200,
    monthCustomers: 38
  },
  highway: {
    amount: 1400,
    scans: 312,
    stops: 47,
    conversion: 15
  }
}

export const whatsappMessages = [
  {
    id: 1,
    name: 'Rahul Sharma',
    when: '2 hours ago',
    template: 'token-ready',
    preview: 'Your token T-1042 is being prepared. Estimated 4 min more.',
    body: [
      { from: 'us', text: 'Hi Rahul! Your order T-1042 is being prepared 🍳' },
      { from: 'us', text: 'Estimated ready in ~4 min. We\'ll ping you when it\'s ready.' },
      { from: 'us', text: 'Track live status anytime →', link: { label: 'View my order', to: '/tracking?type=dine-in&t=T-1042' } }
    ]
  },
  {
    id: 2,
    name: 'Sneha Reddy',
    when: '5 hours ago',
    template: 'express-cook-start',
    preview: 'You\'re within 3 km — we\'ve started cooking your order.',
    body: [
      { from: 'us', text: 'Hi Sneha! You\'re 2.8 km away — kitchen has started preparing your Express order ✅' },
      { from: 'us', text: 'Order will be hot and ready at the counter when you arrive.' },
      { from: 'us', text: 'Open the live tracker →', link: { label: 'View my order', to: '/tracking?type=express&t=E-1052' } }
    ]
  },
  {
    id: 3,
    name: 'Anjali Rao',
    when: 'Yesterday',
    template: 'reengagement-14d',
    preview: 'We miss you! Here\'s 15% off your next biryani.',
    body: [
      { from: 'us', text: 'Hi Anjali, we miss you at Highway Spice Junction 🙏' },
      { from: 'us', text: 'Here\'s 15% off your next biryani — valid this week. Use code: WELCOME15' },
      { from: 'them', text: 'Oh nice, I\'ll stop by Saturday!' }
    ]
  },
  {
    id: 4,
    name: 'Karan Patel',
    when: '3 days ago',
    template: 'parcel-ready',
    preview: 'Parcel P-2029 is ready — please collect.',
    body: [
      { from: 'us', text: 'Hi Karan, your parcel P-2029 is ready for pickup 🛍️' },
      { from: 'us', text: 'Please show the token at the counter to collect.' },
      { from: 'us', text: 'Open the parcel tracker →', link: { label: 'View my order', to: '/tracking?type=parcel&t=P-2029' } },
      { from: 'them', text: 'Reaching in 5 min, thanks!' }
    ]
  }
]

export const reengagementStats = {
  sentThisMonth: 240,
  recovered: 38,
  recoveredRevenue: 15200,
  pendingDue: 18,
  segments: [
    { label: 'Visited 14+ days ago', count: 86,  template: 'WELCOME15 · 15% off' },
    { label: 'Last visit on weekend', count: 42, template: 'Weekend special combo' },
    { label: 'High-value (>₹600)',    count: 21, template: 'VIP free dessert' }
  ]
}
