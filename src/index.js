import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '45587801-39d5210ba67e43ddafd5f17b0';
const BASE_URL = 'https://pixabay.com/api/';
const form = document.getElementById('search-form');
const gallery = document.getElementById('gallery');
const loadMoreBtn = document.getElementById('load-more');

let query = '';
let page = 1;
const perPage = 40;

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(event) {
  event.preventDefault();
  query = event.currentTarget.elements.searchQuery.value.trim();

  if (query === '') {
    Notiflix.Notify.failure('Please enter a search term.');
    return;
  }

  page = 1;
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('hidden');
  fetchImages();
}

async function onLoadMore() {
  page += 1;
  fetchImages();
}

async function fetchImages() {
  try {
    const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`);
    const { hits, totalHits } = response.data;

    if (hits.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    renderGallery(hits);

    if (gallery.children.length >= totalHits) {
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      loadMoreBtn.classList.add('hidden');
    } else {
      loadMoreBtn.classList.remove('hidden');
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    Notiflix.Notify.failure('Failed to fetch images. Please try again later.');
  }
}

function renderGallery(images) {
  const markup = images.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
    <div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" data-source="${largeImageURL}" />
      <div class="info">
        <p class="info-item"><b>Likes</b> ${likes}</p>
        <p class="info-item"><b>Views</b> ${views}</p>
        <p class="info-item"><b>Comments</b> ${comments}</p>
        <p class="info-item"><b>Downloads</b> ${downloads}</p>
      </div>
    </div>`).join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}
