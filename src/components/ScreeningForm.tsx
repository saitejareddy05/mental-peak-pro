import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Heart, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  text: string;
  options: { value: number; label: string }[];
}

const phq9Questions: Question[] = [
  {
    id: "interest",
    text: "Little interest or pleasure in doing things",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "depressed",
    text: "Feeling down, depressed, or hopeless",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "sleep",
    text: "Trouble falling or staying asleep, or sleeping too much",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "energy",
    text: "Feeling tired or having little energy",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "appetite",
    text: "Poor appetite or overeating",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "selfworth",
    text: "Feeling bad about yourself or that you are a failure",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "concentration",
    text: "Trouble concentrating on things, such as reading or watching TV",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "movement",
    text: "Moving or speaking slowly, or being fidgety or restless",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "selfharm",
    text: "Thoughts that you would be better off dead or hurting yourself",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  }
];

const ScreeningForm = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();

  const progress = ((currentQuestion + 1) / phq9Questions.length) * 100;

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    const currentQuestionId = phq9Questions[currentQuestion].id;
    if (answers[currentQuestionId] === undefined) {
      toast({
        title: "Please select an answer",
        description: "Choose the option that best describes your experience.",
        variant: "destructive"
      });
      return;
    }

    if (currentQuestion < phq9Questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
    setScore(totalScore);
    setIsCompleted(true);
  };

  const getScoreInterpretation = (score: number) => {
    if (score >= 20) {
      return {
        level: "Severe",
        color: "crisis",
        icon: AlertTriangle,
        description: "Your responses suggest severe depression symptoms. Please seek professional help immediately.",
        recommendations: [
          "Schedule an urgent appointment with a mental health professional",
          "Contact our crisis support line",
          "Reach out to trusted friends or family",
          "Consider visiting your campus counseling center today"
        ]
      };
    } else if (score >= 15) {
      return {
        level: "Moderately Severe",
        color: "warning",
        icon: AlertTriangle,
        description: "Your responses indicate moderately severe depression symptoms.",
        recommendations: [
          "Schedule an appointment with a counselor",
          "Join our peer support groups",
          "Practice daily self-care routines",
          "Consider therapy or counseling services"
        ]
      };
    } else if (score >= 10) {
      return {
        level: "Moderate",
        color: "accent",
        icon: Info,
        description: "Your responses suggest moderate depression symptoms.",
        recommendations: [
          "Explore our self-help resources",
          "Consider speaking with a counselor",
          "Join peer support discussions",
          "Practice stress management techniques"
        ]
      };
    } else if (score >= 5) {
      return {
        level: "Mild",
        color: "secondary",
        icon: Info,
        description: "Your responses indicate mild depression symptoms.",
        recommendations: [
          "Use our self-help resources and tools",
          "Maintain regular exercise and sleep schedules",
          "Connect with peer support community",
          "Monitor your mood regularly"
        ]
      };
    } else {
      return {
        level: "Minimal",
        color: "safe",
        icon: CheckCircle,
        description: "Your responses suggest minimal depression symptoms.",
        recommendations: [
          "Continue maintaining good mental health habits",
          "Explore our wellness resources",
          "Stay connected with your support network",
          "Regular check-ins with our platform"
        ]
      };
    }
  };

  const resetScreening = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
    setScore(0);
  };

  if (isCompleted) {
    const interpretation = getScoreInterpretation(score);
    const IconComponent = interpretation.icon;

    return (
      <section id="screening" className="py-20 bg-therapeutic/10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-therapeutic bg-card/95 backdrop-blur-sm">
            <CardHeader className="text-center bg-gradient-support/10 border-b border-border/50">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Heart className="w-5 h-5 text-primary" />
                <span>Assessment Results</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-${interpretation.color}/20`}>
                  <IconComponent className={`w-8 h-8 text-${interpretation.color}`} />
                </div>
                
                <Badge 
                  variant="outline" 
                  className={`mb-4 text-${interpretation.color}-foreground bg-${interpretation.color}/10 border-${interpretation.color}/30`}
                >
                  {interpretation.level} Depression Symptoms
                </Badge>
                
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  PHQ-9 Score: {score}/27
                </h3>
                
                <p className="text-muted-foreground mb-6">
                  {interpretation.description}
                </p>
              </div>

              <div className="text-left mb-8">
                <h4 className="font-semibold text-foreground mb-3">Recommended Next Steps:</h4>
                <ul className="space-y-2">
                  {interpretation.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-safe mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {score >= 15 && (
                  <Button className="bg-crisis hover:bg-crisis/90 text-crisis-foreground">
                    Get Professional Help
                  </Button>
                )}
                
                <Button variant="outline" asChild>
                  <a href="#resources">View Resources</a>
                </Button>
                
                <Button variant="ghost" onClick={resetScreening}>
                  Retake Assessment
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-6">
                This screening is not a diagnosis. Please consult with a healthcare professional for proper evaluation.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const currentQ = phq9Questions[currentQuestion];

  return (
    <section id="screening" className="py-20 bg-therapeutic/10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Mental Health Assessment
          </h2>
          <p className="text-muted-foreground">
            This PHQ-9 screening helps evaluate depression symptoms. Your responses are confidential.
          </p>
        </div>

        <Card className="shadow-therapeutic bg-card/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-support/10 border-b border-border/50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-primary" />
                <span>Question {currentQuestion + 1} of {phq9Questions.length}</span>
              </CardTitle>
              <Badge variant="outline" className="bg-safe/20 text-safe-foreground border-safe">
                Confidential
              </Badge>
            </div>
            <Progress value={progress} className="w-full mt-4" />
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="mb-8">
              <h3 className="text-lg font-medium text-foreground mb-6">
                Over the last 2 weeks, how often have you been bothered by:
              </h3>
              
              <p className="text-xl text-foreground mb-8 leading-relaxed">
                {currentQ.text}
              </p>

              <RadioGroup
                value={answers[currentQ.id]?.toString()}
                onValueChange={(value) => handleAnswer(currentQ.id, parseInt(value))}
                className="space-y-4"
              >
                {currentQ.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapeutic/20 transition-colors">
                    <RadioGroupItem 
                      value={option.value.toString()} 
                      id={`${currentQ.id}-${option.value}`}
                      className="border-primary text-primary"
                    />
                    <Label 
                      htmlFor={`${currentQ.id}-${option.value}`}
                      className="flex-1 cursor-pointer text-sm text-foreground"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {currentQuestion === phq9Questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ScreeningForm;