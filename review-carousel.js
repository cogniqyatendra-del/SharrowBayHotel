/* =========================================
      REVIEW CAROUSEL NAVIGATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const reviewCards = document.querySelectorAll('.review-card');
  const prevBtn = document.getElementById('prevReviews');
  const nextBtn = document.getElementById('nextReviews');
  const dotsContainer = document.getElementById('reviewDots');
  
  if (!prevBtn || !nextBtn || !dotsContainer) return;
  
  const reviewsPerPage = 3;
  let currentPage = 0;
  const totalPages = Math.ceil(reviewCards.length / reviewsPerPage);
  
  // Create dots
  for (let i = 0; i < totalPages; i++) {
    const dot = document.createElement('div');
    dot.className = 'review-dot';
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToPage(i));
    dotsContainer.appendChild(dot);
  }
  
  function showReviews() {
    const start = currentPage * reviewsPerPage;
    const end = start + reviewsPerPage;
    
    reviewCards.forEach((card, index) => {
      if (index >= start && index < end) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
    
    // Update dots
    document.querySelectorAll('.review-dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === currentPage);
    });
    
    // Update buttons
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === totalPages - 1;
  }
  
  function goToPage(page) {
    currentPage = page;
    showReviews();
  }
  
  prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      showReviews();
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages - 1) {
      currentPage++;
      showReviews();
    }
  });
  
  // Initialize
  showReviews();
});
