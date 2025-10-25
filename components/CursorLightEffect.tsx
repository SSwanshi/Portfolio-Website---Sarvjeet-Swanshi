import React, { useState, useEffect } from 'react';

const CursorLightEffect = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleMouseMove = (e: { clientX: any; clientY: any; }) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
  if (e.touches.length > 0) {
    const touch = e.touches[0];
    setMousePos({ x: touch.clientX, y: touch.clientY });
    setIsVisible(true);
  }
};

    const handleTouchEnd = () => {
      setIsVisible(false);
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      // Cleanup event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <div
        className={`absolute w-[28rem] h-[28rem] rounded-full transition-opacity duration-200 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.3) 30%, rgba(255, 255, 255, 0.2) 60%, rgba(255, 255, 255, 0.05) 100%)',
          filter: 'blur(35px) brightness(1.3)',
          transform: `translate3d(${mousePos.x - 224}px, ${mousePos.y - 224}px, 0)`, // Hardware accelerated positioning
          willChange: 'transform', // Optimize for animations
        }}
      />
    </div>
  );
};

export default CursorLightEffect;