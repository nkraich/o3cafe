Notifications = {
  showSuccess: function(message) {
    FlashMessages.clear();
    FlashMessages.sendSuccess(message);
  },

  showError: function(message) {
    FlashMessages.clear();
    FlashMessages.sendError(message);
  },

  clear: function() {
    FlashMessages.clear();
  }
};
