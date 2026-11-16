import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/dist/CustomEase";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/dist/SplitText";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger, CustomEase);

export { gsap, useGSAP, SplitText, ScrollTrigger, CustomEase };
