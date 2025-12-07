// render-functions.js
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

export const gallery = document.querySelector(".gallery");
const loader = document.querySelector(".loader");
const loadMoreBtn = document.querySelector(".loader-btn");

const lightbox = new SimpleLightbox(".gallery a", {
  captionsData: "alt",
  captionDelay: 150,
});

export function createGallery(images, options = { append: false }) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
<li class="photo-card">
  <a href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
    <p><b>Likes</b> ${likes}</p>
    <p><b>Views</b> ${views}</p>
    <p><b>Comments</b> ${comments}</p>
    <p><b>Downloads</b> ${downloads}</p>
  </div>
</li>`
    )
    .join("");

  if (options.append) {
    gallery.insertAdjacentHTML("beforeend", markup);
  } else {
    gallery.innerHTML = markup;
  }

  lightbox.refresh();
}

export function clearGallery() {
  gallery.innerHTML = "";
}

export function showLoader() {
  loader.classList.remove("hidden");
}

export function hideLoader() {
  loader.classList.add("hidden");
}

export function showLoadMoreButton() {
  loadMoreBtn.classList.remove("hidden");
}

export function hideLoadMoreButton() {
  loadMoreBtn.classList.add("hidden");
}

export function getFirstCardHeight() {
  const card = gallery.querySelector(".photo-card");
  return card ? card.getBoundingClientRect().height : 0;
}