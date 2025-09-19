import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ChatInterface from "@/components/ChatInterface";
import ScreeningForm from "@/components/ScreeningForm";
import ResourceHub from "@/components/ResourceHub";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <ChatInterface />
        <ScreeningForm />
        <ResourceHub />
      </main>
      
      {/* Footer */}
      <footer className="bg-therapeutic/10 border-t border-border/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-gradient-hero rounded-md"></div>
              <h3 className="text-lg font-bold text-foreground">MindBridge</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Supporting student mental health with confidential, accessible, and culturally-sensitive care.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Crisis Resources</a>
              <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
            </div>
            <div className="mt-6 pt-6 border-t border-border/30">
              <p className="text-xs text-muted-foreground">
                If you're having thoughts of suicide or self-harm, please contact emergency services or call the National Suicide Prevention Lifeline: 988
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
