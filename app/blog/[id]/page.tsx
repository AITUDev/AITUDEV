"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BlogPost } from '@/types/blog';
import { FaUser, FaCalendar } from 'react-icons/fa6';
import Image from 'next/image';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

const BlogPostPage = () => {
  const params = useParams();
  const { id } = params;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/blog/${id}`);
          if (!res.ok) throw new Error('Failed to fetch post');
          const data = await res.json();
          setPost(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [id]);

  const handleNextImage = () => {
    if (post?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
    }
  };

  const handlePrevImage = () => {
    if (post?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8 text-center">جارٍ تحميل التدوينة...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-center text-red-500">خطأ: {error}</div>;
  if (!post) return <div className="container mx-auto px-4 py-8 text-center">لم يتم العثور على التدوينة.</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border dark:border-gray-700">
        {post.images && post.images.length > 0 && (
          <div className="w-full h-96 relative group">
            <Image
              src={post.images[currentImageIndex].url}
              alt={post.title}
              fill
              className="object-cover transition duration-300"
              priority
            />
            {post.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-700 text-gray-800 dark:text-white p-2 rounded-full shadow hover:bg-white"
                >
                  <IoChevronBack size={20} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-700 text-gray-800 dark:text-white p-2 rounded-full shadow hover:bg-white"
                >
                  <IoChevronForward size={20} />
                </button>
              </>
            )}
          </div>
        )}

        <div className="p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mb-6 gap-4">
            <div className="flex items-center gap-2">
              <FaUser />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendar />
              <span>{new Date(post.createdAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-full px-4 py-1 text-sm font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div
            className="prose prose-lg max-w-none dark:prose-invert text-gray-800 dark:text-gray-200"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.images && post.images.length > 1 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">معرض الصور</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {post.images.map((image, index) => (
                  <div key={index} className="relative w-full h-48 rounded-xl overflow-hidden">
                    <Image
                      src={image.url}
                      alt={`صورة ${index + 1}`}
                      fill
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;