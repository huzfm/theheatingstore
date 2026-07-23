
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);



  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch(`https://evulation-api-electrichamambackend.0psc8x.easypanel.host/api/blogs/${slug}`, { 
          cache: "no-store" 
        });
        
        if (res.status === 404) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setBlog(data);
      } catch (err) {
        console.error("Blog fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F0]">
        <div className="w-full h-[500px] bg-[#f0d5c0] animate-pulse" />
        <div className="mx-auto max-w-3xl px-6 py-16 space-y-5">
          <div className="h-4 w-28 bg-[#f0d5c0] rounded animate-pulse" />
          <div className="h-10 w-3/4 bg-[#f0d5c0] rounded-2xl animate-pulse" />
          <div className="h-4 w-full bg-[#f0d5c0] rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-[#f0d5c0] rounded animate-pulse" />
          <div className="h-px w-full bg-[#f0d5c0] mt-8" />
          <div className="h-4 w-full bg-[#f0d5c0] rounded animate-pulse" />
          <div className="h-4 w-full bg-[#f0d5c0] rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-[#f0d5c0] rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-serif text-[#3C2A25]">Article not found</p>
        <Link href="/blog" className="text-sm text-[#B86B45] hover:underline">
          ← Back to all articles
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0]">

      {blog.featuredImage && (
        <div className="w-full h-[500px] bg-[#FFF8F0]">
          <img
            src={blog.featuredImage}
            alt={blog.title}
            // className="w-full h-full object-cover object-center"
            className="w-full h-full object-cover object-top transition duration-700 hover:scale-105"
            style={{ objectPosition: "center 15%" }}
          />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-6 py-16">

        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[#B86B45] hover:underline mb-10 block">
          ← Back to all articles
        </Link>

        <div className="flex items-center gap-4 mb-4">
          {blog.category && (
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B86B45]">
              {blog.category}
            </span>
          )}
          <span className="text-xs text-[#B86B45]/50">
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              month: "long", day: "numeric", year: "numeric",
            })}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#3C2A25] leading-tight mb-6">
          {blog.title}
        </h1>

        {blog.shortDescription && (
          <p className="text-lg text-[#5A4036] leading-relaxed border-l-4 border-[#B86B45]/30 pl-5 mb-10">
            {blog.shortDescription}
          </p>
        )}

        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {blog.tags.map((tag) => (
              <span key={tag} className="text-xs bg-white text-[#B86B45] border border-[#f0d5c0] px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <hr className="border-[#f0d5c0] mb-10" />

        <div
          className="prose prose-lg max-w-none text-[#3C2A25]
            prose-headings:font-serif prose-headings:text-[#3C2A25]
            prose-a:text-[#B86B45] prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-2xl prose-img:shadow-md
          "
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </div>
  );
}



