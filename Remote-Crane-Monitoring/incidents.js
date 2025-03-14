
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  
  if (!currentUser) {
    // Redirect to login page if not authenticated
    window.location.href = 'login.html';
    return;
  }
  
  // Update UI based on user role
  document.querySelector('.user-name').textContent = currentUser.username;
  document.querySelector('.user-role').textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
  
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
  
  // Upload functionality
  const uploadArea = document.getElementById('upload-area');
  const fileUpload = document.getElementById('file-upload');
  const uploadPreview = document.getElementById('upload-preview');
  
  if (uploadArea && fileUpload) {
    uploadArea.addEventListener('click', () => {
      fileUpload.click();
    });
    
    // Handle drag and drop
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      
      if (e.dataTransfer.files.length) {
        handleFiles(e.dataTransfer.files);
      }
    });
    
    fileUpload.addEventListener('change', () => {
      if (fileUpload.files.length) {
        handleFiles(fileUpload.files);
      }
    });
    
    function handleFiles(files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
          const fileElement = document.createElement('div');
          fileElement.className = 'upload-file';
          
          if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.file = file;
            fileElement.appendChild(img);
            
            const reader = new FileReader();
            reader.onload = (function(aImg) { 
              return function(e) { 
                aImg.src = e.target.result; 
              }; 
            })(img);
            reader.readAsDataURL(file);
          } else {
            // For video, just show an icon
            fileElement.innerHTML = '<i class="fas fa-video" style="font-size: 3rem; display: flex; align-items: center; justify-content: center; height: 100%;"></i>';
          }
          
          const removeBtn = document.createElement('button');
          removeBtn.className = 'remove-file';
          removeBtn.innerHTML = '<i class="fas fa-times"></i>';
          removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fileElement.remove();
          });
          
          fileElement.appendChild(removeBtn);
          uploadPreview.appendChild(fileElement);
        }
      }
    }
  }
  
  // Form submission
  const incidentForm = document.getElementById('incident-form');
  if (incidentForm) {
    incidentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form values
      const craneId = document.getElementById('crane-id').value;
      const incidentDate = document.getElementById('incident-date').value;
      const incidentType = document.getElementById('incident-type').value;
      const severity = document.querySelector('input[name="severity"]:checked')?.value;
      const title = document.getElementById('incident-title').value;
      const description = document.getElementById('incident-description').value;
      const reportedBy = document.getElementById('reported-by').value;
      
      // Validation
      if (!craneId || !incidentDate || !incidentType || !severity || !title || !description || !reportedBy) {
        alert('Please fill in all required fields.');
        return;
      }
      
      // In a real app, this would submit to a server
      console.log('Submitting incident report:', {
        craneId,
        incidentDate,
        incidentType,
        severity,
        title,
        description,
        reportedBy
      });
      
      // Show success notification
      showNotification('Incident report submitted successfully', 'success');
      
      // Reset form
      incidentForm.reset();
      uploadPreview.innerHTML = '';
    });
    
    // Save draft button
    const saveDraftBtn = document.getElementById('save-draft-btn');
    if (saveDraftBtn) {
      saveDraftBtn.addEventListener('click', () => {
        showNotification('Draft saved successfully', 'info');
      });
    }
    
    // Reset form button
    const resetFormBtn = document.getElementById('reset-form-btn');
    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset the form? All entered data will be lost.')) {
          incidentForm.reset();
          uploadPreview.innerHTML = '';
        }
      });
    }
  }
  
  // Table actions
  const viewIncidentBtns = document.querySelectorAll('.view-incident');
  const assignIncidentBtns = document.querySelectorAll('.assign-incident');
  const viewIncidentModal = document.getElementById('view-incident-modal');
  const assignIncidentModal = document.getElementById('assign-incident-modal');
  const closeModalButtons = document.querySelectorAll('.close-modal');
  const cancelModalButtons = document.querySelectorAll('.cancel-modal');
  
  // View incident
  viewIncidentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (viewIncidentModal) {
        viewIncidentModal.style.display = 'block';
      }
    });
  });
  
  // Assign incident
  assignIncidentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (assignIncidentModal) {
        assignIncidentModal.style.display = 'block';
      }
    });
  });
  
  // Close modal buttons
  closeModalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
      });
    });
  });
  
  // Cancel modal buttons
  cancelModalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
      });
    });
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
      event.target.style.display = 'none';
    }
  });
  
  // Assignment form submission
  const assignForm = document.getElementById('assign-form');
  if (assignForm) {
    assignForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form values
      const team = document.getElementById('assign-team').value;
      const technician = document.getElementById('assign-technician').value;
      
      // In a real app, this would submit to a server
      console.log('Assigning incident:', { team, technician });
      
      // Show success notification
      showNotification('Incident assigned successfully', 'success');
      
      // Close modal
      if (assignIncidentModal) {
        assignIncidentModal.style.display = 'none';
      }
    });
  }
  
  // Initialize charts if analytics tab is present
  const trendsTab = document.getElementById('trends-tab');
  if (trendsTab) {
    initializeCharts();
  }
  
  function initializeCharts() {
    // Only initialize charts if they don't already exist
    if (!window.incidentTypeChart) {
      // Incidents by Type Chart
      const typeCtx = document.getElementById('incidentsByTypeChart').getContext('2d');
      window.incidentTypeChart = new Chart(typeCtx, {
        type: 'pie',
        data: {
          labels: ['Mechanical', 'Electrical', 'Hydraulic', 'Structural', 'Control', 'Operator Error'],
          datasets: [{
            data: [12, 8, 15, 5, 7, 3],
            backgroundColor: [
              '#4CAF50',
              '#2196F3',
              '#FF9800',
              '#F44336',
              '#9C27B0',
              '#607D8B'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
            }
          }
        }
      });
      
      // Incidents by Severity Chart
      const severityCtx = document.getElementById('incidentsBySeverityChart').getContext('2d');
      window.severityChart = new Chart(severityCtx, {
        type: 'doughnut',
        data: {
          labels: ['Minor', 'Moderate', 'Critical'],
          datasets: [{
            data: [18, 15, 9],
            backgroundColor: [
              '#4CAF50',
              '#FF9800',
              '#F44336'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
            }
          }
        }
      });
      
      // Resolution Time Chart
      const timeCtx = document.getElementById('resolutionTimeChart').getContext('2d');
      window.timeChart = new Chart(timeCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [{
            label: 'Average Resolution Time (hours)',
            data: [18, 16, 14, 15, 13, 11, 10],
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Hours'
              }
            }
          }
        }
      });
      
      // Incidents by Crane Chart
      const craneCtx = document.getElementById('incidentsByCraneChart').getContext('2d');
      window.craneChart = new Chart(craneCtx, {
        type: 'bar',
        data: {
          labels: ['Crane #C-001', 'Crane #C-002', 'Crane #C-003', 'Crane #C-004'],
          datasets: [{
            label: 'Number of Incidents',
            data: [8, 10, 9, 14],
            backgroundColor: '#9C27B0'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Count'
              }
            }
          }
        }
      });
    }
  }
  
  // Notification functionality
  window.showNotification = function(message, type = 'info') {
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
  `;
  document.head.appendChild(style);
  
  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      // Clear user data
      sessionStorage.removeItem('currentUser');
      // Redirect to login
      window.location.href = 'login.html';
    });
  }
});
