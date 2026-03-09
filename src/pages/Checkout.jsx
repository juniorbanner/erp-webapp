import { useState } from "react";
import { createApiClient } from "../api/client";

export default function Checkout({ cart, tg, onSuccess }) {
  const [paymentType, setPaymentType] = useState("cash");
  const [deliveryType, setDeliveryType] = useState("pickup");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleSubmit = async () => {
    const tgWebApp = window.Telegram?.WebApp;
    const initData = tgWebApp?.initData || "";
    const unsafeUser = tgWebApp?.initDataUnsafe?.user;
    const userId = unsafeUser?.id;

    // Full debug
    const debugInfo = JSON.stringify({
      initDataLen: initData.length,
      platform: tgWebApp?.platform,
      version: tgWebApp?.version,
      userId: userId,
      unsafeUser: unsafeUser,
      initDataUnsafe: tgWebApp?.initDataUnsafe,
    }, null, 2);
    window.alert("DEBUG:\n" + debugInfo);

    if (!initData && !userId) {
      setError("Нет данных пользователя: " + debugInfo);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const apiClient = createApiClient(initData, userId);
      const res = await apiClient.post("/orders/", {
        items: cart.map((i) => ({ product_id: i.id, quantity: i.qty })),
        payment_type: paymentType,
        delivery_type: deliveryType,
        delivery_address: deliveryType === "delivery" ? address : null,
        note: note || null,
      });
      onSuccess(res.data);
      if (tg) tg.showAlert(`✅ Заказ #${res.data.order_id} принят!`);
    } catch (e) {
      const msg = e.response?.data?.detail || "Ошибка при оформлении заказа";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 16, paddingBottom: 90 }}>
      <h3 style={{ marginTop: 0 }}>🛒 Оформление заказа</h3>
      <Section title="Оплата">
        {[
          { value: "cash", label: "💵 Наличные" },
          { value: "nasiya", label: "📒 Nasiya (в долг)" },
          { value: "card", label: "💳 Карта" },
        ].map((opt) => (
          <RadioOption key={opt.value} value={opt.value} label={opt.label} selected={paymentType} onSelect={setPaymentType} />
        ))}
      </Section>
      <Section title="Доставка">
        {[
          { value: "pickup", label: "🏪 Самовывоз" },
          { value: "delivery", label: "🚚 Доставка" },
        ].map((opt) => (
          <RadioOption key={opt.value} value={opt.value} label={opt.label} selected={deliveryType} onSelect={setDeliveryType} />
        ))}
        {deliveryType === "delivery" && (
          <input placeholder="Введите адрес доставки..." value={address} onChange={(e) => setAddress(e.target.value)} style={inputStyle} />
        )}
      </Section>
      <Section title="Комментарий (необязательно)">
        <input placeholder="Например: позвоните за 30 минут" value={note} onChange={(e) => setNote(e.target.value)} style={inputStyle} />
      </Section>
      <Section title="Итого">
        <div style={{ fontSize: 22, fontWeight: "bold", color: "var(--tg-theme-button-color)" }}>
          {total.toLocaleString()} UZS
        </div>
        <div style={{ fontSize: 13, color: "var(--tg-theme-hint-color)", marginTop: 4 }}>
          {cart.length} позиций
        </div>
      </Section>
      {error && (
        <div style={{ color: "red", padding: 10, marginBottom: 8, background: "#fff0f0", borderRadius: 8, fontSize: 12 }}>
          ❌ {error}
        </div>
      )}
      <button
        onClick={handleSubmit}
        disabled={loading || (deliveryType === "delivery" && !address.trim())}
        style={{
          width: "100%", padding: 16, borderRadius: 12, border: "none",
          background: "var(--tg-theme-button-color)", color: "var(--tg-theme-button-text-color)",
          fontWeight: "bold", fontSize: 16, cursor: "pointer", opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "⏳ Оформляем..." : "✅ Подтвердить заказ"}
      </button>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontWeight: "bold", fontSize: 14, color: "var(--tg-theme-hint-color)", marginBottom: 8 }}>
        {title.toUpperCase()}
      </div>
      <div style={{ background: "var(--tg-theme-secondary-bg-color)", borderRadius: 12, padding: 12 }}>
        {children}
      </div>
    </div>
  );
}

function RadioOption({ value, label, selected, onSelect }) {
  return (
    <div onClick={() => onSelect(value)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", cursor: "pointer" }}>
      <div style={{
        width: 20, height: 20, borderRadius: "50%",
        border: `2px solid ${selected === value ? "var(--tg-theme-button-color)" : "#ccc"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {selected === value && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--tg-theme-button-color)" }} />}
      </div>
      <span>{label}</span>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 0", border: "none",
  background: "transparent", fontSize: 15,
  color: "var(--tg-theme-text-color)", outline: "none", boxSizing: "border-box",
};