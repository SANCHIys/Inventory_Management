"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      const data = await authAPI.login(email, password);
      localStorage.setItem("token", data.access_token);
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-title">Welcome back</div>
        <div className="auth-sub">Sign in to your inventory dashboard</div>
        {error && <div className="error-msg">{error}</div>}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" onKeyDown={e => e.key === "Enter" && submit()} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && submit()} />
        </div>
        <button className="btn btn-primary" style={{width:"100%"}} onClick={submit} disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <div className="auth-footer">
          No account? <a onClick={() => router.push("/register")}>Register</a>
        </div>
      </div>
    </div>
  );
}