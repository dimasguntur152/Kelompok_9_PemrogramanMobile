import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { INITIAL_MENU, INITIAL_ORDERS, KEDAI_INFO } from '../data/mockData';
import {
  getActiveSession,
  clearActiveSession,
  authenticateUser,
  registerUser,
} from '../services/authService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication & Security State
  // authState: 'CHECKING' | 'AUTHENTICATED' | 'UNAUTHENTICATED'
  const [authState, setAuthState] = useState('CHECKING');
  const [currentUser, setCurrentUser] = useState(null);
  const [sessionClearedMessage, setSessionClearedMessage] = useState(null);

  // Navigation State
  const [currentScreen, setCurrentScreen] = useState('login');
  const [activeTab, setActiveTab] = useState('beranda'); // 'beranda' | 'aktivitas' | 'profil'
  const [screenStack, setScreenStack] = useState(['login']);

  // Cart State: { [productId]: quantity }
  const [cart, setCart] = useState({});

  // Checkout State
  const [deliveryMethod, setDeliveryMethod] = useState(null); // 'diantar' | 'pickup' | null
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Orders State
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [activeOrderId, setActiveOrderId] = useState('TDJ-001');

  // Verify and restore session from Secure Storage on app start/reload
  useEffect(() => {
    let isMounted = true;
    const initializeSession = async () => {
      try {
        const session = await getActiveSession();
        if (!isMounted) return;

        if (session && session.user && session.token) {
          setAuthState('AUTHENTICATED');
          setCurrentUser(session.user);
          setCurrentScreen('beranda');
          setActiveTab('beranda');
          setScreenStack(['beranda']);
        } else {
          setAuthState('UNAUTHENTICATED');
          setCurrentUser(null);
          setCurrentScreen('login');
          setScreenStack(['login']);
        }
      } catch (error) {
        if (!isMounted) return;
        setAuthState('UNAUTHENTICATED');
        setCurrentUser(null);
        setCurrentScreen('login');
        setScreenStack(['login']);
      }
    };

    initializeSession();
    return () => {
      isMounted = false;
    };
  }, []);

  // Navigation helpers with Security Guards
  const navigateTo = (screen, params = {}) => {
    if (params.orderId) {
      setActiveOrderId(params.orderId);
    }

    // Security Guard: unauthenticated users cannot access main application screens
    if (authState !== 'AUTHENTICATED' && !['login', 'register'].includes(screen)) {
      setCurrentScreen('login');
      setScreenStack(['login']);
      return;
    }

    // Security Guard: authenticated users should not return to auth screens
    if (authState === 'AUTHENTICATED' && ['login', 'register'].includes(screen)) {
      setCurrentScreen('beranda');
      setActiveTab('beranda');
      setScreenStack(['beranda']);
      return;
    }

    if (['beranda', 'aktivitas', 'profil'].includes(screen)) {
      setActiveTab(screen);
      setScreenStack([screen]);
    } else {
      setScreenStack((prev) => [...prev, screen]);
    }
    setCurrentScreen(screen);
  };

  const goBack = () => {
    // If not authenticated, navigation history is strictly confined to login/register
    if (authState !== 'AUTHENTICATED') {
      setCurrentScreen('login');
      setScreenStack(['login']);
      return;
    }

    if (screenStack.length > 1) {
      const nextStack = [...screenStack];
      nextStack.pop();
      const prevScreen = nextStack[nextStack.length - 1];

      // Prevent navigating back to login/register while authenticated
      if (['login', 'register'].includes(prevScreen)) {
        setCurrentScreen('beranda');
        setActiveTab('beranda');
        setScreenStack(['beranda']);
        return;
      }

      setScreenStack(nextStack);
      setCurrentScreen(prevScreen);
      if (['beranda', 'aktivitas', 'profil'].includes(prevScreen)) {
        setActiveTab(prevScreen);
      }
    } else {
      setCurrentScreen('beranda');
      setActiveTab('beranda');
      setScreenStack(['beranda']);
    }
  };

  // Switch tab directly (only accessible when authenticated)
  const switchTab = (tabName) => {
    if (authState !== 'AUTHENTICATED') {
      setCurrentScreen('login');
      setScreenStack(['login']);
      return;
    }
    setActiveTab(tabName);
    setCurrentScreen(tabName);
    setScreenStack([tabName]);
  };

  // Authentication Actions
  const login = async (identifier, password) => {
    const result = await authenticateUser(identifier, password);
    if (result.success) {
      setAuthState('AUTHENTICATED');
      setCurrentUser(result.session.user);
      setSessionClearedMessage(null);
      setCurrentScreen('beranda');
      setActiveTab('beranda');
      setScreenStack(['beranda']);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const register = async (userData) => {
    return await registerUser(userData);
  };

  const logout = async () => {
    await clearActiveSession();
    setAuthState('UNAUTHENTICATED');
    setCurrentUser(null);
    setSessionClearedMessage(
      'SESSION CLEARED: Sesi Anda telah dihapus secara aman dari Secure Storage.'
    );
    setCurrentScreen('login');
    setScreenStack(['login']);
    setActiveTab('beranda');
    return true;
  };

  const dismissSessionClearedMessage = () => {
    setSessionClearedMessage(null);
  };

  // Cart Operations
  const addToCart = (productId) => {
    const item = INITIAL_MENU.find((m) => m.id === productId);
    if (!item || !item.available) return;

    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const currentQty = prev[productId] || 0;
      if (currentQty <= 1) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return {
        ...prev,
        [productId]: currentQty - 1,
      };
    });
  };

  const clearCart = () => {
    setCart({});
  };

  // Computed Cart Items
  const cartItems = useMemo(() => {
    return Object.keys(cart).map((id) => {
      const product = INITIAL_MENU.find((p) => p.id === id);
      const qty = cart[id];
      return {
        ...product,
        quantity: qty,
        subtotal: (product?.price || 0) * qty,
      };
    });
  }, [cart]);

  const cartTotalCount = useMemo(() => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  }, [cartItems]);

  const currentDeliveryFee = useMemo(() => {
    if (deliveryMethod === 'diantar') {
      return KEDAI_INFO.defaultDeliveryFee;
    }
    return 0; // Pickup is Rp0
  }, [deliveryMethod]);

  const cartGrandTotal = useMemo(() => {
    return cartSubtotal + currentDeliveryFee;
  }, [cartSubtotal, currentDeliveryFee]);

  // Active Order getter
  const activeOrder = useMemo(() => {
    return orders.find((o) => o.id === activeOrderId) || orders[0];
  }, [orders, activeOrderId]);

  // Create New Order after payment confirmation
  const createOrder = () => {
    const newOrderNum = orders.length + 1;
    const formattedId = `TDJ-00${newOrderNum}`;
    const newOrder = {
      id: formattedId,
      orderNumber: `#${formattedId}`,
      date: 'Baru saja',
      status: 'Menunggu',
      method: deliveryMethod === 'diantar' ? 'Diantar' : 'Ambil di Kedai',
      location:
        deliveryMethod === 'diantar'
          ? deliveryLocation.trim()
          : 'GKB 2 Basement, Kampus 3 UMM',
      deliveryNotes: deliveryNotes.trim(),
      deliveryFee: currentDeliveryFee,
      items: [...cartItems],
      subtotal: cartSubtotal,
      total: cartGrandTotal,
      chatMessages: [
        {
          id: 'welcome_1',
          sender: 'seller',
          text: `Halo Tong Family! Pesanan #${formattedId} telah diterima dan sedang menunggu konfirmasi dapur kami di GKB 2 Basement.`,
          time: 'Baru saja',
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderId(formattedId);
    clearCart();
    return newOrder;
  };

  // Status simulation:
  // For Delivery: Menunggu -> Diproses -> Sedang Diantar -> Selesai
  // For Pickup: Menunggu -> Diproses -> Siap Diambil -> Selesai
  const getNextStatus = (currentStatus, method) => {
    const isDelivery = method === 'Diantar';
    if (isDelivery) {
      if (currentStatus === 'Menunggu') return 'Diproses';
      if (currentStatus === 'Diproses') return 'Sedang Diantar';
      if (currentStatus === 'Sedang Diantar') return 'Selesai';
      return 'Selesai';
    } else {
      if (currentStatus === 'Menunggu') return 'Diproses';
      if (currentStatus === 'Diproses') return 'Siap Diambil';
      if (currentStatus === 'Siap Diambil') return 'Selesai';
      return 'Selesai';
    }
  };

  const advanceOrderStatus = (orderId) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const nextStatus = getNextStatus(ord.status, ord.method);
          return {
            ...ord,
            status: nextStatus,
          };
        }
        return ord;
      })
    );
  };

  const setOrderStatusDirect = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return { ...ord, status: newStatus };
        }
        return ord;
      })
    );
  };

  // Chat message sending
  const sendChatMessage = (orderId, messageText) => {
    if (!messageText.trim()) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newMsg = {
      id: 'msg_' + Date.now(),
      sender: 'customer',
      text: messageText.trim(),
      time: timeStr,
    };

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            chatMessages: [...(ord.chatMessages || []), newMsg],
          };
        }
        return ord;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        activeTab,
        navigateTo,
        goBack,
        switchTab,
        cart,
        cartItems,
        cartTotalCount,
        cartSubtotal,
        currentDeliveryFee,
        cartGrandTotal,
        addToCart,
        removeFromCart,
        clearCart,
        deliveryMethod,
        setDeliveryMethod,
        deliveryLocation,
        setDeliveryLocation,
        deliveryNotes,
        setDeliveryNotes,
        orders,
        activeOrderId,
        setActiveOrderId,
        activeOrder,
        createOrder,
        advanceOrderStatus,
        // Auth & Security state & methods
        authState,
        currentUser,
        sessionClearedMessage,
        dismissSessionClearedMessage,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
