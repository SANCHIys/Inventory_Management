"use client";
import { useEffect, useState } from "react";
import { productsAPI, stockAPI } from "../lib/api";

type Product = { id: number; name: string; sku: string; quantity: number; low_stock_threshold: number; };

export default function StockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState<number>(0);
  const [type, setType] = useState<"stock_in" | "stock_out">("stock_in");
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const data = await productsAPI.getAll();
    setProducts(data);
  };
  
  useEffect(() => {
    load();
  }, []);

  const selected = products.find(p => p.id === productId);

  const submit = async () => {
    if (!productId) { setError("Select a product."); return; }
    if (!quantity || quantity < 1) { setError("Quantity must be at least 1."); return; }
    if (!reason.trim()) { setError("Reason is required."); return; }
    if (type === "stock_out" && selected && quantity > selected.quantity) {
      setError(`Cannot remove more than current stock (${selected.quantity}).`); return;
    }
    setError(""); setSuccess(""); setLoading(true);
    try {
      await stockAPI.adjust(productId, quantity, type, reason.trim());
      setSuccess(`Successfully ${type === "stock_in" ? "added" : "removed"} ${quantity} units.`);
      setQuantity(1); setReason(""); load();
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="page-title">Stock Adjustment</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"2rem",alignItems:"start"}}>
        <div className="card">
          <div style={{fontWeight:600,marginBottom:"1rem"}}>Adjust Stock</div>
          {error && <div className="error-msg">{error}</div>}
          {success && <div style={{background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.3)",color:"var(--success)",padding:"0.75rem",borderRadius:"6px",fontSize:"0.85rem",marginBottom:"1rem"}}>{success}</div>}

          <div className="type-toggle">
            <button className={`type-btn${type === "stock_in" ? " active-in" : ""}`} onClick={() => setType("stock_in")}>↑ Stock In</button>
            <button className={`type-btn${type === "stock_out" ? " active-out" : ""}`} onClick={() => setType("stock_out")}>↓ Stock Out</button>
          </div>

          <div className="form-group">
            <label className="form-label">Product</label>
            <select className="form-select" value={productId} onChange={e => setProductId(Number(e.target.value))}>
              <option value={0}>Select product...</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} — {p.sku} (qty: {p.quantity})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input className="form-input" type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label className="form-label">Reason</label>
            <input className="form-input" placeholder="e.g. Supplier delivery, Damaged goods..." value={reason} onChange={e => setReason(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} />
          </div>
          <button className={`btn btn-sm ${type === "stock_in" ? "btn-success" : "btn-danger"}`} style={{width:"100%",padding:"0.75rem"}} onClick={submit} disabled={loading}>
            {loading ? "Processing..." : type === "stock_in" ? "↑ Add Stock" : "↓ Remove Stock"}
          </button>
        </div>

        <div className="card">
          <div style={{fontWeight:600,marginBottom:"1rem"}}>Current Stock Levels</div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Product</th><th>Qty</th><th>Status</th></tr></thead>
              <tbody>
                {products.map(p => {
                  const low = p.quantity <= p.low_stock_threshold;
                  const out = p.quantity === 0;
                  return (
                    <tr key={p.id}>
                      <td style={{fontWeight:500}}>{p.name}</td>
                      <td>{p.quantity}</td>
                      <td>
                        {out ? <span className="badge badge-red">Out</span>
                          : low ? <span className="badge badge-yellow">Low</span>
                          : <span className="badge badge-green">OK</span>}
                      </td>
                    </tr>
                  );
                })}
                {products.length === 0 && <tr><td colSpan={3} style={{color:"var(--muted)",textAlign:"center"}}>No products</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}