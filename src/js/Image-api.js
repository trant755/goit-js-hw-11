import axios from 'axios';

const KEY = '30127977-afd00810882476e7ef9a8a757';
const BASE_URL = 'https://pixabay.com/api/';

export default class ImageAPI {
  constructor() {
    this.searchQuery = '';
    this.searchParams = new URLSearchParams({
      key: KEY,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    });
  }

  fetchImages() {
    return axios.get(`${BASE_URL}?q=${this.searchQuery}&${this.searchParams}`);
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
