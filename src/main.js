// main.js
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import { getImagesByQuery } from "./js/pixabay-api.js";
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
  getFirstCardHeight,
} from "./js/render-functions.js";

const form = document.querySelector(".form");
const loadMoreBtn = document.querySelector(".loader-btn");

const PER_PAGE = 15;
let query = "";
let page = 1;
let totalPages = 0;

hideLoadMoreButton();

form.addEventListener("submit", async e => {
  e.preventDefault();

  query = e.target.elements["search-text"].value.trim();

  if (!query) {
    iziToast.warning({
      message: "Please enter a search query.",
      position: "topRight",
    });
    return;
  }

  page = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);

    if (data.hits.length === 0) {
      iziToast.error({
        message: "Sorry, there are no images matching your search query.",
        position: "topRight",
      });
      return;
    }

    createGallery(data.hits);
    totalPages = Math.ceil(data.totalHits / PER_PAGE);

    if (page >= totalPages) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: "topRight",
      });
    } else {
      showLoadMoreButton();
    }
  } catch {
    iziToast.error({
      message: "Something went wrong. Please try again later.",
      position: "topRight",
    });
  } finally {
    hideLoader();
  }

  form.reset();
});

loadMoreBtn.addEventListener("click", async () => {
  page += 1;
  showLoader();
  hideLoadMoreButton();

  try {
    const data = await getImagesByQuery(query, page);
    createGallery(data.hits, { append: true });

    const cardHeight = getFirstCardHeight();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });

    if (page >= totalPages) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: "topRight",
      });
    } else {
      showLoadMoreButton();
    }
  } catch {
    iziToast.error({
      message: "Error loading more images.",
      position: "topRight",
    });
  } finally {
    hideLoader();
  }
});