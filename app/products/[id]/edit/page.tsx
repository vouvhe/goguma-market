"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import type { Category } from "@/types";

const CATEGORIES: Category[] = [
  "디지털/가전",
  "가구/인테리어",
  "의류",
  "도서",
  "스포츠/레저",
  "뷰티/미용",
  "생활/주방",
  "기타",
];

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("기타");
  const [existingUrls, setExistingUrls] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const meRes = await fetch("/api/auth/me");
      const me = await meRes.json();
      if (!me) { router.push("/login"); return; }

      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) { router.push("/"); return; }
      const product = await res.json();

      if (product.user_id !== me.userId) { router.push(`/products/${id}`); return; }

      setTitle(product.title);
      setPrice(String(product.price));
      setDescription(product.description ?? "");
      setCategory((product.category as Category) ?? "기타");
      setExistingUrls(product.image_urls ?? []);
      setFetching(false);
    }
    load();
  }, [id, router]);

  function removeExisting(index: number) {
    setExistingUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function handleNewImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const total = existingUrls.length + newFiles.length + files.length;
    if (total > 5) {
      setError("이미지는 최대 5장까지 등록 가능합니다.");
      return;
    }
    setError("");
    setNewFiles((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  }

  function removeNew(index: number) {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 새 이미지 업로드
    const uploadedUrls: string[] = [];
    for (const file of newFiles) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        setError("이미지 업로드에 실패했습니다.");
        setLoading(false);
        return;
      }
      const { url } = await res.json();
      uploadedUrls.push(url);
    }

    const imageUrls = [...existingUrls, ...uploadedUrls];

    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, price: parseInt(price), category, imageUrls }),
    });

    if (!res.ok) {
      setError("수정에 실패했습니다.");
      setLoading(false);
      return;
    }

    router.push(`/products/${id}`);
    router.refresh();
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        불러오는 중...
      </div>
    );
  }

  const totalImages = existingUrls.length + newFiles.length;

  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">
          ←
        </button>
        <h1 className="text-lg font-bold">게시글 수정</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex gap-3 flex-wrap">
          {totalImages < 5 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-goguma-400 transition"
            >
              <span className="text-2xl">+</span>
              <span className="text-xs mt-0.5">{totalImages}/5</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleNewImages}
            className="hidden"
          />
          {existingUrls.map((src, i) => (
            <div key={`ex-${i}`} className="relative w-20 h-20">
              <Image src={src} alt={`기존 ${i + 1}`} fill className="rounded-xl object-cover" />
              <button
                type="button"
                onClick={() => removeExisting(i)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-gray-800 text-white rounded-full text-xs flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
          {newPreviews.map((src, i) => (
            <div key={`new-${i}`} className="relative w-20 h-20">
              <Image src={src} alt={`새 ${i + 1}`} fill className="rounded-xl object-cover" />
              <button
                type="button"
                onClick={() => removeNew(i)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-goguma-500 text-white rounded-full text-xs flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="제목"
          maxLength={40}
          className="w-full border-b border-gray-200 py-3 text-base focus:outline-none focus:border-goguma-400"
        />

        <div>
          <label className="block text-sm text-gray-500 mb-2">카테고리</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${
                  category === cat
                    ? "bg-goguma-500 text-white border-goguma-500"
                    : "border-gray-300 text-gray-600 hover:border-goguma-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center border-b border-gray-200 py-3">
          <span className="text-gray-500 mr-2">₩</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min={0}
            placeholder="가격을 입력해주세요"
            className="flex-1 focus:outline-none text-base"
          />
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="게시글 내용을 작성해 주세요."
          rows={6}
          className="w-full border-b border-gray-200 py-3 text-sm resize-none focus:outline-none focus:border-goguma-400"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading || !title || !price}
          className="w-full bg-goguma-500 text-white py-3 rounded-xl font-medium hover:bg-goguma-600 transition disabled:opacity-50"
        >
          {loading ? "수정 중..." : "수정 완료"}
        </button>
      </form>
    </div>
  );
}
