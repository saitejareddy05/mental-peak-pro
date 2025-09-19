import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Video, 
  Headphones, 
  Download, 
  Heart, 
  Brain, 
  Moon, 
  Users, 
  GraduationCap,
  Search,
  Clock,
  Star,
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'audio' | 'article' | 'guide';
  category: string;
  duration?: string;
  rating: number;
  language: string;
  tags: string[];
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'Managing Exam Anxiety: A Student\'s Guide',
    description: 'Practical techniques to reduce anxiety during exam periods and improve academic performance.',
    type: 'guide',
    category: 'Academic Stress',
    duration: '15 min read',
    rating: 4.8,
    language: 'English',
    tags: ['anxiety', 'exams', 'study-tips']
  },
  {
    id: '2',
    title: 'Progressive Muscle Relaxation for Sleep',
    description: 'A guided audio session to help you relax and improve sleep quality.',
    type: 'audio',
    category: 'Sleep & Relaxation',
    duration: '20 min',
    rating: 4.9,
    language: 'English',
    tags: ['sleep', 'relaxation', 'meditation']
  },
  {
    id: '3',
    title: 'Understanding Depression in College Students',
    description: 'Educational video explaining depression symptoms and available support resources.',
    type: 'video',
    category: 'Mental Health Education',
    duration: '12 min',
    rating: 4.7,
    language: 'English',
    tags: ['depression', 'education', 'support']
  },
  {
    id: '4',
    title: 'Building Healthy Relationships on Campus',
    description: 'Tips for forming meaningful connections and maintaining healthy relationships in college.',
    type: 'article',
    category: 'Social Connections',
    duration: '8 min read',
    rating: 4.6,
    language: 'English',
    tags: ['relationships', 'social-skills', 'friendship']
  },
  {
    id: '5',
    title: 'Mindful Breathing Techniques',
    description: 'Learn various breathing exercises to manage stress and anxiety in daily life.',
    type: 'video',
    category: 'Stress Management',
    duration: '10 min',
    rating: 4.9,
    language: 'Hindi',
    tags: ['breathing', 'mindfulness', 'stress-relief']
  },
  {
    id: '6',
    title: 'Time Management for Academic Success',
    description: 'Comprehensive guide to managing your time effectively as a student.',
    type: 'guide',
    category: 'Academic Stress',
    duration: '20 min read',
    rating: 4.5,
    language: 'English',
    tags: ['time-management', 'productivity', 'study-skills']
  }
];

const categories = [
  { id: 'all', name: 'All Resources', icon: BookOpen },
  { id: 'Academic Stress', name: 'Academic Stress', icon: GraduationCap },
  { id: 'Mental Health Education', name: 'Mental Health', icon: Brain },
  { id: 'Sleep & Relaxation', name: 'Sleep & Relaxation', icon: Moon },
  { id: 'Social Connections', name: 'Social Support', icon: Users },
  { id: 'Stress Management', name: 'Stress Management', icon: Heart }
];

const ResourceHub = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'all' || resource.language === selectedLanguage;
    
    return matchesSearch && matchesCategory && matchesLanguage;
  });

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'audio':
        return <Headphones className="w-5 h-5" />;
      case 'guide':
        return <BookOpen className="w-5 h-5" />;
      case 'article':
        return <BookOpen className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const getResourceColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'accent';
      case 'audio':
        return 'secondary';
      case 'guide':
        return 'primary';
      case 'article':
        return 'therapeutic';
      default:
        return 'primary';
    }
  };

  return (
    <section id="resources" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Mental Health Resource Hub
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access curated resources including videos, audio guides, and articles to support your mental health journey.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-soft bg-card/95 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search resources, topics, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-border/50 focus:border-primary"
                />
              </div>
              
              <div className="flex gap-3">
                <select 
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-3 py-2 border border-border/50 rounded-md bg-background text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="all">All Languages</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 bg-therapeutic/20">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <TabsTrigger 
                  key={category.id}
                  value={category.id}
                  className="flex items-center space-x-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Resource Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const resourceColor = getResourceColor(resource.type);
            return (
              <Card 
                key={resource.id} 
                className="bg-card/95 backdrop-blur-sm border-border/50 hover:shadow-therapeutic transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "mb-2",
                        resourceColor === 'accent' && "bg-accent/10 text-accent-foreground border-accent/30",
                        resourceColor === 'secondary' && "bg-secondary/10 text-secondary-foreground border-secondary/30",
                        resourceColor === 'primary' && "bg-primary/10 text-primary-foreground border-primary/30",
                        resourceColor === 'therapeutic' && "bg-therapeutic/10 text-therapeutic-foreground border-therapeutic/30"
                      )}
                    >
                      <div className="flex items-center space-x-1">
                        {getResourceIcon(resource.type)}
                        <span className="capitalize">{resource.type}</span>
                      </div>
                    </Badge>
                    
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Star className="w-3 h-3 fill-current text-yellow-500" />
                      <span>{resource.rating}</span>
                    </div>
                  </div>
                  
                  <CardTitle className="text-lg text-foreground leading-snug">
                    {resource.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {resource.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{resource.duration}</span>
                    </div>
                    <Badge variant="outline" className="text-xs bg-secondary-soft/20">
                      {resource.language}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.tags.slice(0, 3).map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-xs bg-muted/50 text-muted-foreground"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className={cn(
                        "flex-1",
                        resourceColor === 'accent' && "bg-accent hover:bg-accent/90 text-accent-foreground",
                        resourceColor === 'secondary' && "bg-secondary hover:bg-secondary/90 text-secondary-foreground",
                        resourceColor === 'primary' && "bg-primary hover:bg-primary/90 text-primary-foreground",
                        resourceColor === 'therapeutic' && "bg-therapeutic hover:bg-therapeutic/90 text-therapeutic-foreground"
                      )}
                    >
                      {resource.type === 'video' ? (
                        <>
                          <Play className="w-4 h-4 mr-1" />
                          Watch
                        </>
                      ) : resource.type === 'audio' ? (
                        <>
                          <Play className="w-4 h-4 mr-1" />
                          Listen
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-4 h-4 mr-1" />
                          Read
                        </>
                      )}
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No resources found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find relevant resources.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-support/10 border-primary/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <Heart className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                Need More Personalized Support?
              </h3>
              <p className="text-muted-foreground mb-6">
                Our resources are a great start, but sometimes you need one-on-one guidance. 
                Connect with our licensed counselors for personalized support.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <a href="#booking">Book Counseling Session</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="#chat">Chat with AI Support</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ResourceHub;