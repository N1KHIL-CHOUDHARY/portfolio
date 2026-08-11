"use client";

import Image, { type ImageProps } from "next/image";
import { useState, useRef, useEffect } from "react";

type ImageWithSkeletonProps = ImageProps & {
  containerClassName?: string;
  skeletonClassName?: string;
};

export default function ImageWithSkeleton({
  alt,
  containerClassName = "",
  skeletonClassName = "",
  className = "",
  onLoad,
  onError,
  ...props
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
  
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, []);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {!isLoaded && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 z-10 animate-pulse bg-zinc-200 dark:bg-zinc-800 ${skeletonClassName}`}
        />
      )}
      <Image
        ref={imgRef}
        alt={alt}
        {...props}
        className={`relative z-0 ${className}`}
        onLoad={(event) => {
          setIsLoaded(true);
          onLoad?.(event);
        }}
        onError={(event) => {
          // Hide skeleton even on error so we don't show a permanent pulse
          setIsLoaded(true);
          onError?.(event);
        }}
      />
    </div>
  );
}