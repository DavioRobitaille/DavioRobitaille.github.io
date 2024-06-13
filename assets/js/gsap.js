document.addEventListener("DOMContentLoaded", () => {
    // Register the GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    const sections = gsap.utils.toArray("section");
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: "main",
            start: "top top",
            end: "+=5000", // Adjust this value as needed for the length of the timeline
            scrub: true,
            pin: true,
            anticipatePin: 1
        }
    });

    sections.forEach((section, index) => {
        timeline.fromTo(section, {
            autoAlpha: 0,
            zIndex: 1
        }, {
            autoAlpha: 1,
            zIndex: 2,
            duration: 1,
            onStart: () => {
                if (index > 0) {
                    gsap.to(sections[index - 1], { autoAlpha: 0, duration: 1 });
                }
            },
            onComplete: () => {
                if (index < sections.length - 1) {
                    gsap.to(sections[index + 1], { autoAlpha: 0, duration: 1 });
                }
            }
        }, "+=2");

        // Animate elements inside each section before transition
        const heading = section.querySelector("h2");
        timeline.from(heading, {
            y: 50,
            autoAlpha: 0,
            duration: 1
        }, "<");
    });

    // Optional: Add auto-play animation
    gsap.to(timeline, {
        progress: 1,
        duration: 10, // Adjust this value for how long the whole timeline should take
        ease: "none",
        repeat: -1,
        yoyo: false
    });
});
