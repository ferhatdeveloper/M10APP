// Web polyfill for react-native-safe-area-context
import React from 'react';

export const SafeAreaView = ({ children, style, ...props }) => {
  return React.createElement('div', { style, ...props }, children);
};

export const SafeAreaProvider = ({ children }) => {
  return children;
};

export const useSafeAreaInsets = () => ({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
});

export const useSafeAreaFrame = () => ({
  x: 0,
  y: 0,
  width: window.innerWidth,
  height: window.innerHeight,
});

export default {
  SafeAreaView,
  SafeAreaProvider,
  useSafeAreaInsets,
  useSafeAreaFrame,
};
