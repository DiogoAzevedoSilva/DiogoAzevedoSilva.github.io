/* ============================================================
   DIOGO SILVA — PORTFOLIO SCRIPT
   Handles: project filtering, count label, empty state,
            contact form validation
   ============================================================ */

/* ------------------------------------------------------------
   PROJECT FILTER
   Reads data-filter from each button and data-tool from each
   card, then shows/hides cards accordingly.
   ------------------------------------------------------------ */

// Wait for the DOM to be fully loaded before running any code
document.addEventListener('DOMContentLoaded', function () {

  // --- Grab elements ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards  = document.querySelectorAll('.project-card');
  const countLabel    = document.getElementById('projects-count');
  const emptyState    = document.getElementById('empty-state');
  const resetBtn      = document.getElementById('empty-state-reset');

  // Only run filter logic if these elements exist
  // (script.js is loaded on all pages, so this guard is important)
  if (!filterButtons.length || !projectCards.length) return;


  // --- Helper: update the count label ---
  function updateCount(visibleCount) {
    if (!countLabel) return;
    if (visibleCount === projectCards.length) {
      countLabel.textContent = visibleCount + ' projects';
    } else {
      countLabel.textContent = 'Showing ' + visibleCount + ' of ' + projectCards.length + ' projects';
    }
  }


  // --- Helper: show or hide the empty state ---
  function toggleEmptyState(visible) {
    if (!emptyState) return;
    emptyState.hidden = !visible;
  }


  // --- Core filter function ---
  function filterProjects(selectedTool) {
    var visibleCount = 0;

    projectCards.forEach(function (card) {
      var cardTool = card.getAttribute('data-tool');

      if (selectedTool === 'all' || cardTool === selectedTool) {
        card.hidden = false;
        visibleCount++;
      } else {
        card.hidden = true;
      }
    });

    updateCount(visibleCount);
    toggleEmptyState(visibleCount === 0);
  }


  // --- Attach click handlers to filter buttons ---
  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {

      // Remove active class from all buttons
      filterButtons.forEach(function (b) {
        b.classList.remove('active');
      });

      // Add active class to the clicked button
      btn.classList.add('active');

      // Run the filter
      var selectedTool = btn.getAttribute('data-filter');
      filterProjects(selectedTool);
    });
  });


  // --- Empty state reset button: goes back to "All" ---
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      // Find the "All" button and click it
      var allBtn = document.querySelector('.filter-btn[data-filter="all"]');
      if (allBtn) allBtn.click();
    });
  }


  // --- Run on page load to set the initial count ---
  filterProjects('all');

});


/* ------------------------------------------------------------
   CONTACT FORM VALIDATION
   Validates all fields on submit. Shows inline errors and
   a top-level feedback message. Resets after success.
   ------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', function () {

  var form         = document.getElementById('contact-form');
  var successMsg   = document.getElementById('form-success');
  var errorSummary = document.getElementById('form-error-summary');

  // Only run on the contact page
  if (!form) return;

  // --- Helper: mark a field as invalid ---
  function showError(inputId, errorId) {
    var input = document.getElementById(inputId);
    var error = document.getElementById(errorId);
    if (input)  input.classList.add('is-invalid');
    if (error)  error.hidden = false;
  }

  // --- Helper: clear a field's error state ---
  function clearError(inputId, errorId) {
    var input = document.getElementById(inputId);
    var error = document.getElementById(errorId);
    if (input)  input.classList.remove('is-invalid');
    if (error)  error.hidden = true;
  }

  // --- Helper: basic email format check ---
  function isValidEmail(value) {
    // Checks for something@something.something
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  // --- Clear individual field errors as the user corrects them ---
  var fields = ['name', 'email', 'topic', 'subject', 'message'];

  fields.forEach(function (id) {
    var input = document.getElementById(id);
    if (!input) return;

    input.addEventListener('input', function () {
      if (input.value.trim() !== '') {
        clearError(id, 'error-' + id);
      }
    });

    // Also clear on change (useful for the select dropdown)
    input.addEventListener('change', function () {
      if (input.value.trim() !== '') {
        clearError(id, 'error-' + id);
      }
    });
  });


  // --- Form submit handler ---
  form.addEventListener('submit', function (event) {
    // Always prevent default — we have no backend yet
    event.preventDefault();

    // Reset all error states before re-validating
    fields.forEach(function (id) {
      clearError(id, 'error-' + id);
    });
    if (successMsg)   successMsg.hidden   = true;
    if (errorSummary) errorSummary.hidden = true;

    var hasErrors = false;

    // Validate: Name (required)
    var nameVal = document.getElementById('name').value.trim();
    if (nameVal === '') {
      showError('name', 'error-name');
      hasErrors = true;
    }

    // Validate: Email (required + format)
    var emailVal = document.getElementById('email').value.trim();
    if (emailVal === '' || !isValidEmail(emailVal)) {
      showError('email', 'error-email');
      hasErrors = true;
    }

    // Validate: Topic (required — must select something other than default)
    var topicVal = document.getElementById('topic').value;
    if (topicVal === '') {
      showError('topic', 'error-topic');
      hasErrors = true;
    }

    // Validate: Subject (required)
    var subjectVal = document.getElementById('subject').value.trim();
    if (subjectVal === '') {
      showError('subject', 'error-subject');
      hasErrors = true;
    }

    // Validate: Message (required)
    var messageVal = document.getElementById('message').value.trim();
    if (messageVal === '') {
      showError('message', 'error-message');
      hasErrors = true;
    }

    // If errors exist: show the summary banner and stop
    if (hasErrors) {
      if (errorSummary) errorSummary.hidden = false;
      // Scroll the summary into view so the user sees it
      if (errorSummary) errorSummary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }

    // --- All valid: simulate a successful submission ---
    // When you add a backend in UC00605, replace this block
    // with a fetch() call to your API endpoint.

    // Show success message
    if (successMsg) {
      successMsg.hidden = false;
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Reset the form fields
    form.reset();

  });

});
