"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-6xl">
        🍠
      </div>
    );
  }

  return (
    <div>
      <div className="relative w-full aspect-square bg-gray-100">
        <Image
          src={images[current]}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 px-4 py-3 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                i === current ? "border-goguma-500" : "border-transparent"
              }`}
            >
              <Image src={src} alt={`${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
