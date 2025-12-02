// =========================================
// ADD REVIEW MODAL FUNCTIONALITY
// =========================================

let selectedRating = 0;
let selectedAvatar = '1'; // Default avatar

// Open Add Review Modal
function openAddReviewModal() {
  const modal = document.getElementById('addReviewModal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    resetReviewForm();
  }
}

// Close Add Review Modal
function closeAddReviewModal() {
  const modal = document.getElementById('addReviewModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// Reset Review Form
function resetReviewForm() {
  selectedRating = 0;
  selectedAvatar = '1';
  
  document.getElementById('reviewName').value = '';
  document.getElementById('reviewEmail').value = '';
  document.getElementById('reviewText').value = '';
  
  // Reset stars
  const stars = document.querySelectorAll('#starRating .star');
  stars.forEach(star => star.classList.remove('active'));
  
  // Reset avatars
  const avatars = document.querySelectorAll('.avatar-option');
  avatars.forEach(avatar => avatar.classList.remove('selected'));
  // Select first avatar by default
  if (avatars.length > 0) {
    avatars[0].classList.add('selected');
  }
}

// Star Rating Click Handler
document.addEventListener('DOMContentLoaded', function() {
  const stars = document.querySelectorAll('#starRating .star');
  
  stars.forEach(star => {
    star.addEventListener('click', function() {
      selectedRating = parseInt(this.getAttribute('data-rating'));
      
      // Update star display
      stars.forEach((s, index) => {
        if (index < selectedRating) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    });
    
    // Hover effect
    star.addEventListener('mouseenter', function() {
      const rating = parseInt(this.getAttribute('data-rating'));
      stars.forEach((s, index) => {
        if (index < rating) {
          s.style.color = 'var(--accent)';
        }
      });
    });
    
    star.addEventListener('mouseleave', function() {
      stars.forEach((s, index) => {
        if (index >= selectedRating) {
          s.style.color = '';
        }
      });
    });
  });
  
  // Avatar Selection
  const avatars = document.querySelectorAll('.avatar-option');
  avatars.forEach(avatar => {
    avatar.addEventListener('click', function() {
      // Remove selected from all
      avatars.forEach(a => a.classList.remove('selected'));
      // Add selected to clicked
      this.classList.add('selected');
      selectedAvatar = this.getAttribute('data-avatar');
    });
  });
  
  // Close on outside click
  document.addEventListener('click', function(e) {
    const modal = document.getElementById('addReviewModal');
    if (modal && e.target === modal) {
      closeAddReviewModal();
    }
  });
  
  // Close on Esc key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeAddReviewModal();
    }
  });
});

// Submit Review
function submitReview(e) {
  e.preventDefault();
  
  const name = document.getElementById('reviewName').value.trim();
  const reviewText = document.getElementById('reviewText').value.trim();
  
  if (!selectedRating) {
    alert('Please select a star rating');
    return;
  }
  
  if (!name || !reviewText) {
    alert('Please fill in all required fields');
    return;
  }
  
  // Create star display
  const stars = '★'.repeat(selectedRating) + '☆'.repeat(5 - selectedRating);
  
  // Get avatar URL
  const avatarUrl = `https://i.pravatar.cc/150?img=${selectedAvatar}`;
  
  // Create new review card
  const reviewCard = document.createElement('article');
  reviewCard.className = 'review-card';
  reviewCard.innerHTML = `
    <img src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=400&fit=crop" alt="Guest Review">
    <div class="review-content">
      <div class="review-stars">${stars}</div>
      <p class="review-text">"${reviewText}"</p>
      <div class="review-author">
        <img src="${avatarUrl}" alt="${name}" class="review-avatar">
        <div class="review-meta">
          <strong>${name}</strong>
          <span>Guest Review</span>
        </div>
      </div>
    </div>
  `;
  
  // Add to reviews grid (prepend to show newest first)
  const reviewsGrid = document.getElementById('reviewsGrid');
  const firstReview = reviewsGrid.querySelector('.review-card');
  if (firstReview) {
    reviewsGrid.insertBefore(reviewCard, firstReview);
  } else {
    reviewsGrid.appendChild(reviewCard);
  }
  
  
  // Close modal
  closeAddReviewModal();
  
  // Scroll to reviews section
  document.getElementById('testimonials').scrollIntoView({ behavior: 'smooth' });
}
