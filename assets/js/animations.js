"use strict";

class SplitText {
  #options = {
    charClass: "st-char",
    wordClass: "st-word",
    lineClass: "st-line",
    globalClass: "st-wrapper",
    emptySpaceName: "st-empty-space",
  };

  #rawChars = [];
  chars = [];
  #rawWords = [];
  words = [];
  lines = [];

  constructor(elementOrSelector) {
    this.init(elementOrSelector);

    this.target = null;
    this.textContent = null;
  }

  #isElement(obj) {
    try {
      return obj instanceof HTMLElement;
    } catch (e) {
      return (
        typeof obj === "object" &&
        obj.nodeType === 1 &&
        typeof obj.style === "object" &&
        typeof obj.ownerDocument === "object"
      );
    }
  }

  #createElement(tagname, content = "", htmlAttributes = {}, ...cssClass) {
    const __element__ = document.createElement(tagname);
    __element__.classList.add(...cssClass);
    __element__.innerHTML = content;

    for (const [key, value] of Object.entries(htmlAttributes)) {
      __element__.setAttribute(key, value);
    }

    return __element__;
  }

  #splitChars() {
    const textChars = `${this.textContent}`.split("");

    textChars.forEach((char) => {
      const charElement = this.#createElement(
        "div",
        `${char}`,
        {
          style: "position:relative; display:inline-block;",
        },
        `${this.#options.globalClass}`,
        `${this.#options.charClass}`
      );

      this.#rawChars.push(char === " " ? " " : charElement);
      this.chars.push(charElement);
    });
    this.#rawChars.push(" ");
  }

  #splitWords() {
    let startIndex = 0;
    this.#rawChars.forEach((rawChar, index) => {
      if (rawChar === " ") {
        const wordArray = this.#rawChars
          .slice(startIndex, index)
          .filter((word) => word !== " ");

        const wordDiv = this.#createElement(
          "div",
          "",
          {
            style: "position:relative; display:inline-block;",
          },
          `${this.#options.globalClass}`,
          `${this.#options.wordClass}`
        );

        wordArray.forEach((word) => {
          wordDiv.append(word);
        });

        this.words.push(wordDiv);
        this.#rawWords.push(wordDiv, " ");
        startIndex = index;
      }
    });
  }

  #splitLines() {
    let startIndex = 0;
    let lineArrays = [];

    const appendToLineArray = () => {

      lineArrays.forEach((lineArray) => {
        const lineDiv = this.#createElement(
          "div",
          "",
          {
            style: "position:relative; display:inline-block",
          },
          `${this.#options.globalClass}`,
          `${this.#options.lineClass}`
        );
        
        lineArray.forEach(lineWord => {
          lineDiv.append(lineWord)
          lineDiv.append(" ")
        })
        this.lines.push(lineDiv);
        this.target.append(lineDiv);
      });
    };

    this.words.reduce((oldOffsetTop, word, index) => {
      const currentOffsetTop = word.offsetTop;
      
      if (
        (oldOffsetTop !== currentOffsetTop && oldOffsetTop !== null) ||
        index === this.words.length - 1
      ) {
        const computedIndex =
          index === this.words.length - 1 ? index + 1 : index;
        const lineArray = this.words.slice(startIndex, computedIndex);
        lineArrays.push(lineArray);
        startIndex = index;
      }

      return currentOffsetTop;
    }, null);
    
    appendToLineArray();
  }

  #combineAll() {
    this.words.forEach((word) => {
      this.target.append(word);
      this.target.append(" ");
    });
    this.#splitLines();
  }

  #splitStart() {
    this.#splitChars();
    this.#splitWords();
    this.#combineAll();
  }

  #getTextContent() {
    this.textContent = this.target.textContent;
  }

  #clearContent(element) {
    element.innerHTML = "";
  }

  #logError(message) {
    console.error(`${message}`, "color:red", "color:inherit");
  }

  #logAndThrowError(message) {
    if (message.includes("%c")) {
      console.error(`${message}`, "color:red", "color:inherit");
    } else {
      console.error(`${message}`);
    }
    throw "SplitTextException! ⬆️";
  }

  init(elementOrSelector) {
    if (this.#isElement(elementOrSelector)) {
      this.target = elementOrSelector;
      this.#getTextContent();
    } else {
      if (elementOrSelector !== "") {
        const element = document.querySelector(`${elementOrSelector}`);
        if (element) {
          this.target = element;
          this.#getTextContent();
        } else {
          this.#logAndThrowError(
            `can't found %c${elementOrSelector}%c in DOM tree!`
          );
        }
      } else {
        this.#logAndThrowError(
          `selector is empty! %cplease give a valid%c selector!`
        );
      }
    }

    this.#clearContent(this.target);
    this.#splitStart();
  }
}

gsap.registerPlugin(Observer);

let sections = document.querySelectorAll("section"),
  images = document.querySelectorAll(".bg"),
  headings = gsap.utils.toArray(".section-heading"),
  outerWrappers = gsap.utils.toArray(".outer"),
  innerWrappers = gsap.utils.toArray(".inner"),
  splitHeadings = headings.map(heading => new SplitText(heading, { type: "chars,words,lines", linesClass: "clip-text" })),
  currentIndex = -1,
  wrap = gsap.utils.wrap(0, sections.length),
  animating,
  autoNavigateTimeout;

// Function to start the auto-navigation timer
function startAutoNavigate() {
  clearTimeout(autoNavigateTimeout);
  autoNavigateTimeout = setTimeout(() => {
    if (!animating) {
      gotoSection(currentIndex + 1, 1);
    }
  }, 5000);
}

function gotoSection(index, direction) {
  index = wrap(index);
  animating = true;
  clearTimeout(autoNavigateTimeout); // Clear the timeout when navigating
  let fromTop = direction === -1,
      dFactor = fromTop ? -1 : 1,
      tl = gsap.timeline({
        defaults: { duration: 1.25, ease: "expo.inOut" },
        onComplete: () => {
          animating = false;
          startAutoNavigate(); // Restart the timer after animation completes
        }
      });
  if (currentIndex >= 0) {
    // The first time this function runs, current is -1
    gsap.set(sections[currentIndex], { zIndex: 0 });
    tl.to(images[currentIndex], { yPercent: -15 * dFactor })
      .set(sections[currentIndex], { autoAlpha: 0 });
  }
  gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
  tl.fromTo([outerWrappers[index], innerWrappers[index]], { 
      yPercent: i => i ? -100 * dFactor : 100 * dFactor
    }, { 
      yPercent: 0 
    }, 0)
    .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)
    .fromTo(splitHeadings[index].chars, { 
        autoAlpha: 0, 
        yPercent: 150 * dFactor
    }, {
        autoAlpha: 1,
        yPercent: 0,
        duration: 1,
        ease: "power4",
        stagger: {
          each: 0.1,
          from: "random"
        }
      }, 0.2);

  currentIndex = index;
}

Observer.create({
  type: "wheel,touch,scroll,pointer",
  wheelSpeed: -1,
  onDown: () => !animating && gotoSection(currentIndex - 1, -1),
  onUp: () => !animating && gotoSection(currentIndex + 1, 1),
  tolerance: 1,
  preventDefault: true
});

document.addEventListener('keydown', (event) => {
    if (!animating) {
      switch (event.key) {
        case 'ArrowUp':
        case 'PageUp':
        case 'ArrowLeft':
          gotoSection(currentIndex - 1, -1);
          break;
        case 'ArrowDown':
        case 'PageDown':
        case 'ArrowRight':
          gotoSection(currentIndex + 1, 1);
          break;
        default:
          break;
      }
    }
});

// Typewriter effect
const typewriterElement = document.querySelector('.typewriter');
const words = ['Davio', 'Developer', 'Designer', 'Dreamer'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typewriterTimeout;

function type() {
  const currentWord = words[wordIndex];
  const displayText = currentWord.substring(0, charIndex);

  typewriterElement.textContent = displayText;

  if (!isDeleting) {
    if (charIndex < currentWord.length) {
      charIndex++;
      typewriterTimeout = setTimeout(type, 150); // Typing speed
    } else {
      isDeleting = true;
      typewriterTimeout = setTimeout(type, 2000); // Pause before deleting
    }
  } else {
    if (charIndex > 1) {
      charIndex--;
      typewriterTimeout = setTimeout(type, 100); // Deleting speed
    } else {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typewriterTimeout = setTimeout(type, 200); // Pause before typing next word
    }
  }
}

gotoSection(0, 1); // Initial section
startAutoNavigate(); // Start the auto-navigation timer
type(); // Start the typewriter effect