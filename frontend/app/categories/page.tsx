"use client";
import { useEffect, useState } from "react";
import { categoriesAPI } from "../lib/api";

type Category = { id: number; name: string; };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const data = await categoriesAPI.getAll();
    setCategories(data);
  };
  
  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    if (!name.trim()) { setError("Category name is required."); return; }
    setLoading(true); setError("");
    try {
      await categoriesAPI.create(name.trim());
      setName(""); load();
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="page-title">Categories</div>
      <div className="card" style={{maxWidth:480,marginBottom:"2rem"}}>
        <div style={{fontWeight:600,marginBottom:"1rem"}}>Add Category</div>
        {error && <div className="error-msg">{error}</div>}
        <div style={{display:"flex",gap:"0.75rem"}}>
          <input className="form-input" placeholder="Category name" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} />
          <button className="btn btn-primary" onClick={add} disabled={loading}>{loading ? "Adding..." : "Add"}</button>
        </div>
      </div>
      <div className="card" style={{padding:0}}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Name</th></tr></thead>
            <tbody>
              {categories.length === 0 && (
                <tr><td colSpan={2} style={{textAlign:"center",color:"var(--muted)",padding:"2rem"}}>No categories yet</td></tr>
              )}
              {categories.map((c, i) => (
                <tr key={c.id}>
                  <td style={{color:"var(--muted)",width:60}}>{i + 1}</td>
                  <td style={{fontWeight:500}}>{c.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}