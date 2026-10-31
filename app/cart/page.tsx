"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API = "https://practice.amirm.me";

type CartItem = {
    product: {
        id: number;
        name: string;
        price: number;
        stock: number;
        image: string;
    };
    quantity: number;
    subtotal: number;
};

type Cart = {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
};

async function callApi(path: string, method = "GET", data?: unknown) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("UNAUTHORIZED");

    const res = await fetch(`${API}${path}`, {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            ...(data ? { "Content-Type": "application/json" } : {}),
        },
        body: data ? JSON.stringify(data) : undefined,
    });

    if (res.status === 401) {
        localStorage.removeItem("token");
        throw new Error("UNAUTHORIZED");
    }
    if (res.status === 204) return null;

    const body = await res.json();
    if (!res.ok) throw new Error(body.error || "خطای ارتباط با سرور");
    return body;
}

export default function CartPage() {
    const router = useRouter();

    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    function handleError(e: unknown) {
        if (e instanceof Error && e.message === "UNAUTHORIZED") {
            router.push("/signin");
            return;
        }
        setError(e instanceof Error ? e.message : "خطای نامشخص");
    }

    useEffect(() => {
        async function loadCart() {
            try {
                setCart(await callApi("/me/cart"));
            } catch (e) {
                handleError(e);
            } finally {
                setLoading(false);
            }
        }
        loadCart();
    }, []);

    async function changeQuantity(productId: number, quantity: number) {
        setBusy(true);
        setError("");
        try {
            setCart(await callApi(`/me/cart/items/${productId}`, "PATCH", { quantity }));
        } catch (e) {
            handleError(e);
        } finally {
            setBusy(false);
        }
    }

    async function removeItem(productId: number) {
        setBusy(true);
        setError("");
        try {
            setCart(await callApi(`/me/cart/items/${productId}`, "DELETE"));
        } catch (e) {
            handleError(e);
        } finally {
            setBusy(false);
        }
    }

    async function clearCart() {
        setBusy(true);
        setError("");
        try {
            await callApi("/me/cart", "DELETE");
            setCart({ items: [], totalItems: 0, totalPrice: 0 });
        } catch (e) {
            handleError(e);
        } finally {
            setBusy(false);
        }
    }

    const isEmpty = !cart || cart.items.length === 0;

    return (
        <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
            <div className="mx-auto max-w-4xl px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">سبد خرید</h1>
                    <Link href="/shop" className="text-sm text-emerald-600 hover:underline">
                        ← بازگشت به فروشگاه
                    </Link>
                </div>

                {error && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {loading && <p className="py-20 text-center text-slate-500">در حال بارگذاری...</p>}

                {!loading && isEmpty && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
                        <p className="text-lg font-semibold text-slate-700">سبد خرید شما خالی است</p>
                        <Link
                            href="/shop"
                            className="mt-4 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                            رفتن به فروشگاه
                        </Link>
                    </div>
                )}

                {!loading && cart && !isEmpty && (
                    <div className="space-y-4">
                        <div className={`space-y-3 ${busy ? "opacity-60" : ""}`}>
                            {cart.items.map((item) => {
                                const p = item.product;
                                const max = Math.min(p.stock, 10);
                                return (
                                    <div
                                        key={p.id}
                                        className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                                    >
                                        <img
                                            src={`${API}${p.image}`}
                                            alt={p.name}
                                            className="h-20 w-20 rounded-xl bg-slate-50 object-contain p-2"
                                        />

                                        <div className="min-w-0 flex-1">
                                            <Link
                                                href={`/shop/${p.id}`}
                                                className="line-clamp-1 font-semibold hover:text-emerald-600"
                                            >
                                                {p.name}
                                            </Link>
                                            <p className="mt-1 text-sm text-slate-500">
                                                {p.price.toLocaleString("fa-IR")} تومان
                                            </p>
                                        </div>

                                        <div className="flex items-center overflow-hidden rounded-xl border border-slate-200">
                                            <button
                                                disabled={busy || item.quantity <= 1}
                                                onClick={() => changeQuantity(p.id, item.quantity - 1)}
                                                className="h-9 w-9 cursor-pointer hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                −
                                            </button>
                                            <span className="w-10 text-center font-semibold">
                                                {item.quantity.toLocaleString("fa-IR")}
                                            </span>
                                            <button
                                                disabled={busy || item.quantity >= max}
                                                onClick={() => changeQuantity(p.id, item.quantity + 1)}
                                                className="h-9 w-9 cursor-pointer hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <p className="w-32 text-left font-bold text-emerald-600">
                                            {item.subtotal.toLocaleString("fa-IR")} تومان
                                        </p>

                                        <button
                                            disabled={busy}
                                            onClick={() => removeItem(p.id)}
                                            className="cursor-pointer rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            حذف
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-600">
                                    جمع کل ({cart.totalItems.toLocaleString("fa-IR")} عدد)
                                </span>
                                <span className="text-xl font-extrabold text-emerald-600">
                                    {cart.totalPrice.toLocaleString("fa-IR")} تومان
                                </span>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-3">
                                <Link
                                    href="/checkout"
                                    className="flex-1 rounded-xl bg-emerald-600 py-3 text-center font-semibold text-white hover:bg-emerald-700"
                                >
                                    ادامه‌ی خرید
                                </Link>
                                <button
                                    disabled={busy}
                                    onClick={clearCart}
                                    className="cursor-pointer rounded-xl border border-red-300 px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    خالی کردن سبد
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}