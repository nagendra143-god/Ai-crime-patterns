
import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, StopCircle, Video } from "lucide-react";
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as cocossd from '@tensorflow-models/coco-ssd';

export function CameraFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [detections, setDetections] = useState<Array<{
    class: string;
    score: number;
    bbox: [number, number, number, number];
  }>>([]);
  const [model, setModel] = useState<cocossd.ObjectDetection | null>(null);
  const animationRef = useRef<number | null>(null);

  // Initialize the object detection model
  useEffect(() => {
    const loadModel = async () => {
      try {
        // Initialize TensorFlow.js
        await tf.ready();
        console.log("TensorFlow.js initialized");
        
        // Set backend to webgl for better performance
        await tf.setBackend('webgl');
        console.log("WebGL backend set");
        
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
      };
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;
    
    const stream = videoRef.current.srcObject as MediaStream;
    const tracks = stream.getTracks();
    
    tracks.forEach(track => track.stop());
    videoRef.current.srcObject = null;
    
    setIsRecording(false);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const detectFrame = async () => {
    if (!model || !videoRef.current || !canvasRef.current || videoRef.current.paused || videoRef.current.ended) {
      return;
    }
    
    // Perform detection
    const predictions = await model.detect(videoRef.current);
    
    // Filter for people only
    const peopleDetections = predictions.filter(prediction => 
      prediction.class === 'person'
    );
    
    // Update state with new detections
    setDetections(peopleDetections);
    
    // Draw the detections
    drawDetections(peopleDetections);
    
    // Continue detection
    animationRef.current = requestAnimationFrame(detectFrame);
  };

  const drawDetections = (detections: cocossd.DetectedObject[]) => {
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
      
      // Draw bounding box
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      
      // Draw label
      ctx.fillStyle = '#FF0000';
      ctx.font = '18px Arial';
      ctx.fillText(
        `Person: ${Math.round(detection.score * 100)}%`,
        x, y > 20 ? y - 5 : y + 20
      );

      // Analyze pose if applicable
      analyzePose(detection, ctx);
    });
  };

  const analyzePose = (detection: cocossd.DetectedObject, ctx: CanvasRenderingContext2D) => {
    const [x, y, width, height] = detection.bbox;
    
    // Simple action detection based on bounding box proportions
    // This is a simplified version - real pose estimation would use more advanced models
    const aspectRatio = width / height;
    let action = "Standing";
    
    if (aspectRatio > 1.5) {
      action = "Lying down";
    } else if (aspectRatio > 0.8 && aspectRatio < 1.2) {
      action = "Crouching/Sitting";
    }
    
    // Draw action text
    ctx.fillStyle = '#0000FF';
    ctx.fillText(`Action: ${action}`, x, y + height + 20);
  };

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary flex justify-between items-center">
          Camera Surveillance
          <div className="space-x-2">
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
                <li key={index}>
                  Person detected (confidence: {Math.round(detection.score * 100)}%)
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="text-sm text-muted-foreground">
          <p>This camera feed uses TensorFlow.js and COCO-SSD to detect people in real-time.</p>
          <p>For more accurate action recognition, additional pose estimation models can be integrated.</p>
        </div>
      </CardContent>
    </Card>
  );
}
