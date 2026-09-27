// Exact Data for Kedai Tong Djajakarta - Kampus 3 UMM GKB 2 Basement

export const KEDAI_INFO = {
  name: 'Kedai Tong Djajakarta',
  shortName: 'Tong Djajakarta',
  greeting: 'Halo, Tong Family!',
  storyTitle: 'Dari Mahasiswa, Untuk Kamu Semua.',
  storyContent: `Kisah kami bukan sekadar tentang bubur dan kopi. Kedai Tong Djajakarta adalah bukti nyata bahwa mimpi bisa diwujudkan dari bangku kuliah. Dirintis oleh Naufal Atha, seorang mahasiswa sepertimu, usaha ini lahir dari ide kreatif dan semangat yang tak pernah padam.

Berkat proposal yang matang dan perencanaan yang rapi, kami berhasil menjadi salah satu usaha yang lolos pendanaan P2MW di bidang F&B. Ini adalah pencapaian yang kami dedikasikan untuk 'Tong Family' – kalian semua yang menjadi bagian dari cerita ini.`,
  locationTitle: 'Temukan Kami',
  locationBuilding: 'GKB 2 Basement',
  locationCampus: 'Kampus 3 UMM',
  locationDescription: 'Temukan Kedai Tong Djajakarta di area basement GKB 2, Kampus 3 UMM.',
  deliveryNote: 'Hanya tersedia di area Kampus 3 UMM.',
  defaultDeliveryFee: 3000, // Mock delivery fee yang mudah diubah pada code
};

export const MENU_CATEGORIES = [
  'Semua',
  'Kopi',
  'Non-Kopi',
  'Makanan',
  'Lainnya',
];

export const INITIAL_MENU = [
  // ------------------------------
  // MINUMAN KOPI
  // ------------------------------
  {
    id: 'kopi-1',
    name: 'Americano',
    category: 'Kopi',
    price: 13000,
    label: null,
    available: true,
  },
  {
    id: 'kopi-2',
    name: 'Americano Mango',
    category: 'Kopi',
    price: 15000,
    label: 'DARK SERIES',
    available: true,
  },
  {
    id: 'kopi-3',
    name: 'Americano Lycchee',
    category: 'Kopi',
    price: 15000,
    label: 'DARK SERIES',
    available: true,
  },
  {
    id: 'kopi-4',
    name: 'Americano Peach',
    category: 'Kopi',
    price: 15000,
    label: 'DARK SERIES',
    available: true,
  },
  {
    id: 'kopi-5',
    name: 'Hot Americano',
    category: 'Kopi',
    price: 8000,
    label: null,
    available: true,
  },
  {
    id: 'kopi-6',
    name: 'Kopi Baileys',
    category: 'Kopi',
    price: 13000,
    label: null,
    available: false, // Menu dengan status Habis untuk prototype
  },
  {
    id: 'kopi-7',
    name: 'Kopi Crash',
    category: 'Kopi',
    price: 5000,
    label: null,
    available: true,
  },
  {
    id: 'kopi-8',
    name: 'Kopi Crash Susu',
    category: 'Kopi',
    price: 7000,
    label: null,
    available: true,
  },
  {
    id: 'kopi-9',
    name: 'Kopi Susu Mantap',
    category: 'Kopi',
    price: 13000,
    label: 'FAVORIT!',
    available: true,
  },
  {
    id: 'kopi-10',
    name: 'Kopi Susu Sangar',
    category: 'Kopi',
    price: 13000,
    label: null,
    available: true,
  },
  {
    id: 'kopi-11',
    name: 'Kopi Susu Legit',
    category: 'Kopi',
    price: 15000,
    label: null,
    available: true,
  },

  // ------------------------------
  // MINUMAN NON-KOPI / LAINNYA
  // ------------------------------
  {
    id: 'nonkopi-1',
    name: 'Bublegum',
    category: 'Non-Kopi',
    price: 13000,
    label: null,
    available: true,
  },
  {
    id: 'nonkopi-2',
    name: 'Choco Banana',
    category: 'Non-Kopi',
    price: 15000,
    label: null,
    available: true,
  },
  {
    id: 'nonkopi-3',
    name: 'Cream Cheese',
    category: 'Non-Kopi',
    price: 13000,
    label: null,
    available: true,
  },
  {
    id: 'nonkopi-4',
    name: 'Hot Choco Banana',
    category: 'Non-Kopi',
    price: 10000,
    label: null,
    available: true,
  },
  {
    id: 'nonkopi-5',
    name: 'Hot Coklat',
    category: 'Non-Kopi',
    price: 8000,
    label: null,
    available: true,
  },
  {
    id: 'nonkopi-6',
    name: 'Coklat',
    category: 'Non-Kopi',
    price: 13000,
    label: null,
    available: true,
  },
  {
    id: 'nonkopi-7',
    name: 'Hot Matcha',
    category: 'Non-Kopi',
    price: 8000,
    label: null,
    available: true,
  },
  {
    id: 'nonkopi-8',
    name: 'Matcha',
    category: 'Non-Kopi',
    price: 13000,
    label: 'BEST SELLER!',
    available: true,
  },
  {
    id: 'nonkopi-9',
    name: 'Light Spark Lychee',
    category: 'Non-Kopi',
    price: 15000,
    label: 'LIGHT SERIES',
    available: true,
  },
  {
    id: 'nonkopi-10',
    name: 'Light Spark Mango',
    category: 'Non-Kopi',
    price: 15000,
    label: 'LIGHT SERIES',
    available: true,
  },
  {
    id: 'nonkopi-11',
    name: 'Light Spark Peach',
    category: 'Non-Kopi',
    price: 15000,
    label: 'LIGHT SERIES',
    available: true,
  },
  {
    id: 'nonkopi-12',
    name: 'Milo Malay',
    category: 'Non-Kopi',
    price: 15000,
    label: null,
    available: true,
  },
  {
    id: 'nonkopi-13',
    name: 'Thai Tea',
    category: 'Non-Kopi',
    price: 13000,
    label: null,
    available: true,
  },
  {
    id: 'nonkopi-14',
    name: 'Mineral Kecil',
    category: 'Non-Kopi',
    price: 2000,
    label: null,
    available: true,
  },
  {
    id: 'nonkopi-15',
    name: 'Mineral Sedang',
    category: 'Non-Kopi',
    price: 3000,
    label: null,
    available: true,
  },

  // ------------------------------
  // MAKANAN / CAMILAN
  // ------------------------------
  {
    id: 'mkn-1',
    name: 'Cemilan Kecil (Mie)',
    category: 'Makanan',
    price: 2000,
    label: null,
    available: true,
  },
  {
    id: 'mkn-2',
    name: 'Cemilan Sedang',
    category: 'Makanan',
    price: 3000,
    label: null,
    available: true,
  },
  {
    id: 'mkn-3',
    name: 'Mie Abang Jago',
    category: 'Makanan',
    price: 15000,
    label: null,
    available: true,
  },
  {
    id: 'mkn-4',
    name: 'Mix Platter',
    category: 'Makanan',
    price: 13000,
    label: null,
    available: true,
  },
  {
    id: 'mkn-5',
    name: 'Nasi Ayam Merah',
    category: 'Makanan',
    price: 15000,
    label: null,
    available: true,
  },

  // ------------------------------
  // LAIN-LAIN
  // ------------------------------
  {
    id: 'lain-1',
    name: 'Rokok Surya Ketengan',
    category: 'Lainnya',
    price: 3000,
    label: null,
    available: true,
  },
];

export const INITIAL_ORDERS = [
  {
    id: 'TDJ-001',
    orderNumber: '#TDJ-001',
    date: 'Hari ini, 10:15 WIB',
    status: 'Selesai', // 'Menunggu' | 'Diproses' | 'Sedang Diantar' / 'Siap Diambil' | 'Selesai'
    method: 'Diantar', // 'Diantar' | 'Ambil di Kedai'
    location: 'GKB 2 lantai 5, depan ruang 502',
    deliveryNotes: 'Tolong titip di meja depan',
    deliveryFee: 0,
    items: [
      { id: 'kopi-9', name: 'Kopi Susu Mantap', price: 13000, quantity: 1, subtotal: 13000 },
    ],
    subtotal: 13000,
    total: 13000,
    chatMessages: [
      { id: 'm1', sender: 'customer', text: 'Halo kak, pesanan saya sedang diantar ke GKB 2 lantai 5.', time: '10:20' },
      { id: 'm2', sender: 'seller', text: 'Baik kak, pesanan sedang kami antar.', time: '10:22' },
    ],
  },
  {
    id: 'TDJ-002',
    orderNumber: '#TDJ-002',
    date: 'Kemarin, 13:40 WIB',
    status: 'Selesai',
    method: 'Ambil di Kedai',
    location: 'GKB 2 Basement, Kampus 3 UMM',
    deliveryNotes: '',
    deliveryFee: 0,
    items: [
      { id: 'nonkopi-8', name: 'Matcha', price: 13000, quantity: 1, subtotal: 13000 },
      { id: 'mkn-5', name: 'Nasi Ayam Merah', price: 15000, quantity: 1, subtotal: 15000 },
    ],
    subtotal: 28000,
    total: 28000,
    chatMessages: [
      { id: 'm1', sender: 'seller', text: 'Halo kak, pesanan Anda siap diambil di kedai ya.', time: '13:50' },
      { id: 'm2', sender: 'customer', text: 'Siap kak, saya meluncur ke basement.', time: '13:52' },
    ],
  },
];

export const formatRupiah = (number) => {
  return 'Rp' + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
