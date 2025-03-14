
// Initialize performance chart
const performanceCtx = document.getElementById('performanceChart').getContext('2d');

const performanceChart = new Chart(performanceCtx, {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Load Capacity Utilization',
        data: [65, 59, 80, 81, 56, 55, 72],
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Energy Consumption',
        data: [28, 48, 40, 35, 45, 50, 40],
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Maintenance Indicators',
        data: [15, 20, 24, 32, 38, 40, 55],
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
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  }
});

// Simulate real-time data updates
function updateChartData() {
  // Add new random data point
  const newLoadData = Math.floor(Math.random() * 30) + 50; // Random between 50-80
  const newEnergyData = Math.floor(Math.random() * 25) + 30; // Random between 30-55
  const newMaintenanceData = Math.floor(Math.random() * 40) + 15; // Random between 15-55
  
  // Remove first data point
  performanceChart.data.datasets[0].data.shift();
  performanceChart.data.datasets[1].data.shift();
  performanceChart.data.datasets[2].data.shift();
  
  // Add new data point
  performanceChart.data.datasets[0].data.push(newLoadData);
  performanceChart.data.datasets[1].data.push(newEnergyData);
  performanceChart.data.datasets[2].data.push(newMaintenanceData);
  
  // Update chart
  performanceChart.update();
}

// Update prediction values periodically
function updatePredictions() {
  const predictionItems = document.querySelectorAll('.prediction-item');
  
  predictionItems.forEach(item => {
    // Get current percentage
    const progressBar = item.querySelector('.progress');
    const percentageSpan = item.querySelector('.prediction-percentage');
    const timeSpan = item.querySelector('.prediction-time');
    
    // Get current value
    let currentPercentage = parseInt(percentageSpan.textContent);
    
    // Randomly increase or decrease by 0-2%
    const change = Math.floor(Math.random() * 5) - 2;
    currentPercentage += change;
    
    // Ensure within bounds
    currentPercentage = Math.max(5, Math.min(98, currentPercentage));
    
    // Update display
    progressBar.style.width = `${currentPercentage}%`;
    percentageSpan.textContent = `${currentPercentage}%`;
    
    // Update estimated time
    const days = Math.floor((100 - currentPercentage) / 3);
    timeSpan.textContent = `~${days} days until maintenance`;
  });
}

// Simulate new alerts occasionally
function simulateNewAlert() {
  if (Math.random() > 0.8) { // 20% chance of new alert
    const alertsList = document.querySelector('.alerts-list');
    const alertTypes = ['critical', 'warning', 'info'];
    const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    
    const alertTitles = {
      'critical': ['Critical Load Detected', 'Emergency Stop Triggered', 'Structural Integrity Warning'],
      'warning': ['Maintenance Due', 'Unusual Vibration Detected', 'Weather Warning'],
      'info': ['System Update', 'Operator Shift Change', 'Inspection Completed']
    };
    
    const alertMessages = {
      'critical': ['Load exceeded 95% capacity', 'Emergency button pressed by operator', 'Stress levels above threshold'],
      'warning': ['Scheduled maintenance in 3 days', 'Vibration detected in main motor', 'High wind speeds expected'],
      'info': ['New firmware available', 'Shift change at 3:00 PM', 'Routine inspection passed']
    };
    
    const alertIcons = {
      'critical': 'exclamation-circle',
      'warning': 'exclamation-triangle',
      'info': 'info-circle'
    };
    
    const title = alertTitles[alertType][Math.floor(Math.random() * alertTitles[alertType].length)];
    const message = alertMessages[alertType][Math.floor(Math.random() * alertMessages[alertType].length)];
    const icon = alertIcons[alertType];
    
    const newAlert = document.createElement('div');
    newAlert.className = `alert-item ${alertType}`;
    newAlert.innerHTML = `
      <div class="alert-icon">
        <i class="fas fa-${icon}"></i>
      </div>
      <div class="alert-info">
        <h4>${title}</h4>
        <p>${message}</p>
        <span class="alert-time">Just now</span>
      </div>
    `;
    
    // Add to top of list
    alertsList.prepend(newAlert);
    
    // Remove oldest if more than 5
    const alerts = alertsList.querySelectorAll('.alert-item');
    if (alerts.length > 5) {
      alerts[alerts.length - 1].remove();
    }
    
    // Update notification count
    const notificationCount = document.querySelector('.notification-count');
    let count = parseInt(notificationCount.textContent) + 1;
    notificationCount.textContent = count;
  }
}

// Additional Charts
const temperatureCtx = document.getElementById('temperatureChart').getContext('2d');
const vibrationCtx = document.getElementById('vibrationChart').getContext('2d');

// Initialize Temperature Chart
const temperatureChart = new Chart(temperatureCtx, {
  type: 'line',
  data: {
    labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
    datasets: [
      {
        label: 'Crane #C-001',
        data: [65, 68, 70, 72, 74, 73, 70, 68],
        borderColor: '#4CAF50',
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: 'Crane #C-002',
        data: [62, 64, 67, 65, 66, 68, 65, 63],
        borderColor: '#2196F3',
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: 'Crane #C-003',
        data: [70, 74, 78, 80, 82, 84, 83, 81],
        borderColor: '#FF9800',
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: 'Crane #C-004',
        data: [85, 88, 92, 95, 102, 105, 104, 100],
        borderColor: '#F44336',
        tension: 0.4,
        borderWidth: 2,
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        min: 50,
        max: 110,
        ticks: {
          callback: function(value) {
            return value + '°C';
          }
        }
      }
    }
  }
});

// Initialize Vibration Chart
const vibrationChart = new Chart(vibrationCtx, {
  type: 'bar',
  data: {
    labels: ['Crane #C-001', 'Crane #C-002', 'Crane #C-003', 'Crane #C-004'],
    datasets: [
      {
        label: 'Current Vibration (Hz)',
        data: [2.4, 1.8, 3.6, 4.8],
        backgroundColor: [
          'rgba(76, 175, 80, 0.5)',
          'rgba(76, 175, 80, 0.5)',
          'rgba(255, 152, 0, 0.5)',
          'rgba(244, 67, 54, 0.5)'
        ],
        borderColor: [
          'rgba(76, 175, 80, 1)',
          'rgba(76, 175, 80, 1)',
          'rgba(255, 152, 0, 1)',
          'rgba(244, 67, 54, 1)'
        ],
        borderWidth: 1
      },
      {
        label: 'Safe Threshold',
        data: [3, 3, 3, 3],
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderColor: 'rgba(0, 0, 0, 0.5)',
        borderWidth: 2,
        type: 'line',
        pointRadius: 0
      },
      {
        label: 'Warning Threshold',
        data: [4, 4, 4, 4],
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderColor: 'rgba(255, 152, 0, 0.5)',
        borderWidth: 2,
        type: 'line',
        pointRadius: 0,
        borderDash: [5, 5]
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 6,
        ticks: {
          callback: function(value) {
            return value + ' Hz';
          }
        }
      }
    }
  }
});

// Update temperature data
function updateTemperatureData() {
  temperatureChart.data.datasets.forEach((dataset, index) => {
    for (let i = 0; i < dataset.data.length; i++) {
      // Add small random fluctuations
      const change = Math.floor(Math.random() * 3) - 1;
      dataset.data[i] += change;
      
      // Ensure values stay in reasonable range
      if (index === 3) { // Critical crane
        dataset.data[i] = Math.max(85, Math.min(110, dataset.data[i]));
      } else if (index === 2) { // Warning crane
        dataset.data[i] = Math.max(70, Math.min(85, dataset.data[i]));
      } else {
        dataset.data[i] = Math.max(60, Math.min(75, dataset.data[i]));
      }
    }
  });
  
  temperatureChart.update();
}

// Update vibration data
function updateVibrationData() {
  vibrationChart.data.datasets[0].data.forEach((value, index) => {
    // Add small random fluctuations
    const change = (Math.random() * 0.4) - 0.2;
    vibrationChart.data.datasets[0].data[index] += change;
    
    // Ensure values stay in reasonable range based on crane status
    if (index === 3) { // Critical crane
      vibrationChart.data.datasets[0].data[index] = Math.max(4, Math.min(5.5, vibrationChart.data.datasets[0].data[index]));
    } else if (index === 2) { // Warning crane
      vibrationChart.data.datasets[0].data[index] = Math.max(2.5, Math.min(4.2, vibrationChart.data.datasets[0].data[index]));
    } else {
      vibrationChart.data.datasets[0].data[index] = Math.max(1.5, Math.min(2.8, vibrationChart.data.datasets[0].data[index]));
    }
    
    // Update bar colors based on values
    if (vibrationChart.data.datasets[0].data[index] >= 4) {
      vibrationChart.data.datasets[0].backgroundColor[index] = 'rgba(244, 67, 54, 0.5)';
      vibrationChart.data.datasets[0].borderColor[index] = 'rgba(244, 67, 54, 1)';
    } else if (vibrationChart.data.datasets[0].data[index] >= 3) {
      vibrationChart.data.datasets[0].backgroundColor[index] = 'rgba(255, 152, 0, 0.5)';
      vibrationChart.data.datasets[0].borderColor[index] = 'rgba(255, 152, 0, 1)';
    } else {
      vibrationChart.data.datasets[0].backgroundColor[index] = 'rgba(76, 175, 80, 0.5)';
      vibrationChart.data.datasets[0].borderColor[index] = 'rgba(76, 175, 80, 1)';
    }
  });
  
  vibrationChart.update();
}

// Update all stats counts with random fluctuations
function updateStatCounts() {
  const operationalCount = document.getElementById('operational-count');
  const maintenanceCount = document.getElementById('maintenance-count');
  const criticalCount = document.getElementById('critical-count');
  const uptimePercentage = document.getElementById('uptime-percentage');
  
  // Small random fluctuations in operational count (14-16)
  if (Math.random() > 0.7) {
    const newCount = 14 + Math.floor(Math.random() * 3);
    operationalCount.textContent = newCount;
    
    // Update trend indicator
    const prevCount = parseInt(operationalCount.getAttribute('data-prev') || '15');
    const trend = operationalCount.nextElementSibling;
    
    if (newCount > prevCount) {
      trend.className = 'stat-trend positive';
      trend.innerHTML = `<i class="fas fa-arrow-up"></i> ${newCount - prevCount} since yesterday`;
    } else if (newCount < prevCount) {
      trend.className = 'stat-trend negative';
      trend.innerHTML = `<i class="fas fa-arrow-down"></i> ${prevCount - newCount} since yesterday`;
    } else {
      trend.className = 'stat-trend neutral';
      trend.innerHTML = `<i class="fas fa-minus"></i> No change`;
    }
    
    operationalCount.setAttribute('data-prev', newCount);
  }
  
  // Small random fluctuations in maintenance count (2-4)
  if (Math.random() > 0.8) {
    const newCount = 2 + Math.floor(Math.random() * 3);
    maintenanceCount.textContent = newCount;
    
    // Update trend indicator
    const prevCount = parseInt(maintenanceCount.getAttribute('data-prev') || '3');
    const trend = maintenanceCount.nextElementSibling;
    
    if (newCount > prevCount) {
      trend.className = 'stat-trend negative';
      trend.innerHTML = `<i class="fas fa-arrow-up"></i> ${newCount - prevCount} since yesterday`;
    } else if (newCount < prevCount) {
      trend.className = 'stat-trend positive';
      trend.innerHTML = `<i class="fas fa-arrow-down"></i> ${prevCount - newCount} since yesterday`;
    } else {
      trend.className = 'stat-trend neutral';
      trend.innerHTML = `<i class="fas fa-minus"></i> No change`;
    }
    
    maintenanceCount.setAttribute('data-prev', newCount);
  }
  
  // Small random fluctuations in critical count (0-2)
  if (Math.random() > 0.9) {
    const newCount = Math.floor(Math.random() * 3);
    criticalCount.textContent = newCount;
    
    // Update trend indicator
    const prevCount = parseInt(criticalCount.getAttribute('data-prev') || '1');
    const trend = criticalCount.nextElementSibling;
    
    if (newCount > prevCount) {
      trend.className = 'stat-trend negative';
      trend.innerHTML = `<i class="fas fa-arrow-up"></i> ${newCount - prevCount} since yesterday`;
    } else if (newCount < prevCount) {
      trend.className = 'stat-trend positive';
      trend.innerHTML = `<i class="fas fa-arrow-down"></i> ${prevCount - newCount} since yesterday`;
    } else {
      trend.className = 'stat-trend neutral';
      trend.innerHTML = `<i class="fas fa-minus"></i> No change`;
    }
    
    criticalCount.setAttribute('data-prev', newCount);
  }
  
  // Small random fluctuations in uptime percentage (98.0-99.2%)
  if (Math.random() > 0.6) {
    const newUptime = (98 + Math.random() * 1.2).toFixed(1);
    uptimePercentage.textContent = newUptime + '%';
    
    // Update trend indicator
    const prevUptime = parseFloat(uptimePercentage.getAttribute('data-prev') || '98.5');
    const trend = uptimePercentage.nextElementSibling;
    
    if (newUptime > prevUptime) {
      trend.className = 'stat-trend positive';
      trend.innerHTML = `<i class="fas fa-arrow-up"></i> ${(newUptime - prevUptime).toFixed(1)}% increase`;
    } else if (newUptime < prevUptime) {
      trend.className = 'stat-trend negative';
      trend.innerHTML = `<i class="fas fa-arrow-down"></i> ${(prevUptime - newUptime).toFixed(1)}% decrease`;
    } else {
      trend.className = 'stat-trend neutral';
      trend.innerHTML = `<i class="fas fa-minus"></i> No change`;
    }
    
    uptimePercentage.setAttribute('data-prev', newUptime);
  }
}

// Customization modal functionality
function initializeCustomizationModal() {
  const customizeBtn = document.getElementById('customize-dashboard');
  const modal = document.getElementById('customization-modal');
  const closeModal = document.querySelector('.close-modal');
  const saveBtn = document.getElementById('save-dashboard');
  const resetBtn = document.getElementById('reset-dashboard');
  const layoutOptions = document.querySelectorAll('.layout-option');
  const widgetToggles = document.querySelectorAll('.widget-toggle');
  
  // Open modal
  customizeBtn.addEventListener('click', function() {
    modal.style.display = 'block';
  });
  
  // Close modal
  closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // Layout options selection
  layoutOptions.forEach(option => {
    option.addEventListener('click', function() {
      layoutOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      
      const layout = this.getAttribute('data-layout');
      const dashboardGrid = document.getElementById('customizable-dashboard');
      
      // Apply different layouts
      if (layout === '2x2') {
        dashboardGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        // Hide widgets beyond 4
        const widgets = dashboardGrid.querySelectorAll('.grid-item');
        widgets.forEach((widget, index) => {
          if (index < 4) {
            widget.style.display = 'block';
          } else {
            widget.style.display = 'none';
          }
        });
      } else if (layout === '2x3') {
        dashboardGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        // Show all widgets
        const widgets = dashboardGrid.querySelectorAll('.grid-item');
        widgets.forEach(widget => {
          widget.style.display = 'block';
        });
      } else if (layout === '3x2') {
        dashboardGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        // Show all widgets
        const widgets = dashboardGrid.querySelectorAll('.grid-item');
        widgets.forEach(widget => {
          widget.style.display = 'block';
        });
      } else if (layout === 'custom') {
        dashboardGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
      }
    });
  });
  
  // Widget toggles
  widgetToggles.forEach(toggle => {
    toggle.addEventListener('change', function() {
      const widgetId = this.closest('.widget-option').getAttribute('data-widget');
      const widget = document.getElementById(widgetId);
      
      if (this.checked) {
        widget.style.display = 'block';
      } else {
        widget.style.display = 'none';
      }
    });
  });
  
  // Save dashboard layout
  saveBtn.addEventListener('click', function() {
    // Get current layout configuration
    const layoutConfig = {
      layout: document.querySelector('.layout-option.active').getAttribute('data-layout'),
      visibleWidgets: []
    };
    
    widgetToggles.forEach(toggle => {
      if (toggle.checked) {
        layoutConfig.visibleWidgets.push(toggle.closest('.widget-option').getAttribute('data-widget'));
      }
    });
    
    // Save to localStorage
    localStorage.setItem('dashboardConfig', JSON.stringify(layoutConfig));
    
    // Close modal
    modal.style.display = 'none';
  });
  
  // Reset dashboard
  resetBtn.addEventListener('click', function() {
    // Reset to default layout
    document.querySelector('[data-layout="2x3"]').click();
    
    // Check all widget toggles
    widgetToggles.forEach(toggle => {
      toggle.checked = true;
    });
    
    // Show all widgets
    const widgets = document.querySelectorAll('.grid-item');
    widgets.forEach(widget => {
      widget.style.display = 'block';
    });
    
    // Remove saved config
    localStorage.removeItem('dashboardConfig');
  });
  
  // Load saved configuration if exists
  const savedConfig = localStorage.getItem('dashboardConfig');
  if (savedConfig) {
    const config = JSON.parse(savedConfig);
    
    // Apply saved layout
    document.querySelector(`[data-layout="${config.layout}"]`).click();
    
    // Show/hide widgets based on saved config
    widgetToggles.forEach(toggle => {
      const widgetId = toggle.closest('.widget-option').getAttribute('data-widget');
      toggle.checked = config.visibleWidgets.includes(widgetId);
      
      const widget = document.getElementById(widgetId);
      widget.style.display = toggle.checked ? 'block' : 'none';
    });
  }
}

// Widget controls functionality
function initializeWidgetControls() {
  // Widget refresh buttons
  document.querySelectorAll('.refresh-widget').forEach(button => {
    button.addEventListener('click', function() {
      const widgetId = this.closest('.grid-item').id;
      refreshWidget(widgetId);
    });
  });
  
  // Widget view selectors
  document.querySelectorAll('.widget-view-selector').forEach(selector => {
    selector.addEventListener('change', function() {
      const widgetId = this.closest('.grid-item').id;
      const value = this.value;
      
      if (widgetId === 'crane-status') {
        filterCraneItems(value);
      }
    });
  });
  
  // Widget alert selectors
  document.querySelectorAll('.widget-alert-selector').forEach(selector => {
    selector.addEventListener('change', function() {
      const value = this.value;
      filterAlertItems(value);
    });
  });
  
  // Widget chart type selectors
  document.querySelectorAll('.widget-chart-selector').forEach(selector => {
    selector.addEventListener('change', function() {
      const value = this.value;
      changeChartType(value);
    });
  });
}

// Refresh specific widget data
function refreshWidget(widgetId) {
  // Add loading indicator
  const widget = document.getElementById(widgetId);
  widget.classList.add('loading');
  
  // Add temporary loading overlay
  const loadingOverlay = document.createElement('div');
  loadingOverlay.className = 'loading-overlay';
  loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
  widget.appendChild(loadingOverlay);
  
  // Simulate loading
  setTimeout(() => {
    // Different refresh logic for each widget type
    switch (widgetId) {
      case 'crane-status':
        updateCraneStatus();
        break;
      case 'performance-chart':
        updateChartData();
        break;
      case 'alerts-panel':
        simulateNewAlert();
        break;
      case 'maintenance-prediction':
        updatePredictions();
        break;
      case 'live-temperature':
        updateTemperatureData();
        break;
      case 'vibration-analysis':
        updateVibrationData();
        break;
    }
    
    // Remove loading overlay and class
    widget.removeChild(loadingOverlay);
    widget.classList.remove('loading');
  }, 800);
}

// Filter crane items based on status
function filterCraneItems(status) {
  const craneItems = document.querySelectorAll('.crane-item');
  
  craneItems.forEach(item => {
    if (status === 'all') {
      item.style.display = 'flex';
    } else if (status === 'critical' && item.classList.contains('critical')) {
      item.style.display = 'flex';
    } else if (status === 'warning' && item.classList.contains('warning')) {
      item.style.display = 'flex';
    } else if (status === 'operational' && item.classList.contains('operational')) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

// Filter alert items based on type
function filterAlertItems(type) {
  const alertItems = document.querySelectorAll('.alert-item');
  
  alertItems.forEach(item => {
    if (type === 'all') {
      item.style.display = 'flex';
    } else if (type === 'critical' && item.classList.contains('critical')) {
      item.style.display = 'flex';
    } else if (type === 'warning' && item.classList.contains('warning')) {
      item.style.display = 'flex';
    } else if (type === 'info' && item.classList.contains('info')) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

// Change performance chart type
function changeChartType(type) {
  performanceChart.config.type = type;
  performanceChart.update();
}

// Update crane status items 
function updateCraneStatus() {
  const craneItems = document.querySelectorAll('.crane-item');
  
  craneItems.forEach(item => {
    // Update load and temperature with random fluctuations
    const loadValue = item.querySelector('.metric:nth-child(1) .metric-value');
    const tempValue = item.querySelector('.metric:nth-child(2) .metric-value');
    
    // Current values
    let currentLoad = parseInt(loadValue.textContent);
    let currentTemp = parseInt(tempValue.textContent);
    
    // Random fluctuations
    currentLoad += Math.floor(Math.random() * 5) - 2;
    currentTemp += Math.floor(Math.random() * 3) - 1;
    
    // Keep within reasonable ranges based on crane status
    if (item.classList.contains('critical')) {
      currentLoad = Math.max(85, Math.min(98, currentLoad));
      currentTemp = Math.max(95, Math.min(108, currentTemp));
    } else if (item.classList.contains('warning')) {
      currentLoad = Math.max(45, Math.min(65, currentLoad));
      currentTemp = Math.max(75, Math.min(85, currentTemp));
    } else {
      currentLoad = Math.max(30, Math.min(55, currentLoad));
      currentTemp = Math.max(60, Math.min(75, currentTemp));
    }
    
    // Update displayed values
    loadValue.textContent = currentLoad + '%';
    tempValue.textContent = currentTemp + '°C';
    
    // Add warning classes based on values
    if (currentLoad > 80) {
      loadValue.parentElement.classList.add('warning-metric');
    } else {
      loadValue.parentElement.classList.remove('warning-metric');
    }
    
    if (currentTemp > 90) {
      tempValue.parentElement.classList.add('critical-metric');
    } else if (currentTemp > 80) {
      tempValue.parentElement.classList.add('warning-metric');
      tempValue.parentElement.classList.remove('critical-metric');
    } else {
      tempValue.parentElement.classList.remove('warning-metric', 'critical-metric');
    }
  });
}

// Initialize additional event listeners
function initializeEventListeners() {
  // Dashboard controls
  const refreshDataBtn = document.getElementById('refresh-data');
  const exportPdfBtn = document.getElementById('export-pdf');
  const exportExcelBtn = document.getElementById('export-excel');
  
  // Refresh all data button
  refreshDataBtn.addEventListener('click', function() {
    // Refresh all widgets
    updateChartData();
    updatePredictions();
    updateCraneStatus();
    updateTemperatureData();
    updateVibrationData();
    updateStatCounts();
    
    // Show refresh animation
    this.classList.add('refreshing');
    setTimeout(() => {
      this.classList.remove('refreshing');
    }, 1000);
  });
  
  // Export buttons
  exportPdfBtn.addEventListener('click', function() {
    alert('PDF Export Feature - This would generate a PDF report of the current dashboard state.');
  });
  
  exportExcelBtn.addEventListener('click', function() {
    alert('Excel Export Feature - This would export the dashboard data to an Excel file.');
  });
  
  // Date range filter
  const dateFilter = document.getElementById('date-range-filter');
  dateFilter.addEventListener('change', function() {
    const value = this.value;
    
    // Update chart data based on selected time range
    let labels, dataMultiplier;
    
    if (value === 'daily') {
      labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
      dataMultiplier = 0.8;
    } else if (value === 'weekly') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      dataMultiplier = 1;
    } else if (value === 'monthly') {
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      dataMultiplier = 1.2;
    }
    
    // Update performance chart
    performanceChart.data.labels = labels;
    performanceChart.data.datasets.forEach(dataset => {
      dataset.data = dataset.data.map(() => 
        Math.floor(Math.random() * 30 * dataMultiplier) + 40
      );
    });
    performanceChart.update();
    
    // Update temperature chart
    temperatureChart.data.labels = labels;
    temperatureChart.update();
  });
  
  // Alert action buttons
  document.querySelectorAll('.alert-action').forEach(button => {
    button.addEventListener('click', function() {
      const alertItem = this.closest('.alert-item');
      const action = this.getAttribute('title');
      
      if (action === 'Mark as Read') {
        alertItem.style.opacity = '0.6';
        
        // Update notification count
        const notificationCount = document.getElementById('new-alerts-count');
        let count = parseInt(notificationCount.textContent);
        if (count > 0) {
          notificationCount.textContent = count - 1;
        }
      } else if (action === 'Assign') {
        alert('Assignment feature would open a dialog to assign this alert to a specific user or team.');
      }
    });
  });
}

// Make dashboard items draggable
function makeWidgetsDraggable() {
  const dashboardGrid = document.getElementById('customizable-dashboard');
  const moveHandles = document.querySelectorAll('.move-widget');
  
  moveHandles.forEach(handle => {
    handle.addEventListener('mousedown', function(e) {
      e.preventDefault();
      
      const widget = this.closest('.grid-item');
      const widgetRect = widget.getBoundingClientRect();
      const dashboardRect = dashboardGrid.getBoundingClientRect();
      
      // Add dragging class for styling
      widget.classList.add('dragging');
      
      const initialX = e.clientX;
      const initialY = e.clientY;
      const initialLeft = widgetRect.left - dashboardRect.left;
      const initialTop = widgetRect.top - dashboardRect.top;
      
      // Store original position in the grid
      widget.style.position = 'absolute';
      widget.style.left = initialLeft + 'px';
      widget.style.top = initialTop + 'px';
      widget.style.width = widgetRect.width + 'px';
      widget.style.zIndex = '100';
      
      // Create a placeholder
      const placeholder = document.createElement('div');
      placeholder.className = 'widget-placeholder';
      placeholder.style.width = widgetRect.width + 'px';
      placeholder.style.height = widgetRect.height + 'px';
      dashboardGrid.insertBefore(placeholder, widget);
      
      function moveWidget(e) {
        const offsetX = e.clientX - initialX;
        const offsetY = e.clientY - initialY;
        
        widget.style.left = (initialLeft + offsetX) + 'px';
        widget.style.top = (initialTop + offsetY) + 'px';
        
        // Find widget under cursor for swap positioning
        const elementsUnderCursor = document.elementsFromPoint(e.clientX, e.clientY);
        for (let i = 0; i < elementsUnderCursor.length; i++) {
          const elem = elementsUnderCursor[i];
          if (elem.classList.contains('grid-item') && elem !== widget) {
            // Swap positions
            dashboardGrid.insertBefore(placeholder, elem);
            break;
          }
        }
      }
      
      function releaseWidget() {
        // Remove move event listener
        document.removeEventListener('mousemove', moveWidget);
        document.removeEventListener('mouseup', releaseWidget);
        
        // Insert widget at placeholder position
        dashboardGrid.insertBefore(widget, placeholder);
        dashboardGrid.removeChild(placeholder);
        
        // Reset widget styling
        widget.style.position = '';
        widget.style.left = '';
        widget.style.top = '';
        widget.style.width = '';
        widget.style.zIndex = '';
        widget.classList.remove('dragging');
      }
      
      document.addEventListener('mousemove', moveWidget);
      document.addEventListener('mouseup', releaseWidget);
    });
  });
}

// Initialize real-time data updates
function initializeRealTimeUpdates() {
  // Initial role-based access restrictions
  applyRoleBasedAccess();
  
  // Update dashboard data periodically
  setInterval(updateChartData, 5000); // Every 5 seconds
  setInterval(updatePredictions, 10000); // Every 10 seconds
  setInterval(simulateNewAlert, 15000); // Every 15 seconds
  setInterval(updateTemperatureData, 8000); // Every 8 seconds
  setInterval(updateVibrationData, 12000); // Every 12 seconds
  setInterval(updateStatCounts, 20000); // Every 20 seconds
}

// Apply role-based access restrictions
function applyRoleBasedAccess() {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  
  if (currentUser) {
    const role = currentUser.role;
    
    if (role === 'operator') {
      // Operators can only view assigned cranes
      document.querySelectorAll('.widget-controls select').forEach(select => {
        select.disabled = true;
      });
      
      // Hide export and customization buttons
      document.getElementById('export-pdf').style.display = 'none';
      document.getElementById('export-excel').style.display = 'none';
      document.getElementById('customize-dashboard').style.display = 'none';
      
      // Disable widget dragging
      document.querySelectorAll('.move-widget').forEach(handle => {
        handle.style.display = 'none';
      });
    } else if (role === 'supervisor') {
      // Supervisors can view reports but can't customize
      document.getElementById('customize-dashboard').style.display = 'none';
      
      // Disable widget dragging
      document.querySelectorAll('.move-widget').forEach(handle => {
        handle.style.display = 'none';
      });
    }
    // Admins have full access by default
  }
}

// Initialize all dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all UI functionality
  initializeCustomizationModal();
  initializeWidgetControls();
  initializeEventListeners();
  makeWidgetsDraggable();
  initializeRealTimeUpdates();
  
  // Update data initially
  updateChartData();
  updatePredictions();
  updateTemperatureData();
  updateVibrationData();
  updateStatCounts();
  updateCraneStatus();
});

// Initialize interactive elements
document.addEventListener('DOMContentLoaded', function() {
  // Navigation item click
  const navItems = document.querySelectorAll('nav ul li');
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      navItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Logout button click
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      // Clear user session
      sessionStorage.removeItem('currentUser');
      
      // Log the logout activity
      const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
      if (currentUser) {
        const loginHistory = JSON.parse(localStorage.getItem('loginHistory') || '[]');
        loginHistory.push({
          username: currentUser.username,
          timestamp: new Date().toISOString(),
          ipAddress: '192.168.1.1',
          userAgent: navigator.userAgent,
          success: true,
          details: 'User logged out'
        });
        localStorage.setItem('loginHistory', JSON.stringify(loginHistory));
      }
      
      // Redirect to login page
      window.location.href = 'login.html';
    });
  }
  
  // Notification button click
  const notificationBtn = document.querySelector('.notification-btn');
  notificationBtn.addEventListener('click', function() {
    const count = document.querySelector('.notification-count');
    count.textContent = '0';
    alert('Notifications marked as read');
  });

  // Help button click
  const helpBtn = document.querySelector('.help-btn');
  helpBtn.addEventListener('click', function() {
    alert('Help documentation is currently under development. Please contact support for assistance.');
  });
});

// Simulate loading data
(function initialDataLoad() {
  // Add loading animation
  const gridItems = document.querySelectorAll('.grid-item');
  gridItems.forEach(item => {
    item.classList.add('loading');
    
    // Add loading overlay
    const loader = document.createElement('div');
    loader.className = 'loader-overlay';
    loader.innerHTML = '<div class="loader"></div>';
    item.appendChild(loader);
  });
  
  // Remove loading animation after timeout
  setTimeout(() => {
    gridItems.forEach(item => {
      const loader = item.querySelector('.loader-overlay');
      if (loader) {
        loader.remove();
      }
      item.classList.remove('loading');
    });
  }, 1500);
})();

// Add responsive menu toggle
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');

window.addEventListener('resize', function() {
  if (window.innerWidth <= 768) {
    sidebar.classList.add('collapsed');
    mainContent.classList.add('expanded');
  } else {
    sidebar.classList.remove('collapsed');
    mainContent.classList.remove('expanded');
  }
});

// Initial check
if (window.innerWidth <= 768) {
  sidebar.classList.add('collapsed');
  mainContent.classList.add('expanded');
}
