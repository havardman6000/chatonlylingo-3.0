// Custom type declarations
declare global {
  interface Window {
    tokenManager?: {
      initialized: boolean;
      purchaseMessagePackage: () => Promise<void>;
      [key: string]: any;
    };
  }
}

export {}; 