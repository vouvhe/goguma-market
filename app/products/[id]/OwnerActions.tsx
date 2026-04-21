"use client";

import { useState } from "react";
import Link from "next/link";
import type { ProductStatus } from "@/types";

interface OwnerActionsProps {
  productId: string;
  currentStatus: ProductStatus;
}

const STATUS_OPTIONS: { value: ProductStatus; label: string }[] = [
  { value: "selling", label: "판매중" },
  { value: "reserved", label: "예약중" },
  { value: "sold", label: "거래완료" },
];

export default function OwnerActions({ productId, currentStatus }: OwnerActionsProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const currentLabel =
    STATUS_OPTIONS.find((s) => s.value === currentStatus)?.label ?? "판매중";

  function blockDb() {
    alert("DB 무료 사용일자 초과");
    setShowStatusMenu(false);
    setShowDeleteModal(false);
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setShowStatusMenu((v) => !v)}
            className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <span>{currentLabel}</span>
            <span className="text-gray-400 text-xs">▼</span>
          </button>
          {showStatusMenu && (
            <div className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-10 min-w-[110px]">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={blockDb}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition ${
                    currentStatus === opt.value ? "text-goguma-600 font-medium" : "text-gray-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <Link
          href={`/products/${productId}/edit`}
          className="px-3 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          수정
        </Link>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-3 py-2 border border-red-200 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition"
        >
          삭제
        </button>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-2">게시글 삭제</h2>
            <p className="text-sm text-gray-500 mb-6">
              삭제한 게시글은 복구할 수 없어요. 정말 삭제할까요?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                취소
              </button>
              <button
                onClick={blockDb}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
