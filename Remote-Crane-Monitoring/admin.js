
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in and is an admin
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  
  if (!currentUser) {
    // Redirect to login page if not authenticated
    window.location.href = 'login.html';
    return;
  }
  
  if (currentUser.role !== 'admin') {
    // Redirect to dashboard if not an admin
    window.location.href = 'index.html';
    return;
  }
  
  // Tab switching functionality
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all tabs
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked tab
      button.classList.add('active');
      
      // Show corresponding content
      const tabId = button.getAttribute('data-tab');
      document.getElementById(`${tabId}-tab`).classList.add('active');
    });
  });
  
  // Initialize Database Performance Chart
  const dbCtx = document.getElementById('dbPerformanceChart').getContext('2d');
  const dbPerformanceChart = new Chart(dbCtx, {
    type: 'line',
    data: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
      datasets: [
        {
          label: 'Query Response Time (ms)',
          data: [42, 38, 45, 65, 50, 45, 40],
          borderColor: '#2196F3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Active Connections',
          data: [15, 12, 18, 25, 22, 20, 17],
          borderColor: '#FF9800',
          backgroundColor: 'rgba(255, 152, 0, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Value'
          }
        }
      }
    }
  });
  
  // Modal functionality
  const addUserBtn = document.getElementById('add-user-btn');
  const addUserModal = document.getElementById('add-user-modal');
  const closeModal = document.querySelector('.close-modal');
  const cancelModal = document.querySelector('.cancel-modal');
  
  addUserBtn.addEventListener('click', () => {
    addUserModal.style.display = 'block';
  });
  
  closeModal.addEventListener('click', () => {
    addUserModal.style.display = 'none';
  });
  
  cancelModal.addEventListener('click', () => {
    addUserModal.style.display = 'none';
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target === addUserModal) {
      addUserModal.style.display = 'none';
    }
  });
  
  // Add user form submission
  const addUserForm = document.getElementById('add-user-form');
  addUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const username = document.getElementById('new-username').value;
    const email = document.getElementById('new-email').value;
    const password = document.getElementById('new-password').value;
    const role = document.getElementById('new-role').value;
    const requireMfa = document.getElementById('require-mfa').checked;
    
    // Simulate adding a user (in a real app, this would be an API call)
    console.log('Adding new user:', {
      username,
      email,
      password: '********', // Don't log real passwords
      role,
      requireMfa
    });
    
    // Show success notification
    showNotification(`User ${username} created successfully`, 'success');
    
    // Close modal
    addUserModal.style.display = 'none';
    
    // Reset form
    addUserForm.reset();
  });
  
  // Table actions
  const editUserBtns = document.querySelectorAll('.edit-user');
  const lockUserBtns = document.querySelectorAll('.lock-user');
  const unlockUserBtns = document.querySelectorAll('.unlock-user');
  const deleteUserBtns = document.querySelectorAll('.delete-user');
  
  editUserBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const username = btn.closest('tr').querySelector('td:nth-child(2)').textContent;
      showNotification(`Editing user: ${username}`, 'info');
      // In a real app, this would open a modal with user details
    });
  });
  
  lockUserBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const username = btn.closest('tr').querySelector('td:nth-child(2)').textContent;
      if (confirm(`Are you sure you want to lock user ${username}?`)) {
        showNotification(`User ${username} locked`, 'warning');
      }
    });
  });
  
  unlockUserBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const username = btn.closest('tr').querySelector('td:nth-child(2)').textContent;
      showNotification(`User ${username} unlocked`, 'success');
    });
  });
  
  deleteUserBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const username = btn.closest('tr').querySelector('td:nth-child(2)').textContent;
      if (confirm(`Are you sure you want to delete user ${username}? This action cannot be undone.`)) {
        showNotification(`User ${username} deleted`, 'error');
      }
    });
  });
  
  // Save configuration
  const saveConfigBtn = document.getElementById('save-config-btn');
  saveConfigBtn.addEventListener('click', () => {
    // Collect all configuration values
    const dashboardRefresh = document.getElementById('dashboard-refresh').value;
    const craneRefresh = document.getElementById('crane-refresh').value;
    const alertRefresh = document.getElementById('alert-refresh').value;
    const tempCritical = document.getElementById('temp-critical').value;
    const tempWarning = document.getElementById('temp-warning').value;
    const autoEscalation = document.getElementById('auto-escalation').value;
    const emailNotifications = document.getElementById('email-notifications').checked;
    const requireAdminMfa = document.getElementById('require-admin-mfa').checked;
    const sessionTimeout = document.getElementById('session-timeout').value;
    const loginAttempts = document.getElementById('login-attempts').value;
    const passwordExpiry = document.getElementById('password-expiry').value;
    
    // Log configuration (in a real app, this would be saved to server)
    console.log('Saving configuration:', {
      dashboardRefresh,
      craneRefresh,
      alertRefresh,
      tempCritical,
      tempWarning,
      autoEscalation,
      emailNotifications,
      requireAdminMfa,
      sessionTimeout,
      loginAttempts,
      passwordExpiry
    });
    
    showNotification('System configuration saved successfully', 'success');
  });
  
  // Reset configuration to defaults
  const resetDefaultsBtn = document.getElementById('reset-defaults-btn');
  resetDefaultsBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all configuration to default values?')) {
      document.getElementById('dashboard-refresh').value = 15;
      document.getElementById('crane-refresh').value = 10;
      document.getElementById('alert-refresh').value = 20;
      document.getElementById('temp-critical').value = 95;
      document.getElementById('temp-warning').value = 85;
      document.getElementById('auto-escalation').value = 30;
      document.getElementById('email-notifications').checked = true;
      document.getElementById('require-admin-mfa').checked = true;
      document.getElementById('session-timeout').value = 60;
      document.getElementById('login-attempts').value = 5;
      document.getElementById('password-expiry').value = 90;
      
      showNotification('Configuration reset to defaults', 'info');
    }
  });
  
  // Export logs
  const exportLogsBtn = document.getElementById('export-logs-btn');
  exportLogsBtn.addEventListener('click', () => {
    showNotification('Logs exported to file: audit_logs_export.csv', 'success');
  });
  
  // Clear logs
  const clearLogsBtn = document.getElementById('clear-logs-btn');
  clearLogsBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      showNotification('All logs have been cleared', 'warning');
    }
  });
  
  // Refresh monitoring
  const refreshMonitoringBtn = document.querySelector('.refresh-monitoring');
  refreshMonitoringBtn.addEventListener('click', () => {
    refreshMonitoringBtn.classList.add('refreshing');
    
    setTimeout(() => {
      // Simulate updating monitoring data
      updateMonitoringData();
      refreshMonitoringBtn.classList.remove('refreshing');
      showNotification('Monitoring data refreshed', 'info');
    }, 1000);
  });
  
  // Save theme settings
  const saveThemeBtn = document.getElementById('save-theme-btn');
  saveThemeBtn.addEventListener('click', () => {
    // Get selected theme settings
    const themeMode = document.querySelector('input[name="theme-mode"]:checked').value;
    const accentColor = document.querySelector('input[name="accent-color"]:checked').value;
    const dashboardLayout = document.querySelector('input[name="dashboard-layout"]:checked').value;
    const enableAnimations = document.getElementById('enable-animations').checked;
    const highContrast = document.getElementById('high-contrast').checked;
    const fontSize = document.getElementById('font-size').value;
    const language = document.getElementById('language-select').value;
    
    // Log settings (in a real app, this would be saved to server)
    console.log('Saving theme settings:', {
      themeMode,
      accentColor,
      dashboardLayout,
      enableAnimations,
      highContrast,
      fontSize,
      language
    });
    
    showNotification('Theme settings saved successfully', 'success');
  });
  
  // Reset theme settings
  const resetThemeBtn = document.getElementById('reset-theme-btn');
  resetThemeBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset theme settings to defaults?')) {
      document.getElementById('light-mode').checked = true;
      document.getElementById('blue-theme').checked = true;
      document.getElementById('layout-2x3').checked = true;
      document.getElementById('enable-animations').checked = true;
      document.getElementById('high-contrast').checked = false;
      document.getElementById('font-size').value = 'medium';
      document.getElementById('language-select').value = 'en';
      
      showNotification('Theme settings reset to defaults', 'info');
    }
  });
  
  // Update system monitoring data
  function updateMonitoringData() {
    // Update database performance chart with random data
    dbPerformanceChart.data.datasets[0].data = generateRandomData(30, 70, 7);
    dbPerformanceChart.data.datasets[1].data = generateRandomData(10, 30, 7);
    dbPerformanceChart.update();
    
    // Update endpoint response times
    document.querySelectorAll('.endpoints-table tbody tr').forEach(row => {
      const responseTimeCell = row.querySelector('td:nth-child(3)');
      const currentTime = parseInt(responseTimeCell.textContent);
      const newTime = currentTime + (Math.floor(Math.random() * 20) - 10);
      responseTimeCell.textContent = `${Math.max(100, newTime)}ms`;
    });
  }
  
  function generateRandomData(min, max, count) {
    return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);
  }
  
  // Notification functionality
  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas ${getIconForType(type)}"></i>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
  
  function getIconForType(type) {
    switch(type) {
      case 'success': return 'fa-check-circle';
      case 'error': return 'fa-times-circle';
      case 'warning': return 'fa-exclamation-triangle';
      default: return 'fa-info-circle';
    }
  }
  
  // Add CSS for notifications
  const style = document.createElement('style');
  style.textContent = `
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 4px;
      background-color: white;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
      transform: translateX(120%);
      transition: transform 0.3s ease;
      z-index: 1000;
      max-width: 300px;
    }
    
    .notification.show {
      transform: translateX(0);
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .notification.success {
      border-left: 4px solid #4CAF50;
    }
    
    .notification.error {
      border-left: 4px solid #F44336;
    }
    
    .notification.warning {
      border-left: 4px solid #FF9800;
    }
    
    .notification.info {
      border-left: 4px solid #2196F3;
    }
    
    .notification.success i {
      color: #4CAF50;
    }
    
    .notification.error i {
      color: #F44336;
    }
    
    .notification.warning i {
      color: #FF9800;
    }
    
    .notification.info i {
      color: #2196F3;
    }
    
    .refreshing {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
});
