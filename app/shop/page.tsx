"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = "https://practice.amirm.me";

type Category = {
    id: number;
    slug: string;
    name: string;
    productCount: number;
};

type Product = {
    id: number;
    name: string;
    price: number;
    inStock: boolean;
    image: string;
    category: { name: string };
};

const toman = (n: number) => n.toLocaleString("fa-IR") + " تومان";

function useDebounce(value: string, delay = 500) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}

export default function ShopPage() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [page, setPage] = useState(1);

    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
            .then((body) => setCategories(body.data));
    }, []);

    useEffect(() => {
        let ignore = false;

        async function loadProducts() {
            setLoading(true);
            setError("");

            const params = new URLSearchParams({ page: String(page) });
            if (debouncedSearch) params.set("search", debouncedSearch);
            if (category) params.set("category", category);
            if (debouncedMin) params.set("minPrice", debouncedMin);
            if (debouncedMax) params.set("maxPrice", debouncedMax);
            if (sort) params.set("sort", sort);

            try {
                const res = await fetch(`${API}/products?${params}`);
                const body = await res.json();
                if (!res.ok) throw new Error(body.error || "خطا در ارتباط با سرور");

                if (!ignore) {
                    setProducts(body.data);
                    setTotalPages(body.totalPages);
                }
            } catch (e) {
                if (!ignore) setError(e instanceof Error ? e.message : "خطای نامشخص");
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        loadProducts();

        return () => {
            ignore = true;
        };
    }, [debouncedSearch, category, debouncedMin, debouncedMax, sort, page]);

    const inputClass =
        "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500";
    const btnClass =
        "rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40";

    return (
        <main dir="rtl" className="mx-auto max-w-6xl space-y-6 px-4 py-8">
            <h1 className="text-2xl font-bold">فروشگاه</h1>
            <div className="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
                <input
                    type="search"
                    value={search}
                    onChange={(e) => changeFilter(setSearch, e.target.value)}
                    placeholder="جستجوی محصول..."
                    className={`${inputClass} lg:col-span-2`}
                />
                <select
                    value={category}
                    onChange={(e) => changeFilter(setCategory, e.target.value)}
                    className={inputClass}
                >
                    <option value="">همه‌ی دسته‌ها</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.slug}>
                            {c.name} ({c.productCount.toLocaleString("fa-IR")})
                        </option>
                    ))}
                </select>
                <select
                    value={sort}
                    onChange={(e) => changeFilter(setSort, e.target.value)}
                    className={inputClass}
                >
                    <option value="">جدیدترین</option>
                    <option value="price">ارزان‌ترین</option>
                    <option value="-price">گران‌ترین</option>
                </select>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        min={0}
                        value={minPrice}
                        onChange={(e) => changeFilter(setMinPrice, e.target.value)}
                        placeholder="از (تومان)"
                        className={inputClass}
                    />
                    <input
                        type="number"
                        min={0}
                        value={maxPrice}
                        onChange={(e) => changeFilter(setMaxPrice, e.target.value)}
                        placeholder="تا (تومان)"
                        className={inputClass}
                    />
                </div>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}
            {loading && products.length === 0 && (
                <p className="py-12 text-center text-gray-500">در حال بارگذاری...</p>
            )}
            {!loading && !error && products.length === 0 && (
                <p className="py-12 text-center text-gray-500">محصولی پیدا نشد.</p>
            )}

            <div className={`grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 ${loading ? "opacity-60" : ""}`} >
                {products.map((p) => (
                    <Link
                        key={p.id}
                        href={`/shop/${p.id}`}
                        className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-md"
                    >
                        <div className="relative aspect-square bg-gray-50">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`${API}${p.image}`}
                                alt={p.name}
                                className={`h-full w-full object-contain p-4 ${p.inStock ? "" : "opacity-50"
                                    }`}
                            />
                            {!p.inStock && (
                                <span className="absolute right-3 top-3 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                                    ناموجود
                                </span>
                            )}
                        </div>
                        <div className="flex flex-1 flex-col gap-1 p-4">
                            <span className="text-xs text-gray-500">{p.category.name}</span>
                            <h3 className="font-semibold text-gray-900">{p.name}</h3>
                            <p className="mt-auto pt-2 font-bold text-gray-900">{toman(p.price)}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {products.length > 0 && (
                <nav className="flex items-center justify-center gap-4">
                    <button
                        className={btnClass}
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                    >
                        قبلی
                    </button>
                    <span className="text-sm text-gray-600">
                        صفحه {page.toLocaleString("fa-IR")} از {totalPages.toLocaleString("fa-IR")}
                    </span>
                    <button
                        className={btnClass}
                        disabled={page >= totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        بعدی
                    </button>
                </nav>
            )}
        </main>
    );
}