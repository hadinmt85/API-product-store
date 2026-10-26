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

    function changeFilter(setter: (value: string) => void, value: string) {
        setter(value);
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
        <main dir="rtl" className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-6xl px-4 py-10">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">فروشگاه</h1>
                </div>
                <div className="mb-8 grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => changeFilter(setSearch, e.target.value)}
                        placeholder="جستجوی محصول..."
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    />
                    <select
                        value={category}
                        onChange={(e) => changeFilter(setCategory, e.target.value)}
                        className="w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    >
                        <option value="">همه دسته ها</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.slug}>
                                {c.name} ({c.productCount.toLocaleString("fa-IR")})
                            </option>
                        ))}
                    </select>
                    <select
                        value={sort}
                        onChange={(e) => changeFilter(setSort, e.target.value)}
                        className="w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    >
                        <option value="">جدیدترین</option>
                        <option value="price">ارزان ترین</option>
                        <option value="-price">گران ترین</option>
                    </select>
                    <div className="flex items-center gap-2 lg:col-span-2">
                        <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => changeFilter(setMinPrice, e.target.value)}
                            placeholder="از (تومان)"
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        />
                        <span className="text-gray-400">-</span>
                        <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => changeFilter(setMaxPrice, e.target.value)}
                            placeholder="تا (تومان)"
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {loading && (
                    <p className="py-12 text-center text-gray-500">در حال بارگذاری...</p>
                )}

                {!loading && !error && products.length === 0 && (
                    <p className="py-12 text-center text-gray-500">محصولی پیدا نشد.</p>
                )}

                <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
                    {products.map((p) => (
                        <div
                            key={p.id}
                            className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="relative bg-gray-50">
                                <img
                                    src={`${API}${p.image}`}
                                    alt={p.name}
                                    className={`aspect-square w-full object-contain p-5 transition duration-200 group-hover:scale-105 ${
                                        p.inStock ? "" : "opacity-50 grayscale"
                                    }`}
                                />
                                {!p.inStock && (
                                    <span className="absolute right-3 top-3 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                                        ناموجود
                                    </span>
                                )}
                            </div>
                            <div className="space-y-1 p-4">
                                <h3 className="line-clamp-1 font-semibold text-gray-900">
                                    {p.name}
                                </h3>
                                <p
                                    className={`font-bold ${
                                        p.inStock
                                            ? "text-green-600"
                                            : "text-gray-400 line-through"
                                    }`}
                                >
                                    {p.price.toLocaleString("fa-IR")} تومان
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {products.length > 0 && (
                    <nav className="mt-10 flex items-center justify-center gap-4">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage(page - 1)}
                            className="rounded-lg border border-gray-300 cursor-pointer bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-700"
                        >
                            قبلی
                        </button>
                        <span className="text-sm text-gray-600">
                            صفحه {page.toLocaleString("fa-IR")} از{" "}
                            {totalPages.toLocaleString("fa-IR")}
                        </span>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage(page + 1)}
                            className="rounded-lg border border-gray-300 cursor-pointer bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-700"
                        >
                            بعدی
                        </button>
                    </nav>
                )}
            </div>
        </main>
    );
}