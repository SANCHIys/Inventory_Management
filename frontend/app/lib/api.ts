const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

// AUTH
export const authAPI = {
  register: (name: string, email: string, password: string) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
  login: (email: string, password: string) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};

// DASHBOARD
export const dashboardAPI = {
  getStats: () => request("/dashboard/stats"),
};

// CATEGORIES
export const categoriesAPI = {
  getAll: () => request("/categories/"),
  create: (name: string) =>
    request("/categories/", { method: "POST", body: JSON.stringify({ name }) }),
};

// PRODUCTS
export const productsAPI = {
  getAll: () => request("/products/"),
  create: (data: {
    name: string; sku: string; price: number;
    quantity: number; low_stock_threshold: number; category_id: number;
  }) => request("/products/", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: {
    name: string; sku: string; price: number;
    quantity: number; low_stock_threshold: number; category_id: number;
  }) => request(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) => request(`/products/${id}`, { method: "DELETE" }),
};

// STOCK
export const stockAPI = {
  adjust: (product_id: number, quantity: number, type: "stock_in" | "stock_out", reason: string) =>
    request("/stock/", {
      method: "POST",
      body: JSON.stringify({ product_id, quantity, type, reason }),
    }),
};