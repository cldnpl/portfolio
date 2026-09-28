import { Box } from "@chakra-ui/react";
import Image from "next/image";
import { usePortraitGlitch } from "@/hooks/usePortraitGlitch";

export const Portrait = ({ src, alt }: { src: string; alt: string }) => {
  const { containerRef, canvasRef } = usePortraitGlitch({ src });
  return (
    <Box
      position="absolute"
      top="50%"
      left="50%"
      transform="translateY(-50%) translateX(-50%)"
      width={{ base: "260px", lg: "350px" }}
      aspectRatio="2/3"
      overflow="hidden"
    >
      <Box
        ref={containerRef}
        data-intro="portrait"
        position="absolute"
        inset="0"
        overflow="hidden"
        willChange="clip-path, transform"
      >
        <Image src={src} alt={alt} fill priority sizes="(max-width: 992px) 260px, 350px" style={{ objectFit: "cover" }} />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            pointerEvents: "none",
          }}
        />
      </Box>
    </Box>
  );
};
