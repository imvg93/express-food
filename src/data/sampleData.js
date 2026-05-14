export const restaurant = {
  name: 'Highway Spice Junction',
  tagline: 'NH-48 · Open 24×7',
  estimatedWait: 12
}

export const menu = [
  { id: 1, name: 'Butter Chicken',        price: 320, veg: false, popular: true  },
  { id: 2, name: 'Paneer Butter Masala',  price: 280, veg: true,  popular: true  },
  { id: 3, name: 'Veg Biryani',           price: 220, veg: true,  popular: false },
  { id: 4, name: 'Chicken Biryani',       price: 280, veg: false, popular: true  },
  { id: 5, name: 'Tandoori Roti',         price:  25, veg: true,  popular: false },
  { id: 6, name: 'Butter Naan',           price:  45, veg: true,  popular: false },
  { id: 7, name: 'Masala Dosa',           price: 140, veg: true,  popular: true  },
  { id: 8, name: 'Filter Coffee',         price:  60, veg: true,  popular: false }
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
      { from: 'us', text: 'Estimated ready in ~4 min. We\'ll ping you when it\'s ready.' }
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
      { from: 'us', text: 'Order will be hot and ready at the counter when you arrive.' }
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
