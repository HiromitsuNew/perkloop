import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.477cd20423f34de29d6d0d963dbdd5ee',
  appName: 'Investment App',
  webDir: 'dist',
  server: {
    url: 'https://477cd204-23f3-4de2-9d6d-0d963dbdd5ee.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1f2e',
      showSpinner: false
    }
  }
};

export default config;