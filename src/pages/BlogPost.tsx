import { Link, useParams, Navigate } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getPostBySlug, blogPosts } from '@/data/blogPosts';
import { useSEO } from '@/hooks/useSEO';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  useSEO({
    title: post ? `${post.title} | Native Digital Media` : 'Article | Native Digital Media',
    description: post?.description,
    jsonLd: post
      ? {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.date,
          author: { '@type': 'Organization', name: post.author },
          publisher: {
            '@type': 'Organization',
            name: 'Native Digital Media',
          },
          mainEntityOfPage: typeof window !== 'undefined' ? window.location.href : '',
        }
      : undefined,
  });

  if (!post) return <Navigate to="/blog" replace />;

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);
  const formattedDate = new Date(post.date).toLocaleDateString('en-ZA', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <article className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" /> All articles
          </Link>

          <Badge variant="secondary" className="mb-4">{post.category}</Badge>
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-10 pb-10 border-b border-border">
            <span className="flex items-center gap-2"><User className="w-4 h-4" />{post.author}</span>
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{formattedDate}</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{post.readTime}</span>
          </div>

          <div
            className="prose prose-invert max-w-none
              prose-headings:font-heading prose-headings:text-foreground
              prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground
              prose-ul:text-muted-foreground prose-li:mb-2"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-16 p-8 rounded-lg bg-card border border-border text-center">
            <h3 className="font-heading text-2xl font-bold mb-3">Ready to grow your business online?</h3>
            <p className="text-muted-foreground mb-6">Get a free website & SEO audit from our team.</p>
            <Link to="/#contact">
              <Button size="lg">Get Your Free Audit</Button>
            </Link>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <h3 className="font-heading text-2xl font-bold mb-6">Related Articles</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {related.map((p) => (
                  <Link key={p.slug} to={`/blog/${p.slug}`} className="group p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
                    <Badge variant="secondary" className="mb-3 text-xs">{p.category}</Badge>
                    <h4 className="font-heading font-semibold group-hover:text-primary transition-colors">{p.title}</h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
      <Footer />
    </main>
  );
};

export default BlogPost;
