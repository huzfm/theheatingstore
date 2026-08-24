"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Skeleton, SkeletonGroup } from "@/components/ui/loading/Skeleton";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch(
          `https://api.theheatingstore.in/api/blogs/${slug}`,
          {
            headers: { "x-api-key": process.env.NEXT_PUBLIC_BLOG_API_KEY || "" },
            cache: "no-store",
          }
        );

        if (res.status === 404) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setBlog(data);

        document.title = data.seoTitle || data.title;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute("content", data.seoDescription || data.shortDescription || data.excerpt || "");
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage && (data.metaImage || data.seoImage || data.featuredImage)) {
          ogImage.setAttribute("content", data.metaImage || data.seoImage || data.featuredImage);
        }
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
        <SkeletonGroup label="Loading article">
          <Skeleton className="w-full h-[400px]" />
          <div className="mx-auto max-w-3xl px-6 py-12 space-y-4">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="h-px w-full bg-[#f0d5c0] my-8" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </SkeletonGroup>
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

  const publishDate = blog.publishedAt || blog.updatedAt;

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Hero image */}
      {(blog.featuredImage || blog.coverImage) && (
        <div className="w-full h-[350px] sm:h-[450px] overflow-hidden">
          <Image
            src={blog.featuredImage || blog.coverImage}
            alt={blog.title}
            width={1200}
            height={500}
            className="w-full h-full object-cover object-top"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-[#B86B45] hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all articles
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {blog.category && (
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#B86B45]">
              {blog.category}
            </span>
          )}
          {publishDate && (
            <span className="text-[11px] text-[#8A7A6D]">
              {new Date(publishDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
          {blog.readingTime && (
            <span className="text-[11px] text-[#8A7A6D]">
              · {blog.readingTime} min read
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#3C2A25] leading-tight mb-6">
          {blog.title}
        </h1>

        {/* Excerpt */}
        {(blog.shortDescription || blog.excerpt) && (
          <p className="text-lg text-[#5A4036] leading-relaxed border-l-4 border-[#B86B45]/30 pl-5 mb-8">
            {blog.shortDescription || blog.excerpt}
          </p>
        )}

        {/* Tags + Author */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-white text-[#B86B45] border border-[#f0d5c0] px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          {blog.author && (
            <span className="text-sm text-[#5A4036]">
              By <span className="font-medium text-[#3C2A25]">{blog.author}</span>
            </span>
          )}
        </div>

        <hr className="border-[#f0d5c0] mb-10" />

        {/* Article body */}
        <div
          className="prose prose-lg max-w-none text-[#3C2A25]
            prose-headings:font-serif prose-headings:text-[#3C2A25]
            prose-a:text-[#B86B45] prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-md
          "
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Bottom link */}
        <div className="mt-16 pt-8 border-t border-[#f0d5c0]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#B86B45] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse all articles
          </Link>
        </div>
      </div>
    </div>
  );
}
