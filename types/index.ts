export type ProductStatus = "selling" | "reserved" | "sold";

export type Category =
  | "디지털/가전"
  | "가구/인테리어"
  | "의류"
  | "도서"
  | "스포츠/레저"
  | "뷰티/미용"
  | "생활/주방"
  | "기타";

export interface Profile {
  id: string;
  nickname: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  price: number;
  category: Category | null;
  image_urls: string[] | null;
  status: ProductStatus;
  created_at: string;
  profiles?: Profile;
}

export interface Like {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}
