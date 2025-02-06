'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type DeviceType = 'iphone' | 'android' | 'tablet';
export type Orientation = 'portrait' | 'landscape';

interface ViewContextType {
  isAdminView: boolean;
  isMobilePreview: boolean;
  deviceType: DeviceType;
  orientation: Orientation;
  toggleView: () => void;
  toggleMobilePreview: () => void;
  setDeviceType: (device: DeviceType) => void;
  setOrientation: (orientation: Orientation) => void;
}

const ViewContext = createContext<ViewContextType>({
  isAdminView: true,
  isMobilePreview: false,
  deviceType: 'iphone',
  orientation: 'portrait',
  toggleView: () => {},
  toggleMobilePreview: () => {},
  setDeviceType: () => {},
  setOrientation: () => {},
});

function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
  
  return mobileKeywords.some(keyword => userAgent.includes(keyword));
}

function detectDeviceType(): DeviceType {
  if (typeof window === 'undefined') return 'iphone';
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('ipad') || (userAgent.includes('macintosh') && 'ontouchend' in document)) {
    return 'tablet';
  } else if (userAgent.includes('iphone') || userAgent.includes('ipod')) {
    return 'iphone';
  } else if (userAgent.includes('android')) {
    return userAgent.includes('tablet') ? 'tablet' : 'android';
  }
  
  return 'iphone';
}

function detectOrientation(): Orientation {
  if (typeof window === 'undefined') return 'portrait';
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
}

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [isAdminView, setIsAdminView] = useState(true);
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [deviceType, setDeviceType] = useState<DeviceType>('iphone');
  const [orientation, setOrientation] = useState<Orientation>('portrait');

  useEffect(() => {
    // Set initial device detection
    const isMobile = isMobileDevice();
    setIsMobilePreview(isMobile);
    setDeviceType(detectDeviceType());
    setOrientation(detectOrientation());

    // Add orientation change listener
    const handleOrientationChange = () => {
      setOrientation(detectOrientation());
    };

    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  const toggleView = () => {
    setIsAdminView(!isAdminView);
  };

  const toggleMobilePreview = () => {
    setIsMobilePreview(!isMobilePreview);
  };

  return (
    <ViewContext.Provider 
      value={{ 
        isAdminView, 
        isMobilePreview, 
        deviceType,
        orientation,
        toggleView, 
        toggleMobilePreview,
        setDeviceType,
        setOrientation
      }}
    >
      {children}
    </ViewContext.Provider>
  );
}

export const useView = () => {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
}; 