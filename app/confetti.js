function startConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      console.warn("Confetti library not loaded.");
    }
  }
  
  function stopConfetti() {
    // Confetti burst auto-stops; no logic needed here
  }
  