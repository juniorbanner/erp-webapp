export default function Cart({ cart, onUpdate, onCheckout }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "var(--tg-theme-hint-color)" }}>
        <div style={{ fontSize: 48 }}>🛒</div>
        <div style={{ marginTop: 12, fontSize: 16 }}>Корзина пуста</div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 130 }}>
      <div style={{ padding: 12 }}>
        {cart.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 0",
              borderBottom: "1px solid var(--tg-theme-secondary-bg-color)",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold" }}>{item.name}</div>
              <div style={{ color: "var(--tg-theme-hint-color)", fontSize: 13 }}>
                {item.price.toLocaleString()} UZS × {item.qty}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => onUpdate(item.id, item.qty - 1)} style={btnStyle}>−</button>
              <span style={{ fontWeight: "bold", minWidth: 20, textAlign: "center" }}>{item.qty}</span>
              <button onClick={() => onUpdate(item.id, item.qty + 1)} style={btnStyle}>+</button>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 50,
          left: 0,
          right: 0,
          zindex: 999,
          padding: "12px 16px",
          background: "var(--tg-theme-bg-color)",
          borderTop: "1px solid var(--tg-theme-secondary-bg-color)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: "var(--tg-theme-hint-color)" }}>Итого:</div>
          <div style={{ fontWeight: "bold", fontSize: 18 }}>{total.toLocaleString()} UZS</div>
        </div>
        <button
          onClick={onCheckout}
          style={{
            padding: "12px 24px",
            borderRadius: 12,
            border: "none",
            background: "var(--tg-theme-button-color)",
            color: "var(--tg-theme-button-text-color)",
            fontWeight: "bold",
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          Оформить заказ
        </button>
      </div>
    </div>
  );
}

const btnStyle = {
  width: 32,
  height: 32,
  borderRadius: 8,
  border: "none",
  background: "var(--tg-theme-secondary-bg-color)",
  color: "var(--tg-theme-text-color)",
  fontSize: 18,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
