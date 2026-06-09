"use client";
import { useEffect, useState } from "react";
import { productsAPI, categoriesAPI } from "../lib/api";

type Product = { id: number; name: string; sku: string; price: number; quantity: number; low_stock_threshold: number; category_id: number; };
type Category = { id: number; name: string; };

const EMPTY = { name: "", sku: "", price: 0, quantity: 0, low_stock_threshold: 5, category_id: 0 };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = () => {
    productsAPI.getAll().then(setProducts);
    categoriesAPI.getAll().then(setCategories);
  };
  useEffect(load, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(""); setModal(true); };
  const openEdit = (p: Product) => { setEditing(p); setForm({name:p.name,sku:p.sku,price:p.price,quantity:p.quantity,low_stock_threshold:p.low_stock_threshold,category_id:p.category_id}); setError(""); setModal(true); };

  const save = async () => {
    if (!form.name || !form.sku || !form.category_id) { setError("Name, SKU, and Category are required."); return; }
    setLoading(true); setError("");
    try {
      if (editing) await productsAPI.update(editing.id, form);
      else await productsAPI.create(form);
      setModal(false); load();
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    await productsAPI.delete(id); load();
  };

  const getStatus = (p: Product) => {
    if (p.quantity === 0) return "out";
    if (p.quantity <= p.low_stock_threshold) return "low";
    return "in";
  };

  const catName = (id: number) => categories.find(c => c.id === id)?.name ?? "—";

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    if (q && !p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false;
    if (filterCat && String(p.category_id) !== filterCat) return false;
    if (filterStatus) {
      const s = getStatus(p);
      if (filterStatus === "in" && s !== "in") return false;
      if (filterStatus === "low" && s !== "low") return false;
      if (filterStatus === "out" && s !== "out") return false;
    }
    return true;
  });

  return (
    <div className="page">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem"}}>
        <div className="page-title" style={{margin:0}}>Products</div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
      </div>

      <div className="toolbar">
        <input className="search-input" placeholder="Search by name or SKU..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="form-select" style={{width:"auto"}} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="form-select" style={{width:"auto"}} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      <div className="card" style={{padding:0}}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th><th>SKU</th><th>Category</th><th>Price</th><th>Qty</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{textAlign:"center",color:"var(--muted)",padding:"2rem"}}>No products found</td></tr>
              )}
              {filtered.map(p => {
                const s = getStatus(p);
                return (
                  <tr key={p.id}>
                    <td style={{fontWeight:500}}>{p.name}</td>
                    <td style={{color:"var(--muted)",fontFamily:"monospace"}}>{p.sku}</td>
                    <td>{catName(p.category_id)}</td>
                    <td>₹{p.price.toLocaleString()}</td>
                    <td>{p.quantity}</td>
                    <td>
                      {s === "out" && <span className="badge badge-red">⚠ Out of Stock</span>}
                      {s === "low" && <span className="badge badge-yellow">⚠ Low Stock</span>}
                      {s === "in" && <span className="badge badge-green">In Stock</span>}
                    </td>
                    <td style={{display:"flex",gap:"0.5rem"}}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => del(p.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{editing ? "Edit Product" : "Add Product"}</div>
            {error && <div className="error-msg">{error}</div>}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="form-input" value={form.name} onChange={e => setForm({...form,name:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">SKU</label>
                <input className="form-input" value={form.sku} onChange={e => setForm({...form,sku:e.target.value})} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input className="form-input" type="number" value={form.price} onChange={e => setForm({...form,price:Number(e.target.value)})} />
              </div>
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input className="form-input" type="number" value={form.quantity} onChange={e => setForm({...form,quantity:Number(e.target.value)})} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Low Stock Threshold</label>
                <input className="form-input" type="number" value={form.low_stock_threshold} onChange={e => setForm({...form,low_stock_threshold:Number(e.target.value)})} />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category_id} onChange={e => setForm({...form,category_id:Number(e.target.value)})}>
                  <option value={0}>Select category...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save} disabled={loading}>{loading ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}