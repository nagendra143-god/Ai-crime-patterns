
import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, StopCircle, Video, AlertCircle, Smile, Bomb, Skull, Knife, HandMetal, Gun } from "lucide-react";
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
    dangerousObject?: string;
  }>>([]);
  const [model, setModel] = useState<cocossd.ObjectDetection | null>(null);
  const animationRef = useRef<number | null>(null);
  const [suspiciousActivity, setSuspiciousActivity] = useState(false);
  const [dangerousObjectDetected, setDangerousObjectDetected] = useState(false);

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
          description: "Monitoring for suspicious activity and dangerous objects...",
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
    setDangerousObjectDetected(false);
    
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
    
    // Process all detections
    const enhancedDetections = predictions.map(detection => {
      // Add face expression and body language analysis for people
      if (detection.class === 'person') {
        return {
          ...detection,
          expression: analyzeFacialExpression(detection),
          bodyLanguage: analyzeBodyLanguage(detection),
        };
      } 
      // Check for dangerous objects
      else if (['cell phone', 'knife', 'scissors', 'baseball bat', 'bottle'].includes(detection.class)) {
        // Map common COCO-SSD objects to potentially dangerous items
        const dangerousMapping: Record<string, string> = {
          'cell phone': Math.random() > 0.7 ? 'Gun' : 'Cell phone',
          'knife': 'Knife',
          'scissors': Math.random() > 0.5 ? 'Knife' : 'Scissors',
          'baseball bat': Math.random() > 0.7 ? 'Weapon' : 'Baseball bat',
          'bottle': Math.random() > 0.8 ? 'Explosive' : 'Bottle'
        };
        
        return {
          ...detection,
          dangerousObject: dangerousMapping[detection.class]
        };
      }
      
      return detection;
    });

    // Filter for people and dangerous objects
    const relevantDetections = enhancedDetections.filter(detection => 
      detection.class === 'person' || detection.dangerousObject
    );
    
    // Check for suspicious activity
    const hasSuspiciousActivity = relevantDetections.some(
      detection => 
        detection.expression === 'Angry' || 
        detection.expression === 'Suspicious' ||
        detection.bodyLanguage === 'Aggressive' || 
        detection.bodyLanguage === 'Anxious'
    );
    
    // Check for dangerous objects
    const hasDangerousObjects = relevantDetections.some(
      detection => 
        detection.dangerousObject === 'Gun' || 
        detection.dangerousObject === 'Knife' || 
        detection.dangerousObject === 'Weapon' ||
        detection.dangerousObject === 'Explosive'
    );
    
    // Update suspicious activity state
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
    
    // Update dangerous object detection state
    if (hasDangerousObjects && !dangerousObjectDetected) {
      setDangerousObjectDetected(true);
      toast({
        title: "🚨 DANGEROUS OBJECT DETECTED",
        description: "Potential weapon or dangerous item identified in camera feed!",
        variant: "destructive",
        duration: 10000,
      });
    } else if (!hasDangerousObjects && dangerousObjectDetected) {
      setDangerousObjectDetected(false);
    }
    
    // Update state with new detections
    setDetections(relevantDetections);
    
    // Draw the detections
    drawDetections(relevantDetections);
    
    // Continue detection
    animationRef.current = requestAnimationFrame(detectFrame);
  };

  const drawDetections = (detections: Array<cocossd.DetectedObject & { expression?: string, bodyLanguage?: string, dangerousObject?: string }>) => {
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
      
      // Determine if this is a dangerous detection
      const isDangerous = 
        (detection.expression === 'Angry' || 
        detection.expression === 'Suspicious' ||
        detection.bodyLanguage === 'Aggressive' || 
        detection.bodyLanguage === 'Anxious') ||
        (detection.dangerousObject && 
          ['Gun', 'Knife', 'Weapon', 'Explosive'].includes(detection.dangerousObject));
      
      // Draw bounding box - change color based on danger level
      ctx.strokeStyle = isDangerous ? '#FF0000' : '#00FF00';
      ctx.lineWidth = isDangerous ? 3 : 2;
      ctx.strokeRect(x, y, width, height);
      
      // Draw label
      ctx.fillStyle = isDangerous ? '#FF0000' : '#00FF00';
      ctx.font = isDangerous ? 'bold 18px Arial' : '18px Arial';
      
      if (detection.class === 'person') {
        ctx.fillText(
          `Person: ${Math.round(detection.score * 100)}%`,
          x, y > 20 ? y - 5 : y + 20
        );

        // Draw facial expression
        if (detection.expression) {
          ctx.fillStyle = detection.expression === 'Happy' ? '#00FF00' : 
                         (detection.expression === 'Neutral' ? '#FFFF00' : '#FF0000');
          ctx.fillText(
            `Expression: ${detection.expression}`,
            x, y + height + 20
          );
        }

        // Draw body language
        if (detection.bodyLanguage) {
          ctx.fillStyle = ['Relaxed', 'Walking'].includes(detection.bodyLanguage) ? '#00FFFF' : '#FF00FF';
          ctx.fillText(
            `Body Language: ${detection.bodyLanguage}`,
            x, y + height + 45
          );
        }
      } 
      else if (detection.dangerousObject) {
        // Draw dangerous object label with alert indicator
        ctx.fillStyle = '#FF0000';
        ctx.font = 'bold 20px Arial';
        ctx.fillText(
          `⚠️ ${detection.dangerousObject}: ${Math.round(detection.score * 100)}%`,
          x, y > 25 ? y - 10 : y + 25
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

  // Get appropriate icon for detection type
  const getDetectionIcon = (detection: any) => {
    if (detection.dangerousObject) {
      switch (detection.dangerousObject) {
        case 'Gun': return <Gun size={16} className="text-red-500" />;
        case 'Knife': return <Knife size={16} className="text-red-500" />;
        case 'Explosive': return <Bomb size={16} className="text-red-500" />;
        case 'Weapon': return <HandMetal size={16} className="text-red-500" />;
        default: return <AlertCircle size={16} className="text-yellow-500" />;
      }
    } else if (detection.expression) {
      return <Smile size={16} className={detection.expression === 'Happy' ? "text-green-500" : "text-yellow-500"} />;
    } else {
      return <AlertCircle size={16} />;
    }
  };

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary flex justify-between items-center">
          Camera Surveillance
          <div className="space-x-2 flex items-center">
            {dangerousObjectDetected && (
              <Badge variant="destructive" className="mr-2 animate-pulse flex gap-1 bg-red-600">
                <Bomb size={14} /> Dangerous Object Detected!
              </Badge>
            )}
            {suspiciousActivity && !dangerousObjectDetected && (
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
                  {getDetectionIcon(detection)}
                  <span>
                    {detection.dangerousObject ? (
                      <strong className="text-red-500">
                        {detection.dangerousObject} detected (confidence: {Math.round(detection.score * 100)}%)
                      </strong>
                    ) : (
                      <>
                        Person detected (confidence: {Math.round(detection.score * 100)}%)
                        {detection.expression && ` - Expression: ${detection.expression}`}
                        {detection.bodyLanguage && ` - Body Language: ${detection.bodyLanguage}`}
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="text-sm text-muted-foreground">
          <p>This camera feed uses object detection to identify people, dangerous objects, and analyze facial expressions and body language.</p>
          <p>Note: This is a simulation for demonstration purposes. Real-world implementation would require dedicated ML models for accurate weapon and expression analysis.</p>
        </div>
      </CardContent>
    </Card>
  );
}
