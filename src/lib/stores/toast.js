/**
 * Toast Notification Store
 * Manages toast notifications with auto-dismiss
 */
import { writable } from 'svelte/store';

function createToastStore() {
  const { subscribe, update } = writable([]);
  
  let idCounter = 0;
  
  return {
    subscribe,
    
    /**
     * Add a toast notification
     * @param {Object} options - Toast options
     * @param {string} options.message - Toast message
     * @param {string} options.type - Toast type (success, error, warning, info)
     * @param {number} options.duration - Duration in ms (0 for no auto-dismiss)
     */
    add(options) {
      const id = idCounter++;
      const toast = {
        id,
        message: options.message || '',
        type: options.type || 'info',
        duration: options.duration ?? 5000,
        timestamp: Date.now()
      };
      
      update(toasts => [...toasts, toast]);
      
      // Auto-dismiss if duration is set
      if (toast.duration > 0) {
        setTimeout(() => {
          this.remove(id);
        }, toast.duration);
      }
      
      return id;
    },
    
    /**
     * Remove a toast by ID
     */
    remove(id) {
      update(toasts => toasts.filter(t => t.id !== id));
    },
    
    /**
     * Clear all toasts
     */
    clear() {
      update(() => []);
    },
    
    // Convenience methods
    success(message, duration) {
      return this.add({ message, type: 'success', duration });
    },
    
    error(message, duration) {
      return this.add({ message, type: 'error', duration });
    },
    
    warning(message, duration) {
      return this.add({ message, type: 'warning', duration });
    },
    
    info(message, duration) {
      return this.add({ message, type: 'info', duration });
    }
  };
}

export const toast = createToastStore();