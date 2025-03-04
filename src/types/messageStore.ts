/**
 * Type definitions for message tracking functionality
 */

export interface MessageStats {
  messagesRemaining: number;
  messagesUsed: number;
  packagesPurchased: number;
  lastUpdated?: number;
  lastSynced?: number;
} 