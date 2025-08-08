export interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  images?: { url: string; publicId: string }[];
  author: string;
  tags: string[];
  category: string;
  isPublished: boolean;
  isFeatured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}
