import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Bot, User, Heart, AlertTriangle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'normal' | 'suggestion' | 'warning' | 'support';
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your mental health support assistant. I'm here to listen and provide guidance in a safe, confidential space. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'support'
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Crisis detection keywords
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'want to die', 'harm myself'];
    const isCrisis = crisisKeywords.some(keyword => lowerMessage.includes(keyword));
    
    if (isCrisis) {
      return {
        id: Date.now().toString(),
        content: "I'm very concerned about what you've shared. Your life has value and there are people who want to help. Please reach out to a crisis counselor immediately. Would you like me to connect you with emergency support right now?",
        sender: 'bot',
        timestamp: new Date(),
        type: 'warning'
      };
    }

    // Anxiety responses
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried')) {
      return {
        id: Date.now().toString(),
        content: "I understand you're feeling anxious. That's a very common experience for students. Let's try a quick breathing exercise: Breathe in for 4 counts, hold for 4, then out for 6. Would you like me to guide you through some coping strategies?",
        sender: 'bot',
        timestamp: new Date(),
        type: 'suggestion'
      };
    }

    // Depression responses
    if (lowerMessage.includes('depressed') || lowerMessage.includes('sad') || lowerMessage.includes('hopeless')) {
      return {
        id: Date.now().toString(),
        content: "I hear that you're going through a difficult time. These feelings are valid, and it's brave of you to reach out. Remember that depression is treatable, and you don't have to face this alone. Would you be interested in taking a brief screening to better understand your needs?",
        sender: 'bot',
        timestamp: new Date(),
        type: 'support'
      };
    }

    // Stress responses
    if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed') || lowerMessage.includes('pressure')) {
      return {
        id: Date.now().toString(),
        content: "Academic stress is really challenging. You're managing a lot right now. Let's break this down - what specific area is causing you the most stress? I can suggest some practical strategies for managing workload and pressure.",
        sender: 'bot',
        timestamp: new Date(),
        type: 'suggestion'
      };
    }

    // Default supportive response
    return {
      id: Date.now().toString(),
      content: "Thank you for sharing that with me. I'm here to listen and support you. Can you tell me more about what's been on your mind lately? Sometimes talking through our thoughts can help us understand them better.",
      sender: 'bot',
      timestamp: new Date(),
      type: 'normal'
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'suggestion':
        return <Lightbulb className="w-4 h-4 text-accent" />;
      case 'support':
        return <Heart className="w-4 h-4 text-safe" />;
      default:
        return <Bot className="w-4 h-4 text-primary" />;
    }
  };

  const quickResponses = [
    "I'm feeling anxious about exams",
    "I've been really stressed lately",
    "I'm having trouble sleeping",
    "I feel overwhelmed with everything"
  ];

  return (
    <section id="chat" className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            AI Mental Health Support
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Start a confidential conversation with our AI assistant trained in mental health support and crisis intervention.
          </p>
        </div>

        <Card className="shadow-therapeutic bg-card/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-support/10 border-b border-border/50">
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <span>Confidential Support Chat</span>
              <Badge variant="outline" className="ml-auto text-xs bg-safe/20 text-safe-foreground border-safe">
                Private & Secure
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex space-x-3",
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.sender === 'bot' && (
                    <div className="w-8 h-8 bg-gradient-support rounded-full flex items-center justify-center flex-shrink-0">
                      {getMessageIcon(message.type)}
                    </div>
                  )}
                  
                  <div className={cn(
                    "max-w-xs lg:max-w-md px-4 py-3 rounded-lg",
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : message.type === 'warning'
                      ? 'bg-warning/10 text-warning-foreground border border-warning/30'
                      : message.type === 'suggestion'
                      ? 'bg-accent-soft/30 text-accent-foreground border border-accent/30'
                      : message.type === 'support'
                      ? 'bg-safe/10 text-safe-foreground border border-safe/30'
                      : 'bg-therapeutic text-therapeutic-foreground'
                  )}>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {message.sender === 'user' && (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex space-x-3 justify-start">
                  <div className="w-8 h-8 bg-gradient-support rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary animate-pulse" />
                  </div>
                  <div className="bg-therapeutic text-therapeutic-foreground max-w-xs px-4 py-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Responses */}
            <div className="px-6 py-3 border-t border-border/50 bg-therapeutic/20">
              <p className="text-xs text-muted-foreground mb-3">Quick responses:</p>
              <div className="flex flex-wrap gap-2">
                {quickResponses.map((response, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs bg-card hover:bg-primary-soft/20 border-border/50"
                    onClick={() => setInputValue(response)}
                  >
                    {response}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-6 border-t border-border/50">
              <div className="flex space-x-2">
                <Input
                  placeholder="Share what's on your mind..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 border-border/50 focus:border-primary"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Your conversations are private and not stored permanently.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ChatInterface;