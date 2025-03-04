import { MessageStats } from '@/types/messageStore';

// Constants
const MESSAGE_PACKAGE_SIZE = 10;
const STORAGE_PREFIX = 'lingobabe-messages-';

// Default stats for a new user
const DEFAULT_STATS: MessageStats = {
  messagesRemaining: 5, // Default free messages
  messagesUsed: 0,
  packagesPurchased: 0,
  lastUpdated: Date.now(),
  lastSynced: Date.now()
};

class MessageStore {
  // Get message statistics for a user
  getStats(address: string): MessageStats {
    try {
      const key = this.getStorageKey(address);
      const storedData = localStorage.getItem(key);
      
      if (storedData) {
        return JSON.parse(storedData) as MessageStats;
      }
      
      // No stored data, save and return defaults
      const defaultStats = { ...DEFAULT_STATS };
      this.saveStats(address, defaultStats);
      return defaultStats;
    } catch (error) {
      console.error('Error retrieving message stats:', error);
      return { ...DEFAULT_STATS };
    }
  }
  
  // Purchase a message package
  async purchasePackage(address: string): Promise<MessageStats> {
    const stats = this.getStats(address);
    
    const updatedStats: MessageStats = {
      ...stats,
      messagesRemaining: stats.messagesRemaining + MESSAGE_PACKAGE_SIZE,
      packagesPurchased: stats.packagesPurchased + 1,
      lastUpdated: Date.now()
    };
    
    this.saveStats(address, updatedStats);
    this.dispatchStatsUpdateEvent(updatedStats);
    
    return updatedStats;
  }
  
  // Use a message (decrement remaining count)
  async useMessage(address: string): Promise<MessageStats | null> {
    const stats = this.getStats(address);
    
    if (stats.messagesRemaining <= 0) {
      return null;
    }
    
    const updatedStats: MessageStats = {
      ...stats,
      messagesRemaining: stats.messagesRemaining - 1,
      messagesUsed: stats.messagesUsed + 1,
      lastUpdated: Date.now()
    };
    
    this.saveStats(address, updatedStats);
    this.dispatchStatsUpdateEvent(updatedStats);
    
    return updatedStats;
  }
  
  // Sync with blockchain data (placeholder implementation)
  async syncWithBlockchain(address: string): Promise<MessageStats | null> {
    // In real implementation, this would fetch data from blockchain
    const stats = this.getStats(address);
    
    const updatedStats: MessageStats = {
      ...stats,
      lastSynced: Date.now()
    };
    
    this.saveStats(address, updatedStats);
    return updatedStats;
  }
  
  // Save stats to local storage
  private saveStats(address: string, stats: MessageStats): void {
    try {
      const key = this.getStorageKey(address);
      localStorage.setItem(key, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving message stats:', error);
    }
  }
  
  // Dispatch event for stats update
  private dispatchStatsUpdateEvent(stats: MessageStats): void {
    const event = new CustomEvent('messageStatsUpdated', { 
      detail: stats
    });
    window.dispatchEvent(event);
  }
  
  // Generate storage key for a user
  private getStorageKey(address: string): string {
    return `${STORAGE_PREFIX}${address.toLowerCase()}`;
  }
}

// Singleton instance
export const messageStore = new MessageStore(); 