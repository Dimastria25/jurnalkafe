"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import clsx from "clsx";
import Image from "next/image";

export function PhotoCarousel({
  photos,
  alt,
  className,
  imageClassName,
  rounded = "rounded-2xl",
}: {
  photos: { url: string; id: string }[];
  alt: string;
  className?: string;
  imageClassName?: string;
  rounded?: string;
}) {
  const [autoplay] = useState(() =>
    Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true })
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: photos.length > 1 }, [
    autoplay,
  ]);
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (photos.length === 0) {
    return (
      <div
        className={clsx(
          "flex items-center justify-center bg-cream-soft text-espresso-soft",
          rounded,
          className
        )}
      >
        <span className="text-4xl opacity-60">☕</span>
      </div>
    );
  }

  return (
    <div className={clsx("relative overflow-hidden", rounded, className)}>
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {photos.map((photo, i) => (
            <div className="flex-[0_0_100%] h-full relative" key={photo.id}>
              <Image
                src={photo.url}
                alt={`${alt} - foto ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className={clsx("object-cover", imageClassName)}
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>
      {photos.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
          {photos.map((_, i) => (
            <span
              key={i}
              className={clsx(
                "h-1.5 rounded-full transition-all",
                i === selected ? "w-4 bg-cream" : "w-1.5 bg-cream/60"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
