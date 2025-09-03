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

const initialBlogs = [
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
  const [blogs, setBlogs] = useState(initialBlogs);
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

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = blogs.filter(blog =>
      blog.title.toLowerCase().includes(term.toLowerCase()) ||
      blog.description.toLowerCase().includes(term.toLowerCase()) ||
      blog.author.toLowerCase().includes(term.toLowerCase()) ||
      (blog.monastery && blog.monastery.toLowerCase().includes(term.toLowerCase()))
    );
    setFilteredBlogs(filtered);
  };

  const handleCategoryFilter = (category) => {
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

    const blog = {
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

  const handleReadBlog = (blog) => {
    toast({
      title: "Opening Blog",
      description: `Reading "${blog.title}"`,
    });
  };

  const getCategoryColor = (category) => {
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
            Explore personal stories, insights, and reflections from fellow travelers and monks 
            on their experiences in Sikkim's sacred monasteries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => document.getElementById('blogs-grid')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Read Latest Blogs
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Write a Blog
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Create New Blog Post</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="title" className="text-right">
                      Title
                    </label>
                    <Input 
                      id="title" 
                      value={newBlog.title}
                      onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="author" className="text-right">
                      Author
                    </label>
                    <Input 
                      id="author" 
                      value={newBlog.author}
                      onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="monastery" className="text-right">
                      Monastery
                    </label>
                    <Input 
                      id="monastery" 
                      value={newBlog.monastery}
                      onChange={(e) => setNewBlog({ ...newBlog, monastery: e.target.value })}
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="category" className="text-right">
                      Category
                    </label>
                    <select 
                      id="category" 
                      value={newBlog.category}
                      onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                      className="col-span-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="Culture">Culture</option>
                      <option value="Meditation">Meditation</option>
                      <option value="Festivals">Festivals</option>
                      <option value="History">History</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="description" className="text-right">
                      Description
                    </label>
                    <Textarea 
                      id="description" 
                      value={newBlog.description}
                      onChange={(e) => setNewBlog({ ...newBlog, description: e.target.value })}
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="content" className="text-right">
                      Content
                    </label>
                    <Textarea 
                      id="content" 
                      value={newBlog.content}
                      onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                      className="col-span-3 min-h-[150px]" 
                    />
                  </div>
                </div>
                <Button onClick={handleCreateBlog}>Create Blog</Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Floating Animation Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-primary rounded-full animate-float opacity-60" />
        <div className="absolute top-32 right-16 w-6 h-6 bg-primary-glow rounded-full animate-float opacity-40" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-accent rounded-full animate-float opacity-50" style={{ animationDelay: "2s" }} />
      </section>

      {/* Search and Filters */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search Bar */}
            <div ref={searchRef} className="md:col-span-2">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-12"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Category Filters */}
            <div ref={statsRef} className="flex items-center justify-start md:justify-end space-x-3">
              <Button 
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => handleCategoryFilter("all")}
              >
                All Categories
              </Button>
              <Button 
                variant={selectedCategory === "Culture" ? "default" : "outline"}
                onClick={() => handleCategoryFilter("Culture")}
              >
                Culture
              </Button>
              <Button 
                variant={selectedCategory === "Meditation" ? "default" : "outline"}
                onClick={() => handleCategoryFilter("Meditation")}
              >
                Meditation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Blogs Grid */}
      <section id="blogs-grid" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div ref={titleRef} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore Our Blogs
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Dive into the heart of Sikkim's spiritual heritage through personal stories, 
              expert insights, and community reflections.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog, index) => (
              <Card key={blog.id} ref={setBlogRef(index)} className="group hover:shadow-heritage transition-all duration-300 bg-muted/30">
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{blog.description}</p>
                  <div className="flex items-center space-x-2 mb-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{blog.author}</span>
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{blog.date}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="text-xs" variant="secondary">
                      <Eye className="w-3 h-3 mr-1" />
                      {blog.views} Views
                    </Badge>
                    <Badge className="text-xs" variant="secondary">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      {blog.comments} Comments
                    </Badge>
                    {blog.category && (
                      <Badge className={`text-xs ${getCategoryColor(blog.category)}`}>
                        {blog.category}
                      </Badge>
                    )}
                  </div>
                  <Button className="w-full" onClick={() => handleReadBlog(blog)}>
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
