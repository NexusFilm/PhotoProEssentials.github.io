'use client';

import React, { createContext, useContext, useState } from 'react';

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

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [isAdminView, setIsAdminView] = useState(true);
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [deviceType, setDeviceType] = useState<DeviceType>('iphone');
  const [orientation, setOrientation] = useState<Orientation>('portrait');

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