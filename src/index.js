const axios = require('axios').default;
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImageAPI from './js/Image-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  observerEl: document.querySelector('#observer'),
};

const imageAPI = new ImageAPI();
let lightbox = new SimpleLightbox('.gallery a');

refs.searchForm.addEventListener('submit', searchImages);

function searchImages(e) {
  e.preventDefault();
  imageAPI.query = e.currentTarget.elements.searchQuery.value;

  if (imageAPI.query === '') return;

  clearGallery();
  imageAPI.resetPage();

  imageAPI.fetchImages().then(({ data }) => {
    if (data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      ),
        { timeout: 4000 };
      return;
    }

    Notify.info(`Hooray! We found ${data.totalHits} images.`),
      { timeout: 5000 };

    createPage(data);
  });
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function createPage(data) {
  let markup = data.hits.map(creatPhotoCard).join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);

  imageAPI.incrementPage();
  lightbox.refresh();
}

function creatPhotoCard({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
      <a class="gallery__lightbox-link"  href=${largeImageURL}>
        <div class="photo-card">
          <img class="photo-card__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
              <span>${likes}</span>
            </p>
            <p class="info-item">
              <b>Views</b>
              <span>${views}</span>
            </p>
            <p class="info-item">
              <b>Comments</b>
              <span>${comments}</span>
            </p>
            <p class="info-item">
              <b>Downloads</b>
              <span>${downloads}</span>
            </p>
          </div>
        </div>
      </a>
`;
}

const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && imageAPI.page !== 1) {
      imageAPI.fetchImages().then(({ data }) => {
        if (imageAPI.sumImg > data.totalHits) {
          Notify.info(
            "We're sorry, but you've reached the end of search results."
          ),
            { timeout: 10000 };

          return;
        }

        if (data.hits.length === 0) {
          Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          ),
            { timeout: 4000 };
          return;
        }

        createPage(data);
      });
    }
  });
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '200px',
});
observer.observe(refs.observerEl);
