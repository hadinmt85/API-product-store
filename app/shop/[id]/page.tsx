"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const API = "https://practice.amirm.me";

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    inStock: boolean;
    image: string;
    category: { name: string };
};

export default function ProductPage() {
    const { id } = useParams<{ id: string }>();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [cartError, setCartError] = useState("");
    const [added, setAdded] = useState(false);

    const maxQuantity = product ? Math.min(product.stock, 10) : 1;

    async function addToCart() {
        if (!product) return;
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/signin");
            return;
        }
        setAdding(true);
        setCartError("");
        setAdded(false);
        try {
            const res = await fetch(`${API}/me/cart/items`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId: product.id, quantity }),
            });
            if (res.status === 401) {
                localStorage.removeItem("token");
                router.push("/signin");
                return;
            }
            const body = await res.json();
            if (!res.ok) throw new Error(body.error || "خطای ارتباط با سرور");
            setAdded(true);
        } catch (e) {
            setCartError(e instanceof Error ? e.message : "خطای نامشخص");
        } finally {
            setAdding(false);
        }
    }

    useEffect(() => {
        async function loadProduct() {
            setLoading(true);
            setError("");

            try {
                const res = await fetch(`${API}/products/${id}`);
                const body = await res.json();
                if (!res.ok) throw new Error(body.error || "خطای ارتباط با سرور");
                setProduct(body);
            } catch (e) {
                setError(e instanceof Error ? e.message : "خطای نامشخص");
            } finally {
                setLoading(false);
            }
        }
        loadProduct();
    }, [id]);

    return (
        <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
            <div className="mx-auto max-w-5xl px-4 py-8">
                <Link href="/shop" className="text-sm text-emerald-600 hover:underline">
                    ← بازگشت به فروشگاه
                </Link>

                {loading && <p className="py-20 text-center text-slate-500">در حال بارگذاری...</p>}

                {error && (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {product && (
                    <div className="mt-6 grid gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
                        <div className="relative rounded-xl bg-linear-to-b from-slate-50 to-slate-100">
                            <img
                                src={`${API}${product.image}`}
                                alt={product.name}
                                className={`aspect-square w-full object-contain p-8 ${product.inStock ? "" : "opacity-50 grayscale"}`}
                            />
                            {!product.inStock && (
                                <span className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white">
                                    ناموجود
                                </span>
                            )}
                        </div>

                        <div className="space-y-4">
                            <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                {product.category.name}
                            </span>
                            <h1 className="text-2xl font-bold">{product.name}</h1>
                            <p className="leading-7 text-slate-600">{product.description}</p>

                            <p className="text-3xl font-extrabold text-emerald-600">
                                {product.price.toLocaleString("fa-IR")}
                                <span className="mr-1 text-sm font-medium text-slate-500">تومان</span>
                            </p>

                            <p className="text-sm">
                                {product.inStock ? (
                                    <span className="text-emerald-700">
                                        موجود در انبار: {product.stock.toLocaleString("fa-IR")} عدد
                                    </span>
                                ) : (
                                    <span className="text-red-600">این محصول فعلاً موجود نیست</span>
                                )}
                            </p>

                            {product.inStock && (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-slate-600">تعداد:</span>
                                    <div className="flex items-center overflow-hidden rounded-xl border border-slate-200">
                                        <button
                                            onClick={() => setQuantity(quantity - 1)}
                                            disabled={quantity <= 1}
                                            className="h-10 w-10 cursor-pointer text-lg hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            −
                                        </button>
                                        <span className="w-12 text-center font-semibold">
                                            {quantity.toLocaleString("fa-IR")}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            disabled={quantity >= maxQuantity}
                                            className="h-10 w-10 cursor-pointer text-lg hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={addToCart}
                                disabled={!product.inStock || adding}
                                className="w-full cursor-pointer rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                {!product.inStock ? "ناموجود" : adding ? "در حال افزودن..." : "افزودن به سبد"}
                            </button>

                            {cartError && (
                                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                    {cartError}
                                </div>
                            )}

                            {added && (
                                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                                    به سبد اضافه شد.{" "}
                                    <Link href="/cart" className="font-semibold underline">
                                        مشاهده سبد خرید
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}