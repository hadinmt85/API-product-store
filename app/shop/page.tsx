"use client";

import { useState, useEffect } from "react";

const API = "https://practice.amirm.me";

type Product = {
    id: number;
    name: string;
    price: number;
    inStock: boolean;
    image: string;
    category: { name: string };
}

type Category = {
    id: number;
    slug: string;
    name: string;
    productCount: number;
}

function useDebounce(value: string, delay = 500) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const debouncedSearch = useDebounce(search);
    const debouncedMin = useDebounce(minPrice);
    const debouncedMax = useDebounce(maxPrice);

    const hasFilters = search || category || sort || minPrice || maxPrice;

    function changeFilter(setter: (value: string) => void, value: string) {
        setter(value);
        setPage(1);
    }

    function resetFilters() {
        setSearch("");
        setCategory("");
        setSort("");
        setMinPrice("");
        setMaxPrice("");
        setPage(1);
    }

    useEffect(() => {
        fetch(`${API}/categories`)
            .then((res) => res.json())
            .then((body) => setCategories(body.data))
    }, []);

    useEffect(() => {
        async function loadProducts() {
            setLoading(true);
            setError("");

            const params = new URLSearchParams({ page: String(page) });
            if (debouncedSearch) params.set("search", debouncedSearch);
            if (category) params.set("category", category);
            if (sort) params.set("sort", sort);
            if (debouncedMin) params.set("minPrice", debouncedMin);
            if (debouncedMax) params.set("maxPrice", debouncedMax);

            try {
                const res = await fetch(`${API}/products?${params}`);
                const body = await res.json();
                if (!res.ok) throw new Error(body.error || "خطای ارتباط با سرور");
                setProducts(body.data);
                setTotalPages(body.totalPages);
            } catch (e) {
                setError(e instanceof Error ? e.message : "خطای نامشخص");
            } finally {
                setLoading(false);
            }
        }
        loadProducts();
    }, [debouncedSearch, category, sort, debouncedMin, debouncedMax, page]);

    return (
        <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
            <div className="mx-auto max-w-6xl px-4 py-8">
                <header className="mb-8 rounded-3xl bg-linear-to-l from-emerald-600 to-teal-500 px-6 py-10 text-center shadow-lg">
                    <h1 className="text-3xl font-extrabold text-white md:text-4xl">فروشگاه</h1>
                    <p className="mt-2 text-sm text-emerald-50">
                        محصول مورد نظرت را جستجو کن و با فیلترها سریع‌تر پیدا کن
                    </p>

                    <div className="relative mx-auto mt-6 max-w-xl">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                        >
                            <circle cx="11" cy="11" r="7" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => changeFilter(setSearch, e.target.value)}
                            placeholder="جستجوی محصول..."
                            className="w-full rounded-2xl border-0 bg-white py-3.5 pl-4 pr-12 text-sm text-slate-800 shadow-md outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-200"
                        />
                    </div>
                </header>

                <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                    <aside className="w-full space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6 lg:w-72 lg:shrink-0">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-slate-800">فیلترها</h2>
                            {hasFilters && (
                                <button
                                    onClick={resetFilters}
                                    className="cursor-pointer border-2 border-red-400 p-2 rounded-4xl text-xs text-red-500 transition hover:text-white hover:bg-red-400"
                                >
                                    پاک کردن فیلتر
                                </button>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500">دسته‌بندی</label>
                            <select
                                value={category}
                                onChange={(e) => changeFilter(setCategory, e.target.value)}
                                className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                            >
                                <option value="">همه دسته ها</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.slug}>
                                        {c.name} ({c.productCount.toLocaleString("fa-IR")})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500">مرتب‌سازی</label>
                            <select
                                value={sort}
                                onChange={(e) => changeFilter(setSort, e.target.value)}
                                className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                            >
                                <option value="">جدیدترین</option>
                                <option value="price">ارزان ترین</option>
                                <option value="-price">گران ترین</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500">محدوده قیمت</label>
                            <div className="space-y-2">
                                <input
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => changeFilter(setMinPrice, e.target.value)}
                                    placeholder="از (تومان)"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                                />
                                <input
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => changeFilter(setMaxPrice, e.target.value)}
                                    placeholder="تا (تومان)"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                                />
                            </div>
                        </div>
                    </aside>

                    <section className="min-w-0 flex-1">
                        {error && (
                            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {loading && products.length === 0 && (
                            <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
                                    >
                                        <div className="aspect-square bg-slate-100" />
                                        <div className="space-y-2 p-4">
                                            <div className="h-3 w-1/3 rounded bg-slate-100" />
                                            <div className="h-4 w-2/3 rounded bg-slate-100" />
                                            <div className="h-4 w-1/2 rounded bg-slate-100" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!loading && !error && products.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
                                <p className="text-lg font-semibold text-slate-700">محصولی پیدا نشد</p>
                                <p className="mt-1 text-sm text-slate-500">
                                    فیلترها را تغییر بده یا عبارت دیگری جستجو کن.
                                </p>
                            </div>
                        )}

                        <div
                            className={`grid grid-cols-2 gap-5 transition-opacity md:grid-cols-3 ${loading && products.length > 0 ? "opacity-60" : ""
                                }`}
                        >
                            {products.map((p) => (
                                <div
                                    key={p.id}
                                    className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
                                >
                                    <div className="relative overflow-hidden bg-linear-to-b from-slate-50 to-slate-100">
                                        <img
                                            src={`${API}${p.image}`}
                                            alt={p.name}
                                            className={`aspect-square w-full object-contain p-6 transition duration-300 group-hover:scale-110 ${p.inStock ? "" : "opacity-50 grayscale"
                                                }`}
                                        />
                                        {!p.inStock && (
                                            <span className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white shadow">
                                                ناموجود
                                            </span>
                                        )}
                                    </div>
                                    <div className="space-y-2 p-4">
                                        <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                                            {p.category.name}
                                        </span>
                                        <h3 className="line-clamp-1 font-semibold text-slate-900">
                                            {p.name}
                                        </h3>
                                        <p
                                            className={`text-lg font-extrabold ${p.inStock
                                                ? "text-emerald-600"
                                                : "text-slate-400 line-through"
                                                }`}
                                        >
                                            {p.price.toLocaleString("fa-IR")}
                                            <span className="mr-1 text-xs font-medium text-slate-500">
                                                تومان
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {products.length > 0 && (
                            <nav className="mt-10 flex items-center justify-center gap-3">
                                <button
                                    disabled={page <= 1}
                                    onClick={() => setPage(page - 1)}
                                    className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-white disabled:hover:text-slate-700"
                                >
                                    قبلی
                                </button>
                                <span className="rounded-xl bg-white px-4 py-2.5 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
                                    صفحه{" "}
                                    <b className="text-emerald-600">{page.toLocaleString("fa-IR")}</b>{" "}
                                    از {totalPages.toLocaleString("fa-IR")}
                                </span>
                                <button
                                    disabled={page >= totalPages}
                                    onClick={() => setPage(page + 1)}
                                    className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-white disabled:hover:text-slate-700"
                                >
                                    بعدی
                                </button>
                            </nav>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}