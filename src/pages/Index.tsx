import { Navigation } from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ChatInterface from "@/components/ChatInterface";
import ScreeningForm from "@/components/ScreeningForm";
import ResourceHub from "@/components/ResourceHub";
import { FacialRecognition } from "@/components/FacialRecognition";
import { VoiceAnalysis } from "@/components/VoiceAnalysis";

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'counselor' | 'admin' | 'volunteer';
}

interface IndexProps {
  user: User;
  onLogout: () => void;
}

const Index = ({ user, onLogout }: IndexProps) => {
  return (
    <main className="min-h-screen bg-background">
      <Navigation user={user} onLogout={onLogout} />
      <HeroSection />
      
      <section id="chat" className="py-16 px-4">
        <div className="container mx-auto">
          <ChatInterface />
        </div>
      </section>

      <section id="screening" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <ScreeningForm />
        </div>
      </section>

      <section id="advanced" className="py-16 px-4">
        <div className="container mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Advanced Analysis</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience cutting-edge AI technology for comprehensive mental health assessment
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <FacialRecognition />
            <VoiceAnalysis />
          </div>
        </div>
      </section>

      <section id="resources" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <ResourceHub />
        </div>
      </section>

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
    </main>
  );
};

export default Index;