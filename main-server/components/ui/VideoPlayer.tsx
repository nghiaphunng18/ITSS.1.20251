"use client";

import React, { useState } from "react";
import { Card, Flex, Text, Button } from "@radix-ui/themes";
import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiMaximize,
  FiDownload,
} from "react-icons/fi";

interface VideoPlayerProps {
  videoUrl: string;
  fileName: string;
  fileSize?: number | null;
}

export function VideoPlayer({
  videoUrl,
  fileName,
  fileSize,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  return (
    <Card className="overflow-hidden bg-white">
      <div className="relative w-full bg-black aspect-video">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={togglePlay}
        >
          Your browser does not support the video tag.
        </video>

        {/* Overlay controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <Flex direction="column" gap="2">
            {/* Video info */}
            <Flex justify="between" align="center">
              <Text className="text-white text-sm font-medium truncate">
                {fileName}
              </Text>
              {fileSize && (
                <Text className="text-white/70 text-xs ml-2">
                  {formatFileSize(fileSize)}
                </Text>
              )}
            </Flex>

            {/* Controls */}
            <Flex gap="2" align="center">
              <Button
                size="2"
                variant="ghost"
                onClick={togglePlay}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
              </Button>

              <Button
                size="2"
                variant="ghost"
                onClick={toggleMute}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
              </Button>

              <div className="flex-1" />

              <Button
                size="2"
                variant="ghost"
                onClick={handleDownload}
                className="text-white hover:bg-white/20"
              >
                <FiDownload size={18} />
              </Button>

              <Button
                size="2"
                variant="ghost"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
              >
                <FiMaximize size={18} />
              </Button>
            </Flex>
          </Flex>
        </div>
      </div>
    </Card>
  );
}
