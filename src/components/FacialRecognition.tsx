import React, { useRef, useEffect, useState } from 'react';
import { pipeline, env } from '@huggingface/transformers';
import { Camera, CameraOff, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

interface EmotionScore {
  emotion: string;
  score: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export const FacialRecognition = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emotions, setEmotions] = useState<EmotionScore[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsActive(true);
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
      console.error('Camera error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsActive(false);
    setEmotions([]);
  };

  const analyzeEmotion = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      setIsLoading(true);
      
      // Capture frame from video
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);

      // Convert to data URL
      const imageData = canvas.toDataURL('image/jpeg', 0.8);

      // Load emotion classification model
      const classifier = await pipeline(
        'image-classification',
        'onnx-community/emotion-ferplus-8',
        { device: 'webgpu' }
      );

      const results = await classifier(imageData);
      
      // Map results to risk levels
      const emotionScores: EmotionScore[] = results.slice(0, 5).map((result: any) => ({
        emotion: result.label,
        score: Math.round(result.score * 100),
        riskLevel: getRiskLevel(result.label, result.score)
      }));

      setEmotions(emotionScores);
    } catch (err) {
      setError('Failed to analyze emotions. Please try again.');
      console.error('Emotion analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskLevel = (emotion: string, score: number): 'low' | 'medium' | 'high' => {
    const highRiskEmotions = ['sadness', 'anger', 'fear', 'disgust'];
    const mediumRiskEmotions = ['surprise'];
    
    if (highRiskEmotions.includes(emotion.toLowerCase()) && score > 0.6) {
      return 'high';
    } else if (mediumRiskEmotions.includes(emotion.toLowerCase()) && score > 0.5) {
      return 'medium';
    }
    return 'low';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-yellow-500 text-yellow-50';
      default: return 'bg-green-500 text-green-50';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Facial Expression Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative bg-muted rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-64 object-cover"
            style={{ display: isActive ? 'block' : 'none' }}
          />
          <canvas
            ref={canvasRef}
            className="hidden"
          />
          {!isActive && (
            <div className="w-full h-64 flex items-center justify-center bg-muted">
              <CameraOff className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {!isActive ? (
            <Button onClick={startCamera} disabled={isLoading}>
              {isLoading ? 'Starting...' : 'Start Camera'}
            </Button>
          ) : (
            <>
              <Button onClick={analyzeEmotion} disabled={isLoading}>
                {isLoading ? 'Analyzing...' : 'Analyze Emotions'}
              </Button>
              <Button variant="outline" onClick={stopCamera}>
                Stop Camera
              </Button>
            </>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {emotions.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Emotion Analysis Results:</h3>
            <div className="grid gap-2">
              {emotions.map((emotion, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="font-medium capitalize">{emotion.emotion}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{emotion.score}%</span>
                    <Badge className={getRiskColor(emotion.riskLevel)}>
                      {emotion.riskLevel}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};