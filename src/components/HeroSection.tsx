import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Heart, Shield, Users, ArrowRight, Clock } from "lucide-react";

const HeroSection = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "24/7 AI Support",
      description: "Immediate guidance when you need it most"
    },
    {
      icon: Heart,
      title: "Mental Health Screening",
      description: "Professional assessments to understand your needs"
    },
    {
      icon: Shield,
      title: "Complete Privacy",
      description: "Anonymous, secure, and confidential support"
    },
    {
      icon: Users,
      title: "Peer Community",
      description: "Connect with others who understand your journey"
    }
  ];

  const handleGetStarted = () => {
    document.getElementById('chat')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen bg-gradient-calm flex items-center py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {/* Trust Badge */}
          <div className="inline-flex items-center space-x-2 bg-safe/20 text-safe-foreground px-4 py-2 rounded-full text-sm mb-8">
            <Shield className="w-4 h-4" />
            <span>Trusted by 50,000+ students nationwide</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Your Mental Health
            <span className="block bg-gradient-hero bg-clip-text text-transparent">
              Matters Here
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            A safe, confidential space for college students to access mental health support, 
            connect with counselors, and find the resources you need to thrive academically and personally.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg shadow-therapeutic hover:shadow-elevated transition-all duration-300"
              onClick={handleGetStarted}
            >
              Start Free Chat
              <MessageCircle className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary text-primary hover:bg-primary-soft/20 px-8 py-4 text-lg"
              asChild
            >
              <a href="#screening">
                Take Assessment
                <Heart className="w-5 h-5 ml-2" />
              </a>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground mb-16">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>Available 24/7</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4" />
              <span>100% Anonymous</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>Peer-Reviewed</span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-soft transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-support rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Emergency Notice */}
        <div className="mt-16 text-center">
          <Card className="bg-accent-soft/30 border-accent/30 max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-2 text-accent-foreground mb-2">
                <Heart className="w-5 h-5" />
                <span className="font-semibold">Crisis Support Available</span>
              </div>
              <p className="text-sm text-accent-foreground/80 mb-4">
                If you're experiencing thoughts of self-harm or suicide, please reach out immediately.
              </p>
              <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                Get Crisis Help Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;