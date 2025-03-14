
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
  
  // Initialize chart for failure prediction
  initializeFailurePredictionChart();
  
  // Modal functionality
  const scheduleModal = document.getElementById('schedule-modal');
  const workOrderModal = document.getElementById('work-order-modal');
  const scheduleMaintenanceBtn = document.getElementById('schedule-maintenance-btn');
  const workOrdersBtn = document.getElementById('work-orders-btn');
  const closeModalBtns = document.querySelectorAll('.close-modal');
  const cancelBtns = document.querySelectorAll('.cancel-btn');
  
  // Open modals
  scheduleMaintenanceBtn.addEventListener('click', function() {
    scheduleModal.style.display = 'block';
  });
  
  workOrdersBtn.addEventListener('click', function() {
    workOrderModal.style.display = 'block';
  });
  
  // Close modals when clicking X or Cancel
  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      scheduleModal.style.display = 'none';
      workOrderModal.style.display = 'none';
    });
  });
  
  cancelBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      scheduleModal.style.display = 'none';
      workOrderModal.style.display = 'none';
    });
  });
  
  // Close modals when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target === scheduleModal) {
      scheduleModal.style.display = 'none';
    }
    if (event.target === workOrderModal) {
      workOrderModal.style.display = 'none';
    }
  });
  
  // Add/remove parts functionality
  const addPartBtn = document.getElementById('add-part-btn');
  if (addPartBtn) {
    addPartBtn.addEventListener('click', function() {
      const partsList = document.querySelector('.parts-list');
      const newPartItem = document.createElement('div');
      newPartItem.className = 'part-item';
      newPartItem.innerHTML = `
        <input type="text" placeholder="Part name" class="part-name">
        <input type="number" placeholder="Quantity" class="part-quantity" min="1" value="1">
        <button class="remove-part-btn"><i class="fas fa-times"></i></button>
      `;
      partsList.appendChild(newPartItem);
      
      // Add event listener to the new remove button
      newPartItem.querySelector('.remove-part-btn').addEventListener('click', function() {
        this.parentElement.remove();
      });
    });
  }
  
  // Initialize remove part buttons
  document.querySelectorAll('.remove-part-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      this.parentElement.remove();
    });
  });
  
  // Save task button
  const saveTaskBtn = document.getElementById('save-task');
  if (saveTaskBtn) {
    saveTaskBtn.addEventListener('click', function() {
      const taskName = document.getElementById('task-name').value;
      const taskCrane = document.getElementById('task-crane').value;
      
      if (!taskName || !taskCrane) {
        showNotification('Please fill in all required fields', 'error');
        return;
      }
      
      showNotification('Maintenance task scheduled successfully', 'success');
      scheduleModal.style.display = 'none';
    });
  }
  
  // Complete work order button
  const completeWorkOrderBtn = document.getElementById('complete-work-order');
  if (completeWorkOrderBtn) {
    completeWorkOrderBtn.addEventListener('click', function() {
      showNotification('Work order completed successfully', 'success');
      workOrderModal.style.display = 'none';
    });
  }
  
  // Save progress button
  const saveProgressBtn = document.getElementById('save-progress');
  if (saveProgressBtn) {
    saveProgressBtn.addEventListener('click', function() {
      showNotification('Progress saved', 'success');
    });
  }
  
  // Select all checkbox functionality
  const selectAllTasks = document.getElementById('select-all-tasks');
  if (selectAllTasks) {
    selectAllTasks.addEventListener('change', function() {
      const checkboxes = document.querySelectorAll('.task-select');
      checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
      });
    });
  }
  
  // Filter functionality
  const statusFilter = document.getElementById('status-filter');
  if (statusFilter) {
    statusFilter.addEventListener('change', function() {
      filterTasks(this.value);
    });
  }
  
  // Reset filter button
  const resetFilterBtn = document.querySelector('.reset-filter-btn');
  if (resetFilterBtn) {
    resetFilterBtn.addEventListener('click', function() {
      document.getElementById('status-filter').value = 'all';
      document.getElementById('crane-filter').value = 'all';
      document.getElementById('technician-filter').value = 'all';
      document.getElementById('type-filter').value = 'all';
      document.getElementById('from-date').value = '';
      document.getElementById('to-date').value = '';
      filterTasks('all');
    });
  }
  
  // Table action buttons
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const taskId = this.closest('tr').querySelector('td:nth-child(2)').textContent;
      showWorkOrderDetails(taskId);
    });
  });
  
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const taskId = this.closest('tr').querySelector('td:nth-child(2)').textContent;
      editTask(taskId);
    });
  });
  
  document.querySelectorAll('.complete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const taskId = this.closest('tr').querySelector('td:nth-child(2)').textContent;
      completeTask(taskId);
    });
  });
  
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const taskId = this.closest('tr').querySelector('td:nth-child(2)').textContent;
      deleteTask(taskId);
    });
  });
  
  document.querySelectorAll('.schedule-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const crane = this.closest('tr').querySelector('td:nth-child(1)').textContent;
      const component = this.closest('tr').querySelector('td:nth-child(2)').textContent;
      scheduleForComponent(crane, component);
    });
  });
  
  // AI Insight action buttons
  document.querySelectorAll('.action-link').forEach(btn => {
    btn.addEventListener('click', function() {
      const action = this.textContent;
      const component = this.closest('.insight-item').querySelector('h4').textContent;
      showNotification(`Action '${action}' triggered for ${component}`, 'info');
    });
  });
  
  // Assign technician button
  const assignTechnicianBtn = document.getElementById('assign-technician-btn');
  if (assignTechnicianBtn) {
    assignTechnicianBtn.addEventListener('click', function() {
      const selectedTasks = document.querySelectorAll('.task-select:checked');
      if (selectedTasks.length === 0) {
        showNotification('Please select at least one task', 'warning');
        return;
      }
      
      showNotification(`Assign technician to ${selectedTasks.length} selected tasks`, 'info');
    });
  }
  
  // Generate report button
  const generateReportBtn = document.getElementById('generate-report-btn');
  if (generateReportBtn) {
    generateReportBtn.addEventListener('click', function() {
      showNotification('Generating maintenance report...', 'info');
      setTimeout(() => {
        showNotification('Report generated successfully', 'success');
      }, 1500);
    });
  }
  
  // Import/Export button
  const importExportBtn = document.getElementById('import-export-btn');
  if (importExportBtn) {
    importExportBtn.addEventListener('click', function() {
      showNotification('Import/Export functionality will be implemented', 'info');
    });
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
});

// Filter tasks based on status
function filterTasks(status) {
  const rows = document.querySelectorAll('.maintenance-table tbody tr');
  
  rows.forEach(row => {
    if (status === 'all') {
      row.style.display = '';
    } else {
      const rowStatus = row.querySelector('.status-badge').textContent.toLowerCase();
      if (rowStatus === status) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    }
  });
}

// Show work order details
function showWorkOrderDetails(taskId) {
  document.getElementById('work-order-modal').style.display = 'block';
  showNotification(`Viewing details for task ${taskId}`, 'info');
}

// Edit task
function editTask(taskId) {
  document.getElementById('schedule-modal').style.display = 'block';
  showNotification(`Editing task ${taskId}`, 'info');
}

// Complete task
function completeTask(taskId) {
  if (confirm(`Mark task ${taskId} as complete?`)) {
    showNotification(`Task ${taskId} marked as complete`, 'success');
  }
}

// Delete task
function deleteTask(taskId) {
  if (confirm(`Are you sure you want to delete task ${taskId}?`)) {
    showNotification(`Task ${taskId} deleted`, 'success');
  }
}

// Schedule maintenance for component
function scheduleForComponent(crane, component) {
  document.getElementById('schedule-modal').style.display = 'block';
  
  // Pre-fill form
  document.getElementById('task-name').value = `${component} Maintenance`;
  document.getElementById('task-crane').value = crane;
  document.getElementById('task-type').value = 'repair';
  document.getElementById('task-description').value = `Preventive maintenance for ${component} based on AI prediction.`;
  
  showNotification(`Scheduling maintenance for ${component} on ${crane}`, 'info');
}

// Initialize failure prediction chart
function initializeFailurePredictionChart() {
  const ctx = document.getElementById('failurePredictionChart').getContext('2d');
  
  const failurePredictionChart = new Chart(ctx, {
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
