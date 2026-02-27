import { useState, useMemo } from "react";
import { useTelegramUser } from "./hooks/useTelegramUser";
import { createApiClient } from "./api/client";
import Catalog from "./pages/Catalog";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import "./App.css";

export default function App() {
  const { user, initData, tg } = useTelegramUser();
  const [page, setPage] = useState("catalog");
  const [cart, setCart] = useState([]);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const apiClient = useMemo(() => createApiClient(initData), [initData]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1 }];
    });
  };

  const updateCart = (productId, qty) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== productId));
    } else {
      setCart((prev) => prev.map((i) => i.id === productId ? { ...i, qty } : i));
    }
  };

  const handleOrderSuccess = (data) => {
    setCart([]);
    setOrderSuccess(data);
    setPage("success");
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  if (orderSuccess && page === "success") {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 60 }}>✅</div>
        <h2>Заказ #{orderSuccess.order_id} принят!</h2>
        <p style={{ color: "var(--tg-theme-hint-color)" }}>Чек отправлен в Telegram бот</p>
        <p style={{ fontWeight: "bold", fontSize: 18 }}>{orderSuccess.total?.toLocaleString()} UZS</p>
        <button
          onClick={() => { setPage("catalog"); setOrderSuccess(null); }}
          style={{
            marginTop: 20,
            padding: "12px 32px",
            borderRadius: 12,
            border: "none",
            background: "var(--tg-theme-button-color)",
            color: "var(--tg-theme-button-text-color)",
            fontWeight: "bold",
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          На главную
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--tg-theme-bg-color)", color: "var(--tg-theme-text-color)" }}>
      {/* Header */}
      <div style={{
        position: "sticky",
        top: 0,
        background: "var(--tg-theme-bg-color)",
        borderBottom: "1px solid var(--tg-theme-secondary-bg-color)",
        padding: "10px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 100,
      }}>
        <div style={{ fontWeight: "bold", fontSize: 16 }}>🛒 Магазин</div>
        {user && <div style={{ fontSize: 13, color: "var(--tg-theme-hint-color)" }}>👤 {user.first_name}</div>}
      </div>

      {/* Page content */}
      {page === "catalog" && <Catalog apiClient={apiClient} onAddToCart={addToCart} />}
      {page === "cart" && <Cart cart={cart} onUpdate={updateCart} onCheckout={() => setPage("checkout")} />}
      {page === "checkout" && (
        <Checkout cart={cart} apiClient={apiClient} tg={tg} onSuccess={handleOrderSuccess} />
      )}

      {/* Bottom navigation */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        background: "var(--tg-theme-bg-color)",
        borderTop: "1px solid var(--tg-theme-secondary-bg-color)",
      }}>
        {[
          { id: "catalog", label: "Каталог", icon: "🏪" },
          { id: "cart", label: `Корзина${cartCount > 0 ? ` (${cartCount})` : ""}`, icon: "🛒" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPage(tab.id)}
            style={{
              flex: 1,
              padding: "12px 0",
              border: "none",
              background: "transparent",
              color: page === tab.id ? "var(--tg-theme-button-color)" : "var(--tg-theme-hint-color)",
              fontWeight: page === tab.id ? "bold" : "normal",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <div>{tab.icon}</div>
            <div>{tab.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
