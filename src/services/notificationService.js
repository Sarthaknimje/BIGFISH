class NotificationService {
  constructor() {
    this.subscribers = new Map();
    this.telegramSubscribers = new Set(); // Track Telegram-subscribed wallets
    this.telegramService = null;
  }

  setTelegramService(service) {
    this.telegramService = service;
  }

  subscribe(walletAddress, callback) {
    if (!this.subscribers.has(walletAddress)) {
      this.subscribers.set(walletAddress, new Set());
    }
    this.subscribers.get(walletAddress).add(callback);
  }

  unsubscribe(walletAddress, callback) {
    if (this.subscribers.has(walletAddress)) {
      this.subscribers.get(walletAddress).delete(callback);
    }
  }

  subscribeTelegram(walletAddress) {
    this.telegramSubscribers.add(walletAddress);
  }

  unsubscribeTelegram(walletAddress) {
    this.telegramSubscribers.delete(walletAddress);
  }

  async notify(walletAddress, transaction) {
    // Only send Telegram notifications for subscribed wallets
    if (this.telegramService && this.telegramSubscribers.has(walletAddress) && transaction) {
      try {
        const volume = transaction.volume || transaction.buy_volume || transaction.sell_volume || 0;
        if (volume > 0) {
          await this.telegramService.sendWhaleAlert(
            walletAddress,
            volume,
            transaction.nft_bought || 0,
            transaction.nft_sold || 0
          );
        }
      } catch (error) {
        console.error('Failed to send Telegram notification:', error);
      }
    }

    // Existing notification logic
    if (this.subscribers.has(walletAddress)) {
      this.subscribers.get(walletAddress).forEach(callback => {
        callback({
          walletAddress,
          transaction,
          timestamp: new Date().toISOString()
        });
      });
    }
  }
}

const notificationService = new NotificationService();
export default notificationService; 