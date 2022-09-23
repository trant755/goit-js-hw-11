const axios = require('axios').default;
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImageAPI from './js/Image-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

const imageAPI = new ImageAPI();

refs.searchForm.addEventListener('submit', searchImages);

function searchImages(e) {
  e.preventDefault();
  imageAPI.query = e.currentTarget.elements.searchQuery.value;
  console.log(imageAPI.query);

  if (imageAPI.query === '') return;
  fetchImages();
}

function fetchImages() {
  return imageAPI.fetchImages().then(({ data }) => {
    let markup = data.hits.map(creatPhotoCard).join('');

    refs.gallery.innerHTML = markup;
  });
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
      <a href=${largeImageURL}>
        <div class="photo-card">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes</b>${likes}
            </p>
            <p class="info-item">
              <b>Views</b>${views}
            </p>
            <p class="info-item">
              <b>Comments</b>${comments}
            </p>
            <p class="info-item">
              <b>Downloads</b>${downloads}
            </p>
          </div>
        </div>
      </a>
`;
}
