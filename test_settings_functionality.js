// Comprehensive Settings Page Functionality Test
// This script tests all interactive elements on the settings page

console.log('🧪 Starting Settings Page Functionality Test...');

// Test 1: Check if API connection works
async function testBackendConnection() {
  console.log('\n1️⃣ Testing Backend API Connection...');
  try {
    const response = await fetch('https://lifestyle-design-backend-v2.onrender.com/api/settings');
    const data = await response.json();
    if (data.success) {
      console.log('✅ Backend API responding correctly');
      console.log('📋 Credentials found:', Object.keys(data.settings).length, 'fields');
      return data.settings;
    } else {
      console.log('❌ Backend API error:', data);
      return null;
    }
  } catch (error) {
    console.log('❌ Backend connection failed:', error);
    return null;
  }
}

// Test 2: Check if credentials load into form fields
function testCredentialLoading(savedSettings) {
  console.log('\n2️⃣ Testing Credential Loading into Form Fields...');
  
  const testFields = [
    'instagramToken', 'instagramAccount', 'youtubeToken', 
    'youtubeRefresh', 'youtubeChannel', 'youtubeClientId'
  ];
  
  testFields.forEach(field => {
    const input = document.querySelector(`input[value*="${savedSettings[field]}"]`);
    if (input && savedSettings[field]) {
      console.log(`✅ ${field}: Loaded correctly (${savedSettings[field].length} chars)`);
    } else if (savedSettings[field]) {
      console.log(`❌ ${field}: Not loaded into form (should show: ${savedSettings[field].substring(0, 20)}...)`);
    } else {
      console.log(`⚪ ${field}: Empty in database`);
    }
  });
}

// Test 3: Check save button functionality
function testSaveButtons() {
  console.log('\n3️⃣ Testing Save Button Functionality...');
  
  const saveButtons = [
    'Save Core Credentials',
    'Save Optional Credentials', 
    'Save Mode Configuration',
    'Save Scheduler Settings',
    'Save Visual Settings',
    'Save Storage Settings'
  ];
  
  saveButtons.forEach(buttonText => {
    const button = Array.from(document.querySelectorAll('button')).find(
      btn => btn.textContent.includes(buttonText)
    );
    
    if (button && button.onclick) {
      console.log(`✅ ${buttonText}: Button found with click handler`);
    } else if (button) {
      console.log(`⚠️ ${buttonText}: Button found but no click handler`);
    } else {
      console.log(`❌ ${buttonText}: Button not found`);
    }
  });
}

// Test 4: Check toggle switch functionality
function testToggleSwitches() {
  console.log('\n4️⃣ Testing Toggle Switch Functionality...');
  
  const toggles = document.querySelectorAll('.toggle-switch');
  console.log(`Found ${toggles.length} toggle switches`);
  
  toggles.forEach((toggle, index) => {
    if (toggle.onclick) {
      console.log(`✅ Toggle ${index + 1}: Has click handler`);
    } else {
      console.log(`❌ Toggle ${index + 1}: No click handler`);
    }
  });
}

// Test 5: Test form input responsiveness
function testInputFields() {
  console.log('\n5️⃣ Testing Input Field Responsiveness...');
  
  const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
  console.log(`Found ${inputs.length} input fields`);
  
  // Test typing in first few inputs
  inputs.forEach((input, index) => {
    if (index < 3) { // Test first 3 inputs
      const originalValue = input.value;
      input.focus();
      input.value = 'TEST_' + Date.now();
      
      setTimeout(() => {
        if (input.value.startsWith('TEST_')) {
          console.log(`✅ Input ${index + 1}: Accepts user input correctly`);
        } else {
          console.log(`❌ Input ${index + 1}: Input gets overwritten (${input.value})`);
        }
        input.value = originalValue; // Restore original
      }, 100);
    }
  });
}

// Test 6: Check for console errors
function testConsoleErrors() {
  console.log('\n6️⃣ Checking for JavaScript Errors...');
  
  const originalError = console.error;
  const errors = [];
  
  console.error = function(...args) {
    errors.push(args.join(' '));
    originalError.apply(console, args);
  };
  
  setTimeout(() => {
    console.error = originalError;
    if (errors.length === 0) {
      console.log('✅ No JavaScript errors detected');
    } else {
      console.log('❌ JavaScript errors found:');
      errors.forEach(error => console.log('  ', error));
    }
  }, 2000);
}

// Run all tests
async function runAllTests() {
  const savedSettings = await testBackendConnection();
  if (savedSettings) {
    testCredentialLoading(savedSettings);
  }
  testSaveButtons();
  testToggleSwitches();
  testInputFields();
  testConsoleErrors();
  
  console.log('\n🎯 Test completed! Check results above.');
}

// Auto-run if on settings page
if (window.location.pathname.includes('settings')) {
  runAllTests();
} else {
  console.log('❌ Not on settings page. Navigate to settings first.');
}