import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { blogPosts } from '@/data/blogPosts';

const Blog = () => {
  const posts = blogPosts.slice(0, 3);

  return (
    <section id="blog" className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            Insights & Resources
          </Badge>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Latest from the <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Blog</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Expert tips on web development, SEO and digital marketing for South African businesses.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {posts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="group">
              <Card className="h-full bg-card border-border hover:border-primary/50 transition-all duration-300 overflow-hidden hover:shadow-[var(--shadow-glow)]">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-b border-border">
                  <span className="font-heading text-5xl font-bold text-primary/40">
                    {post.category.charAt(0)}
                  </span>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-primary text-sm font-medium">
                    Read article
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link to="/blog">
            <Button variant="outline" size="lg">
              View All Articles
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Blog;
