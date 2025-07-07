
import {
  animate,
  createAnimatable,
  createTimeline
} from 'https://cdn.jsdelivr.net/npm/animejs/+esm';

const screenShakeIntensity = 50;
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);
let referrerUrl = null;
let shouldPlayIntro = true;

/*
  Returns a promise to delay an asyncronous function for a given amount of
  time.
*/
function delay(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

async function shakeElement(el, duration, speed, intensity) {
  const elementShaker = createAnimatable(el, {
    x: 0,
    y: 0,
    duration: speed
  });
  let timeLeft = duration;

  while (timeLeft > 0) {
    const animationProgress = timeLeft / duration;
    elementShaker.x((Math.random() - 0.5) * intensity * animationProgress);
    elementShaker.y((Math.random() - 0.5) * intensity * animationProgress);
    timeLeft -= speed;
    await delay(speed);
  }

  elementShaker.revert();
}

/*
  Plays the intro animation in the current HTML document.
*/
function playIntro() {
  const introOverlay = document.createElement("div");
  introOverlay.id = "intro";
  // EZ way to programmatically assign styles to an element. This is neat. :)
  introOverlay.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  `;

  const introDoor = document.createElement("img");
  introDoor.src = "./static/images/intro-door.svg";
  introDoor.alt = "";

  const introDoorSlam = document.createElement("img");
  introDoorSlam.src = "./static/images/intro-slam.svg";
  introDoorSlam.alt = "";
  introDoorSlam.style.display = "none";

  /*
    Plays a little door bang animation when called.
  */
  const bangDoor = () => {
    introDoor.style.display = "none";
    introDoorSlam.style.display = "";
    setTimeout(() => {
      introDoor.style.display = "";
      introDoorSlam.style.display = "none";
    }, 50);
  };

  // For accessibility's sake...
  document.body.ariaHidden = true;

  introOverlay.appendChild(introDoor);
  introOverlay.appendChild(introDoorSlam);
  document.body.appendChild(introOverlay);

  createTimeline()
  .call(bangDoor, 333)
  .call(bangDoor, 667)
  .call(bangDoor, 950)
  .call(() => {
    shakeElement(document.body, 500, 25, screenShakeIntensity);
    introOverlay.remove();
    document.body.ariaHidden = false;
  }, 1000);

  console.log("Started intro.");
}

// Only play the intro as soon as the user enters the website.
// new URL() can fail if the given URL is invalid, so we need to catch this in
// a "try" statement, then drop the error.
try {
  referrerUrl = new URL(document.referrer);
} catch (_) {} // "catch" apparently gets angry if I don't give it a parameter.

if (referrerUrl) {
  if (referrerUrl.basename === document.location.basename) {
    shouldPlayIntro = false;
  }
}

shouldPlayIntro = shouldPlayIntro && !prefersReducedMotion.matches;

if (shouldPlayIntro) {
  playIntro();
}

