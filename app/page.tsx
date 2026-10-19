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

const CATEGORIES = ["All", "electronics", "jewelery", "men's clothing", "women's clothing"];

const MAX_PER_CATEGORY: Record<string, number> = {
    electronics: 4,
    "women's clothing": 4,
};

const formatPrice = (n: number) => `$${n.toFixed(2)}`;

function Spinner({ size = "h-8 w-8" }: { size?: string }) {
    return (
        <div
            className={`${size} animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600`}
        />
    );
}

function Stars({ rate, className = "h-4 w-4" }: { rate: number; className?: string }) {
    const star = (
        <svg viewBox="0 0 20 20" className={`${className} shrink-0`} fill="currentColor">
            <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.8 4.8 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
    );
    const row = <div className="flex gap-0.5">{[0, 1, 2, 3, 4].map((i) => <span key={i}>{star}</span>)}</div>;
    return (
        <div className="relative inline-block" aria-label={`Rating ${rate} out of 5`}>
            <div className="text-slate-200">{row}</div>
            <div
                className="absolute inset-0 overflow-hidden text-amber-400"
                style={{ width: `${(rate / 5) * 100}%` }}
            >
                {row}
            </div>
        </div>
    );
}

function CategoryBadge({ children }: { children: React.ReactNode }) {
    return (
        <span className="w-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold capitalize tracking-wide text-indigo-600 ring-1 ring-inset ring-indigo-100">
            {children}
        </span>
    );
}

function SkeletonCard() {
    return (
        <div className="animate-pulse overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-4">
            <div className="h-48 rounded-2xl bg-slate-100" />
            <div className="mt-4 h-4 w-3/4 rounded bg-slate-100" />
            <div className="mt-2 h-4 w-1/2 rounded bg-slate-100" />
            <div className="mt-5 flex justify-between">
                <div className="h-5 w-16 rounded bg-slate-100" />
                <div className="h-5 w-20 rounded bg-slate-100" />
            </div>
        </div>
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
                const res = await fetch("https://fakestoreapi.com/products?limit=20");
                if (!res.ok) throw new Error("Failed to fetch products");
                const data: Product[] = await res.json();
                const counts: Record<string, number> = {};
                const limited = data.filter((p) => {
                    const max = MAX_PER_CATEGORY[p.category];
                    if (max === undefined) return true;
                    counts[p.category] = (counts[p.category] ?? 0) + 1;
                    return counts[p.category] <= max;
                });
                setProducts(limited);
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

    useEffect(() => {
        if (selectedId === null) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelectedId(null);
        window.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [selectedId]);

    const filtered =
        category === "All" ? products : products.filter((p) => p.category === category);

    const countFor = (c: string) =>
        c === "All" ? products.length : products.filter((p) => p.category === c).length;

    if (error)
        return (
            <div dir="ltr" className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
                <div className="max-w-sm rounded-3xl border border-red-100 bg-white p-8 text-center shadow-xl shadow-red-100/50">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
                        ⚠️
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">Something went wrong</h2>
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 cursor-pointer rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );

    return (
        <div
            dir="ltr"
            className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-indigo-200"
        >
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-300/30 blur-3xl" />
                <div className="absolute -right-32 top-40 h-96 w-96 rounded-full bg-violet-300/30 blur-3xl" />
                <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-sky-200/30 blur-3xl" />
            </div>
            <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur-xl">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 text-lg text-white shadow-lg shadow-indigo-500/30">
                            🛍️
                        </div>
                        <h1 className="text-xl font-extrabold tracking-tight">
                            Product <span className="text-indigo-600">Store</span>
                        </h1>
                    </div>
                    <span className="rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold text-slate-600">
                        {filtered.length} items
                    </span>
                </div>
            </header>
            <main className="mx-auto max-w-6xl px-6 pb-16">
                <section className="py-10 text-center sm:py-14">
                    <h2 className="bg-linear-to-r from-slate-900 via-indigo-700 to-violet-700 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl">
                        Discover something you&apos;ll love
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-slate-500">
                        Browse our hand-picked collection and find the perfect product for you.
                    </p>
                </section>
                <div className="-mx-6 mb-8 overflow-x-auto px-6 pb-2 [&::-webkit-scrollbar]:hidden">
                    <div className="flex w-max gap-2 sm:mx-auto">
                        {CATEGORIES.map((value) => {
                            const active = category === value;
                            return (
                                <button
                                    key={value}
                                    onClick={() => setCategory(value)}
                                    className={`flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold capitalize transition duration-200 ${
                                        active
                                            ? "bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30"
                                            : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-indigo-50 hover:text-indigo-700 hover:ring-indigo-200"
                                    }`}
                                >
                                    {value}
                                    {!loading && (
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs ${
                                                active ? "bg-white/25" : "bg-slate-100 text-slate-500"
                                            }`}
                                        >
                                            {countFor(value)}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
                {loading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-24 text-center">
                        <p className="text-5xl">🔍</p>
                        <p className="mt-4 text-slate-500">No products in this category.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {filtered.map((p) => (
                            <article
                                key={p.id}
                                onClick={() => setSelectedId(p.id)}
                                className="group cursor-pointer overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-200/60"
                            >
                                <div className="relative flex h-56 items-center justify-center overflow-hidden bg-linear-to-b from-slate-50 to-white p-6">
                                    <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold capitalize text-indigo-600 shadow-sm ring-1 ring-slate-100 backdrop-blur">
                                        {p.category}
                                    </span>
                                    <img
                                        src={p.image}
                                        alt={p.title}
                                        className="h-full w-full object-contain mix-blend-multiply transition duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-5">
                                    <h3 className="line-clamp-2 min-h-12 text-sm font-bold leading-6 text-slate-800 transition group-hover:text-indigo-700">
                                        {p.title}
                                    </h3>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Stars rate={p.rating.rate} className="h-3.5 w-3.5" />
                                        <span className="text-xs text-slate-400">
                                            ({p.rating.count})
                                        </span>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                                        <p className="text-xl font-extrabold text-slate-900">
                                            {formatPrice(p.price)}
                                        </p>
                                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition duration-300 group-hover:bg-indigo-600 group-hover:text-white">
                                            →
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
            {selectedId !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
                    role="dialog"
                    aria-modal="true"
                >
                    <div
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                        onClick={() => setSelectedId(null)}
                    />
                    <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
                        <button
                            onClick={() => setSelectedId(null)}
                            aria-label="Close"
                            className="absolute right-4 top-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-md ring-1 ring-slate-200 transition hover:rotate-90 hover:bg-slate-900 hover:text-white"
                        >
                            ✕
                        </button>
                        {detailLoading && (
                            <div className="flex items-center justify-center gap-3 py-32">
                                <Spinner />
                                <p className="font-medium text-slate-600">Loading...</p>
                            </div>
                        )}
                        {detailError && (
                            <div className="p-10">
                                <p className="rounded-2xl bg-red-50 p-5 text-center font-medium text-red-600">
                                    {detailError}
                                </p>
                            </div>
                        )}
                        {product && (
                            <div className="flex flex-col md:flex-row">
                                <div className="flex h-72 items-center justify-center bg-linear-to-br from-indigo-50 via-white to-violet-50 p-8 md:h-auto md:w-80 md:shrink-0">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="h-full max-h-64 w-full object-contain mix-blend-multiply drop-shadow-xl"
                                    />
                                </div>
                                <div className="flex flex-1 flex-col p-6 sm:p-8">
                                    <CategoryBadge>{product.category}</CategoryBadge>
                                    <h3 className="mt-4 pr-8 text-2xl font-extrabold leading-snug text-slate-900">
                                        {product.title}
                                    </h3>
                                    <div className="mt-3 flex items-center gap-3">
                                        <Stars rate={product.rating.rate} />
                                        <span className="text-sm font-semibold text-amber-600">
                                            {product.rating.rate}
                                        </span>
                                        <span className="text-sm text-slate-400">
                                            · {product.rating.count} reviews
                                        </span>
                                    </div>
                                    <p className="mt-5 leading-7 text-slate-600">
                                        {product.description}
                                    </p>
                                    <div className="mt-auto flex items-end justify-between gap-4 pt-8">
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                                Price
                                            </p>
                                            <p className="text-4xl font-black text-emerald-600">
                                                {formatPrice(product.price)}
                                            </p>
                                        </div>
                                        <button className="cursor-pointer rounded-2xl bg-linear-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:scale-105 hover:shadow-xl active:scale-95">
                                            Add to cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}