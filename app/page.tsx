"use client";

import { useEffect, useState } from "react";

type Product = {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: { rate: number; count: number };
};

const CATEGORIES = ["All", "electronics", "jewelery", "men's clothing"];

const formatPrice = (n: number) => `$${n.toFixed(2)}`;

function Spinner({ size = "h-12 w-12" }: { size?: string }) {
    return (
        <div className={`${size} animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600`} />
    );
}

function Rating({ rate, className = "" }: { rate: number; className?: string }) {
    return (
        <span className={`rounded-lg bg-amber-50 px-2 py-1 font-semibold text-amber-600 ${className}`}>
            ⭐ {rate}
        </span>
    );
}

export default function Page() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [category, setCategory] = useState("All");
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [product, setProduct] = useState<Product | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState<string | null>(null);

    useEffect(() => {
        async function loadProducts() {
            try {
                const res = await fetch("https://fakestoreapi.com/products?limit=12");
                if (!res.ok) throw new Error("Failed to fetch products");
                const data: Product[] = await res.json();
                setProducts(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        }
        loadProducts();
    }, []);

    useEffect(() => {
        if (selectedId === null) return;
        let cancelled = false;
        async function loadProduct() {
            setDetailLoading(true);
            setDetailError(null);
            setProduct(null);
            try {
                const res = await fetch(`https://fakestoreapi.com/products/${selectedId}`);
                if (!res.ok) throw new Error("Failed to fetch product details");
                const data: Product = await res.json();
                if (!cancelled) setProduct(data);
            } catch (err) {
                if (!cancelled)
                    setDetailError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                if (!cancelled) setDetailLoading(false);
            }
        }
        loadProduct();
        return () => {
            cancelled = true;
        };
    }, [selectedId]);

    const filtered =
        category === "All" ? products : products.filter((p) => p.category === category);

    if (loading)
        return (
            <div dir="ltr" className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
                <Spinner />
                <p className="text-lg font-medium text-slate-600">Loading...</p>
            </div>
        );

    if (error)
        return (
            <div dir="ltr" className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
                <div className="rounded-2xl border border-red-200 bg-red-50 px-8 py-6 text-center text-red-700 shadow-sm">
                    <p className="mb-1 text-3xl">⚠️</p>
                    <p className="font-semibold">{error}</p>
                </div>
            </div>
        );

    return (
        <div dir="ltr" className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/40 to-slate-100 font-sans">
            <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
                <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800">
                            Product <span className="text-indigo-600">Store</span>
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {filtered.length} products found
                        </p>
                    </div>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium capitalize text-slate-700 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:w-56"
                    >
                        {CATEGORIES.map((value) => (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        ))}
                    </select>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-8">
                {selectedId !== null && (
                    <section className="mb-10 overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-xl shadow-indigo-100/50">
                        <div className="flex items-center justify-between bg-linear-to-r from-indigo-600 to-violet-600 px-6 py-4">
                            <h2 className="text-lg font-bold text-white">Product Details</h2>
                            <button
                                onClick={() => setSelectedId(null)}
                                className="cursor-pointer rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-white/30"
                            >
                                ✕ Close
                            </button>
                        </div>
                        <div className="p-6">
                            {detailLoading && (
                                <div className="flex items-center justify-center gap-3 py-10">
                                    <Spinner size="h-6 w-6" />
                                    <p className="text-slate-600">Loading...</p>
                                </div>
                            )}
                            {detailError && (
                                <p className="rounded-xl bg-red-50 p-4 text-center font-medium text-red-600">
                                    {detailError}
                                </p>
                            )}
                            {product && (
                                <div className="flex flex-col gap-8 md:flex-row">
                                    <div className="flex h-72 w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-50 p-4 md:w-80 md:shrink-0">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col">
                                        <span className="mb-3 w-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold capitalize text-indigo-600">
                                            {product.category}
                                        </span>
                                        <h3 className="text-2xl font-bold leading-snug text-slate-800">
                                            {product.title}
                                        </h3>
                                        <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                                            <Rating rate={product.rating.rate} />
                                            <span>({product.rating.count} reviews)</span>
                                        </div>
                                        <p className="mt-4 leading-8 text-slate-600">
                                            {product.description}
                                        </p>
                                        <div className="mt-auto pt-6">
                                            <p className="text-sm text-slate-400">Price</p>
                                            <p className="text-3xl font-extrabold text-emerald-600">
                                                {formatPrice(product.price)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {filtered.length === 0 ? (
                    <p className="py-20 text-center text-slate-500">
                        No products in this category.
                    </p>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {filtered.map((p) => (
                            <div
                                key={p.id}
                                onClick={() => {
                                    setSelectedId(p.id);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className={`group cursor-pointer overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl ${selectedId === p.id
                                        ? "border-indigo-500 ring-2 ring-indigo-200"
                                        : "border-slate-200"
                                    }`}
                            >
                                <div className="relative flex h-48 items-center justify-center overflow-hidden bg-slate-50 p-4">
                                    <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold capitalize text-indigo-600 shadow-sm">
                                        {p.category}
                                    </span>
                                    <img
                                        src={p.image}
                                        alt={p.title}
                                        className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-4">
                                    <h2 className="line-clamp-2 min-h-12 text-sm font-bold leading-6 text-slate-800">
                                        {p.title}
                                    </h2>
                                    <div className="mt-3 flex items-center justify-between">
                                        <p className="font-extrabold text-emerald-600">
                                            {formatPrice(p.price)}
                                        </p>
                                        <Rating rate={p.rating.rate} className="text-xs" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}