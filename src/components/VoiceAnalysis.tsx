import React, { useState, useRef } from 'react';
import { Mic, MicOff, Play, Square, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface VoiceMetrics {
  averagePitch: number;
  pitchVariance: number;
  speakingRate: number;
  pauseFrequency: number;
  energyLevel: number;
  stressIndicator: 'low' | 'medium' | 'high';
}

export const VoiceAnalysis = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [metrics, setMetrics] = useState<VoiceMetrics | null>(null);
  const [error, setError] = useState<string>('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        analyzeAudio(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      setError('Microphone access denied. Please allow microphone permissions.');
      console.error('Recording error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const analyzeAudio = async (audioBlob: Blob) => {
    setIsAnalyzing(true);
    
    try {
      // Create audio context for analysis
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      
      // Extract audio features
      const channelData = audioBuffer.getChannelData(0);
      const sampleRate = audioBuffer.sampleRate;
      const duration = audioBuffer.duration;

      // Calculate basic metrics
      const metrics = calculateVoiceMetrics(channelData, sampleRate, duration);
      setMetrics(metrics);
      
    } catch (err) {
      setError('Failed to analyze audio. Please try again.');
      console.error('Audio analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateVoiceMetrics = (data: Float32Array, sampleRate: number, duration: number): VoiceMetrics => {
    // Calculate energy levels
    const energy = data.reduce((sum, sample) => sum + Math.abs(sample), 0) / data.length;
    
    // Estimate pitch using autocorrelation (simplified)
    const pitchSamples = data.slice(0, Math.min(data.length, sampleRate * 2)); // First 2 seconds
    const avgPitch = estimatePitch(pitchSamples, sampleRate);
    
    // Calculate pause frequency (silence detection)
    const silenceThreshold = 0.01;
    let silentSamples = 0;
    let pauseCount = 0;
    let inPause = false;
    
    for (let i = 0; i < data.length; i++) {
      if (Math.abs(data[i]) < silenceThreshold) {
        silentSamples++;
        if (!inPause && silentSamples > sampleRate * 0.3) { // 300ms silence = pause
          pauseCount++;
          inPause = true;
        }
      } else {
        silentSamples = 0;
        inPause = false;
      }
    }

    const speakingRate = (data.length - silentSamples) / sampleRate / duration * 100; // % of time speaking
    const pauseFrequency = pauseCount / duration; // pauses per second

    // Simple stress indicator based on multiple factors
    let stressScore = 0;
    if (avgPitch > 200) stressScore += 1; // High pitch
    if (energy > 0.1) stressScore += 1; // High energy
    if (pauseFrequency > 0.5) stressScore += 1; // Frequent pauses
    if (speakingRate < 30) stressScore += 1; // Too slow or too fast speaking
    
    const stressIndicator: 'low' | 'medium' | 'high' = 
      stressScore >= 3 ? 'high' : stressScore >= 2 ? 'medium' : 'low';

    return {
      averagePitch: Math.round(avgPitch),
      pitchVariance: Math.round(calculateVariance(pitchSamples) * 100),
      speakingRate: Math.round(speakingRate),
      pauseFrequency: Math.round(pauseFrequency * 100) / 100,
      energyLevel: Math.round(energy * 1000),
      stressIndicator
    };
  };

  const estimatePitch = (data: Float32Array, sampleRate: number): number => {
    // Simplified pitch estimation using zero-crossing rate
    let crossings = 0;
    for (let i = 1; i < data.length; i++) {
      if ((data[i-1] >= 0) !== (data[i] >= 0)) {
        crossings++;
      }
    }
    return (crossings / 2) / (data.length / sampleRate);
  };

  const calculateVariance = (data: Float32Array): number => {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    return Math.sqrt(variance);
  };

  const getStressColor = (level: string) => {
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
          <Mic className="h-5 w-5" />
          Voice Stress Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            {!isRecording ? (
              <Button onClick={startRecording} size="lg" className="rounded-full h-16 w-16">
                <Mic className="h-6 w-6" />
              </Button>
            ) : (
              <Button onClick={stopRecording} size="lg" variant="destructive" className="rounded-full h-16 w-16">
                <Square className="h-6 w-6" />
              </Button>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground">
            {isRecording ? 'Recording... Click to stop' : 'Click to start recording (10-30 seconds recommended)'}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {audioUrl && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Recorded Audio:</label>
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/wav" />
            </audio>
          </div>
        )}

        {isAnalyzing && (
          <div className="space-y-2">
            <p className="text-sm">Analyzing voice patterns...</p>
            <Progress value={undefined} className="w-full" />
          </div>
        )}

        {metrics && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Analysis Results:</h3>
              <Badge className={getStressColor(metrics.stressIndicator)}>
                {metrics.stressIndicator.toUpperCase()} STRESS
              </Badge>
            </div>
            
            <div className="grid gap-3">
              <div className="flex justify-between items-center p-3 rounded-lg border">
                <span className="text-sm font-medium">Average Pitch</span>
                <span className="text-sm text-muted-foreground">{metrics.averagePitch} Hz</span>
              </div>
              
              <div className="flex justify-between items-center p-3 rounded-lg border">
                <span className="text-sm font-medium">Speaking Rate</span>
                <span className="text-sm text-muted-foreground">{metrics.speakingRate}%</span>
              </div>
              
              <div className="flex justify-between items-center p-3 rounded-lg border">
                <span className="text-sm font-medium">Pause Frequency</span>
                <span className="text-sm text-muted-foreground">{metrics.pauseFrequency}/sec</span>
              </div>
              
              <div className="flex justify-between items-center p-3 rounded-lg border">
                <span className="text-sm font-medium">Energy Level</span>
                <span className="text-sm text-muted-foreground">{metrics.energyLevel}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};