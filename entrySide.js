document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const loginContainer = document.getElementById('loginContainer');
  const passwordContainer = document.getElementById('passwordContainer');
  const codeContainer = document.getElementById('codeContainer');
  const chatContainer = document.getElementById('chatContainer');
  const passwordDisplay = document.getElementById('passwordDisplay');
  const userTypeDisplay = document.getElementById('userTypeDisplay');
  
  // Function to hide all containers
  function hideAllContainers() {
    loginContainer.style.display = 'none';
    passwordContainer.style.display = 'none';
    codeContainer.style.display = 'none';
    chatContainer.style.display = 'none';
  }
  
  // Teacher button click handler
  const teacherBtn = document.getElementById('teacherBtn');
  if (teacherBtn) {
    teacherBtn.addEventListener('click', async function() {
      // Hide all containers first
      hideAllContainers();
  
      // Show loading in password display
      const passwordDisplay = document.getElementById('passwordDisplay');
      const passwordContainer = document.getElementById('passwordContainer');

      passwordDisplay.textContent = 'Loading...';
      passwordContainer.style.display = 'flex';
  
      try {
        // Include credentials to make cookies work
        const res = await fetch('http://localhost:3000/generate-password', {
          method: 'GET',
          credentials: 'include', // Changed from 'same-origin' to 'include' for cookies
          headers: {
            'Content-Type': 'application/json'
          }
        });
    
        const data = await res.json();
    
        // Display the password
        passwordDisplay.textContent = `${data.password}`;
    
        // Optional: Store in localStorage as backup
        localStorage.setItem('teacherPassword', data.password);
      } catch (error) {
        console.error('Error generating password:', error);
        passwordDisplay.textContent = 'Error generating code';
    
        // Fallback to localStorage if available
        const savedPassword = localStorage.getItem('teacherPassword');
        if (savedPassword) {
          passwordDisplay.textContent = `${savedPassword} (cached)`;
        }
      }
    });
  }

  // Check for existing password on page load
  async function checkExistingPassword() {
    const passwordDisplay = document.getElementById('passwordDisplay');
    const passwordContainer = document.getElementById('passwordContainer');
    
    try {
      // Try to get the password from the cookie
      const res = await fetch('http://localhost:3000/generate-password', {
        method: 'GET',
        credentials: 'include', // Changed to 'include' for cookies
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await res.json();
      
      // If we have a password, show it in the password container
      if (data.password) {
        hideAllContainers();
        passwordDisplay.textContent = `${data.password}`;
        passwordContainer.style.display = 'flex';
        
        // Also update localStorage backup
        localStorage.setItem('teacherPassword', data.password);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error retrieving password on page load:', error);
      
      // Fallback to localStorage if available
      const savedPassword = localStorage.getItem('teacherPassword');
      if (savedPassword) {
        hideAllContainers();
        passwordDisplay.textContent = `${savedPassword} (cached)`;
        passwordContainer.style.display = 'flex';
        return true;
      }
      return false;
    }
  }
  
  // Check for existing password on initial page load
  checkExistingPassword().then(hasPassword => {
    if (!hasPassword && loginContainer) {
      // If no password exists, show the login container
      hideAllContainers();
      loginContainer.style.display = 'flex';
    }
  });
  
  // Copy to clipboard functionality
  const copyPasswordBtn = document.getElementById('copyPasswordBtn');
  if (copyPasswordBtn) {
    copyPasswordBtn.addEventListener('click', function() {
      const password = passwordDisplay.textContent;
      navigator.clipboard.writeText(password).then(function() {
        // Show feedback
        copyPasswordBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyPasswordBtn.textContent = 'Copy to Clipboard';
        }, 2000);
      }).catch(function(err) {
        console.error('Could not copy text: ', err);
      });
    });
  }
  
  // Enter dash button for teacher
  const enterChatBtn = document.getElementById('enterClass');
  if (enterChatBtn) {
      enterChatBtn.addEventListener('click', function() {
        // Redirect to teacherDash.html
        window.location.href = 'teacherDash.html';
    });
  }
  
  // Student button click handler
  const studentBtn = document.getElementById('studentBtn');
  if (studentBtn) {
    studentBtn.addEventListener('click', function() {
      // Hide all containers first
      hideAllContainers();
      
      // Show code entry container
      codeContainer.style.display = 'flex';
    });
  }
  
  // Back button in code container
  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      // Hide all containers first
      hideAllContainers();
      
      // Show login container
      loginContainer.style.display = 'flex';
    });
  }
  
  // Submit code button
  const submitCodeBtn = document.getElementById('submitCodeBtn');
  const accessCodeInput = document.getElementById('accessCode');
  if (submitCodeBtn) {
    submitCodeBtn.addEventListener('click', async function() {
      // Call the validateStudentCode function from login.mjs
      await validateStudentCode();
      // Don't add any additional alert or validation code here
    });
  }
  
  
  
  // Make handleKeyPress function global so it can be accessed from HTML
  window.handleKeyPress = function(event) {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };
});