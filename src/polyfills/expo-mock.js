// Mock for expo modules in web build
export default {}

// Core exports
export const TurboModuleRegistry = { get: () => null, getEnforcing: () => ({}) }
export const SharedObject = class {}
export const SharedRef = class {}

// Network
export const getNetworkStateAsync = async () => ({ isConnected: true, isInternetReachable: true })
export const addNetworkStateListener = () => ({ remove: () => {} })

// Module loading
export const requireNativeModule = () => ({})
export const requireOptionalNativeModule = () => null

// Expo Go
export const isRunningInExpoGo = () => false

// Errors
export class CodedError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}
export class UnavailabilityError extends CodedError {
  constructor(moduleName, propertyName) {
    super('ERR_UNAVAILABLE', `${moduleName}.${propertyName} is not available`);
  }
}

// Platform
export const Platform = {
  OS: 'web',
  select: (obj) => obj.web || obj.default,
  Version: null,
  isTV: false,
  isTesting: false
}

// PermissionStatus
export const PermissionStatus = {
  UNDETERMINED: 'undetermined',
  GRANTED: 'granted',
  DENIED: 'denied'
}

// UUID generator
export const uuid = {
  v4: () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  })
}
