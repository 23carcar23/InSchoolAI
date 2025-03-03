


// DOM Elements
const loginContainer = document.getElementById('loginContainer');
const codeContainer = document.getElementById('codeContainer');
const chatContainer = document.getElementById('chatContainer');
const userTypeDisplay = document.getElementById('userTypeDisplay');
const accessCodeInput = document.getElementById('accessCode');

// Buttons
const teacherBtn = document.getElementById('teacherBtn');
const studentBtn = document.getElementById('studentBtn');
const submitCodeBtn = document.getElementById('submitCodeBtn');
const backBtn = document.getElementById('backBtn');




studentBtn.addEventListener('click', () => {
  loginContainer.style.display = 'none';
  codeContainer.style.display = 'flex';
  accessCodeInput.focus();
});

submitCodeBtn.addEventListener('click', validateStudentCode);

backBtn.addEventListener('click', () => {
  codeContainer.style.display = 'none';
  accessCodeInput.value = '';
  window.location.href = 'index.html';
});

accessCodeInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    validateStudentCode();
  }
});

// Functions
async function validateStudentCode() {
  const enteredCode = accessCodeInput.value.trim(); // Ensure no spaces

  if (!enteredCode) {
    alert('Please enter a code.');
    return;
  }

  
    //const response = await fetch(`http://localhost:3000/check-password/${enteredCode}`);
    //const data = await response.json();
    //data.exists === true////// put in if statment

    // Strictly check if 'exists' is true
  if (enteredCode == 82783) {  
    window.location.href = 'chat.html';
  } else {
      
    accessCodeInput.value = '';
    accessCodeInput.focus();
      
  }
  
}



function showChatInterface(userType) {
  loginContainer.style.display = 'none';
  codeContainer.style.display = 'none';
  chatContainer.style.display = 'flex';
  
  userTypeDisplay.textContent = userType;
  userTypeDisplay.className = 'user-type ' + userType.toLowerCase();
  
  document.getElementById('userInput').focus();
}



///////////////////////



