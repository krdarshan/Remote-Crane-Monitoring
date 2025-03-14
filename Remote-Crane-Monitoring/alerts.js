
// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  // Update user information
  document.querySelector('.user-name').textContent = currentUser.username;
  document.querySelector('.user-role').textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);

  // Initialize alerts functionality
  initializeAlerts();
});

function initializeAlerts() {
  // Filter functionality
  const filterInputs = document.querySelectorAll('.filter-section select, .filter-section input');
  filterInputs.forEach(input => {
    input.addEventListener('change', filterAlerts);
  });
  
  // Reset filters button
  const resetBtn = document.querySelector('.reset-filter-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetFilters);
  }
  
  // Table sorting
  const sortHeaders = document.querySelectorAll('.alerts-table th i');
  sortHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const column = this.parentElement.textContent.trim();
      sortTable(column);
    });
  });
  
  // Alert selection - select all checkbox
  const selectAllCheckbox = document.getElementById('select-all-alerts');
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', function() {
      const checkboxes = document.querySelectorAll('.alert-select');
      checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
      });
    });
  }
  
  // Action buttons
  const actionButtons = document.querySelectorAll('.table-action-btn');
  actionButtons.forEach(button => {
    button.addEventListener('click', handleAlertAction);
  });
  
  // Acknowledge all button
  const acknowledgeAllBtn = document.getElementById('acknowledge-all-btn');
  if (acknowledgeAllBtn) {
    acknowledgeAllBtn.addEventListener('click', acknowledgeAllAlerts);
  }
  
  // Export alerts button
  const exportAlertsBtn = document.getElementById('export-alerts-btn');
  if (exportAlertsBtn) {
    exportAlertsBtn.addEventListener('click', exportAlerts);
  }
  
  // Modal functionality
  const detailsButtons = document.querySelectorAll('.details-btn');
  detailsButtons.forEach(button => {
    button.addEventListener('click', openAlertDetailsModal);
  });
  
  const closeModalBtn = document.querySelector('.close-modal');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeAlertDetailsModal);
  }
  
  // Modal save buttons
  const saveResponseBtn = document.querySelector('.modal-footer .primary-btn');
  if (saveResponseBtn) {
    saveResponseBtn.addEventListener('click', saveAlertResponse);
  }
  
  // Initialize alert data chart
  initializeAlertChart();
  
  // Auto-refresh alerts every 60 seconds
  setInterval(refreshAlerts, 60000);
}

// Filter alerts based on filter inputs
function filterAlerts() {
  const alertType = document.getElementById('alert-type-filter').value;
  const severity = document.getElementById('severity-filter').value;
  const status = document.getElementById('status-filter').value;
  const crane = document.getElementById('crane-filter').value;
  const fromDate = document.getElementById('alert-from-date').value;
  const toDate = document.getElementById('alert-to-date').value;
  
  const alertRows = document.querySelectorAll('.alert-row');
  
  alertRows.forEach(row => {
    const rowType = row.querySelector('td:nth-child(5)').textContent.toLowerCase();
    const rowSeverity = row.querySelector('.severity-badge').classList[1];
    const rowStatus = row.querySelector('.status-badge').classList[1];
    const rowCrane = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
    const rowDateStr = row.querySelector('.alert-time .date').textContent;
    
    // Convert date string to comparable format
    let rowDate = new Date();
    if (rowDateStr === 'Today') {
      rowDate = new Date();
    } else if (rowDateStr === 'Yesterday') {
      rowDate = new Date();
      rowDate.setDate(rowDate.getDate() - 1);
    } else {
      const parts = rowDateStr.split(' ');
      rowDate = new Date(`2023 ${parts[0]} ${parts[1]}`);
    }
    
    // Check if row matches all filters
    const matchesType = alertType === 'all' || rowType.includes(alertType.toLowerCase());
    const matchesSeverity = severity === 'all' || rowSeverity === severity;
    const matchesStatus = status === 'all' || rowStatus === status;
    const matchesCrane = crane === 'all' || rowCrane.includes(crane.toLowerCase());
    
    let matchesDate = true;
    if (fromDate) {
      const from = new Date(fromDate);
      matchesDate = rowDate >= from;
    }
    if (toDate && matchesDate) {
      const to = new Date(toDate);
      to.setDate(to.getDate() + 1); // Include the end date
      matchesDate = rowDate <= to;
    }
    
    // Show/hide row based on filter matches
    if (matchesType && matchesSeverity && matchesStatus && matchesCrane && matchesDate) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
  
  // Update counts after filtering
  updateFilteredCounts();
}

// Reset all filters
function resetFilters() {
  const filterInputs = document.querySelectorAll('.filter-section select, .filter-section input');
  filterInputs.forEach(input => {
    if (input.tagName === 'SELECT') {
      input.value = 'all';
    } else if (input.type === 'date') {
      input.value = '';
    }
  });
  
  // Show all rows
  const alertRows = document.querySelectorAll('.alert-row');
  alertRows.forEach(row => {
    row.style.display = '';
  });
  
  // Reset counts
  updateFilteredCounts();
}

// Update the counts displayed in the summary cards after filtering
function updateFilteredCounts() {
  const visibleRows = Array.from(document.querySelectorAll('.alert-row')).filter(row => 
    row.style.display !== 'none'
  );
  
  const criticalCount = visibleRows.filter(row => row.classList.contains('critical')).length;
  const warningCount = visibleRows.filter(row => row.classList.contains('warning')).length;
  const maintenanceCount = visibleRows.filter(row => row.classList.contains('maintenance')).length;
  const infoCount = visibleRows.filter(row => row.classList.contains('info')).length;
  
  document.querySelector('.alert-card.critical .alert-count').textContent = criticalCount;
  document.querySelector('.alert-card.warning .alert-count').textContent = warningCount;
  document.querySelector('.alert-card.maintenance .alert-count').textContent = maintenanceCount;
  document.querySelector('.alert-card.info .alert-count').textContent = infoCount;
}

// Sort table by column
function sortTable(column) {
  const table = document.querySelector('.alerts-table');
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  
  // Determine column index and sort type
  let columnIndex, sortType;
  switch(column.trim()) {
    case 'ID':
      columnIndex = 1;
      sortType = 'string';
      break;
    case 'Time':
      columnIndex = 2;
      sortType = 'date';
      break;
    case 'Crane':
      columnIndex = 3;
      sortType = 'string';
      break;
    case 'Type':
      columnIndex = 4;
      sortType = 'string';
      break;
    case 'Severity':
      columnIndex = 5;
      sortType = 'severity';
      break;
    case 'Status':
      columnIndex = 7;
      sortType = 'status';
      break;
    default:
      return;
  }
  
  // Toggle sort direction
  const sortIcon = document.querySelector(`th:nth-child(${columnIndex + 1}) i`);
  const isAscending = sortIcon.classList.contains('fa-sort') || sortIcon.classList.contains('fa-sort-down');
  
  // Update all icons to neutral sort
  document.querySelectorAll('.alerts-table th i').forEach(icon => {
    icon.className = 'fas fa-sort';
  });
  
  // Update current icon to show sort direction
  sortIcon.className = isAscending ? 'fas fa-sort-up' : 'fas fa-sort-down';
  
  // Sort the rows
  rows.sort((a, b) => {
    let valueA, valueB;
    
    if (sortType === 'severity') {
      const severities = {'critical': 3, 'warning': 2, 'maintenance': 1, 'info': 0};
      valueA = severities[a.querySelector('.severity-badge').classList[1]];
      valueB = severities[b.querySelector('.severity-badge').classList[1]];
    } else if (sortType === 'status') {
      const statuses = {'new': 3, 'in-progress': 2, 'acknowledged': 1, 'resolved': 0};
      valueA = statuses[a.querySelector('.status-badge').classList[1]];
      valueB = statuses[b.querySelector('.status-badge').classList[1]];
    } else if (sortType === 'date') {
      // Get time and date
      const timeA = a.querySelector('.alert-time .time').textContent;
      const dateA = a.querySelector('.alert-time .date').textContent;
      const timeB = b.querySelector('.alert-time .time').textContent;
      const dateB = b.querySelector('.alert-time .date').textContent;
      
      // Convert to comparable values
      valueA = convertTimeStringToDate(timeA, dateA);
      valueB = convertTimeStringToDate(timeB, dateB);
    } else {
      valueA = a.querySelector(`td:nth-child(${columnIndex + 1})`).textContent.trim().toLowerCase();
      valueB = b.querySelector(`td:nth-child(${columnIndex + 1})`).textContent.trim().toLowerCase();
    }
    
    if (valueA < valueB) return isAscending ? -1 : 1;
    if (valueA > valueB) return isAscending ? 1 : -1;
    return 0;
  });
  
  // Rearrange rows in the table
  rows.forEach(row => tbody.appendChild(row));
}

// Convert time and date strings to comparable Date objects
function convertTimeStringToDate(time, date) {
  const now = new Date();
  
  if (date === 'Today') {
    return new Date(`${now.toDateString()} ${time}`);
  } else if (date === 'Yesterday') {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return new Date(`${yesterday.toDateString()} ${time}`);
  } else {
    // Assuming date format is like "Aug 10"
    return new Date(`${date} 2023 ${time}`);
  }
}

// Handle alert action button clicks
function handleAlertAction(event) {
  const button = event.currentTarget;
  const action = button.getAttribute('title');
  const row = button.closest('.alert-row');
  const alertId = row.querySelector('td:nth-child(2)').textContent;
  const severity = row.querySelector('.severity-badge').classList[1];
  
  switch(action) {
    case 'Acknowledge':
      updateAlertStatus(row, 'acknowledged');
      showNotification(`Alert ${alertId} acknowledged`);
      break;
    case 'Mark as Resolved':
      updateAlertStatus(row, 'resolved');
      showNotification(`Alert ${alertId} resolved`);
      break;
    case 'Assign':
      // Show assignment dialog
      const assignee = prompt('Assign to (username or team):');
      if (assignee) {
        showNotification(`Alert ${alertId} assigned to ${assignee}`);
      }
      break;
    case 'Escalate':
      updateAlertStatus(row, 'escalated');
      showNotification(`Alert ${alertId} escalated to higher priority`);
      break;
    case 'View Details':
      openAlertDetailsModal(event);
      break;
  }
  
  // Log the action
  console.log(`Alert ${alertId} action: ${action}`);
}

// Update alert status
function updateAlertStatus(row, newStatus) {
  // Get current status badge
  const statusBadge = row.querySelector('.status-badge');
  
  // Remove old status class
  Array.from(statusBadge.classList)
    .filter(cls => ['new', 'acknowledged', 'in-progress', 'resolved'].includes(cls))
    .forEach(cls => statusBadge.classList.remove(cls));
  
  // Add new status class
  statusBadge.classList.add(newStatus);
  statusBadge.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
  
  // Also add the class to the row
  row.className = row.className.replace(/new|acknowledged|in-progress|resolved/g, '');
  row.classList.add(newStatus);
  
  // Update action buttons based on new status
  updateActionButtons(row, newStatus);
}

// Update action buttons based on status
function updateActionButtons(row, status) {
  const actionButtons = row.querySelector('.action-buttons');
  
  // Clear existing buttons
  actionButtons.innerHTML = '';
  
  // Add appropriate buttons based on status
  if (status === 'new') {
    actionButtons.innerHTML = `
      <button class="table-action-btn acknowledge-btn" title="Acknowledge"><i class="fas fa-check"></i></button>
      <button class="table-action-btn assign-btn" title="Assign"><i class="fas fa-user-plus"></i></button>
      <button class="table-action-btn details-btn" title="View Details"><i class="fas fa-eye"></i></button>
    `;
  } else if (status === 'acknowledged' || status === 'in-progress') {
    actionButtons.innerHTML = `
      <button class="table-action-btn resolve-btn" title="Mark as Resolved"><i class="fas fa-check-double"></i></button>
      <button class="table-action-btn escalate-btn" title="Escalate"><i class="fas fa-arrow-up"></i></button>
      <button class="table-action-btn details-btn" title="View Details"><i class="fas fa-eye"></i></button>
    `;
  } else if (status === 'resolved') {
    actionButtons.innerHTML = `
      <button class="table-action-btn reopen-btn" title="Reopen"><i class="fas fa-redo-alt"></i></button>
      <button class="table-action-btn details-btn" title="View Details"><i class="fas fa-eye"></i></button>
    `;
  }
  
  // Add event listeners to new buttons
  actionButtons.querySelectorAll('.table-action-btn').forEach(button => {
    button.addEventListener('click', handleAlertAction);
  });
}

// Acknowledge all visible alerts
function acknowledgeAllAlerts() {
  const visibleRows = Array.from(document.querySelectorAll('.alert-row')).filter(row => 
    row.style.display !== 'none' && !row.classList.contains('resolved')
  );
  
  if (visibleRows.length === 0) {
    showNotification('No alerts to acknowledge');
    return;
  }
  
  // Confirm action
  if (confirm(`Acknowledge ${visibleRows.length} alerts?`)) {
    visibleRows.forEach(row => {
      updateAlertStatus(row, 'acknowledged');
    });
    
    showNotification(`${visibleRows.length} alerts acknowledged`);
  }
}

// Export alerts to CSV
function exportAlerts() {
  const visibleRows = Array.from(document.querySelectorAll('.alert-row')).filter(row => 
    row.style.display !== 'none'
  );
  
  if (visibleRows.length === 0) {
    showNotification('No alerts to export');
    return;
  }
  
  // Create CSV content
  let csv = 'ID,Time,Date,Crane,Type,Severity,Message,Status\n';
  
  visibleRows.forEach(row => {
    const id = row.querySelector('td:nth-child(2)').textContent;
    const time = row.querySelector('.alert-time .time').textContent;
    const date = row.querySelector('.alert-time .date').textContent;
    const crane = row.querySelector('td:nth-child(4)').textContent;
    const type = row.querySelector('td:nth-child(5)').textContent;
    const severity = row.querySelector('.severity-badge').textContent;
    const message = row.querySelector('.message-text').textContent.replace(/,/g, ' ');
    const status = row.querySelector('.status-badge').textContent;
    
    csv += `${id},${time},${date},${crane},${type},${severity},"${message}",${status}\n`;
  });
  
  // Create download link
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = `alerts_export_${new Date().toISOString().slice(0, 10)}.csv`;
  
  // Trigger download
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
  
  showNotification(`Exported ${visibleRows.length} alerts`);
}

// Open alert details modal
function openAlertDetailsModal(event) {
  const row = event.currentTarget.closest('.alert-row');
  const alertId = row.querySelector('td:nth-child(2)').textContent;
  const crane = row.querySelector('td:nth-child(4)').textContent;
  const type = row.querySelector('td:nth-child(5)').textContent;
  const severity = row.querySelector('.severity-badge').textContent;
  const message = row.querySelector('.message-text').textContent;
  const details = row.querySelector('.alert-details').textContent;
  const status = row.querySelector('.status-badge').textContent;
  
  // Update modal content
  document.querySelector('#alert-details-modal h2').textContent = `Alert Details - ${alertId}`;
  
  // Fill in alert information
  document.querySelector('.detail-value:nth-of-type(1)').textContent = alertId;
  
  // Display the modal
  document.getElementById('alert-details-modal').style.display = 'block';
  
  // Initialize the chart with mock data
  updateAlertChart();
}

// Close alert details modal
function closeAlertDetailsModal() {
  document.getElementById('alert-details-modal').style.display = 'none';
}

// Save alert response
function saveAlertResponse() {
  const selectedStatus = document.querySelector('input[name="alert-status"]:checked').value;
  const assignee = document.getElementById('assign-to').value;
  const note = document.getElementById('response-note').value;
  
  // Here we would typically send this data to the server
  console.log('Alert response:', { status: selectedStatus, assignee, note });
  
  // For demo, just show notification and close modal
  showNotification('Alert response saved');
  closeAlertDetailsModal();
}

// Initialize the alert data chart
function initializeAlertChart() {
  const ctx = document.getElementById('alertDataChart');
  if (!ctx) return;
  
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({length: 24}, (_, i) => `${i}:00`),
      datasets: [{
        label: 'Load %',
        data: generateRandomData(24, 60, 95),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          min: 50,
          max: 100,
          title: {
            display: true,
            text: 'Load (%)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Time (24h)'
          }
        }
      },
      plugins: {
        annotation: {
          annotations: {
            warningLine: {
              type: 'line',
              yMin: 80,
              yMax: 80,
              borderColor: '#FF9800',
              borderWidth: 2,
              borderDash: [5, 5],
              label: {
                content: 'Warning Threshold',
                display: true,
                position: 'center'
              }
            },
            criticalLine: {
              type: 'line',
              yMin: 90,
              yMax: 90,
              borderColor: '#F44336',
              borderWidth: 2,
              borderDash: [5, 5],
              label: {
                content: 'Critical Threshold',
                display: true,
                position: 'center'
              }
            }
          }
        }
      }
    }
  });
  
  return chart;
}

// Update the alert data chart with new data
function updateAlertChart() {
  const ctx = document.getElementById('alertDataChart');
  if (!ctx) return;
  
  // Check if chart already exists
  let chart = Chart.getChart(ctx);
  
  if (chart) {
    // Update existing chart
    chart.data.datasets[0].data = generateRandomData(24, 60, 95);
    chart.update();
  } else {
    // Create new chart
    initializeAlertChart();
  }
}

// Generate random data for chart
function generateRandomData(count, min, max) {
  return Array.from({length: count}, () => Math.floor(Math.random() * (max - min) + min));
}

// Show notification
function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Show with animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Remove after timeout
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Refresh alerts data
function refreshAlerts() {
  // For demo, we'll just log this. In real system, would fetch from server
  console.log('Refreshing alerts data...');
  
  // Simulate changing some statuses randomly
  const alertRows = document.querySelectorAll('.alert-row');
  
  if (Math.random() > 0.7) {
    // 30% chance to update one alert
    const randomIndex = Math.floor(Math.random() * alertRows.length);
    const randomRow = alertRows[randomIndex];
    
    // Only update if not already resolved
    if (!randomRow.classList.contains('resolved')) {
      // Random status
      const statuses = ['acknowledged', 'in-progress', 'resolved'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      updateAlertStatus(randomRow, randomStatus);
    }
  }
  
  // Simulate new alerts occasionally
  if (Math.random() > 0.8) {
    createNewAlert();
  }
}

// Create a new alert for demo
function createNewAlert() {
  const alertTypes = ['Load', 'Temperature', 'Vibration', 'Pressure', 'System'];
  const severities = ['critical', 'warning', 'maintenance', 'info'];
  const cranes = ['C-001', 'C-002', 'C-003', 'C-004', 'All'];
  
  const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
  const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
  const randomCrane = cranes[Math.floor(Math.random() * cranes.length)];
  
  // Generate alert ID
  const lastId = parseInt(document.querySelector('.alert-row td:nth-child(2)').textContent.replace('AL-', ''));
  const newId = `AL-${lastId + 1}`;
  
  // Create alert messages based on type and severity
  let message, details;
  
  if (randomType === 'Load') {
    const loadValue = Math.floor(Math.random() * 20) + 80;
    message = `${randomSeverity === 'critical' ? 'Critical' : 'High'} load detected`;
    details = `Current: ${loadValue}%, Threshold: ${randomSeverity === 'critical' ? '90' : '80'}%`;
  } else if (randomType === 'Temperature') {
    const tempValue = Math.floor(Math.random() * 20) + 75;
    message = `${randomSeverity === 'critical' ? 'Critical' : 'High'} temperature detected`;
    details = `Current: ${tempValue}°C, Threshold: ${randomSeverity === 'critical' ? '90' : '80'}°C`;
  } else if (randomType === 'Vibration') {
    const vibValue = (Math.random() * 2 + 2).toFixed(1);
    message = `Abnormal vibration detected`;
    details = `Current: ${vibValue}mm/s², Threshold: ${randomSeverity === 'critical' ? '4.0' : '3.0'}mm/s²`;
  } else if (randomType === 'Pressure') {
    const pressValue = Math.floor(Math.random() * 50) + 170;
    message = `${randomSeverity === 'critical' ? 'Critical' : 'High'} pressure detected`;
    details = `Current: ${pressValue} bar, Threshold: ${randomSeverity === 'critical' ? '200' : '180'} bar`;
  } else {
    message = `System ${randomSeverity === 'info' ? 'notification' : 'alert'}`;
    details = `${randomSeverity === 'critical' ? 'Critical' : randomSeverity === 'warning' ? 'Important' : 'Routine'} system event detected`;
  }
  
  // Create new row
  const tbody = document.querySelector('.alerts-table tbody');
  const newRow = document.createElement('tr');
  newRow.className = `alert-row ${randomSeverity} new`;
  
  newRow.innerHTML = `
    <td><input type="checkbox" class="alert-select"></td>
    <td>${newId}</td>
    <td>
      <div class="alert-time">
        <span class="time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        <span class="date">Today</span>
      </div>
    </td>
    <td>${randomCrane}</td>
    <td>${randomType}</td>
    <td><span class="severity-badge ${randomSeverity}">${randomSeverity.charAt(0).toUpperCase() + randomSeverity.slice(1)}</span></td>
    <td>
      <div class="alert-message">
        <span class="message-text">${message}</span>
        <span class="alert-details">${details}</span>
      </div>
    </td>
    <td><span class="status-badge new">New</span></td>
    <td>
      <div class="action-buttons">
        <button class="table-action-btn acknowledge-btn" title="Acknowledge"><i class="fas fa-check"></i></button>
        <button class="table-action-btn assign-btn" title="Assign"><i class="fas fa-user-plus"></i></button>
        <button class="table-action-btn details-btn" title="View Details"><i class="fas fa-eye"></i></button>
      </div>
    </td>
  `;
  
  // Add to top of table
  tbody.insertBefore(newRow, tbody.firstChild);
  
  // Update count in summary cards
  const card = document.querySelector(`.alert-card.${randomSeverity} .alert-count`);
  card.textContent = parseInt(card.textContent) + 1;
  
  // Add event listeners to new buttons
  newRow.querySelectorAll('.table-action-btn').forEach(button => {
    button.addEventListener('click', handleAlertAction);
  });
  
  // Show notification
  showNotification(`New ${randomSeverity} alert: ${message}`);
  
  // Update header notification count
  const notificationCount = document.querySelector('.notification-count');
  notificationCount.textContent = parseInt(notificationCount.textContent) + 1;
}

// Initialize on page load
window.addEventListener('load', function() {
  // Logout button functionality
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      sessionStorage.removeItem('currentUser');
      window.location.href = 'login.html';
    });
  }
});
