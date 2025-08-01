document.addEventListener('DOMContentLoaded', function() {
    // Set default date to today
    const dateField = document.getElementById('date_posted');
    if (dateField && !dateField.value) {
        const today = new Date().toISOString().split('T')[0];
        dateField.value = today;
    }

    // Form validation
    const noticeForm = document.querySelector('.notice-form');
    if (noticeForm) {
        noticeForm.addEventListener('submit', function(e) {
            const title = document.getElementById('title').value.trim();
            const description = document.getElementById('description').value.trim();
            
            if (!title) {
                alert('Please enter a notice title');
                e.preventDefault();
                return;
            }
            
            if (!description) {
                alert('Please enter a description');
                e.preventDefault();
                return;
            }
            
            // Additional validation can be added here
        });
    }

    // Optional: Character counters
    const titleInput = document.getElementById('title');
    const descTextarea = document.getElementById('description');
    
    if (titleInput) {
        titleInput.addEventListener('input', function() {
            const remaining = 250 - this.value.length;
            // You could display this to the user if you want
        });
    }
    
    if (descTextarea) {
        descTextarea.addEventListener('input', function() {
            // You could add similar counter for description if needed
        });
    }
});