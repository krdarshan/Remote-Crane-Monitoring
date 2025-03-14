
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  
  if (!currentUser) {
    // Redirect to login page if not authenticated
    window.location.href = 'login.html';
    return;
  }
  
  // Update UI based on user role
  setTimeout(() => {
    document.querySelector('.user-name').textContent = currentUser.username;
    document.querySelector('.user-role').textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
  }, 100);
  
  // Modal Functionality
  const modals = document.querySelectorAll('.modal');
  const modalCloseButtons = document.querySelectorAll('.close-modal, .close-btn');
  
  // Open Modal Functions
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.getElementById('crane-details-modal').style.display = 'block';
    });
  });
  
  document.getElementById('import-export-btn').addEventListener('click', function() {
    document.getElementById('import-export-modal').style.display = 'block';
  });
  
  // Close Modal Functions
  modalCloseButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      modals.forEach(modal => {
        modal.style.display = 'none';
      });
    });
  });
  
  window.addEventListener('click', function(event) {
    modals.forEach(modal => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  });
  
  // Tab Functionality
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabContainer = this.closest('.tabs').parentElement;
      const tabName = this.getAttribute('data-tab');
      
      // Deactivate all tabs
      tabContainer.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      tabContainer.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      // Activate selected tab
      this.classList.add('active');
      tabContainer.querySelector(`#tab-${tabName}`).classList.add('active');
      
      // Update import/export button text based on active tab
      if (tabContainer.closest('#import-export-modal')) {
        const actionBtn = document.getElementById('import-export-action');
        actionBtn.textContent = tabName === 'import' ? 'Import Data' : 'Export Data';
      }
    });
  });
  
  // Filter Functionality
  const filterInputs = document.querySelectorAll('.filter-section select');
  
  filterInputs.forEach(input => {
    input.addEventListener('change', function() {
      filterCranes();
    });
  });
  
  document.querySelector('.reset-filter-btn').addEventListener('click', function() {
    filterInputs.forEach(input => {
      input.value = 'all';
    });
    filterCranes();
  });
  
  function filterCranes() {
    const statusFilter = document.getElementById('status-filter').value;
    const siteFilter = document.getElementById('site-filter').value;
    const maintenanceFilter = document.getElementById('maintenance-filter').value;
    const utilizationFilter = document.getElementById('utilization-filter').value;
    
    const craneRows = document.querySelectorAll('.cranes-table tbody tr');
    
    craneRows.forEach(row => {
      let showRow = true;
      
      // Status filtering
      if (statusFilter !== 'all') {
        const rowStatus = row.className.includes(statusFilter);
        showRow = showRow && rowStatus;
      }
      
      // Site filtering (simplified for demo)
      if (siteFilter !== 'all') {
        const siteCell = row.querySelector('td:nth-child(3)').textContent;
        showRow = showRow && siteCell.toLowerCase().includes(siteFilter.replace('site-', '').toLowerCase());
      }
      
      // We'd implement other filters in a real app
      
      row.style.display = showRow ? '' : 'none';
    });
  }
  
  // Bulk Selection
  const selectAllCheckbox = document.getElementById('select-all-cranes');
  const craneCheckboxes = document.querySelectorAll('.crane-select');
  
  selectAllCheckbox.addEventListener('change', function() {
    craneCheckboxes.forEach(checkbox => {
      checkbox.checked = this.checked;
    });
  });
  
  craneCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const allChecked = [...craneCheckboxes].every(cb => cb.checked);
      const someChecked = [...craneCheckboxes].some(cb => cb.checked);
      
      selectAllCheckbox.checked = allChecked;
      selectAllCheckbox.indeterminate = someChecked && !allChecked;
    });
  });
  
  // Performance Chart
  if (document.getElementById('cranePerformanceChart')) {
    const ctx = document.getElementById('cranePerformanceChart').getContext('2d');
    
    const performanceChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [{
          label: 'Utilization Rate (%)',
          data: [45, 59, 80, 81, 56, 55, 72, 68],
          fill: false,
          borderColor: '#4CAF50',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
    
    // Change chart data based on metric selection
    document.getElementById('performance-metric').addEventListener('change', function() {
      const metric = this.value;
      let data, label, color;
      
      switch(metric) {
        case 'utilization':
          data = [45, 59, 80, 81, 56, 55, 72, 68];
          label = 'Utilization Rate (%)';
          color = '#4CAF50';
          break;
        case 'load':
          data = [5600, 7200, 8500, 9800, 7400, 6900, 8100, 8700];
          label = 'Load (kg)';
          color = '#FF9800';
          break;
        case 'temperature':
          data = [65, 68, 72, 78, 82, 80, 75, 72];
          label = 'Temperature (°C)';
          color = '#F44336';
          break;
        case 'vibration':
          data = [15, 17, 16, 19, 22, 25, 18, 16];
          label = 'Vibration (mm/s²)';
          color = '#2196F3';
          break;
      }
      
      performanceChart.data.datasets[0].data = data;
      performanceChart.data.datasets[0].label = label;
      performanceChart.data.datasets[0].borderColor = color;
      performanceChart.update();
    });
  }
  
  // Import functionality
  const uploadArea = document.querySelector('.upload-area');
  const fileInput = document.getElementById('file-upload');
  
  if (uploadArea && fileInput) {
    uploadArea.addEventListener('click', function() {
      fileInput.click();
    });
    
    uploadArea.addEventListener('dragover', function(e) {
      e.preventDefault();
      this.style.borderColor = '#1a73e8';
    });
    
    uploadArea.addEventListener('dragleave', function() {
      this.style.borderColor = '';
    });
    
    uploadArea.addEventListener('drop', function(e) {
      e.preventDefault();
      this.style.borderColor = '';
      
      if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        handleFileUpload(e.dataTransfer.files[0]);
      }
    });
    
    fileInput.addEventListener('change', function() {
      if (this.files.length) {
        handleFileUpload(this.files[0]);
      }
    });
    
    function handleFileUpload(file) {
      // In a real app, this would process the file
      // For demo purposes, we'll just show a notification
      showNotification(`File "${file.name}" selected for import`, 'success');
    }
  }
  
  // QR Code buttons
  document.querySelectorAll('.qr-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent triggering row click
      
      const craneId = this.closest('.crane-id').querySelector('span').textContent;
      // In a real app, this would generate or show a QR code
      showNotification(`QR Code for ${craneId} generated`, 'info');
    });
  });
  
  // Add date pickers defaults
  const dateInputs = document.querySelectorAll('input[type="date"]');
  if (dateInputs.length) {
    const today = new Date().toISOString().split('T')[0];
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const sixMonthsAgoStr = sixMonthsAgo.toISOString().split('T')[0];
    
    dateInputs.forEach(input => {
      if (input.id.includes('from')) {
        input.value = sixMonthsAgoStr;
      } else if (input.id.includes('to')) {
        input.value = today;
      }
    });
  }
  
  // Table row actions
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const craneId = this.closest('tr').querySelector('.crane-id span').textContent;
      showNotification(`Edit mode for ${craneId}`, 'info');
    });
  });
  
  document.querySelectorAll('.history-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const craneId = this.closest('tr').querySelector('.crane-id span').textContent;
      showNotification(`Viewing history for ${craneId}`, 'info');
    });
  });
  
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const craneId = this.closest('tr').querySelector('.crane-id span').textContent;
      if (confirm(`Are you sure you want to delete crane ${craneId}?`)) {
        showNotification(`Crane ${craneId} deleted`, 'success');
      }
    });
  });
  
  // Add Crane button
  document.getElementById('add-crane-btn').addEventListener('click', function() {
    showNotification('Add Crane functionality will be implemented', 'info');
  });
  
  // Batch Update button
  document.getElementById('batch-update-btn').addEventListener('click', function() {
    const selectedCount = [...document.querySelectorAll('.crane-select:checked')].length;
    
    if (selectedCount === 0) {
      showNotification('Please select at least one crane to update', 'warning');
    } else {
      showNotification(`Batch update for ${selectedCount} cranes`, 'info');
    }
  });
  
  // Generate QR Codes button
  document.getElementById('generate-qr-btn').addEventListener('click', function() {
    const selectedCount = [...document.querySelectorAll('.crane-select:checked')].length;
    
    if (selectedCount === 0) {
      showNotification('Please select cranes to generate QR codes', 'warning');
    } else {
      showNotification(`Generating QR codes for ${selectedCount} cranes`, 'success');
    }
  });
  
  // Notification function
  function showNotification(message, type = 'info') {
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
  
  // Logout button click
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      // Clear user session
      sessionStorage.removeItem('currentUser');
      
      // Redirect to login page
      window.location.href = 'login.html';
    });
  }
  
  // Add CSS for notifications if not already present
  if (!document.querySelector('style#notification-style')) {
    const style = document.createElement('style');
    style.id = 'notification-style';
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
    `;
    document.head.appendChild(style);
  }
});
