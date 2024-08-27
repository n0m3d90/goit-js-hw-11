import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = 'YOUR_PIXABAY_API_KEY';
const BASE_URL = 'https://pixabay.com/api/';
let page = 1;
let query = '';
const perPage = 40;

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(event) {
  event.preventDefault();
  query = event.currentTarget.elements.searchQuery.value.trim();
  if (query === '') {
    Notiflix.Notify.failure('Please enter a search query.');
    return;
  }

  page = 1;
  clearGallery();
  loadMoreBtn.style.display = 'none';

  try {
    const { data } = await fetchImages();
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    renderGallery(data.hits);
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    if (data.totalHits > perPage) {
      loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    Notiflix.Notify.failure('Something went wrong. Please try again later.');
  }
}

async function onLoadMore() {
  page += 1;

  try {
    const { data } = await fetchImages();
    renderGallery(data.hits);
    if (page * perPage >= data.totalHits) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    Notiflix.Notify.failure('Something went wrong. Please try again later.');
  }
}

function fetchImages() {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: perPage,
  };
  return axios.get(BASE_URL, { params });
}

function renderGallery(images) {
  const markup = images
    .map(
      ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
      <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item"><b>Likes:</b> ${likes}</p>
          <p class="info-item"><b>Views:</b> ${views}</p>
          <p class="info-item"><b>Comments:</b> ${comments}</p>
          <p class="info-item"><b>Downloads:</b> ${downloads}</p>
        </div>
      </div>`
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
  gallery.innerHTML = '';
}
