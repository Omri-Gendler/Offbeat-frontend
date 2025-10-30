import React, { useState, useEffect, useRef } from 'react';
import { IconCheckCircle24, IconAddCircle24 } from './Icon.jsx';

export function LikeButtonWithFireworks({ 
  isLiked, 
  onToggleLike, 
  className = "tertiary-btn",
  ariaLabel,
  disabled = false,
  likedIcon = null,
  unlikedIcon = null,
  ...props 
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const buttonRef = useRef(null);
  const fireworksRef = useRef(null);

  const handleClick = async (e) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();

    // Only show fireworks when liking (not unliking)
    const willBeLiked = !isLiked;
    
    if (willBeLiked) {
      // Start animation immediately for better UX
      setIsAnimating(true);
      setShowFireworks(true);
      
      // Create firework particles
      createFireworkParticles();
      
      // Reset animations after duration
      setTimeout(() => {
        setIsAnimating(false);
        setShowFireworks(false);
      }, 1000);
    }
    
    // Call the actual toggle function
    await onToggleLike?.(e);
  };

  const createFireworkParticles = () => {
    if (!buttonRef.current || !fireworksRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Create multiple bursts of particles
    for (let burst = 0; burst < 3; burst++) {
      setTimeout(() => {
        createParticleBurst(centerX, centerY, burst);
      }, burst * 100);
    }
  };

  const createParticleBurst = (centerX, centerY, burstIndex) => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
    const particleCount = burstIndex === 0 ? 12 : 8; // More particles in first burst

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'firework-particle';
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      const angle = (360 / particleCount) * i + (burstIndex * 15); // Offset each burst
      const velocity = 80 + Math.random() * 40; // Random velocity
      const size = 3 + Math.random() * 3;

      particle.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${centerX}px;
        top: ${centerY}px;
        box-shadow: 0 0 6px ${color};
        --angle: ${angle}deg;
        --velocity: ${velocity}px;
        --duration: ${0.8 + Math.random() * 0.4}s;
      `;

      document.body.appendChild(particle);

      // Animate the particle
      particle.animate([
        {
          transform: 'translate(-50%, -50%) rotate(var(--angle)) translateY(0) scale(1)',
          opacity: 1
        },
        {
          transform: 'translate(-50%, -50%) rotate(var(--angle)) translateY(calc(-1 * var(--velocity))) scale(0)',
          opacity: 0
        }
      ], {
        duration: parseFloat(particle.style.getPropertyValue('--duration')) * 1000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }).onfinish = () => {
        particle.remove();
      };
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={`${className} ${isAnimating ? 'like-animating' : ''} ${isLiked ? 'liked' : ''}`}
        aria-label={ariaLabel || (isLiked ? 'Remove from Liked Songs' : 'Save to Liked Songs')}
        aria-pressed={isLiked}
        onClick={handleClick}
        disabled={disabled}
        {...props}
      >
        {isLiked ? 
          (likedIcon ? React.cloneElement(likedIcon, { className: "icon like-icon" }) : <IconCheckCircle24 className="icon like-icon" />) : 
          (unlikedIcon ? React.cloneElement(unlikedIcon, { className: "icon like-icon" }) : <IconAddCircle24 className="icon like-icon" />)
        }
      </button>
      
      {/* Fireworks container */}
      <div 
        ref={fireworksRef}
        className={`fireworks-container ${showFireworks ? 'active' : ''}`}
        style={{ pointerEvents: 'none' }}
      />
    </>
  );
}