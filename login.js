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

// Constants
const CORRECT_CODE = '12345';

// Event Listeners
teacherBtn.addEventListener('click', () => {
  showChatInterface('Teacher');
});

studentBtn.addEventListener('click', () => {
  loginContainer.style.display = 'none';
  codeContainer.style.display = 'flex';
  accessCodeInput.focus();
});

submitCodeBtn.addEventListener('click', validateStudentCode);

backBtn.addEventListener('click', () => {
  codeContainer.style.display = 'none';
  loginContainer.style.display = 'flex';
  accessCodeInput.value = '';
});

accessCodeInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    validateStudentCode();
  }
});

// Functions
function validateStudentCode() {
  const enteredCode = accessCodeInput.value;
  
  if (enteredCode === CORRECT_CODE) {
    showChatInterface('Student');
  } else {
    alert('Incorrect code. Please try again.');
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