"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      await authAPI.register(name, email, password);
      router.push("/login");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-title">Create account</div>
        <div className="auth-sub">Start managing your inventory</div>
        {error && <div className="error-msg">{error}</div>}
        <div className="form-group">
          <label className="form-label">Name</label>
          <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && submit()} />
        </div>
        <button className="btn btn-primary" style={{width:"100%"}} onClick={submit} disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
        <div className="auth-footer">
          Already have an account? <a onClick={() => router.push("/login")}>Sign in</a>
        </div>
      </div>
    </div>
  );
}