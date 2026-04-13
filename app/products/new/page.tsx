"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase";
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

export default function NewProductPage() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("기타");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (images.length + files.length > 5) {
      setError("이미지는 최대 5장까지 등록 가능합니다.");
      return;
    }
    setError("");
    setImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // 이미지 업로드
    const imageUrls: string[] = [];
    for (const image of images) {
      const ext = image.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, image);

      if (uploadError) {
        setError("이미지 업로드에 실패했습니다.");
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);
      imageUrls.push(urlData.publicUrl);
    }

    // 상품 저장
    const { data: product, error: insertError } = await supabase
      .from("products")
      .insert({
        user_id: user.id,
        title,
        price: parseInt(price),
        description,
        category,
        image_urls: imageUrls,
      })
      .select()
      .single();

    if (insertError || !product) {
      setError("상품 등록에 실패했습니다.");
      setLoading(false);
      return;
    }

    router.push(`/products/${product.id}`);
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-lg font-bold mb-6">중고거래 올리기</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 이미지 업로드 */}
        <div>
          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-goguma-400 transition"
            >
              <span className="text-2xl">+</span>
              <span className="text-xs mt-0.5">{images.length}/5</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
            {previews.map((src, i) => (
              <div key={i} className="relative w-20 h-20">
                <Image
                  src={src}
                  alt={`미리보기 ${i + 1}`}
                  fill
                  className="rounded-xl object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-gray-800 text-white rounded-full text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 제목 */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="제목"
            maxLength={40}
            className="w-full border-b border-gray-200 py-3 text-base focus:outline-none focus:border-goguma-400"
          />
        </div>

        {/* 카테고리 */}
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

        {/* 가격 */}
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

        {/* 설명 */}
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="게시글 내용을 작성해 주세요."
            rows={6}
            className="w-full border-b border-gray-200 py-3 text-sm resize-none focus:outline-none focus:border-goguma-400"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading || !title || !price}
          className="w-full bg-goguma-500 text-white py-3 rounded-xl font-medium hover:bg-goguma-600 transition disabled:opacity-50"
        >
          {loading ? "등록 중..." : "작성 완료"}
        </button>
      </form>
    </div>
  );
}
