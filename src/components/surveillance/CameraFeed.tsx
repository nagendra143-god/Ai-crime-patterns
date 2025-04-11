
import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, StopCircle, Video, AlertCircle, Smile } from "lucide-react";
import * as cocossd from '@tensorflow-models/coco-ssd';
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

export function CameraFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [detections, setDetections] = useState<Array<{
    class: string;
    score: number;
    bbox: [number, number, number, number];
    expression?: string;
    bodyLanguage?: string;
  }>>([]);
  const [model, setModel] = useState<cocossd.ObjectDetection | null>(null);
  const animationRef = useRef<number | null>(null);
  const [suspiciousActivity, setSuspiciousActivity] = useState(false);

  // Initialize the object detection model
  useEffect(() => {
    const loadModel = async () => {
      try {
        // Load the COCO-SSD model for object detection
        const loadedModel = await cocossd.load();
        setModel(loadedModel);
        console.log("COCO-SSD Model loaded successfully");
      } catch (error) {
        console.error("Failed to load model:", error);
      }
    };
    
    loadModel();
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const startCamera = async () => {
    if (!videoRef.current) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      videoRef.current.srcObject = stream;
      setIsRecording(true);
      
      // Start detection once video is ready
      videoRef.current.onloadeddata = () => {
        detectFrame();
        toast({
          title: "Camera surveillance started",
          description: "Monitoring for suspicious activity...",
        });
      };
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;
    
    const stream = videoRef.current.srcObject as MediaStream;
    const tracks = stream.getTracks();
    
    tracks.forEach(track => track.stop());
    videoRef.current.srcObject = null;
    
    setIsRecording(false);
    setSuspiciousActivity(false);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    toast({
      title: "Camera surveillance stopped",
    });
  };

  const detectFrame = async () => {
    if (!model || !videoRef.current || !canvasRef.current || videoRef.current.paused || videoRef.current.ended) {
      return;
    }
    
    // Perform detection
    const predictions = await model.detect(videoRef.current);
    
    // Filter for people only
    const peopleDetections = predictions
      .filter(prediction => prediction.class === 'person')
      .map(detection => {
        // Add face expression and body language analysis
        const enhancedDetection = {
          ...detection,
          expression: analyzeFacialExpression(detection),
          bodyLanguage: analyzeBodyLanguage(detection),
        };

        return enhancedDetection;
      });
    
    // Check for suspicious activity
    const hasSuspiciousActivity = peopleDetections.some(
      detection => 
        detection.expression === 'Angry' || 
        detection.expression === 'Suspicious' ||
        detection.bodyLanguage === 'Aggressive' || 
        detection.bodyLanguage === 'Anxious'
    );
    
    if (hasSuspiciousActivity && !suspiciousActivity) {
      setSuspiciousActivity(true);
      toast({
        title: "⚠️ Suspicious Activity Detected",
        description: "Unusual behavior or expression detected in camera feed.",
        variant: "destructive",
        duration: 5000,
      });
    } else if (!hasSuspiciousActivity && suspiciousActivity) {
      setSuspiciousActivity(false);
    }
    
    // Update state with new detections
    setDetections(peopleDetections);
    
    // Draw the detections
    drawDetections(peopleDetections);
    
    // Continue detection
    animationRef.current = requestAnimationFrame(detectFrame);
  };

  const drawDetections = (detections: Array<cocossd.DetectedObject & { expression?: string, bodyLanguage?: string }>) => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Set canvas dimensions to match video
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    
    // Draw each detection
    detections.forEach(detection => {
      const [x, y, width, height] = detection.bbox;
      
      // Draw bounding box - change color based on suspiciousness
      const isSuspicious = 
        detection.expression === 'Angry' || 
        detection.expression === 'Suspicious' ||
        detection.bodyLanguage === 'Aggressive' || 
        detection.bodyLanguage === 'Anxious';
      
      ctx.strokeStyle = isSuspicious ? '#FF0000' : '#00FF00';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      
      // Draw person label
      ctx.fillStyle = isSuspicious ? '#FF0000' : '#00FF00';
      ctx.font = '18px Arial';
      ctx.fillText(
        `Person: ${Math.round(detection.score * 100)}%`,
        x, y > 20 ? y - 5 : y + 20
      );

      // Draw facial expression
      if (detection.expression) {
        ctx.fillStyle = '#FFFF00';
        ctx.fillText(
          `Expression: ${detection.expression}`,
          x, y + height + 20
        );
      }

      // Draw body language
      if (detection.bodyLanguage) {
        ctx.fillStyle = '#00FFFF';
        ctx.fillText(
          `Body Language: ${detection.bodyLanguage}`,
          x, y + height + 45
        );
      }
    });
  };

  const analyzeFacialExpression = (detection: cocossd.DetectedObject): string => {
    // In a real implementation, this would use a dedicated facial expression model
    // Here we'll simulate results based on some heuristics from the bounding box
    
    const [x, y, width, height] = detection.bbox;
    const faceRatio = width / height;
    
    // Simulate different expressions based on position in the frame and size
    const centerX = x + (width / 2);
    const randomFactor = Math.sin(Date.now() / 1000 + centerX) * 0.5 + 0.5; // Creates variation over time
    
    if (randomFactor < 0.2) return "Neutral";
    if (randomFactor < 0.4) return "Happy";
    if (randomFactor < 0.6) return "Concerned";
    if (randomFactor < 0.8) return "Suspicious";
    return "Angry";
  };

  const analyzeBodyLanguage = (detection: cocossd.DetectedObject): string => {
    // Again, in a real implementation this would use a pose estimation model
    // Here we simulate based on aspect ratio and position
    
    const [x, y, width, height] = detection.bbox;
    const aspectRatio = width / height;
    
    // Use time-based randomness for demo purposes
    const randomFactor = Math.cos(Date.now() / 1500 + y) * 0.5 + 0.5;
    
    // Different body language based on aspect ratio and simulated movement
    if (aspectRatio > 1.5) {
      return "Lying down";
    } else if (aspectRatio > 0.8 && aspectRatio < 1.2) {
      return "Crouching/Sitting";
    } else if (randomFactor < 0.2) {
      return "Relaxed";
    } else if (randomFactor < 0.4) {
      return "Walking";
    } else if (randomFactor < 0.6) {
      return "Anxious";
    } else if (randomFactor < 0.8) {
      return "Running";
    } else {
      return "Aggressive";
    }
  };

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary flex justify-between items-center">
          Camera Surveillance
          <div className="space-x-2 flex items-center">
            {suspiciousActivity && (
              <Badge variant="destructive" className="mr-2 animate-pulse flex gap-1">
                <AlertCircle size={14} /> Suspicious Activity
              </Badge>
            )}
            {!isRecording ? (
              <Button 
                onClick={startCamera}
                size="sm"
                className="gap-2"
              >
                <Camera size={16} /> Start Camera
              </Button>
            ) : (
              <Button 
                onClick={stopCamera} 
                variant="destructive"
                size="sm"
                className="gap-2"
              >
                <StopCircle size={16} /> Stop Camera
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative rounded-md overflow-hidden bg-black aspect-video flex items-center justify-center">
          {!isRecording && !videoRef.current?.srcObject && (
            <div className="text-gray-400 flex flex-col items-center gap-2">
              <Video className="h-12 w-12 opacity-50" />
              <p>Start camera to begin surveillance</p>
            </div>
          )}
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline
            muted 
            className="w-full h-full object-contain"
          />
          <canvas 
            ref={canvasRef} 
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />
        </div>
        
        {detections.length > 0 && (
          <div className="p-3 bg-muted rounded-md">
            <h3 className="font-medium mb-2">Live Detections:</h3>
            <ul className="space-y-1">
              {detections.map((detection, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Smile size={16} className={detection.expression === 'Happy' ? 'text-green-500' : 'text-yellow-500'} />
                  <span>
                    Person detected (confidence: {Math.round(detection.score * 100)}%)
                    {detection.expression && ` - Expression: ${detection.expression}`}
                    {detection.bodyLanguage && ` - Body Language: ${detection.bodyLanguage}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="text-sm text-muted-foreground">
          <p>This camera feed uses object detection to identify people and analyze facial expressions and body language.</p>
          <p>Note: This is a simulation for demonstration purposes. Real-world implementation would require dedicated ML models for accurate expression and pose analysis.</p>
        </div>
      </CardContent>
    </Card>
  );
}
