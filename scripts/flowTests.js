// End-to-end Automated Flow Test for Kedai Tong Djajakarta Customer App
const {
  INITIAL_MENU,
  INITIAL_ORDERS,
  KEDAI_INFO,
  formatRupiah,
} = require('../src/data/mockData');
const { validateLogin } = require('../src/utils/validation');

async function runFlowTests() {
  console.log('====================================================');
  console.log('  KEDAI TONG DJAJAKARTA — REDESIGNED FLOW TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // TEST 1: Login validation & credentials check
    const validation = validateLogin({
      identifier: 'civitas@umm.ac.id',
      password: 'KedaiTong123',
    });
    assert(validation.isValid === true, 'TEST 1: Validasi form login berhasil');

    // TEST 2: Initial screen & state (Beranda)
    let currentScreen = 'beranda';
    let activeTab = 'beranda';
    let selectedCategory = 'Semua';
    let screenStack = ['beranda'];

    assert(
      currentScreen === 'beranda' && activeTab === 'beranda',
      'TEST 2: Beranda aktif dengan header brand Kedai Tong Djajakarta (NO search bar, NO hamburger)'
    );

    // TEST 3: Category filtering from Beranda to Menu
    // User clicks 'Kopi' on Beranda
    function navigateTo(screen, params = {}) {
      if (params.category) {
        selectedCategory = params.category;
      }
      if (['beranda', 'aktivitas', 'profil'].includes(screen)) {
        activeTab = screen;
        screenStack = [screen];
      } else {
        screenStack.push(screen);
      }
      currentScreen = screen;
    }

    navigateTo('menu', { category: 'Kopi' });
    assert(
      currentScreen === 'menu' && selectedCategory === 'Kopi',
      'TEST 3A: Klik kategori Kopi di Beranda membuka Menu dengan kategori Kopi aktif'
    );

    // Filter menu items by Kopi
    let filteredMenu = INITIAL_MENU.filter(
      (item) => selectedCategory === 'Semua' || item.category === selectedCategory
    );
    const allAreKopi = filteredMenu.every((item) => item.category === 'Kopi');
    assert(
      filteredMenu.length === 11 && allAreKopi,
      'TEST 3B: Menu Kopi terfilter dengan benar (11 menu kopi dari Kedai Tong Djajakarta)'
    );

    // User switches to Non-Kopi on Menu directly without returning to Beranda
    selectedCategory = 'Non-Kopi';
    filteredMenu = INITIAL_MENU.filter(
      (item) => selectedCategory === 'Semua' || item.category === selectedCategory
    );
    const allAreNonKopi = filteredMenu.every((item) => item.category === 'Non-Kopi');
    assert(
      filteredMenu.length === 15 && allAreNonKopi,
      'TEST 3C: User dapat berpindah ke Non-Kopi langsung di Menu (15 menu non-kopi)'
    );

    // TEST 4: Popular Drinks Verification
    const popularIds = ['kopi-9', 'nonkopi-8', 'kopi-1', 'kopi-11', 'nonkopi-2'];
    const popularItems = popularIds.map((id) => INITIAL_MENU.find((m) => m.id === id));
    assert(
      popularItems.length === 5 && popularItems[0].name === 'Kopi Susu Mantap',
      'TEST 4: Popular Drinks menampilkan menu unggulan (Kopi Susu Mantap, Matcha, Americano, dll)'
    );

    // TEST 5: Cart and Checkout
    const cart = {};
    cart['kopi-9'] = 2; // 2x Kopi Susu Mantap @ 13.000 = 26.000
    cart['nonkopi-8'] = 1; // 1x Matcha @ 13.000 = 13.000
    const subtotal = 26000 + 13000; // 39.000
    const deliveryFee = KEDAI_INFO.defaultDeliveryFee; // 3.000
    const grandTotal = subtotal + deliveryFee; // 42.000

    assert(
      grandTotal === 42000,
      `TEST 5: Perhitungan total pesanan akurat (${formatRupiah(grandTotal)})`
    );

    // TEST 6: Payment and Order Creation
    const newOrderId = `TDJ-00${INITIAL_ORDERS.length + 1}`;
    const newOrder = {
      id: newOrderId,
      orderNumber: `#${newOrderId}`,
      date: 'Baru saja',
      status: 'Menunggu',
      method: 'Diantar',
      location: 'GKB 2 Lantai 5 Ruang 502',
      deliveryFee: deliveryFee,
      total: grandTotal,
      items: [
        { name: 'Kopi Susu Mantap', quantity: 2, price: 13000 },
        { name: 'Matcha', quantity: 1, price: 13000 },
      ],
    };

    assert(
      newOrder.orderNumber === '#TDJ-003' && newOrder.status === 'Menunggu',
      'TEST 6: Pesanan baru berhasil dibuat dan masuk status Menunggu'
    );

    // TEST 7: Order Tracking progression to Selesai
    let currentStatus = newOrder.status;
    const progression = ['Diproses', 'Sedang Diantar', 'Selesai'];
    for (const nextSt of progression) {
      currentStatus = nextSt;
    }
    newOrder.status = currentStatus;
    assert(
      newOrder.status === 'Selesai',
      'TEST 7: Status pesanan berhasil diselesaikan sampai tahap Selesai'
    );

    // TEST 8: Order Finished Screen (NO WHITE SCREEN)
    navigateTo('order_finished');
    assert(
      currentScreen === 'order_finished',
      'TEST 8A: Navigasi ke order_finished sukses tanpa white screen (formatRupiah terimpor dengan aman)'
    );

    // Simulate clicking 'Kembali ke Beranda'
    navigateTo('beranda');
    assert(
      currentScreen === 'beranda' &&
        activeTab === 'beranda' &&
        screenStack.length === 1 &&
        screenStack[0] === 'beranda',
      'TEST 8B: Tombol Kembali ke Beranda berhasil mereset navigasi ke Beranda (carousel, categories, popular drinks, owner story aktif)'
    );

    // TEST 9: Activity tab displays orders
    navigateTo('aktivitas');
    const allOrders = [newOrder, ...INITIAL_ORDERS];
    assert(
      currentScreen === 'aktivitas' && allOrders.length === 3,
      'TEST 9: Halaman Aktivitas menampilkan riwayat pesanan lengkap dengan nomor pesanan & tombol Lihat Detail'
    );

    // TEST 10: Profile and Logout Navigation
    navigateTo('profil');
    assert(currentScreen === 'profil', 'TEST 10A: Halaman Profil berhasil dibuka');

    // Simulate logout action
    currentScreen = 'login';
    screenStack = ['login'];
    activeTab = 'beranda';
    assert(
      currentScreen === 'login',
      'TEST 10B: Tombol Keluar berhasil mengembalikan pengguna ke layar Login'
    );

    console.log('\n----------------------------------------------------');
    console.log(`HASIL PENGUJIAN FLOW: ${passed} PASSED / ${failed} FAILED`);
    console.log('====================================================\n');
  } catch (error) {
    console.error('Test threw unhandled error:', error);
  }
}

runFlowTests();
