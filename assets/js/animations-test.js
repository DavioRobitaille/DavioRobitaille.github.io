document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);
  
    const animations = {
      "fade-in": { opacity: 1 },
      "fade-in-up": { opacity: 1, y: 0 },
      "fade-in-down": { opacity: 1, y: 0 },
      "fade-in-left": { opacity: 1, x: 0 },
      "fade-in-right": { opacity: 1, x: 0 },
      "fade-out": { opacity: 0 },
      "fade-out-up": { opacity: 0, y: -50 },
      "fade-out-down": { opacity: 0, y: 50 },
      "fade-out-left": { opacity: 0, x: -50 },
      "fade-out-right": { opacity: 0, x: 50 },
      "zoom-in": { opacity: 1, scale: 1 },
      "zoom-out": { opacity: 0, scale: 0 },
      "rotate-in": { opacity: 1, rotation: 0 },
      "rotate-out": { opacity: 0, rotation: 180 },
      "slide-in-up": { opacity: 1, y: 0 },
      "slide-in-down": { opacity: 1, y: 0 },
      "slide-in-left": { opacity: 1, x: 0 },
      "slide-in-right": { opacity: 1, x: 0 },
      "slide-out-up": { opacity: 0, y: -100 },
      "slide-out-down": { opacity: 0, y: 100 },
      "slide-out-left": { opacity: 0, x: -100 },
      "slide-out-right": { opacity: 0, x: 100 },
      "flip-in-x": { opacity: 1, rotationX: 0 },
      "flip-in-y": { opacity: 1, rotationY: 0 },
      "flip-out-x": { opacity: 0, rotationX: 180 },
      "flip-out-y": { opacity: 0, rotationY: 180 },
      "bounce-in": { opacity: 1, scale: 1 },
      "bounce-out": { opacity: 0, scale: 0 },
      "skew-in": { opacity: 1, skewX: 0, skewY: 0 },
      "skew-out": { opacity: 0, skewX: 30, skewY: 30 },
      "stretch-in": { opacity: 1, scaleX: 1, scaleY: 1 },
      "stretch-out": { opacity: 0, scaleX: 2, scaleY: 2 },
      "wobble-in": { opacity: 1, rotation: 0 },
      "wobble-out": { opacity: 0, rotation: 15 },
    };
  
    const initialStates = {
      "fade-in": { opacity: 0 },
      "fade-in-up": { opacity: 0, y: 50 },
      "fade-in-down": { opacity: 0, y: -50 },
      "fade-in-left": { opacity: 0, x: 50 },
      "fade-in-right": { opacity: 0, x: -50 },
      "fade-out": { opacity: 1 },
      "fade-out-up": { opacity: 1, y: 0 },
      "fade-out-down": { opacity: 1, y: 0 },
      "fade-out-left": { opacity: 1, x: 0 },
      "fade-out-right": { opacity: 1, x: 0 },
      "zoom-in": { opacity: 0, scale: 0 },
      "zoom-out": { opacity: 1, scale: 1 },
      "rotate-in": { opacity: 0, rotation: -180 },
      "rotate-out": { opacity: 1, rotation: 0 },
      "slide-in-up": { opacity: 0, y: 100 },
      "slide-in-down": { opacity: 0, y: -100 },
      "slide-in-left": { opacity: 0, x: 100 },
      "slide-in-right": { opacity: 0, x: -100 },
      "slide-out-up": { opacity: 1, y: 0 },
      "slide-out-down": { opacity: 1, y: 0 },
      "slide-out-left": { opacity: 1, x: 0 },
      "slide-out-right": { opacity: 1, x: 0 },
      "flip-in-x": { opacity: 0, rotationX: -180 },
      "flip-in-y": { opacity: 0, rotationY: -180 },
      "flip-out-x": { opacity: 1, rotationX: 0 },
      "flip-out-y": { opacity: 1, rotationY: 0 },
      "bounce-in": { opacity: 0, scale: 0.5 },
      "bounce-out": { opacity: 1, scale: 1 },
      "skew-in": { opacity: 0, skewX: 30, skewY: 30 },
      "skew-out": { opacity: 1, skewX: 0, skewY: 0 },
      "stretch-in": { opacity: 0, scaleX: 0.5, scaleY: 0.5 },
      "stretch-out": { opacity: 1, scaleX: 1, scaleY: 1 },
      "wobble-in": { opacity: 0, rotation: -15 },
      "wobble-out": { opacity: 1, rotation: 0 },
    };
  
    const applyAnimation = (key, element, index = 0) => {
      gsap.fromTo(
        element,
        initialStates[key],
        {
          ...animations[key],
          delay: index * 0.25,
          duration: 2,
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "top -10%",
            toggleActions: "play reverse restart reverse",
          }          // enter | leave | re-enter | re-leave
        }            // Options : play, reverse, restart, reset, complete, none
      );
    };
  
    const observeAnimations = () => {
      Object.keys(animations).forEach((key) => {
        // Single animations
        document.querySelectorAll(`.single-${key}`).forEach((element) => {
          gsap.set(element, initialStates[key]);
          applyAnimation(key, element);
        });
  
        // Multi animations
        document.querySelectorAll(`.multi-${key}`).forEach((container) => {
          Array.from(container.children).forEach((child, index) => {
            gsap.set(child, initialStates[key]);
            applyAnimation(key, child, index);
          });
        });
      });
    };
  
    observeAnimations();
  });
  