import { Text, useBreakpointValue } from "@chakra-ui/react";
import { AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { MotionBox } from "@/components/MotionBox";
import { useCursorStore } from "@/store/cursor";

const spring = { stiffness: 300, damping: 30 };

/** Small white square (difference blend) that grows into a label over projects. */
export const Cursor = () => {
  const type = useCursorStore((s) => s.cursorType);
  const label = useCursorStore((s) => s.cursorLabel);
  const isProject = type === "project";
  const width = isProject ? 140 : 10;
  const height = isProject ? 44 : 10;
  const lastX = useRef(0);
  const lastY = useRef(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const left = useSpring(x, spring);
  const top = useSpring(y, spring);
  const enabled = useBreakpointValue({ base: false, md: true });

  useEffect(() => {
    if (!enabled) return;
    const onMove = (event: MouseEvent) => {
      lastX.current = event.clientX;
      lastY.current = event.clientY;
      x.set(event.clientX - width / 2);
      y.set(event.clientY - height / 2);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y, width, height, enabled]);

  useEffect(() => {
    x.set(lastX.current - width / 2);
    y.set(lastY.current - height / 2);
  }, [width, height, x, y]);

  if (!enabled) return null;

  return (
    <MotionBox
      style={{ position: "fixed", left, top, pointerEvents: "none", zIndex: 2000, mixBlendMode: "difference" }}
      animate={{ width, height }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      bg="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <AnimatePresence>
        {isProject && label && (
          <MotionBox
            key="label"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2 }}
          >
            <Text
              fontSize="xs"
              fontWeight="medium"
              textTransform="uppercase"
              letterSpacing="0.08em"
              color="black"
              whiteSpace="nowrap"
              userSelect="none"
            >
              {label}
            </Text>
          </MotionBox>
        )}
      </AnimatePresence>
    </MotionBox>
  );
};
