import { Fancybox } from "@fancyapps/ui";

Fancybox.bind("[data-fancybox]", {
    // Your custom options
});


window.addEventListener('load', function () {
    const images = document.querySelectorAll('.lazy-image')
    for (let image of images) {
        if (image.src) {
            image.style.display = "block";
        }
        image.addEventListener('load', function () {
            image.parentNode.parentNode.style.filter = 'none'
        })
    }
})