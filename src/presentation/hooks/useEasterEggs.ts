import { useEffect, useRef } from 'react';

// Triple click anywhere easter egg
export const useTripleClickEasterEgg = (callback: () => void) => {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    let clickCount = 0;
    let clickTimer: ReturnType<typeof setTimeout>;

    const handleClick = () => {
      clickCount++;
      
      if (clickCount === 3) {
        callbackRef.current();
        clickCount = 0;
      }

      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 500);
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
      clearTimeout(clickTimer);
    };
  }, []);
};

// Secret code easter egg - Multiple discoverable ways to trigger
// PC: Clicking on specific elements in sequence, or typing a code
// Mobile: Long-press on profile image, or tap specific sections
export const useSecretCodeEasterEgg = (code: string, callback: () => void) => {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    let inputBuffer = '';
    let triggered = false;
    let clickSequence: string[] = [];
    let longPressTimer: ReturnType<typeof setTimeout>;

    // Method 1: Type the code (original, but with hints)
    const handleKeyPress = (e: KeyboardEvent) => {
      if (triggered) return;
      
      inputBuffer += e.key.toLowerCase();
      
      if (inputBuffer.length > code.length) {
        inputBuffer = inputBuffer.slice(-code.length);
      }

      if (inputBuffer === code.toLowerCase()) {
        triggered = true;
        callbackRef.current();
        inputBuffer = '';
      }
    };

    // Method 2: Click on logo/title 5 times (PC discoverable)
    const handleLogoClick = (e: MouseEvent) => {
      if (triggered) return;
      
      const target = e.target as HTMLElement;
      // Look for portfolio title, logo, or brand elements
      if (
        target.textContent?.toLowerCase().includes('portfolio') ||
        target.closest('h1') ||
        target.closest('[class*="logo"]') ||
        target.closest('nav')
      ) {
        clickSequence.push('logo');
        
        if (clickSequence.length >= 5) {
          triggered = true;
          callbackRef.current();
          clickSequence = [];
        }

        // Reset sequence after 3 seconds
        setTimeout(() => {
          clickSequence = [];
        }, 3000);
      }
    };

    // Method 3: Long-press on profile image (Mobile discoverable)
    const handleTouchStart = (e: TouchEvent) => {
      if (triggered) return;
      
      const target = e.target as HTMLElement;
      // Look for profile image
      if (
        target.tagName === 'IMG' ||
        target.closest('img') ||
        target.getAttribute('alt')?.toLowerCase().includes('profile')
      ) {
        longPressTimer = setTimeout(() => {
          triggered = true;
          callbackRef.current();
        }, 2000); // 2 second long press
      }
    };

    const handleTouchEnd = () => {
      clearTimeout(longPressTimer);
    };

    // Method 4: Tap all navigation links in order (Mobile/Tablet discoverable)
    let navSequence: string[] = [];
    const expectedNavSequence = ['home', 'about', 'projects', 'contact'];
    
    const handleNavClick = (e: Event) => {
      if (triggered) return;
      
      const target = e.target as HTMLElement;
      const navLink = target.closest('a[href*="#"]') as HTMLAnchorElement;
      
      if (navLink) {
        const href = navLink.getAttribute('href')?.toLowerCase() || '';
        const section = href.replace('#', '').replace('/', '');
        
        if (expectedNavSequence.includes(section)) {
          navSequence.push(section);
          
          // Check if sequence matches expected order
          if (navSequence.length === expectedNavSequence.length) {
            let matches = true;
            for (let i = 0; i < expectedNavSequence.length; i++) {
              if (navSequence[i] !== expectedNavSequence[i]) {
                matches = false;
                break;
              }
            }
            
            if (matches) {
              triggered = true;
              callbackRef.current();
              navSequence = [];
            } else {
              navSequence = [];
            }
          }
          
          // Reset after 10 seconds
          setTimeout(() => {
            navSequence = [];
          }, 10000);
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    document.addEventListener('click', handleLogoClick);
    document.addEventListener('click', handleNavClick);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      document.removeEventListener('click', handleLogoClick);
      document.removeEventListener('click', handleNavClick);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      clearTimeout(longPressTimer);
    };
  }, [code]);
};

// Scroll distance easter egg - triggers on total scroll OR reaching bottom
export const useScrollEasterEgg = (distance: number, callback: () => void) => {
  const callbackRef = useRef(callback);
  
  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    let totalScrolled = 0;
    let lastScroll = window.scrollY;
    let triggered = false;

    const handleScroll = () => {
      if (triggered) return;

      const currentScroll = window.scrollY;
      totalScrolled += Math.abs(currentScroll - lastScroll);
      lastScroll = currentScroll;

      // Check if scrolled enough distance
      const reachedDistance = totalScrolled >= distance;
      
      // Check if reached near bottom of page (within 100px)
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrolledToBottom = currentScroll + windowHeight >= documentHeight - 100;

      if (reachedDistance || scrolledToBottom) {
        callbackRef.current();
        triggered = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [distance]);
};

// Time-based easter egg (staying on page)
export const useTimeBasedEasterEgg = (seconds: number, callback: () => void) => {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const timer = setTimeout(() => {
      callbackRef.current();
    }, seconds * 1000);

    return () => clearTimeout(timer);
  }, [seconds]);
};

// Konami Code easter egg
export const useKonamiCodeEasterEgg = (callback: () => void) => {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let currentIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const expectedKey = konamiCode[currentIndex].toLowerCase();

      if (key === expectedKey || e.code === konamiCode[currentIndex]) {
        currentIndex++;
        if (currentIndex === konamiCode.length) {
          callbackRef.current();
          currentIndex = 0;
        }
      } else {
        currentIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};

// Shake device easter egg (mobile + PC with keyboard shortcut)
export const useShakeEasterEgg = (callback: () => void, threshold: number = 15) => {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    let triggered = false;
    
    // Mobile shake detection
    let lastX = 0, lastY = 0, lastZ = 0;
    let lastUpdate = 0;

    const handleMotion = (e: DeviceMotionEvent) => {
      if (triggered) return;
      
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;

      const currentTime = new Date().getTime();
      if ((currentTime - lastUpdate) > 100) {
        const diffTime = currentTime - lastUpdate;
        lastUpdate = currentTime;

        const x = acc.x || 0;
        const y = acc.y || 0;
        const z = acc.z || 0;

        const speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;

        if (speed > threshold) {
          triggered = true;
          callbackRef.current();
          // Reset after 2 seconds to allow re-triggering
          setTimeout(() => { triggered = false; }, 2000);
        }

        lastX = x;
        lastY = y;
        lastZ = z;
      }
    };

    // PC alternative: Press 'S' key 5 times quickly (for "Shake")
    let keyPressCount = 0;
    let keyTimer: ReturnType<typeof setTimeout>;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (triggered) return;
      
      if (e.key.toLowerCase() === 's') {
        keyPressCount++;
        
        if (keyPressCount >= 5) {
          triggered = true;
          callbackRef.current();
          keyPressCount = 0;
          setTimeout(() => { triggered = false; }, 2000);
        }

        clearTimeout(keyTimer);
        keyTimer = setTimeout(() => {
          keyPressCount = 0;
        }, 1000);
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    window.addEventListener('keypress', handleKeyPress);
    
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      window.removeEventListener('keypress', handleKeyPress);
      clearTimeout(keyTimer);
    };
  }, [threshold]);
};

// Long press easter egg (mobile friendly)
export const useLongPressEasterEgg = (
  targetRef: React.RefObject<HTMLElement>,
  callback: () => void,
  duration: number = 3000
) => {
  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    let pressTimer: ReturnType<typeof setTimeout>;

    const handleStart = () => {
      pressTimer = setTimeout(() => {
        callback();
      }, duration);
    };

    const handleEnd = () => {
      clearTimeout(pressTimer);
    };

    element.addEventListener('mousedown', handleStart);
    element.addEventListener('mouseup', handleEnd);
    element.addEventListener('mouseleave', handleEnd);
    element.addEventListener('touchstart', handleStart);
    element.addEventListener('touchend', handleEnd);

    return () => {
      element.removeEventListener('mousedown', handleStart);
      element.removeEventListener('mouseup', handleEnd);
      element.removeEventListener('mouseleave', handleEnd);
      element.removeEventListener('touchstart', handleStart);
      element.removeEventListener('touchend', handleEnd);
      clearTimeout(pressTimer);
    };
  }, [targetRef, callback, duration]);
};

// Double tap easter egg (mobile + PC with double-click)
export const useDoubleTapEasterEgg = (callback: () => void) => {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    let lastTap = 0;
    let triggered = false;

    // Mobile double-tap
    const handleTouchEnd = () => {
      if (triggered) return;
      
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      
      if (tapLength < 300 && tapLength > 0) {
        triggered = true;
        callbackRef.current();
        setTimeout(() => { triggered = false; }, 2000);
      }
      lastTap = currentTime;
    };

    // PC double-click alternative
    const handleDoubleClick = () => {
      if (triggered) return;
      
      triggered = true;
      callbackRef.current();
      setTimeout(() => { triggered = false; }, 2000);
    };

    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('dblclick', handleDoubleClick);
    
    return () => {
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('dblclick', handleDoubleClick);
    };
  }, []);
};
