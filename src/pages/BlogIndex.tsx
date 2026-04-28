import { Link } from 'react-router-dom';
import { Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { blogPosts } from '@/data/blogPosts';
import { useSEO } from '@/hooks/useSEO';

const BlogIndex = () => {
  useSEO({
    title: 'Blog | Web Development & SEO Tips | Native Digital Media',
    description:
      'Expert insights on web development, SEO and digital marketing for South African businesses. Read the latest from Native Digital Media.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Native Digital Media Blog',
      url: typeof window !== 'undefined' ? window.location.href : '',
      blogPost: blogPosts.map((p) => ({
        '@type': 'BlogPosting',
        headline: p.title,
        datePublished: p.date,
        author: { '@type': 'Organization', name: p.author },
      })),
    },
  });

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Blog</Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Insights & <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Resources</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Expert tips on web development, SEO and digital marketing for South African businesses.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="group">
                <Card className="h-full bg-card border-border hover:border-primary/50 transition-all duration-300 overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-b border-border">
                    <span className="font-heading text-5xl font-bold text-primary/40">{post.category.charAt(0)}</span>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                    </div>
                    <h2 className="font-heading text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-2 text-primary text-sm font-medium">
                      Read article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default BlogIndex;
