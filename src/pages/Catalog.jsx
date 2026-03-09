import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function Catalog({ onAddToCart }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Create fresh client directly - no initData needed for catalog
    axios.get(`${API_BASE}/catalog/categories`)
      .then((res) => {
        setCategories(res.data);
        if (res.data.length > 0) setSelectedCat(res.data[0].id);
      })
      .catch((err) => {
        setError(`Ошибка загрузки: ${err.message} | URL: ${API_BASE}`);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedCat) return;
    setLoading(true);
    axios.get(`${API_BASE}/catalog/products?category_id=${selectedCat}`)
      .then((res) => setProducts(res.data))
      .catch((err) => setError(`Ошибка товаров: ${err.message}`))
      .finally(() => setLoading(false));
  }, [selectedCat]);

  if (error) {
    return (
      <div style={{ padding: 20, color: "red" }}>
        <div>❌ {error}</div>
        <div style={{ fontSize: 12, marginTop: 8, color: "#666" }}>
          API: {API_BASE}
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ display: "flex", overflowX: "auto", gap: 8, padding: "8px 12px", background: "var(--tg-theme-bg-color)" }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            style={{
              padding: "6px 14px", borderRadius: 20, border: "none",
              background: selectedCat === cat.id ? "var(--tg-theme-button-color)" : "var(--tg-theme-secondary-bg-color)",
              color: selectedCat === cat.id ? "var(--tg-theme-button-text-color)" : "var(--tg-theme-text-color)",
              whiteSpace: "nowrap", cursor: "pointer",
              fontWeight: selectedCat === cat.id ? "bold" : "normal",
            }}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>⏳ Загрузка...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: 12 }}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={onAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, onAdd }) {
  return (
    <div style={{ background: "var(--tg-theme-bg-color)", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.1)" }}>
      <div style={{ height: 110, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
        📦
      </div>
      <div style={{ padding: 10 }}>
        <div style={{ fontWeight: "bold", fontSize: 13, marginBottom: 4, lineHeight: 1.3 }}>{product.name}</div>
        <div style={{ color: "var(--tg-theme-button-color)", fontWeight: "bold", marginBottom: 8 }}>
          {product.price.toLocaleString()} UZS
        </div>
        <button
          onClick={() => onAdd(product)}
          disabled={product.stock === 0}
          style={{
            width: "100%", padding: "7px 0", borderRadius: 8, border: "none",
            background: product.stock > 0 ? "var(--tg-theme-button-color)" : "#ccc",
            color: product.stock > 0 ? "var(--tg-theme-button-text-color)" : "#888",
            fontWeight: "bold", cursor: product.stock > 0 ? "pointer" : "not-allowed", fontSize: 12,
          }}
        >
          {product.stock > 0 ? "+ В корзину" : "Нет в наличии"}
        </button>
      </div>
    </div>
  );
}