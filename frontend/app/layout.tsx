"use client";
import "./globals.css";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/stock", label: "Stock" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuth = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && !isAuth) router.push("/login");
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <html lang="en">
      <body>
        {!isAuth && (
          <nav className="navbar">
            <div className="nav-links">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className={`nav-link${pathname === n.href ? " active" : ""}`}>
                  {n.label}
                </Link>
              ))}
            </div>
            <button className="nav-logout" onClick={logout}>Logout</button>
          </nav>
        )}
        {children}
      </body>
    </html>
  );
}