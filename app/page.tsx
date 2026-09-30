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

const CATEGORIES = [
    { value: "All", label: "همه" },
    { value: "electronics", label: "لوازم الکترونیکی" },
    { value: "jewelery", label: "جواهرات" },
    { value: "men's clothing", label: "پوشاک مردانه" },
];

const CATEGORY_FA: Record<string, string> = {
    "electronics": "لوازم الکترونیکی",
    "jewelery": "جواهرات",
    "men's clothing": "پوشاک مردانه",
};

const PRODUCT_FA: Record<number, { img?: string; price?: number; title: string; description: string }> = {
    1: {
        img: "/foto/list_img/img1.webp",
        price: 490000,
        title: "کت تک مردانه پشمی کد kt 0100",
        description:
            "کوله‌ای عالی برای استفاده روزمره و پیاده‌روی در جنگل. لپ‌تاپ خود (تا ۱۵ اینچ) را در جیب مخصوص و پوشش‌دار آن قرار دهید.",
    },
    2: {
        img: "/foto/list_img/img2.webp",
        price: 350000,
        title: "هودی مردانه خزدار مدل تدی",
        description:
            "مدل جذب و اسلیم، آستین بلند رگلان با رنگ متضاد، یقه هنلی با سه دکمه، پارچه‌ای سبک و نرم که تنفس‌پذیر و راحت است. دوخت محکم با یقه گرد، مناسب استایل روزمره.",
    },
    3: {
        img: "/foto/list_img/img3.webp",
        price: 420000,
        title: "پلیور مردانه بافت متراکم طرح‌دار",
        description:
            "لباس رویی عالی برای بهار، پاییز و زمستان، مناسب کار، کوهنوردی، کمپینگ، دوچرخه‌سواری، سفر و فعالیت‌های فضای باز. انتخابی خوب برای هدیه دادن به پدر، همسر یا پسر.",
    },
    4: {
        img: "/foto/list_img/img4.webp",
        price: 560000,
        title: "کت پاییزه مردانه جین مدل S-05",
        description:
            "ممکن است رنگ محصول روی صفحه نمایش با واقعیت کمی تفاوت داشته باشد. لطفاً توجه کنید که اندام افراد متفاوت است، بنابراین اطلاعات اندازه را در توضیحات محصول بررسی کنید.",
    },
    5: {
        img: "/foto/list_img/img5.webp",
        price: 1200000,
        title: "گردنبند طلا 18 عیار زنانه مدل 1072 سگ",
        description:
            "از مجموعه افسانه‌ها؛ نگا با الهام از اژدهای آبی اسطوره‌ای ساخته شده که از مروارید اقیانوس محافظت می‌کند. برای جذب عشق و فراوانی رو به داخل و برای محافظت رو به بیرون ببندید.",
    },
    6: {
        img: "/foto/list_img/img6.webp",
        price: 2500000,
        title: "آویز گردنبند طلا 18 عیار زنانه طرح قلب",
        description:
            "تضمین رضایت. امکان مرجوع یا تعویض هر سفارش تا ۳۰ روز. طراحی و فروش توسط مرکز حفیظ در ایالات متحده.",
    },
    7: {
        img: "/foto/list_img/img7.webp",
        price: 1800000,
        title: "گردنبند طلا 18 عیار زنانه با زنجیر مهره‌ای",
        description:
            "انگشتر کلاسیک سلیتر با نگین الماس برای نامزدی و ازدواج. هدیه‌ای عالی برای نامزدی، عروسی، سالگرد و روز ولنتاین.",
    },
    8: {
        img: "/foto/list_img/img8.webp",
        price: 300000,
        title: "نیم ست طلا 18 عیار زنانه",
        description:
            "گوشواره حلقه‌ای دوتایی با آبکاری رزگلد. ساخته‌شده از استیل ضدزنگ ۳۱۶L.",
    },
    9: {
        img: "/foto/list_img/img9.webp",
        price: 2200000,
        title: "هارد اکسترنال قابل حمل وسترن دیجیتال ۲ ترابایت مدل Elements",
        description:
            "هارد اکسترنال قابل حمل با رابط USB 3.0 و سازگار با USB 2.0. مناسب ذخیره و انتقال سریع فایل‌ها، با ظرفیت ۲ ترابایت.",
    },
    10: {
        img: "/foto/list_img/img10.webp",
        price: 3800000,
        title: "حافظه SSD داخلی سن‌دیسک ۱ ترابایت مدل SSD PLUS",
        description:
            "حافظه SSD با رابط SATA III و سرعت خواندن تا ۵۶۰ مگابایت بر ثانیه. بوت سریع‌تر سیستم و بارگذاری سریع‌تر برنامه‌ها.",
    },
    11: {
        img: "/foto/list_img/img11.webp",
        price: 2100000,
        title: "حافظه SSD سیلیکون پاور ۲۵۶ گیگابایت مدل A55",
        description:
            "حافظه SSD سایز ۲.۵ اینچ با رابط SATA III و تکنولوژی 3D NAND. ارتقای مناسب برای لپ‌تاپ و کامپیوتر رومیزی.",
    },
    12: {
        img: "/foto/list_img/img12.webp",
        price: 4200000,
        title: "هارد اکسترنال گیمینگ وسترن دیجیتال ۴ ترابایت (سازگار با پلی‌استیشن ۴)",
        description:
            "هارد اکسترنال قابل حمل مخصوص گیم با ظرفیت ۴ ترابایت. نصب آسان و سازگار با کنسول پلی‌استیشن ۴.",
    },
};

function faTitle(p: Product) {
    return PRODUCT_FA[p.id]?.title ?? p.title;
}
function faDescription(p: Product) {
    return PRODUCT_FA[p.id]?.description ?? p.description;
}
function faCategory(c: string) {
    return CATEGORY_FA[c] ?? c;
}
function getPrice(p: Product) {
    return PRODUCT_FA[p.id]?.price ?? p.price;
}
function formatPrice(p: Product) {
    return `${getPrice(p).toLocaleString("fa-IR")} تومان`;
}
function getImage(p: Product) {
    return PRODUCT_FA[p.id]?.img ?? p.image;
}

export default function Page() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [category, setCategory] = useState("All");
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [product, setProduct] = useState<Product | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState<string | null>(null);

    useEffect(() => {
        async function loadProducts() {
            try {
                const res = await fetch("https://fakestoreapi.com/products?limit=12");
                if (!res.ok) throw new Error("خطا در دریافت محصولات");
                const data: Product[] = await res.json();
                setProducts(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "خطای ناشناخته");
            } finally {
                setLoading(false);
            }
        }
        loadProducts();
    }, []);

    useEffect(() => {
        if (selectedProductId === null) return;
        let cancelled = false;
        async function loadProduct() {
            setDetailLoading(true);
            setDetailError(null);
            setProduct(null);
            try {
                const res = await fetch(
                    `https://fakestoreapi.com/products/${selectedProductId}`
                );
                if (!res.ok) throw new Error("خطا در دریافت جزئیات محصول");
                const data: Product = await res.json();
                if (!cancelled) setProduct(data);
            } catch (err) {
                if (!cancelled)
                    setDetailError(err instanceof Error ? err.message : "خطای ناشناخته");
            } finally {
                if (!cancelled) setDetailLoading(false);
            }
        }
        loadProduct();
        return () => {
            cancelled = true;
        };
    }, [selectedProductId]);

    const filtered =
        category === "All"
            ? products
            : products.filter((p) => p.category === category);

    if (loading)
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
                <p className="text-lg font-medium text-slate-600">Loading...</p>
            </div>
        );

    if (error)
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
                <div className="rounded-2xl border border-red-200 bg-red-50 px-8 py-6 text-center text-red-700 shadow-sm">
                    <p className="mb-1 text-3xl">⚠️</p>
                    <p className="font-semibold">{error}</p>
                </div>
            </div>
        );

    return (
        <div
            dir="rtl"
            className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/40 to-slate-100"
        >
            <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
                <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800">
                            فروشگاه <span className="text-indigo-600">محصولات</span>
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {filtered.length.toLocaleString("fa-IR")} محصول یافت شد
                        </p>
                    </div>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:w-56"
                    >
                        {CATEGORIES.map((c) => (
                            <option key={c.value} value={c.value}>
                                {c.label}
                            </option>
                        ))}
                    </select>
                </div>
            </header>
            <main className="mx-auto max-w-6xl px-6 py-8">
                {selectedProductId !== null && (
                    <section className="mb-10 overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-xl shadow-indigo-100/50">
                        <div className="flex items-center justify-between bg-linear-to-l from-indigo-600 to-violet-600 px-6 py-4">
                            <h2 className="text-lg font-bold text-white">جزئیات محصول</h2>
                            <button
                                onClick={() => setSelectedProductId(null)}
                                className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-white/30"
                            >
                                ✕ بستن
                            </button>
                        </div>
                        <div className="p-6">
                            {detailLoading && (
                                <div className="flex items-center justify-center gap-3 py-10">
                                    <div className="h-6 w-6 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
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
                                            src={getImage(product)}
                                            alt={faTitle(product)}
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col">
                                        <span className="mb-3 w-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                                            {faCategory(product.category)}
                                        </span>
                                        <h3 className="text-2xl font-bold leading-snug text-slate-800">
                                            {faTitle(product)}
                                        </h3>
                                        <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                                            <span className="rounded-lg bg-amber-50 px-2 py-1 font-semibold text-amber-600">
                                                ⭐ {product.rating.rate.toLocaleString("fa-IR")}
                                            </span>
                                            <span>
                                                ({product.rating.count.toLocaleString("fa-IR")} نظر)
                                            </span>
                                        </div>
                                        <p className="mt-4 leading-8 text-slate-600">
                                            {faDescription(product)}
                                        </p>
                                        <div className="mt-auto pt-6">
                                            <p className="text-sm text-slate-400">قیمت</p>
                                            <p className="text-3xl font-extrabold text-emerald-600">
                                                {formatPrice(product)}
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
                        محصولی در این دسته‌بندی وجود ندارد.
                    </p>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {filtered.map((p) => (
                            <div
                                key={p.id}
                                onClick={() => {
                                    setSelectedProductId(p.id);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className={`group cursor-pointer overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
                                    selectedProductId === p.id
                                        ? "border-indigo-500 ring-2 ring-indigo-200"
                                        : "border-slate-200"
                                }`}
                            >
                                <div className="relative flex h-48 items-center justify-center overflow-hidden bg-slate-50 p-4">
                                    <span className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-indigo-600 shadow-sm">
                                        {faCategory(p.category)}
                                    </span>
                                    <img
                                        src={getImage(p)}
                                        alt={faTitle(p)}
                                        className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-4">
                                    <h2 className="line-clamp-2 min-h-12 text-sm font-bold leading-6 text-slate-800">
                                        {faTitle(p)}
                                    </h2>
                                    <div className="mt-3 flex items-center justify-between">
                                        <p className="font-extrabold text-emerald-600">
                                            {formatPrice(p)}
                                        </p>
                                        <span className="rounded-lg bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-600">
                                            ⭐ {p.rating.rate.toLocaleString("fa-IR")}
                                        </span>
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