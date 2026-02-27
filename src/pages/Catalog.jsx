import { useState, useEffect } from "react";

export default function Catalog({ apiClient, onAddToCart }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/catalog/categories").then((res) => {
      setCategories(res.data);
      if (res.data.length > 0) setSelectedCat(res.data[0].id);
    });
  }, [apiClient]);

  useEffect(() => {
    if (!selectedCat) return;
    setLoading(true);
    apiClient
      .get(`/catalog/products?category_id=${selectedCat}`)
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, [selectedCat, apiClient]);

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Category tabs */}
      <div style={{ display: "flex", overflowX: "auto", gap: 8, padding: "8px 12px", background: "var(--tg-theme-bg-color)" }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: "none",
              background: selectedCat === cat.id ? "var(--tg-theme-button-color)" : "var(--tg-theme-secondary-bg-color)",
              color: selectedCat === cat.id ? "var(--tg-theme-button-text-color)" : "var(--tg-theme-text-color)",
              whiteSpace: "nowrap",
              cursor: "pointer",
              fontWeight: selectedCat === cat.id ? "bold" : "normal",
            }}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Products grid */}
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
    <div
      style={{
        background: "var(--tg-theme-bg-color)",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
      }}
    >
      {product.photo_file_id ? (
        <div style={{ height: 110, background: "#eee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
          🛒
        </div>
      ) : (
        <div style={{ height: 110, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
          📦
        </div>
      )}
      <div style={{ padding: 10 }}>
        <div style={{ fontWeight: "bold", fontSize: 13, marginBottom: 4, lineHeight: 1.3 }}>{product.name}</div>
        <div style={{ color: "var(--tg-theme-button-color)", fontWeight: "bold", marginBottom: 8 }}>
          {product.price.toLocaleString()} UZS
        </div>
        <button
          onClick={() => onAdd(product)}
          disabled={product.stock === 0}
          style={{
            width: "100%",
            padding: "7px 0",
            borderRadius: 8,
            border: "none",
            background: product.stock > 0 ? "var(--tg-theme-button-color)" : "#ccc",
            color: product.stock > 0 ? "var(--tg-theme-button-text-color)" : "#888",
            fontWeight: "bold",
            cursor: product.stock > 0 ? "pointer" : "not-allowed",
            fontSize: 12,
          }}
        >
          {product.stock > 0 ? "+ В корзину" : "Нет в наличии"}
        </button>
      </div>
    </div>
  );
}
