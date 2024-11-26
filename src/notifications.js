document.addEventListener('DOMContentLoaded', () => {
    const clearBtn = document.getElementById('clearNotifications');
    const notificationList = document.getElementById('notifications');
  
    // Mark notification as read
    notificationList.addEventListener('click', (e) => {
      if (e.target.classList.contains('mark-read')) {
        const notificationId = e.target.getAttribute('data-id');
        fetch(`/mark-read/${notificationId}`, { method: 'POST' })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              e.target.closest('.notification').classList.remove('notification-priority');
              e.target.closest('.notification').classList.add('notification-read');
              e.target.remove();
            }
          })
          .catch(err => console.error('Error marking notification as read:', err));
      }
    });
  
    // Clear all notifications
    clearBtn.addEventListener('click', () => {
      fetch('/clear-notifications', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            notificationList.innerHTML = '<p>No notifications at the moment.</p>';
          }
        })
        .catch(err => console.error('Error clearing notifications:', err));
    });
  });
  