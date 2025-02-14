import React, { useEffect } from 'react'

const Particles = () => {
    useEffect(() => {
        const createParticles = () => {
          const particlesContainer = document.querySelector(".particles");
          if (!particlesContainer) return;

          // Clear existing particles
          particlesContainer.innerHTML = "";

          // Create 50 particles
          for (let i = 0; i < 50; i++) {
            const particle = document.createElement("div");
            particle.className = "particle";
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 15}s`;
            particlesContainer.appendChild(particle);
          }
        };

        createParticles();
        const interval = setInterval(createParticles, 10000); // Recreate particles every 10 seconds

        return () => clearInterval(interval);
      }, []);

  return (
    <div className='particles'>

    </div>
  )
}

export default Particles
