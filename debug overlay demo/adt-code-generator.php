<?php
/**
 * ADT Overlay Demo - Code Generator
 * Password-protected tool for generating demo code
 * 
 * @package Advanced_DataLayer_Tracker
 * @version 1.0.0
 */

// Configuration
define('GENERATOR_PASSWORD', 'adt2025'); // Change this password!

// Session handling
session_start();

// Check if user is logged in
$is_authenticated = isset($_SESSION['adt_generator_auth']) && $_SESSION['adt_generator_auth'] === true;

// Handle login
if (isset($_POST['generator_password'])) {
    if ($_POST['generator_password'] === GENERATOR_PASSWORD) {
        $_SESSION['adt_generator_auth'] = true;
        $is_authenticated = true;
    } else {
        $login_error = 'Incorrect password. Please try again.';
    }
}

// Handle logout
if (isset($_GET['logout'])) {
    unset($_SESSION['adt_generator_auth']);
    session_destroy();
    header('Location: ' . $_SERVER['PHP_SELF']);
    exit;
}

// If not authenticated, show login form
if (!$is_authenticated) {
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ADT Code Generator - Login</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .login-container {
                background: white;
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                max-width: 400px;
                width: 100%;
            }
            
            .login-header {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .login-header h1 {
                font-size: 24px;
                color: #333;
                margin-bottom: 10px;
            }
            
            .login-header p {
                color: #666;
                font-size: 14px;
            }
            
            .form-group {
                margin-bottom: 20px;
            }
            
            label {
                display: block;
                margin-bottom: 8px;
                color: #333;
                font-weight: 500;
                font-size: 14px;
            }
            
            input[type="password"] {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 15px;
                transition: border-color 0.2s;
            }
            
            input[type="password"]:focus {
                outline: none;
                border-color: #667eea;
            }
            
            .btn-login {
                width: 100%;
                padding: 14px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .btn-login:hover {
                background: #5568d3;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }
            
            .error-message {
                background: #fee;
                color: #c33;
                padding: 12px;
                border-radius: 8px;
                margin-bottom: 20px;
                font-size: 14px;
                border-left: 4px solid #c33;
            }
        </style>
    </head>
    <body>
        <div class="login-container">
            <div class="login-header">
                <h1>🎬 ADT Code Generator</h1>
                <p>Enter password to access the code generator</p>
            </div>
            
            <?php if (isset($login_error)): ?>
                <div class="error-message"><?php echo htmlspecialchars($login_error); ?></div>
            <?php endif; ?>
            
            <form method="POST" action="">
                <div class="form-group">
                    <label for="generator_password">Password</label>
                    <input type="password" id="generator_password" name="generator_password" required autofocus>
                </div>
                <button type="submit" class="btn-login">Access Generator</button>
            </form>
        </div>
    </body>
    </html>
    <?php
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ADT Overlay Demo - Code Generator</title>
  <script src="https://datalayer-tracker.com/debug-demo-helper.js?v=2.0"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    
    header {
      background: white;
      padding: 30px;
      border-radius: 8px;
      margin-bottom: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .header-content h1 {
      font-size: 28px;
      color: #333;
      margin-bottom: 10px;
    }
    
    .subtitle {
      color: #666;
      font-size: 16px;
    }
    
    .logout-btn {
      padding: 10px 20px;
      background: #f44336;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s;
    }
    
    .logout-btn:hover {
      background: #d32f2f;
      transform: translateY(-1px);
    }
    
    .reset-btn {
      padding: 10px 20px;
      background: #ff9800;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
    }
    
    .reset-btn:hover {
      background: #f57c00;
      transform: translateY(-1px);
    }
    
    .main-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    @media (max-width: 1024px) {
      .main-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .panel {
      background: white;
      padding: 25px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .panel h2 {
      font-size: 20px;
      color: #333;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #f0f0f0;
    }
    
    .section {
      margin-bottom: 25px;
    }
    
    .section:last-child {
      margin-bottom: 0;
    }
    
    .section h3 {
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 12px;
      font-weight: 600;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    label {
      display: block;
      font-size: 14px;
      color: #333;
      margin-bottom: 6px;
      font-weight: 500;
    }
    
    input[type="text"],
    input[type="number"],
    input[type="file"],
    input[type="color"],
    input[type="range"],
    select,
    textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
      transition: border-color 0.2s;
    }
    
    input[type="color"] {
      height: 45px;
      padding: 5px;
      cursor: pointer;
    }
    
    input[type="range"] {
      width: calc(100% - 60px);
      display: inline-block;
      vertical-align: middle;
    }
    
    #opacity-value {
      display: inline-block;
      width: 50px;
      text-align: right;
      font-weight: 600;
      color: #333;
      margin-left: 10px;
    }
    
    textarea {
      resize: vertical;
      min-height: 80px;
    }
    
    input[type="text"]:focus,
    input[type="number"]:focus,
    input[type="color"]:focus,
    select:focus,
    textarea:focus {
      outline: none;
      border-color: #4CAF50;
    }
    
    .radio-group,
    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .radio-option,
    .checkbox-option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px;
      background: #f8f9fa;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s;
    }
    
    .radio-option:hover,
    .checkbox-option:hover {
      background: #e9ecef;
    }
    
    .radio-option input[type="radio"],
    .checkbox-option input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
    
    .radio-option label,
    .checkbox-option label {
      flex: 1;
      margin: 0;
      cursor: pointer;
      font-weight: normal;
    }
    
    .event-selector {
      border: 1px solid #ddd;
      border-radius: 6px;
      max-height: 300px;
      overflow-y: auto;
      padding: 10px;
      background: #f8f9fa;
    }
    
    .event-category {
      margin-bottom: 15px;
    }
    
    .event-category:last-child {
      margin-bottom: 0;
    }
    
    .category-header {
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
      padding: 8px;
      background: white;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }
    
    .category-header input[type="checkbox"] {
      width: 18px;
      height: 18px;
    }
    
    .event-list {
      padding-left: 15px;
    }
    
    .help-text {
      font-size: 12px;
      color: #666;
      margin-top: 5px;
    }
    
    .button {
      width: 100%;
      padding: 12px 20px;
      border: none;
      border-radius: 6px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .button-primary {
      background: #4CAF50;
      color: white;
    }
    
    .button-primary:hover {
      background: #45a049;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    }
    
    .button:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
    
    .button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
    
    .code-output {
      background: #1e1e1e;
      color: #d4d4d4;
      padding: 20px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.6;
      overflow-x: auto;
      position: relative;
      margin-bottom: 15px;
    }
    
    .code-output pre {
      margin: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    
    .copy-button {
      position: absolute;
      top: 15px;
      right: 15px;
      padding: 8px 15px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: all 0.2s;
    }
    
    .copy-button:hover {
      background: #45a049;
    }
    
    .copy-button.copied {
      background: #2196F3;
    }
    
    .alert {
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 20px;
      font-size: 14px;
    }
    
    .alert-info {
      background: #e3f2fd;
      color: #1565c0;
      border-left: 4px solid #2196F3;
    }
    
    .alert-warning {
      background: #fff3e0;
      color: #e65100;
      border-left: 4px solid #ff9800;
    }
    
    .hidden {
      display: none;
    }
    
    .sequence-controls {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 6px;
      margin-top: 15px;
    }
    
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      margin-left: 8px;
    }
    
    .badge-new {
      background: #4CAF50;
      color: white;
    }
    
    .preloader-preview {
      margin-top: 15px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 6px;
      border: 2px dashed #ddd;
    }
    
    .preloader-preview-label {
      font-size: 12px;
      color: #666;
      margin-bottom: 10px;
    }
    
    .preview-box {
      background: white;
      padding: 20px;
      border-radius: 6px;
      text-align: center;
      min-height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 10px;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #4CAF50;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .preview-image {
      max-width: 150px;
      max-height: 150px;
      border-radius: 4px;
    }
  </style>
</head>
<body>

<div class="container">
  <header>
    <div class="header-content">
      <h1>🎬 ADT Demo Generator</h1>
      <p class="subtitle">Configure your demo and get production-ready code instantly</p>
    </div>
    <div style="display: flex; gap: 10px;">
      <button class="reset-btn" id="reset-settings-btn">Reset Settings</button>
      <a href="?logout" class="logout-btn">Logout</a>
    </div>
  </header>

  <div class="main-grid">
    <!-- Configuration Panel -->
    <div class="panel">
      <h2>Configuration</h2>

      <!-- Step 1: Demo Type -->
      <div class="section">
        <h3>1. Demo Type</h3>
        <div class="radio-group">
          <div class="radio-option">
            <input type="radio" id="type-static" name="demo-type" value="static" checked>
            <label for="type-static">
              <strong>Static Demo</strong><br>
              <span class="help-text">Pin or open specific events (no animation)</span>
            </label>
          </div>
          <div class="radio-option">
            <input type="radio" id="type-sequence" name="demo-type" value="sequence">
            <label for="type-sequence">
              <strong>Sequence Demo</strong> <span class="badge badge-new">New</span><br>
              <span class="help-text">Automated walkthrough with timing controls</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Step 2: Iframe ID -->
      <div class="section">
        <h3>2. Iframe Identifier</h3>
        <div class="form-group">
          <label for="iframe-id">CSS Selector (e.g., #demo1, #my-overlay)</label>
          <input type="text" id="iframe-id" value="#demo1" placeholder="#demo1">
          <p class="help-text">Unique ID for your iframe element</p>
        </div>
      </div>

      <!-- Step 3: Event Selection -->
      <div class="section">
        <h3>3. Select Events</h3>
        <div class="event-selector" id="event-selector">
          <!-- Will be populated by JavaScript -->
        </div>
        <p class="help-text" style="margin-top: 10px;">
          <span id="selected-count">0</span> events selected
        </p>
      </div>

      <!-- Step 4: Event Behavior (Static Only) -->
      <div class="section" id="static-options">
        <h3>4. Event Behavior</h3>
        <div class="radio-group">
          <div class="radio-option">
            <input type="radio" id="behavior-pin" name="event-behavior" value="pin" checked>
            <label for="behavior-pin">
              <strong>Pin Events</strong><br>
              <span class="help-text">Move to pinned section at top</span>
            </label>
          </div>
          <div class="radio-option">
            <input type="radio" id="behavior-open" name="event-behavior" value="open">
            <label for="behavior-open">
              <strong>Open Events</strong><br>
              <span class="help-text">Expand in main list (no pinning)</span>
            </label>
          </div>
          <div class="radio-option">
            <input type="radio" id="behavior-both" name="event-behavior" value="both">
            <label for="behavior-both">
              <strong>Pin & Open</strong><br>
              <span class="help-text">Pin some, open others (configure below)</span>
            </label>
          </div>
        </div>

        <!-- Pin & Open Split -->
        <div id="split-config" class="hidden sequence-controls">
          <label>Events to Pin (others will be opened):</label>
          <input type="text" id="pin-events" placeholder="e.g., purchase, begin_checkout">
          <p class="help-text">Comma-separated event names</p>
        </div>
      </div>

      <!-- Step 5: Preloader Options -->
      <div class="section">
        <h3>5. Preloader (Optional)</h3>
        
        <div class="form-group">
          <label>Enable Preloader</label>
          <div class="checkbox-option">
            <input type="checkbox" id="enable-preloader">
            <label for="enable-preloader">Show loading animation before iframe loads</label>
          </div>
        </div>

        <div id="preloader-options" class="hidden">
          <div class="form-group">
            <label for="preloader-type">Preloader Type</label>
            <select id="preloader-type">
              <option value="spinner">Spinner (Default)</option>
              <option value="text">Text Message</option>
              <option value="image">Custom Image</option>
              <option value="both">Image + Spinner</option>
            </select>
          </div>

          <div class="form-group">
            <label for="preloader-bg-color">Background Color</label>
            <input type="color" id="preloader-bg-color" value="#f8f9fa">
          </div>

          <div class="form-group">
            <label for="preloader-opacity">Background Opacity</label>
            <input type="range" id="preloader-opacity" min="0" max="100" value="100" step="5">
            <span id="opacity-value">100%</span>
          </div>

          <div class="form-group hidden" id="preloader-text-group">
            <label for="preloader-text">Loading Text</label>
            <input type="text" id="preloader-text" value="Loading demo..." placeholder="Loading demo...">
          </div>

          <div class="form-group hidden" id="preloader-image-group">
            <label for="preloader-image-url">Image URL</label>
            <input type="text" id="preloader-image-url" placeholder="https://example.com/logo.png">
            <p class="help-text">Enter a URL to an image (PNG, JPG, SVG)</p>
          </div>

          <div class="preloader-preview">
            <div class="preloader-preview-label">Preview:</div>
            <div class="preview-box" id="preloader-preview">
              <div class="spinner"></div>
              <div>Loading demo...</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 6: Sequence Options (Sequence Only) -->
      <div class="section hidden" id="sequence-options">
        <h3>6. Sequence Settings</h3>
        
        <div class="form-group">
          <label for="duration">Duration per Event (seconds)</label>
          <input type="number" id="duration" value="5" min="1" max="30">
        </div>

        <div class="checkbox-group">
          <div class="checkbox-option">
            <input type="checkbox" id="loop-enabled">
            <label for="loop-enabled">Loop continuously</label>
          </div>
          <div class="checkbox-option">
            <input type="checkbox" id="disable-interaction" checked>
            <label for="disable-interaction">Disable user interactions</label>
          </div>
          <div class="checkbox-option">
            <input type="checkbox" id="pause-scroll" checked>
            <label for="pause-scroll">Pause auto-scroll during sequence</label>
          </div>
          <div class="checkbox-option">
            <input type="checkbox" id="pin-in-sequence">
            <label for="pin-in-sequence">Pin events (like static demo) - allows scroll to continue</label>
          </div>
        </div>
        
        <div class="alert alert-info" style="margin-top: 15px; font-size: 13px;">
          <strong>Tip:</strong> Enable "Pin events" to show events in the pinned section while auto-scroll continues in the background. This creates a dynamic effect where the pinned event stays visible while new events scroll below.
        </div>
      </div>

      <!-- Generate Button -->
      <div class="section">
        <button class="button button-primary" id="generate-btn">
          Generate Code
        </button>
      </div>
    </div>

    <!-- Output Panel -->
    <div class="panel">
      <h2>Generated Code</h2>

      <div id="output-container" class="hidden">
        <div class="alert alert-info">
          <strong>Installation Steps:</strong><br>
          1. Copy the HTML code and paste it into your page<br>
          2. Copy the JavaScript code and paste it after the iframe<br>
          3. Adjust the iframe src URL if needed
        </div>

        <div class="section">
          <h3>HTML (Iframe)</h3>
          <div class="code-output">
            <button class="copy-button" data-target="html-code">Copy</button>
            <pre id="html-code"></pre>
          </div>
        </div>

        <div class="section">
          <h3>JavaScript (Configuration)</h3>
          <div class="code-output">
            <button class="copy-button" data-target="js-code">Copy</button>
            <pre id="js-code"></pre>
          </div>
        </div>

        <div class="section">
          <h3>Required Script</h3>
          <div class="alert alert-warning">
            Don't forget to include the helper script before your configuration code:
          </div>
          <div class="code-output">
            <button class="copy-button" data-target="script-include">Copy</button>
            <pre id="script-include">&lt;script src="https://datalayer-tracker.com/debug-demo-helper.js?v=2.0"&gt;&lt;/script&gt;</pre>
          </div>
        </div>
      </div>

      <div id="placeholder" class="alert alert-info">
        Configure your demo settings and click "Generate Code" to see your custom code here.
      </div>
    </div>
  </div>
  
  <!-- Preview Panel -->
  <div class="panel" style="grid-column: 1 / -1;">
    <h2>Live Preview</h2>
    
    <div class="alert alert-info">
      <strong>Preview Mode:</strong> See your configuration in action below. Click "Start Preview" to test the sequence or static demo.
    </div>
    
    <div style="display: flex; gap: 10px; margin-bottom: 20px;">
      <button class="button button-primary" id="start-preview-btn" style="width: auto;">
        ▶ Start Preview
      </button>
      <button class="button" id="stop-preview-btn" style="width: auto; background: #f44336; color: white;">
        ⏹ Stop Preview
      </button>
      <button class="button" id="refresh-preview-btn" style="width: auto; background: #2196F3; color: white;">
        🔄 Refresh Preview
      </button>
    </div>
    
    <div id="preview-container" style="background: #f8f9fa; padding: 30px; border-radius: 8px; text-align: center; min-height: 300px;">
      <div id="preview-content">
        <!-- Preview iframe will be injected here -->
      </div>
    </div>
  </div>
</div>

<script>
(function() {
  'use strict';

  // ============= Settings Persistence =============
  const STORAGE_KEY = 'adt_generator_settings';
  
  // Default settings
  const defaultSettings = {
    demoType: 'static',
    iframeId: '#demo1',
    eventBehavior: 'pin',
    duration: 5,
    loopEnabled: false,
    disableInteraction: true,
    pauseScroll: true,
    pinInSequence: false,
    enablePreloader: false,
    preloaderType: 'spinner',
    preloaderText: 'Loading demo...',
    preloaderImageUrl: '',
    preloaderBgColor: '#f8f9fa',
    preloaderOpacity: 100,
    selectedEvents: [],
    pinEvents: ''
  };
  
  // Save settings to localStorage
  function saveSettings() {
    const settings = {
      demoType: document.querySelector('input[name="demo-type"]:checked').value,
      iframeId: document.getElementById('iframe-id').value,
      eventBehavior: document.querySelector('input[name="event-behavior"]:checked').value,
      duration: document.getElementById('duration').value,
      loopEnabled: document.getElementById('loop-enabled').checked,
      disableInteraction: document.getElementById('disable-interaction').checked,
      pauseScroll: document.getElementById('pause-scroll').checked,
      pinInSequence: document.getElementById('pin-in-sequence').checked,
      enablePreloader: document.getElementById('enable-preloader').checked,
      preloaderType: document.getElementById('preloader-type').value,
      preloaderText: document.getElementById('preloader-text').value,
      preloaderImageUrl: document.getElementById('preloader-image-url').value,
      preloaderBgColor: document.getElementById('preloader-bg-color').value,
      preloaderOpacity: document.getElementById('preloader-opacity').value,
      selectedEvents: Array.from(document.querySelectorAll('.event-list input[type="checkbox"]:checked'))
        .map(function(cb) { return cb.value; }),
      pinEvents: document.getElementById('pin-events').value
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    // console.log('[ADT Generator] Settings saved');
  }
  
  // Load settings from localStorage
  function loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;
      
      const settings = JSON.parse(saved);
      // console.log('[ADT Generator] Settings loaded', settings);
      return settings;
    } catch (e) {
      // console.error('[ADT Generator] Error loading settings:', e);
      return null;
    }
  }
  
  // Apply settings to form
  function applySettings(settings) {
    if (!settings) return;
    
    // Demo type
    document.querySelector('input[name="demo-type"][value="' + settings.demoType + '"]').checked = true;
    document.querySelector('input[name="demo-type"][value="' + settings.demoType + '"]').dispatchEvent(new Event('change'));
    
    // Iframe ID
    document.getElementById('iframe-id').value = settings.iframeId;
    
    // Event behavior
    document.querySelector('input[name="event-behavior"][value="' + settings.eventBehavior + '"]').checked = true;
    document.querySelector('input[name="event-behavior"][value="' + settings.eventBehavior + '"]').dispatchEvent(new Event('change'));
    
    // Sequence settings
    document.getElementById('duration').value = settings.duration;
    document.getElementById('loop-enabled').checked = settings.loopEnabled;
    document.getElementById('disable-interaction').checked = settings.disableInteraction;
    document.getElementById('pause-scroll').checked = settings.pauseScroll;
    document.getElementById('pin-in-sequence').checked = settings.pinInSequence;
    
    // Preloader settings
    document.getElementById('enable-preloader').checked = settings.enablePreloader;
    document.getElementById('enable-preloader').dispatchEvent(new Event('change'));
    document.getElementById('preloader-type').value = settings.preloaderType;
    document.getElementById('preloader-type').dispatchEvent(new Event('change'));
    document.getElementById('preloader-text').value = settings.preloaderText;
    document.getElementById('preloader-image-url').value = settings.preloaderImageUrl;
    document.getElementById('preloader-bg-color').value = settings.preloaderBgColor;
    document.getElementById('preloader-opacity').value = settings.preloaderOpacity;
    document.getElementById('opacity-value').textContent = settings.preloaderOpacity + '%';
    
    // Pin events
    document.getElementById('pin-events').value = settings.pinEvents;
    
    // Selected events (wait for event selector to be built)
    setTimeout(function() {
      settings.selectedEvents.forEach(function(eventValue) {
        const checkbox = document.getElementById('event-' + eventValue);
        if (checkbox) checkbox.checked = true;
      });
      updateSelectedCount();
      updatePreloaderPreview();
    }, 100);
  }
  
  // Reset to default settings
  function resetSettings() {
    if (!confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      return;
    }
    
    localStorage.removeItem(STORAGE_KEY);
    applySettings(defaultSettings);
    
    // Clear output
    document.getElementById('placeholder').classList.remove('hidden');
    document.getElementById('output-container').classList.add('hidden');
    
    // console.log('[ADT Generator] Settings reset to defaults');
    alert('Settings have been reset to defaults!');
  }

  // Event categories and definitions
  const eventCategories = {
    'Core Events': [
      'page_view',
      'gtm.js',
      'gtm.dom',
      'gtm.load'
    ],
    'Engagement': [
      'scroll_depth',
      'time_on_page',
      'active_time',
      'hover_intent',
      'content_intelligence'
    ],
    'E-commerce': [
      'view_item',
      'view_item_list',
      'add_to_cart',
      'remove_from_cart',
      'view_cart',
      'begin_checkout',
      'add_shipping_info',
      'add_payment_info',
      'purchase',
      'refund'
    ],
    'Forms': [
      'form_start',
      'form_field_interaction',
      'form_submit',
      'form_error',
      'form_abandon'
    ],
    'Session Summaries': [
      'session_engagement_summary',
      'session_content_summary',
      'session_commerce_summary',
      'session_attribution_summary'
    ],
    'Video': [
      'video_start',
      'video_progress',
      'video_complete'
    ],
    'Custom': [
      'custom_event'
    ]
  };

  // Build event selector
  function buildEventSelector() {
    const container = document.getElementById('event-selector');
    
    Object.keys(eventCategories).forEach(function(category) {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'event-category';
      
      const categoryId = 'cat-' + category.replace(/\s+/g, '-');
      const categoryHeader = document.createElement('div');
      categoryHeader.className = 'category-header';
      categoryHeader.innerHTML = '<input type="checkbox" id="' + categoryId + '" data-category="' + category + '"><label for="' + categoryId + '">' + category + '</label>';
      categoryDiv.appendChild(categoryHeader);
      
      const eventList = document.createElement('div');
      eventList.className = 'event-list';
      
      eventCategories[category].forEach(function(event) {
        const checkboxOption = document.createElement('div');
        checkboxOption.className = 'checkbox-option';
        checkboxOption.innerHTML = '<input type="checkbox" id="event-' + event + '" value="' + event + '"><label for="event-' + event + '">' + event + '</label>';
        eventList.appendChild(checkboxOption);
      });
      
      categoryDiv.appendChild(eventList);
      container.appendChild(categoryDiv);
    });

    // Add event listeners to category checkboxes
    container.querySelectorAll('.category-header input[type="checkbox"]').forEach(function(checkbox) {
      checkbox.addEventListener('change', function() {
        toggleCategory(this);
      });
    });

    // Add event listeners to event checkboxes
    container.querySelectorAll('.event-list input[type="checkbox"]').forEach(function(checkbox) {
      checkbox.addEventListener('change', updateSelectedCount);
    });
  }

  // Toggle entire category
  function toggleCategory(checkbox) {
    const category = checkbox.dataset.category;
    const events = eventCategories[category];
    const isChecked = checkbox.checked;
    
    events.forEach(function(event) {
      const eventCheckbox = document.getElementById('event-' + event);
      if (eventCheckbox) {
        eventCheckbox.checked = isChecked;
      }
    });
    updateSelectedCount();
  }

  // Update selected count
  function updateSelectedCount() {
    const checkboxes = document.querySelectorAll('.event-list input[type="checkbox"]:checked');
    document.getElementById('selected-count').textContent = checkboxes.length;
  }

  // Toggle between static and sequence options
  document.querySelectorAll('input[name="demo-type"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
      const staticOptions = document.getElementById('static-options');
      const sequenceOptions = document.getElementById('sequence-options');
      
      if (this.value === 'sequence') {
        staticOptions.classList.add('hidden');
        sequenceOptions.classList.remove('hidden');
      } else {
        staticOptions.classList.remove('hidden');
        sequenceOptions.classList.add('hidden');
      }
    });
  });

  // Toggle split config visibility
  document.querySelectorAll('input[name="event-behavior"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
      const splitConfig = document.getElementById('split-config');
      if (this.value === 'both') {
        splitConfig.classList.remove('hidden');
      } else {
        splitConfig.classList.add('hidden');
      }
    });
  });

  // Preloader toggle
  document.getElementById('enable-preloader').addEventListener('change', function() {
    const preloaderOptions = document.getElementById('preloader-options');
    if (this.checked) {
      preloaderOptions.classList.remove('hidden');
    } else {
      preloaderOptions.classList.add('hidden');
    }
  });

  // Preloader type change
  document.getElementById('preloader-type').addEventListener('change', function() {
    const textGroup = document.getElementById('preloader-text-group');
    const imageGroup = document.getElementById('preloader-image-group');
    
    textGroup.classList.add('hidden');
    imageGroup.classList.add('hidden');
    
    if (this.value === 'text' || this.value === 'spinner') {
      textGroup.classList.remove('hidden');
    } else if (this.value === 'image' || this.value === 'both') {
      imageGroup.classList.remove('hidden');
      if (this.value === 'both') {
        textGroup.classList.remove('hidden');
      }
    }
    
    updatePreloaderPreview();
  });

  // Opacity slider update
  document.getElementById('preloader-opacity').addEventListener('input', function() {
    document.getElementById('opacity-value').textContent = this.value + '%';
    updatePreloaderPreview();
  });

  // Background color update
  document.getElementById('preloader-bg-color').addEventListener('input', updatePreloaderPreview);

  // Update preloader preview
  function updatePreloaderPreview() {
    const preview = document.getElementById('preloader-preview');
    const type = document.getElementById('preloader-type').value;
    const text = document.getElementById('preloader-text').value || 'Loading demo...';
    const imageUrl = document.getElementById('preloader-image-url').value;
    const bgColor = document.getElementById('preloader-bg-color').value;
    const opacity = document.getElementById('preloader-opacity').value / 100;
    
    // Convert hex to rgba
    const r = parseInt(bgColor.substr(1, 2), 16);
    const g = parseInt(bgColor.substr(3, 2), 16);
    const b = parseInt(bgColor.substr(5, 2), 16);
    const bgColorRgba = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
    
    preview.style.background = bgColorRgba;
    preview.innerHTML = '';
    
    if (type === 'spinner') {
      preview.innerHTML = '<div class="spinner"></div><div>' + text + '</div>';
    } else if (type === 'text') {
      preview.innerHTML = '<div>' + text + '</div>';
    } else if (type === 'image' && imageUrl) {
      preview.innerHTML = '<img src="' + imageUrl + '" class="preview-image" alt="Preloader">';
    } else if (type === 'both' && imageUrl) {
      preview.innerHTML = '<img src="' + imageUrl + '" class="preview-image" alt="Preloader"><div class="spinner"></div>';
    } else {
      preview.innerHTML = '<div class="spinner"></div><div>' + text + '</div>';
    }
  }

  // Listen for preloader input changes
  document.getElementById('preloader-text').addEventListener('input', updatePreloaderPreview);
  document.getElementById('preloader-image-url').addEventListener('input', updatePreloaderPreview);

  // Generate preloader HTML
  function generatePreloaderHTML(iframeId, type, text, imageUrl, bgColor, opacity) {
    const cleanId = iframeId.replace('#', '');
    
    // Convert hex to rgba
    const r = parseInt(bgColor.substr(1, 2), 16);
    const g = parseInt(bgColor.substr(3, 2), 16);
    const b = parseInt(bgColor.substr(5, 2), 16);
    const bgColorRgba = 'rgba(' + r + ',' + g + ',' + b + ',' + (opacity / 100) + ')';
    
    let html = '';
    
    html += '<div id="' + cleanId + '-preloader" style="opacity: 1; transition: opacity 0.3s; text-align: center; padding: 40px; background: ' + bgColorRgba + '; border-radius: 8px; margin-bottom: 20px;">\n';
    
    if (type === 'spinner') {
      html += '  <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #4CAF50; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 15px;"></div>\n';
      html += '  <div style="color: #666; font-size: 16px;">' + text + '</div>\n';
    } else if (type === 'text') {
      html += '  <div style="color: #666; font-size: 16px;">' + text + '</div>\n';
    } else if (type === 'image') {
      html += '  <img src="' + imageUrl + '" alt="Loading" style="max-width: 150px; max-height: 150px; display: block; margin: 0 auto;">\n';
    } else if (type === 'both') {
      html += '  <img src="' + imageUrl + '" alt="Loading" style="max-width: 150px; max-height: 150px; display: block; margin: 0 auto 15px;">\n';
      html += '  <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #4CAF50; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>\n';
    }
    
    html += '</div>\n\n';
    html += '<style>\n@keyframes spin {\n  0% { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }\n}\n</style>\n\n';
    
    return html;
  }

  // Generate code
  function generateCode() {
    const demoType = document.querySelector('input[name="demo-type"]:checked').value;
    const iframeId = document.getElementById('iframe-id').value.trim();
    const selectedEvents = Array.from(document.querySelectorAll('.event-list input[type="checkbox"]:checked'))
      .map(function(cb) { return cb.value; });
    
    const enablePreloader = document.getElementById('enable-preloader').checked;
    const preloaderType = document.getElementById('preloader-type').value;
    const preloaderText = document.getElementById('preloader-text').value || 'Loading demo...';
    const preloaderImageUrl = document.getElementById('preloader-image-url').value;
    const preloaderBgColor = document.getElementById('preloader-bg-color').value;
    const preloaderOpacity = parseInt(document.getElementById('preloader-opacity').value);
    
    if (!iframeId) {
      alert('Please enter an iframe ID');
      return;
    }
    
    if (selectedEvents.length === 0) {
      alert('Please select at least one event');
      return;
    }
    
    let htmlCode = '';
    let jsCode = '';
    
    // Add preloader if enabled
    if (enablePreloader) {
      htmlCode += generatePreloaderHTML(iframeId, preloaderType, preloaderText, preloaderImageUrl, preloaderBgColor, preloaderOpacity);
    }
    
    // Generate HTML
    const cleanId = iframeId.replace('#', '');
    htmlCode += '<iframe \n  id="' + cleanId + '" \n  src="https://datalayer-tracker.com/adt-debug-overlay-demo.html"\n  width="420" \n  height="720"\n  style="border: none; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"';
    
    if (enablePreloader) {
      htmlCode += '\n  onload="document.getElementById(\'' + cleanId + '-preloader\').style.opacity=\'0\'; setTimeout(function() { document.getElementById(\'' + cleanId + '-preloader\').remove(); }, 300);"';
    }
    
    htmlCode += '>\n</iframe>';
    
    // Generate JavaScript based on demo type
    if (demoType === 'static') {
      const behavior = document.querySelector('input[name="event-behavior"]:checked').value;
      
      if (behavior === 'both') {
        const pinEventsStr = document.getElementById('pin-events').value.trim();
        const pinEvents = pinEventsStr ? pinEventsStr.split(',').map(function(e) { return e.trim(); }) : [];
        const openEvents = selectedEvents.filter(function(e) { return !pinEvents.includes(e); });
        
        jsCode = '<script>\n// ADT Overlay Demo Configuration\nwindow.overlayDemoConfig = {\n  \'' + iframeId + '\': {\n    pinEvents: ' + JSON.stringify(pinEvents, null, 4) + ',\n    openEvents: ' + JSON.stringify(openEvents, null, 4) + '\n  }\n};\n<\/script>';
      } else if (behavior === 'pin') {
        jsCode = '<script>\n// ADT Overlay Demo Configuration\nwindow.overlayDemoConfig = {\n  \'' + iframeId + '\': {\n    pinEvents: ' + JSON.stringify(selectedEvents, null, 4) + '\n  }\n};\n<\/script>';
      } else if (behavior === 'open') {
        jsCode = '<script>\n// ADT Overlay Demo Configuration\nwindow.overlayDemoConfig = {\n  \'' + iframeId + '\': {\n    openEvents: ' + JSON.stringify(selectedEvents, null, 4) + '\n  }\n};\n<\/script>';
      }
    } else if (demoType === 'sequence') {
      const duration = parseInt(document.getElementById('duration').value) * 1000;
      const loop = document.getElementById('loop-enabled').checked;
      const disableInteraction = document.getElementById('disable-interaction').checked;
      const pauseScroll = document.getElementById('pause-scroll').checked;
      const pinInSequence = document.getElementById('pin-in-sequence').checked;
      
      // IMPORTANT: When pinInSequence is true, we should NOT pause auto-scroll
      // The whole point of pin mode is that scroll continues while event is pinned
      const effectivePauseScroll = pinInSequence ? false : pauseScroll;
      
      jsCode = '<script>\n// ADT Overlay Sequence Demo\nwindow.addEventListener(\'load\', function() {\n  setTimeout(function() {\n    const sequence = OverlayDemoHelper.sequence(\'' + iframeId + '\', ' + JSON.stringify(selectedEvents, null, 4) + ', {\n      duration: ' + duration + ',\n      loop: ' + loop + ',\n      disableInteraction: ' + disableInteraction + ',\n      pauseAutoScroll: ' + effectivePauseScroll + ',\n      pinInSequence: ' + pinInSequence + ',\n      onEventChange: function(eventName, index, total) {\n        console.log(\'Showing event \' + (index + 1) + \'/\' + total + \': \' + eventName);\n      },\n      onComplete: function() {\n        console.log(\'Sequence complete!\');\n      }\n    });\n    \n    // Auto-start the sequence\n    sequence.start();\n    \n    // Optional: Add controls\n    // sequence.pause();\n    // sequence.stop();\n    // sequence.next();\n    // sequence.previous();\n  }, 2000);\n});\n<\/script>';
    }
    
    // Display generated code
    document.getElementById('html-code').textContent = htmlCode;
    document.getElementById('js-code').textContent = jsCode;
    
    document.getElementById('placeholder').classList.add('hidden');
    document.getElementById('output-container').classList.remove('hidden');
  }

  // Copy code to clipboard
  function copyCode(button) {
    const targetId = button.dataset.target;
    const code = document.getElementById(targetId).textContent;
    
    navigator.clipboard.writeText(code).then(function() {
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      button.classList.add('copied');
      
      setTimeout(function() {
        button.textContent = originalText;
        button.classList.remove('copied');
      }, 2000);
    });
  }

  // ============= Preview Functions =============
  let previewSequence = null;
  
  function buildPreview() {
    const demoType = document.querySelector('input[name="demo-type"]:checked').value;
    const iframeId = document.getElementById('iframe-id').value.trim();
    const selectedEvents = Array.from(document.querySelectorAll('.event-list input[type="checkbox"]:checked'))
      .map(function(cb) { return cb.value; });
    
    const enablePreloader = document.getElementById('enable-preloader').checked;
    const preloaderType = document.getElementById('preloader-type').value;
    const preloaderText = document.getElementById('preloader-text').value || 'Loading demo...';
    const preloaderImageUrl = document.getElementById('preloader-image-url').value;
    const preloaderBgColor = document.getElementById('preloader-bg-color').value;
    const preloaderOpacity = parseInt(document.getElementById('preloader-opacity').value);
    
    if (!iframeId) {
      alert('Please enter an iframe ID');
      return;
    }
    
    if (selectedEvents.length === 0) {
      alert('Please select at least one event');
      return;
    }
    
    const previewContent = document.getElementById('preview-content');
    const cleanId = iframeId.replace('#', '');
    
    let html = '';
    
    // Add preloader if enabled
    if (enablePreloader) {
      html += generatePreloaderHTML('#preview-demo', preloaderType, preloaderText, preloaderImageUrl, preloaderBgColor, preloaderOpacity);
    }
    
    // Add iframe
    html += '<iframe \n  id="preview-demo" \n  src="https://datalayer-tracker.com/adt-debug-overlay-demo.html"\n  width="420" \n  height="720"\n  style="border: none; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"';
    
    if (enablePreloader) {
      html += '\n  onload="document.getElementById(\'preview-demo-preloader\').style.opacity=\'0\'; setTimeout(function() { document.getElementById(\'preview-demo-preloader\').remove(); }, 300);"';
    }
    
    html += '>\n</iframe>';
    
    previewContent.innerHTML = html;
    
    // console.log('[ADT Generator] Preview built');
  }
  
  function startPreview() {
    const demoType = document.querySelector('input[name="demo-type"]:checked').value;
    const selectedEvents = Array.from(document.querySelectorAll('.event-list input[type="checkbox"]:checked'))
      .map(function(cb) { return cb.value; });
    
    if (selectedEvents.length === 0) {
      alert('Please select at least one event');
      return;
    }
    
    // Stop any existing sequence
    if (previewSequence && previewSequence.isRunning()) {
      previewSequence.stop();
    }
    
    // Wait for iframe to load
    setTimeout(function() {
      if (demoType === 'static') {
        const behavior = document.querySelector('input[name="event-behavior"]:checked').value;
        
        if (behavior === 'both') {
          const pinEventsStr = document.getElementById('pin-events').value.trim();
          const pinEvents = pinEventsStr ? pinEventsStr.split(',').map(function(e) { return e.trim(); }) : [];
          const openEvents = selectedEvents.filter(function(e) { return !pinEvents.includes(e); });
          
          // Apply config
          window.previewDemoConfig = {
            '#preview-demo': {
              pinEvents: pinEvents,
              openEvents: openEvents
            }
          };
          OverlayDemoHelper.applyConfig(window.previewDemoConfig);
        } else if (behavior === 'pin') {
          window.previewDemoConfig = {
            '#preview-demo': {
              pinEvents: selectedEvents
            }
          };
          OverlayDemoHelper.applyConfig(window.previewDemoConfig);
        } else if (behavior === 'open') {
          window.previewDemoConfig = {
            '#preview-demo': {
              openEvents: selectedEvents
            }
          };
          OverlayDemoHelper.applyConfig(window.previewDemoConfig);
        }
        
        // console.log('[ADT Generator] Static preview started');
      } else if (demoType === 'sequence') {
        // const duration = parseInt(document.getElementById('duration').value) * 1000;
        // const loop = document.getElementById('loop-enabled').checked;
        // const disableInteraction = document.getElementById('disable-interaction').checked;
        // const pauseScroll = document.getElementById('pause-scroll').checked;
        // const pinInSequence = document.getElementById('pin-in-sequence').checked;
        // const effectivePauseScroll = pinInSequence ? false : pauseScroll;
        
        previewSequence = OverlayDemoHelper.sequence('#preview-demo', selectedEvents, {
          duration: duration,
          loop: loop,
          disableInteraction: disableInteraction,
          pauseAutoScroll: effectivePauseScroll,
          pinInSequence: pinInSequence,
          onEventChange: function(eventName, index, total) {
            // console.log('[Preview] Event ' + (index + 1) + '/' + total + ': ' + eventName);
          },
          onComplete: function() {
            // console.log('[Preview] Sequence complete');
          }
        });
        
        previewSequence.start();
        //console.log('[ADT Generator] Sequence preview started');
      }
    }, 2000);
  }
  
  function stopPreview() {
    if (previewSequence && previewSequence.isRunning()) {
      previewSequence.stop();
      // console.log('[ADT Generator] Preview stopped');
    }
    
    // Unpin all
    OverlayDemoHelper.unpinAll('#preview-demo');
    OverlayDemoHelper.closeAll('#preview-demo');
  }
  
  function refreshPreview() {
    stopPreview();
    buildPreview();
    setTimeout(startPreview, 500);
  }

  // Event listeners
  document.getElementById('generate-btn').addEventListener('click', generateCode);
  
  document.querySelectorAll('.copy-button').forEach(function(button) {
    button.addEventListener('click', function() {
      copyCode(this);
    });
  });
  
  // Reset button
  document.getElementById('reset-settings-btn').addEventListener('click', resetSettings);
  
  // Preview buttons
  document.getElementById('start-preview-btn').addEventListener('click', function() {
    buildPreview();
    setTimeout(startPreview, 500);
  });
  
  document.getElementById('stop-preview-btn').addEventListener('click', stopPreview);
  
  document.getElementById('refresh-preview-btn').addEventListener('click', refreshPreview);
  
  // Auto-save settings when they change
  function setupAutoSave() {
    // Save on any input change
    document.querySelectorAll('input, select, textarea').forEach(function(element) {
      element.addEventListener('change', function() {
        saveSettings();
      });
    });
    
    // Also save when typing in text fields (with debounce)
    let saveTimeout;
    document.querySelectorAll('input[type="text"], textarea').forEach(function(element) {
      element.addEventListener('input', function() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveSettings, 500);
      });
    });
  }

  // Initialize
  buildEventSelector();
  
  // Load saved settings after a short delay to ensure DOM is ready
  setTimeout(function() {
    const savedSettings = loadSettings();
    if (savedSettings) {
      applySettings(savedSettings);
      // console.log('[ADT Generator] Restored previous settings');
    } else {
      // console.log('[ADT Generator] No saved settings found, using defaults');
    }
    
    // Setup auto-save after loading settings
    setupAutoSave();
  }, 200);
})();
</script>

</body>
</html>