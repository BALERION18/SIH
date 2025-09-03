import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Calendar, User, Eye, MessageCircle, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NotificationPanel } from "./NotificationPanel";
import { useScrollAnimation, useStaggeredScrollAnimation } from "@/hooks/useScrollAnimation";
import archivesHero from "@/assets/digital-archives-hero-large.jpg";

// Preload critical hero image
const preloadBlogsHeroImage = () => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = archivesHero;
  document.head.appendChild(link);
};

// Call preload immediately
preloadBlogsHeroImage();

interface BlogPost {
  id: number;
  title: string;
  description: string;
  content: string;
  author: string;
  date: string;
  monastery?: string;
  category: string;
  readTime: number;
  views: number;
  comments: number;
}

const initialBlogs: BlogPost[] = [
  {
    id: 1,
    title: "Morning Meditation at Rumtek Monastery",
    description: "Experience the serene morning meditation practices at one of Sikkim's most sacred monasteries.",
    content: "The morning mist rises from the valleys as monks gather for their daily meditation...",
    author: "Lama Tenzin",
    date: "2024-01-15",
    monastery: "Rumtek",
    category: "Meditation",
    readTime: 5,
    views: 234,
    comments: 12,
  },
  {
    id: 2,
    title: "Traditional Butter Tea Recipe",
    description: "Learn how to prepare the traditional Tibetan butter tea that warms both body and soul.",
    content: "Butter tea, or po cha, is more than just a beverage in Tibetan culture...",
    author: "Ani Dolma",
    date: "2024-01-12",
    monastery: "Pemayangtse",
    category: "Culture",
    readTime: 3,
    views: 189,
    comments: 8,
  },
  {
    id: 3,
    title: "Festival of Lights at Enchey",
    description: "Witness the magnificent celebration of Diwali at Enchey Monastery with traditional dances and prayers.",
    content: "The monastery comes alive with the glow of thousand butter lamps...",
    author: "Monk Lobsang",
    date: "2024-01-10",
    monastery: "Enchey",
    category: "Festivals",
    readTime: 7,
    views: 456,
    comments: 23,
  },
];

export const Blogs = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredBlogs, setFilteredBlogs] = useState(initialBlogs);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: "",
    description: "",
    content: "",
    author: "",
    monastery: "",
    category: "Culture",
  });
  const { toast } = useToast();
  
  const heroRef = useScrollAnimation('scale');
  const titleRef = useScrollAnimation('right', 0.1);
  const searchRef = useScrollAnimation('left', 0.1);
  const statsRef = useScrollAnimation('up', 0.2);
  const setBlogRef = useStaggeredScrollAnimation(6, 'stagger', 100);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = blogs.filter(blog =>
      blog.title.toLowerCase().includes(term.toLowerCase()) ||
      blog.description.toLowerCase().includes(term.toLowerCase()) ||
      blog.author.toLowerCase().includes(term.toLowerCase()) ||
      (blog.monastery && blog.monastery.toLowerCase().includes(term.toLowerCase()))
    );
    setFilteredBlogs(filtered);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    const filtered = category === "all" 
      ? blogs 
      : blogs.filter(blog => blog.category === category);
    setFilteredBlogs(filtered);
  };

  const handleCreateBlog = () => {
    if (!newBlog.title || !newBlog.description || !newBlog.content || !newBlog.author) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const blog: BlogPost = {
      ...newBlog,
      id: blogs.length + 1,
      date: new Date().toISOString().split('T')[0],
      readTime: Math.ceil(newBlog.content.length / 200),
      views: 0,
      comments: 0,
    };

    const updatedBlogs = [blog, ...blogs];
    setBlogs(updatedBlogs);
    setFilteredBlogs(updatedBlogs);
    setNewBlog({
      title: "",
      description: "",
      content: "",
      author: "",
      monastery: "",
      category: "Culture",
    });
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Blog Published",
      description: "Your blog post has been published successfully!",
    });
  };

  const handleReadBlog = (blog: BlogPost) => {
    toast({
      title: "Opening Blog",
      description: `Reading "${blog.title}"`,
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Meditation": return "bg-primary/10 text-primary";
      case "Culture": return "bg-secondary/10 text-secondary-foreground";
      case "Festivals": return "bg-accent/10 text-accent-foreground";
      case "History": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen">
      <NotificationPanel />
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${archivesHero})`,
            top: '-120px',
            height: 'calc(100% + 120px)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" style={{ top: '-120px', height: 'calc(100% + 120px)' }} />
        
        <div ref={heroRef} className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Sacred <span className="text-primary">Blogs</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Share Your Spiritual Journey and Monastery Experiences
          </p>
          <p className="text-lg mb-12 text-gray-300 max-w-2xl mx-auto">
            Connect with fellow spiritual seekers by sharing stories, experiences, and wisdom 
            from Sikkim's sacred monasteries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Write a Blog
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Write a New Blog Post</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title *</label>
                    <Input
                      placeholder="Enter blog title..."
                      value={newBlog.title}
                      onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description *</label>
                    <Textarea
                      placeholder="Brief description of your blog..."
                      value={newBlog.description}
                      onChange={(e) => setNewBlog({ ...newBlog, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Content *</label>
                    <Textarea
                      placeholder="Write your blog content here..."
                      value={newBlog.content}
                      onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                      rows={8}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Author *</label>
                      <Input
                        placeholder="Your name..."
                        value={newBlog.author}
                        onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Monastery (Optional)</label>
                      <Input
                        placeholder="Associated monastery..."
                        value={newBlog.monastery}
                        onChange={(e) => setNewBlog({ ...newBlog, monastery: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <select
                      value={newBlog.category}
                      onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      <option value="Culture">Culture</option>
                      <option value="Meditation">Meditation</option>
                      <option value="Festivals">Festivals</option>
                      <option value="History">History</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateBlog}>
                      Publish Blog
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => document.getElementById('blogs-content')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Read Blogs
            </Button>
          </div>
        </div>

        {/* Floating Animation Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-primary rounded-full animate-float opacity-60" />
        <div className="absolute top-32 right-16 w-6 h-6 bg-primary-glow rounded-full animate-float opacity-40" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-accent rounded-full animate-float opacity-50" style={{ animationDelay: "2s" }} />
      </section>


      {/* Blogs Content */}
      <section id="blogs-content" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div ref={titleRef} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Latest Blog Posts
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover stories and insights from our monastery community.
            </p>
          </div>

          {/* Search and Filter */}
          <div ref={searchRef} className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search blogs by title, author, or monastery..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => handleCategoryFilter("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={selectedCategory === "Culture" ? "default" : "outline"}
                onClick={() => handleCategoryFilter("Culture")}
                size="sm"
              >
                Culture
              </Button>
              <Button
                variant={selectedCategory === "Meditation" ? "default" : "outline"}
                onClick={() => handleCategoryFilter("Meditation")}
                size="sm"
              >
                Meditation
              </Button>
              <Button
                variant={selectedCategory === "Festivals" ? "default" : "outline"}
                onClick={() => handleCategoryFilter("Festivals")}
                size="sm"
              >
                Festivals
              </Button>
            </div>
          </div>

          {/* Blog Statistics */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-muted/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{blogs.length}</div>
                <div className="text-sm text-muted-foreground">Total Blogs</div>
              </CardContent>
            </Card>
            <Card className="bg-accent/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {blogs.reduce((sum, blog) => sum + blog.views, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Views</div>
              </CardContent>
            </Card>
            <Card className="bg-secondary/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {new Set(blogs.map(blog => blog.author)).size}
                </div>
                <div className="text-sm text-muted-foreground">Authors</div>
              </CardContent>
            </Card>
            <Card className="bg-primary/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {blogs.reduce((sum, blog) => sum + blog.comments, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Comments</div>
              </CardContent>
            </Card>
          </div>

          {/* Blog Posts */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog, index) => (
              <Card key={blog.id} ref={setBlogRef(index)} className="group hover:shadow-heritage transition-all duration-300 bg-muted/30">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={getCategoryColor(blog.category)}>
                      {blog.category}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      {blog.readTime} min read
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {blog.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {blog.description}
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{blog.author}</span>
                    </div>
                    {blog.monastery && (
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        <span>{blog.monastery} Monastery</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{new Date(blog.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{blog.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{blog.comments}</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleReadBlog(blog)}
                    >
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBlogs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blogs found matching your search criteria.</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setFilteredBlogs(blogs);
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};