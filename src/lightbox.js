const gallery = document.getElementById('gallery');

gallery.addEventListener('click', onImageClick);

function onImageClick(event) {
  event.preventDefault();
  if (event.target.nodeName !== 'IMG') return;

  const selectedImage = event.target.dataset.source;
  const images = Array.from(document.querySelectorAll('.gallery img')).map(img => img.dataset.source);
  
  let currentIndex = images.indexOf(selectedImage);

  const lightboxOverlay = document.createElement('div');
  lightboxOverlay.className = 'lightbox-overlay';
  lightboxOverlay.innerHTML = `
    <div class="lightbox">
      <img src="${selectedImage}" alt="Image Preview">
      <button class="prev">←</button>
      <button class="next">→</button>
    </div>`;
  
  document.body.appendChild(lightboxOverlay);

  const lightboxImage = lightboxOverlay.querySelector('img');
  const prevButton = lightboxOverlay.querySelector('.prev');
  const nextButton = lightboxOverlay.querySelector('.next');

  prevButton.addEventListener('click', () => showImage(-1));
  nextButton.addEventListener('click', () => showImage(1));
  lightboxOverlay.addEventListener('click', closeLightbox);

  function showImage(direction) {
    currentIndex = (currentIndex + direction + images.length) % images.length;
    lightboxImage.src = images[currentIndex];
  }

  function closeLightbox(event) {
    if (event.target === lightboxOverlay || event.target === prevButton || event.target === nextButton) {
      lightboxOverlay.remove();
    }
  }
}
