
document.addEventListener('DOMContentLoaded', function() {
  // Form switching logic
  const loginTab = document.getElementById('login-tab');
  const forgotTab = document.getElementById('forgot-tab');
  const loginForm = document.getElementById('login-form');
  const forgotForm = document.getElementById('forgot-form');

  loginTab.addEventListener('click', function() {
    loginTab.classList.add('active');
    forgotTab.classList.remove('active');
    loginForm.style.display = 'flex';
    forgotForm.style.display = 'none';
  });

  forgotTab.addEventListener('click', function() {
    forgotTab.classList.add('active');
    loginTab.classList.remove('active');
    forgotForm.style.display = 'flex';
    loginForm.style.display = 'none';
  });

  // Password visibility toggle
  const togglePassword = document.querySelector('.toggle-password');
  const passwordField = document.getElementById('password');

  togglePassword.addEventListener('click', function() {
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    this.querySelector('i').classList.toggle('fa-eye');
    this.querySelector('i').classList.toggle('fa-eye-slash');
  });

  // Dark mode toggle
  const themeSwitch = document.getElementById('theme-switch');
  
  // Check local storage for theme preference
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    themeSwitch.checked = true;
  }

  themeSwitch.addEventListener('change', function() {
    if (this.checked) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'enabled');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'disabled');
    }
  });

  // Mock user database for demonstration
  const users = [
    { 
      username: 'admin', 
      email: 'admin@cranemonitor.com', 
      password: 'admin123', 
      role: 'admin',
      requiresMFA: true
    },
    { 
      username: 'supervisor', 
      email: 'supervisor@cranemonitor.com', 
      password: 'super123', 
      role: 'supervisor',
      requiresMFA: true 
    },
    { 
      username: 'operator', 
      email: 'operator@cranemonitor.com', 
      password: 'operate123', 
      role: 'operator',
      requiresMFA: false
    }
  ];

  // Login form submission
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const mfaSection = document.getElementById('mfa-section');
    const mfaInput = document.getElementById('otp');
    
    // Basic validation
    if (!username || !password) {
      showNotification('Please enter both username and password', 'error');
      return;
    }
    
    // Find user
    const user = users.find(u => (u.username === username || u.email === username) && u.password === password);
    
    if (!user) {
      showNotification('Invalid username or password', 'error');
      // Log failed attempt
      logLoginActivity(username, false, 'Invalid credentials');
      return;
    }
    
    // Check if MFA is required for this user
    if (user.requiresMFA) {
      if (mfaSection.style.display === 'none') {
        // First login step passed, show MFA input
        mfaSection.style.display = 'block';
        showNotification('Please enter the verification code sent to your device', 'info');
        // In a real app, you would trigger sending the OTP here
        generateAndStoreMockOTP(user);
        return;
      } else {
        // Verify OTP
        const enteredOTP = mfaInput.value;
        if (!enteredOTP || enteredOTP !== sessionStorage.getItem('currentOTP')) {
          showNotification('Invalid verification code', 'error');
          return;
        }
      }
    }
    
    // Successful authentication
    showNotification(`Welcome back, ${user.username}!`, 'success');
    
    // Log successful login
    logLoginActivity(username, true, 'Successful login');
    
    // Store user info in session
    sessionStorage.setItem('currentUser', JSON.stringify({
      username: user.username,
      role: user.role,
      loginTime: new Date().toISOString()
    }));
    
    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  });

  // Forgot password form submission
  forgotForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('reset-email').value;
    
    if (!email) {
      showNotification('Please enter your email address', 'error');
      return;
    }
    
    // Check if email exists
    const user = users.find(u => u.email === email);
    
    if (!user) {
      // Don't reveal if email exists or not for security reasons
      showNotification('If your email is registered, you will receive password reset instructions shortly', 'info');
      return;
    }
    
    // In a real app, you would send a reset link to the email
    showNotification('Password reset instructions have been sent to your email', 'success');
    
    // Switch back to login form after 3 seconds
    setTimeout(() => {
      loginTab.click();
    }, 3000);
  });

  // Social login buttons
  const googleBtn = document.querySelector('.google-btn');
  const microsoftBtn = document.querySelector('.microsoft-btn');
  const ssoBtn = document.querySelector('.sso-btn');
  
  googleBtn.addEventListener('click', function() {
    // In a real app, you would integrate with Google OAuth
    mockSocialLogin('Google');
  });
  
  microsoftBtn.addEventListener('click', function() {
    // In a real app, you would integrate with Microsoft OAuth
    mockSocialLogin('Microsoft');
  });
  
  ssoBtn.addEventListener('click', function() {
    // In a real app, you would integrate with Enterprise SSO
    mockSocialLogin('Enterprise SSO');
  });

  // Helper functions
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
  
  function generateAndStoreMockOTP(user) {
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem('currentOTP', otp);
    
    // In a real app, you would send this OTP to the user's device
    console.log(`Mock OTP for ${user.username}: ${otp}`);
    
    // For demo purposes, show it in a notification
    showNotification(`Demo mode: Your OTP is ${otp}`, 'info');
  }
  
  function mockSocialLogin(provider) {
    showNotification(`Logging in with ${provider}...`, 'info');
    
    // Simulate API delay
    setTimeout(() => {
      // Mock successful login
      const mockUser = {
        username: `user_${Math.floor(Math.random() * 1000)}`,
        role: 'operator',
        loginTime: new Date().toISOString()
      };
      
      sessionStorage.setItem('currentUser', JSON.stringify(mockUser));
      
      showNotification(`Successfully authenticated with ${provider}`, 'success');
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    }, 2000);
  }
  
  function logLoginActivity(username, success, details) {
    const activity = {
      username: username,
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.1', // In a real app, you would get the actual IP
      userAgent: navigator.userAgent,
      success: success,
      details: details
    };
    
    // In a real app, you would send this to your server
    console.log('Login activity:', activity);
    
    // Store in local storage for demo purposes
    const loginHistory = JSON.parse(localStorage.getItem('loginHistory') || '[]');
    loginHistory.push(activity);
    localStorage.setItem('loginHistory', JSON.stringify(loginHistory));
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
      border-left: 4px solid var(--success-color);
    }
    
    .notification.error {
      border-left: 4px solid var(--danger-color);
    }
    
    .notification.warning {
      border-left: 4px solid var(--warning-color);
    }
    
    .notification.info {
      border-left: 4px solid var(--info-color);
    }
    
    .notification.success i {
      color: var(--success-color);
    }
    
    .notification.error i {
      color: var(--danger-color);
    }
    
    .notification.warning i {
      color: var(--warning-color);
    }
    
    .notification.info i {
      color: var(--info-color);
    }
  `;
  document.head.appendChild(style);
});
