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
};

type Category = {
    id: number;
    slug: string;
    name: string;
    productCount: number;
};

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
            .then((body) => setCategories(body.data));
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

    const fieldClass =
        "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

    const pagerBtnClass =
        "rounded-xl border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white";

    return (
        <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-800">
            <header className="border-b border-indigo-900 bg-indigo-950 text-white shadow-md">
                <div className="mx-auto flex max-w-6xl flex-row gap-10 px-4 py-4 sm:items-center">
                    <h1 className="shrink-0 text-xl font-extrabold tracking-tight">
                        فروشگاه
                    </h1>
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => changeFilter(setSearch, e.target.value)}
                        placeholder="جستجوی محصول..."
                        className={`${fieldClass} sm:max-w-xs`}
                    />
                </div>
            </header>

            <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 lg:flex-row lg:items-start">
                <aside className="w-full space-y-7 rounded-2xl border border-slate-200 bg-white p-7 shadow-md lg:sticky lg:top-6 lg:w-72 lg:shrink-0">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <h2 className="text-lg font-bold text-slate-900">
                            فیلترها
                        </h2>
                        {hasFilters && (
                            <button
                                onClick={resetFilters}
                                className="cursor-pointer text-xs font-medium text-red-500 transition hover:text-red-700"
                            >
                                پاک کردن
                            </button>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">
                            دسته‌بندی
                        </label>
                        <select
                            value={category}
                            onChange={(e) => changeFilter(setCategory, e.target.value)}
                            className={`${fieldClass} cursor-pointer`}
                        >
                            <option value="">همه دسته‌ها</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.slug}>
                                    {c.name} ({c.productCount.toLocaleString("fa-IR")})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">
                            مرتب‌سازی
                        </label>
                        <select
                            value={sort}
                            onChange={(e) => changeFilter(setSort, e.target.value)}
                            className={`${fieldClass} cursor-pointer`}
                        >
                            <option value="">جدیدترین</option>
                            <option value="price">ارزان‌ترین</option>
                            <option value="-price">گران‌ترین</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">
                            محدوده قیمت
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={minPrice}
                                onChange={(e) => changeFilter(setMinPrice, e.target.value)}
                                placeholder="از"
                                className={fieldClass}
                            />
                            <input
                                type="number"
                                value={maxPrice}
                                onChange={(e) => changeFilter(setMaxPrice, e.target.value)}
                                placeholder="تا"
                                className={fieldClass}
                            />
                        </div>
                        <p className="text-xs text-slate-400">به تومان</p>
                    </div>
                </aside>
                <section className="min-w-0 flex-1">
                    {error && (
                        <div className="mb-5 rounded-xl border-r-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                    {loading && products.length === 0 && (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
                                >
                                    <div className="aspect-square bg-slate-200" />
                                    <div className="space-y-3 p-4">
                                        <div className="h-3 w-1/3 rounded bg-slate-200" />
                                        <div className="h-4 w-2/3 rounded bg-slate-200" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {!loading && !error && products.length === 0 && (
                        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-16 text-center shadow-sm">
                            <p className="text-lg font-bold text-slate-800">
                                محصولی پیدا نشد
                            </p>
                            <p className="mt-2 text-sm text-slate-500">
                                فیلترها را تغییر بده یا عبارت دیگری جستجو کن.
                            </p>
                        </div>
                    )}
                    <div className={`grid grid-cols-2 gap-4 md:grid-cols-3 ${loading && products.length > 0 ? "opacity-60" : ""}`}>
                        {products.map((p) => (
                            <div
                                key={p.id}
                                className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg"
                            >
                                <div className="relative overflow-hidden bg-slate-100">
                                    <img
                                        src={`${API}${p.image}`}
                                        alt={p.name}
                                        className={`aspect-square w-full object-contain p-5 transition duration-300 group-hover:scale-105 ${p.inStock ? "" : "opacity-40 grayscale"
                                            }`}
                                    />
                                    {!p.inStock && (
                                        <span className="absolute right-3 top-3 rounded-lg bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
                                            ناموجود
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-2 p-3 sm:p-4">
                                    <p className="text-xs font-medium text-indigo-600">
                                        {p.category.name}
                                    </p>
                                    <h3 className="line-clamp-1 text-sm font-semibold text-slate-800">
                                        {p.name}
                                    </h3>
                                    <p
                                        className={`pt-1 text-base font-bold ${p.inStock
                                            ? "text-emerald-700"
                                            : "text-slate-400 line-through"
                                            }`}
                                    >
                                        {p.price.toLocaleString("fa-IR")}
                                        <span className="mr-1 text-xs font-normal text-slate-500">
                                            تومان
                                        </span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {products.length > 0 && (
                        <nav className="mt-8 flex items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage(page - 1)}
                                className={`${pagerBtnClass} cursor-pointer`}
                            >
                                قبلی
                            </button>
                            <span className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-800">
                                صفحه {page.toLocaleString("fa-IR")} از{" "}
                                {totalPages.toLocaleString("fa-IR")}
                            </span>
                            <button
                                disabled={page >= totalPages}
                                onClick={() => setPage(page + 1)}
                                className={`${pagerBtnClass} cursor-pointer`}
                            >
                                بعدی
                            </button>
                        </nav>
                    )}
                </section>
            </div>
        </main>
    );
}