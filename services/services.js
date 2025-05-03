// Mobile dropdown functionality
document.querySelectorAll('.dropdown > a').forEach(dropdownToggle => {
    dropdownToggle.addEventListener('click', function(e) {
        if (window.innerWidth <= 992) {
            e.preventDefault();
            const dropdown = this.parentElement;
            dropdown.classList.toggle('active');
            
            // Close other open dropdowns
            document.querySelectorAll('.dropdown').forEach(item => {
                if (item !== dropdown) {
                    item.classList.remove('active');
                }
            });
        }
    });
});

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown') && window.innerWidth <= 992) {
        document.querySelectorAll('.dropdown').forEach(item => {
            item.classList.remove('active');
        });
    }
});