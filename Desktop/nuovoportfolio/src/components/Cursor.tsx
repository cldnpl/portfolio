import { Text, useBreakpointValue } from "@chakra-ui/react";
import { useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MotionBox } from "@/components/MotionBox";
import { useCursorStore } from "@/store/cursor";

const spring = { stiffness: 300, damping: 30 };
const fade = { duration: 0.2 };

/** The square at rest, with her initial in it; it grows into a label over projects. */
const REST = 18;
const INITIAL = "C";

/**
 * White square with a difference blend (so it reads black on the white page)
 * that follows the pointer. Both texts stay mounted and only fade: an exit
 * animation that never finished (it happened in Firefox-based browsers) left
 * the middle of "VIEW PROJECT", an "R", stuck inside the small square.
 */
export const Cursor = () => {
  const type = useCursorStore((s) => s.cursorType);
  const label = useCursorStore((s) => s.cursorLabel);
  const isProject = type === "project" && !!label;
  const width = isProject ? 140 : REST;
  const height = isProject ? 44 : REST;
  const [shownLabel, setShownLabel] = useState("");
  const lastX = useRef(0);
  const lastY = useRef(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const left = useSpring(x, spring);
  const top = useSpring(y, spring);
  const enabled = useBreakpointValue({ base: false, md: true });

  // keep the last label while it fades out, so it does not vanish mid-fade
  useEffect(() => {
    if (label) setShownLabel(label);
  }, [label]);

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
      aria-hidden
      style={{ position: "fixed", left, top, pointerEvents: "none", zIndex: 2000, mixBlendMode: "difference" }}
      animate={{ width, height }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      bg="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
    >
      <MotionBox
        position="absolute"
        inset={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
        initial={false}
        animate={{ opacity: isProject ? 0 : 1, scale: isProject ? 0.6 : 1 }}
        transition={fade}
      >
        <Text as="span" fontSize="13px" fontWeight="bold" lineHeight="1" color="black" userSelect="none">
          {INITIAL}
        </Text>
      </MotionBox>
      <MotionBox
        initial={false}
        animate={{ opacity: isProject ? 1 : 0, scale: isProject ? 1 : 0.6 }}
        transition={fade}
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
          {shownLabel}
        </Text>
      </MotionBox>
    </MotionBox>
  );
};
