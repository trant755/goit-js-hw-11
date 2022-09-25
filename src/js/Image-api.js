import axios from 'axios';

const KEY = '30127977-afd00810882476e7ef9a8a757';
const BASE_URL = 'https://pixabay.com/api/';

export default class ImageAPI {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.sumImg = 0;
  }

  async fetchImages() {
    const searchParams = new URLSearchParams({
      q: this.searchQuery,
      key: KEY,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: 40,
    });
    try {
      this.incrementSumImg();
      return await axios.get(`${BASE_URL}?${searchParams}`);
    } catch (error) {
      Notify.failure('ERROR'), { timeout: 3000 };
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  incrementSumImg() {
    this.sumImg += 40;
  }

  resetSumImg() {
    this.sumImg = 0;
  }
}
