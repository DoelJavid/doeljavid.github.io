
const galleryImgList = document.querySelector("#gallery .icon-list");
const imgPreview = document.querySelector("#preview");
const previewImg = document.querySelector("#preview-img");
const previewCaption = document.querySelector("#preview-caption");
const previewExit = document.querySelector("#preview-exit");

function openImagePreview(img) {
  const caption = img.getAttribute("data-caption");

  previewImg.src = img.src;
  previewImg.alt = caption ? img.alt : "";
  previewCaption.innerText = caption || img.alt;

  imgPreview.showModal();
}

previewExit.addEventListener("click", () => {
  imgPreview.close();
});

for (const entry of galleryImgList.querySelectorAll(".gallery-img")) {
  const btnImg = entry.querySelector("img");
  entry.addEventListener("click", () => {
    console.log("Clicked!")
    openImagePreview(btnImg);
  });
}

