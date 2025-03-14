
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
  
  // Initialize charts
  initializeCharts();
  
  // Drag and drop functionality for report builder
  initializeDragAndDrop();
  
  // Modal functionality
  const scheduleModal = document.getElementById('schedule-modal');
  const addScheduleBtn = document.getElementById('add-schedule');
  const closeModalBtn = document.querySelector('.close-modal');
  const cancelBtn = document.querySelector('.cancel-btn');
  
  // Open modal
  addScheduleBtn.addEventListener('click', function() {
    scheduleModal.style.display = 'block';
  });
  
  // Close modal buttons
  [closeModalBtn, cancelBtn].forEach(btn => {
    btn.addEventListener('click', function() {
      scheduleModal.style.display = 'none';
    });
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target === scheduleModal) {
      scheduleModal.style.display = 'none';
    }
  });
  
  // Show/hide frequency details based on selection
  const frequencySelect = document.getElementById('schedule-frequency');
  const weeklyDetails = document.getElementById('weekly-details');
  const monthlyDetails = document.getElementById('monthly-details');
  
  frequencySelect.addEventListener('change', function() {
    // Hide all details first
    weeklyDetails.style.display = 'none';
    monthlyDetails.style.display = 'none';
    
    // Show the appropriate details section
    if (this.value === 'weekly') {
      weeklyDetails.style.display = 'block';
    } else if (this.value === 'monthly') {
      monthlyDetails.style.display = 'block';
    }
  });
  
  // Trigger initial display
  frequencySelect.dispatchEvent(new Event('change'));
  
  // Save schedule button
  document.getElementById('save-schedule').addEventListener('click', function() {
    const scheduleName = document.getElementById('schedule-name').value;
    
    if (!scheduleName) {
      showNotification('Please enter a report name', 'warning');
      return;
    }
    
    // In a real app, this would submit to the server
    showNotification('Schedule saved successfully', 'success');
    scheduleModal.style.display = 'none';
  });
  
  // Create Report button
  document.getElementById('create-report-btn').addEventListener('click', function() {
    // Scroll to the report builder section
    document.getElementById('custom-report').scrollIntoView({ behavior: 'smooth' });
  });
  
  // Schedule Report button
  document.getElementById('schedule-report-btn').addEventListener('click', function() {
    scheduleModal.style.display = 'block';
  });
  
  // Export Report button
  document.getElementById('export-report-btn').addEventListener('click', function() {
    showNotification('Export functionality will be implemented', 'info');
  });
  
  // Print Report button
  document.getElementById('print-report-btn').addEventListener('click', function() {
    showNotification('Print functionality will be implemented', 'info');
  });
  
  // Report builder actions
  document.getElementById('generate-report').addEventListener('click', function() {
    showNotification('Generating report...', 'info');
    setTimeout(() => {
      showNotification('Report generated successfully', 'success');
    }, 1500);
  });
  
  document.getElementById('preview-report').addEventListener('click', function() {
    showNotification('Preview functionality will be implemented', 'info');
  });
  
  document.getElementById('clear-builder').addEventListener('click', function() {
    if (confirm('Are you sure you want to clear the report builder?')) {
      // In a real app, this would clear all components
      showNotification('Report builder cleared', 'info');
    }
  });
  
  // Add component editing functionality
  document.querySelectorAll('.edit-component').forEach(btn => {
    btn.addEventListener('click', function() {
      const component = this.closest('.report-component');
      const componentType = component.getAttribute('data-component');
      showNotification(`Editing ${componentType} component`, 'info');
    });
  });
  
  // Remove component functionality
  document.querySelectorAll('.remove-component').forEach(btn => {
    btn.addEventListener('click', function() {
      const component = this.closest('.report-component');
      component.remove();
      showNotification('Component removed', 'info');
    });
  });
  
  // Scheduled reports table actions
  document.querySelectorAll('.table-actions .edit-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const reportName = this.closest('tr').querySelector('td:first-child').textContent;
      showNotification(`Editing schedule: ${reportName}`, 'info');
    });
  });
  
  document.querySelectorAll('.table-actions .pause-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const reportName = this.closest('tr').querySelector('td:first-child').textContent;
      showNotification(`Paused schedule: ${reportName}`, 'info');
      
      // Update the status badge
      const statusBadge = this.closest('tr').querySelector('.status-badge');
      statusBadge.textContent = 'Paused';
      statusBadge.className = 'status-badge paused';
      
      // Replace pause button with resume button
      this.innerHTML = '<i class="fas fa-play"></i>';
      this.className = 'resume-btn';
    });
  });
  
  document.querySelectorAll('.table-actions .resume-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const reportName = this.closest('tr').querySelector('td:first-child').textContent;
      showNotification(`Resumed schedule: ${reportName}`, 'success');
      
      // Update the status badge
      const statusBadge = this.closest('tr').querySelector('.status-badge');
      statusBadge.textContent = 'Active';
      statusBadge.className = 'status-badge active';
      
      // Replace resume button with pause button
      this.innerHTML = '<i class="fas fa-pause"></i>';
      this.className = 'pause-btn';
    });
  });
  
  document.querySelectorAll('.table-actions .delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const reportName = this.closest('tr').querySelector('td:first-child').textContent;
      
      if (confirm(`Are you sure you want to delete the schedule "${reportName}"?`)) {
        this.closest('tr').remove();
        showNotification(`Deleted schedule: ${reportName}`, 'success');
      }
    });
  });
  
  // Comparison controls
  document.getElementById('add-crane-comparison').addEventListener('click', function() {
    showNotification('Added crane to comparison', 'info');
  });
  
  // Insight action buttons
  document.querySelectorAll('.action-link').forEach(btn => {
    btn.addEventListener('click', function() {
      const action = this.textContent;
      showNotification(`Action: ${action}`, 'info');
    });
  });
  
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
});

// Initialize charts using Chart.js
function initializeCharts() {
  // Failure Prediction Chart
  const failurePredictionCtx = document.getElementById('failurePredictionChart').getContext('2d');
  const failurePredictionChart = new Chart(failurePredictionCtx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      datasets: [
        {
          label: 'Actual Failures',
          data: [2, 1, 3, 1, 2, 2, 1, 3, 2],
          borderColor: '#F44336',
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Predicted Failures',
          data: [null, null, null, null, null, null, null, null, 2, 4, 3, 2],
          borderColor: '#FF9800',
          borderDash: [5, 5],
          tension: 0.4,
          fill: false
        },
        {
          label: 'Maintenance Events',
          data: [4, 5, 3, 6, 4, 3, 5, 4, 6],
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Failure Prediction vs. Actual Events',
          padding: {
            top: 10,
            bottom: 20
          }
        },
        legend: {
          position: 'top'
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Month'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Event Count'
          },
          min: 0,
          suggestedMax: 10,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
  
  // Comparison Chart
  const comparisonCtx = document.getElementById('comparisonChart').getContext('2d');
  const comparisonChart = new Chart(comparisonCtx, {
    type: 'bar',
    data: {
      labels: ['Uptime (%)', 'Maintenance Frequency', 'Load Capacity (tons)'],
      datasets: [
        {
          label: 'Crane C-002',
          data: [92, 6, 12],
          backgroundColor: 'rgba(33, 150, 243, 0.7)',
          borderColor: 'rgba(33, 150, 243, 1)',
          borderWidth: 1
        },
        {
          label: 'Crane C-003',
          data: [78, 11, 12],
          backgroundColor: 'rgba(156, 39, 176, 0.7)',
          borderColor: 'rgba(156, 39, 176, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Crane Performance Comparison',
          padding: {
            top: 10,
            bottom: 20
          }
        },
        legend: {
          position: 'top'
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
  
  // Listen for comparison data changes
  document.querySelectorAll('#crane-select-1, #crane-select-2, .metric-checkbox').forEach(el => {
    el.addEventListener('change', updateComparisonChart);
  });
  
  document.querySelectorAll('#comparison-start-date, #comparison-end-date').forEach(el => {
    el.addEventListener('change', updateComparisonChart);
  });
  
  function updateComparisonChart() {
    // In a real app, this would fetch new data from the API
    // For this demo, we'll just simulate a data change
    
    // Get selected cranes
    const crane1 = document.getElementById('crane-select-1').value;
    const crane2 = document.getElementById('crane-select-2').value;
    
    // Get selected metrics
    const selectedMetrics = [];
    document.querySelectorAll('.metric-checkbox input:checked').forEach(checkbox => {
      selectedMetrics.push(checkbox.value);
    });
    
    // Update chart labels and data
    comparisonChart.data.labels = selectedMetrics.map(metric => {
      switch(metric) {
        case 'uptime': return 'Uptime (%)';
        case 'maintenance': return 'Maintenance Frequency';
        case 'load': return 'Load Capacity (tons)';
        case 'temperature': return 'Avg Temperature (°C)';
        case 'vibration': return 'Vibration (mm/s²)';
        default: return metric;
      }
    });
    
    // Randomize some data for demonstration purposes
    comparisonChart.data.datasets[0].label = crane1;
    comparisonChart.data.datasets[1].label = crane2;
    
    // Generate sample data for selected metrics
    const data1 = [];
    const data2 = [];
    
    selectedMetrics.forEach(metric => {
      switch(metric) {
        case 'uptime':
          data1.push(Math.floor(85 + Math.random() * 10));
          data2.push(Math.floor(75 + Math.random() * 15));
          break;
        case 'maintenance':
          data1.push(Math.floor(4 + Math.random() * 4));
          data2.push(Math.floor(8 + Math.random() * 5));
          break;
        case 'load':
          data1.push(Math.floor(10 + Math.random() * 5));
          data2.push(Math.floor(10 + Math.random() * 5));
          break;
        case 'temperature':
          data1.push(Math.floor(65 + Math.random() * 10));
          data2.push(Math.floor(70 + Math.random() * 15));
          break;
        case 'vibration':
          data1.push(Math.floor(15 + Math.random() * 5));
          data2.push(Math.floor(20 + Math.random() * 8));
          break;
      }
    });
    
    comparisonChart.data.datasets[0].data = data1;
    comparisonChart.data.datasets[1].data = data2;
    comparisonChart.update();
    
    // Update comparison summary
    updateComparisonSummary(selectedMetrics, data1, data2);
  }
  
  // Update comparison summary
  function updateComparisonSummary(metrics, data1, data2) {
    const summaryContainer = document.querySelector('.summary-grid');
    summaryContainer.innerHTML = '';
    
    metrics.forEach((metric, index) => {
      const diff = data1[index] - data2[index];
      const percentDiff = Math.abs(Math.round((diff / data2[index]) * 100));
      
      let metricName, metricSign, statusClass, detailText;
      
      switch(metric) {
        case 'uptime':
          metricName = 'Uptime Difference';
          metricSign = diff > 0 ? '+' : '';
          statusClass = diff > 0 ? 'positive' : 'negative';
          detailText = `${document.getElementById('crane-select-1').value} has ${diff > 0 ? 'higher' : 'lower'} uptime than ${document.getElementById('crane-select-2').value}`;
          break;
        case 'maintenance':
          metricName = 'Maintenance Difference';
          metricSign = diff < 0 ? '-' : '+';
          statusClass = diff < 0 ? 'positive' : 'negative';
          detailText = `${diff > 0 ? document.getElementById('crane-select-1').value : document.getElementById('crane-select-2').value} requires more maintenance`;
          break;
        case 'load':
          metricName = 'Load Capacity';
          metricSign = diff >= 0 ? '+' : '';
          statusClass = diff >= 0 ? 'positive' : 'negative';
          detailText = `${diff !== 0 ? (diff > 0 ? document.getElementById('crane-select-1').value : document.getElementById('crane-select-2').value) + ' has higher capacity' : 'Equal capacity'}`;
          break;
        case 'temperature':
          metricName = 'Temperature Difference';
          metricSign = diff < 0 ? '-' : '+';
          statusClass = diff < 0 ? 'positive' : 'negative';
          detailText = `${diff > 0 ? document.getElementById('crane-select-1').value : document.getElementById('crane-select-2').value} runs at higher temperature`;
          break;
        case 'vibration':
          metricName = 'Vibration Difference';
          metricSign = diff < 0 ? '-' : '+';
          statusClass = diff < 0 ? 'positive' : 'negative';
          detailText = `${diff > 0 ? document.getElementById('crane-select-1').value : document.getElementById('crane-select-2').value} has higher vibration`;
          break;
      }
      
      // Create summary card
      const card = document.createElement('div');
      card.className = 'summary-card';
      
      card.innerHTML = `
        <h4>${metricName}</h4>
        <p class="summary-value ${statusClass}">${metricSign}${Math.abs(diff)}${metric === 'uptime' ? '%' : metric === 'maintenance' ? ' events' : ''}</p>
        <p class="summary-detail">${detailText}</p>
      `;
      
      summaryContainer.appendChild(card);
    });
  }
}

// Initialize drag and drop for report builder
function initializeDragAndDrop() {
  const componentItems = document.querySelectorAll('.component-item');
  const canvasDropzone = document.querySelector('.canvas-dropzone');
  
  componentItems.forEach(item => {
    item.addEventListener('dragstart', function(e) {
      e.dataTransfer.setData('text/plain', this.getAttribute('data-component'));
      this.classList.add('dragging');
    });
    
    item.addEventListener('dragend', function() {
      this.classList.remove('dragging');
    });
  });
  
  canvasDropzone.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.classList.add('drag-over');
  });
  
  canvasDropzone.addEventListener('dragleave', function() {
    this.classList.remove('drag-over');
  });
  
  canvasDropzone.addEventListener('drop', function(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    const componentType = e.dataTransfer.getData('text/plain');
    showNotification(`Component of type "${componentType}" would be added here`, 'info');
    
    // In a real implementation, this would create a new component
    // For this demo, we'll just show a notification
  });
}

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
