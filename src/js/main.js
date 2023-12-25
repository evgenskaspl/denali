import { Fancybox } from "@fancyapps/ui";

Fancybox.bind("[data-fancybox]", {
    // Your custom options
});

// const section = document.getElementById('about-us');

// function isElementInViewport(el) {
//     const rect = el.getBoundingClientRect();
//     return (
//         rect.top <= window.innerHeight * 0.75 &&
//         rect.bottom >= window.innerHeight * 0.25
//     );
// }

// let timeoutId;

// function smoothScrollToTop(el) {
//     console.log(el.offsetTop)
//     timeoutId = setTimeout(() => {
//         window.scrollTo({
//             top: el.offsetTop,
//             behavior: 'smooth'
//         });
//     }, 1000)
// }

// function handleScroll() {
//     //   sections.forEach((section) => {
//     if (isElementInViewport(section)) {
//         smoothScrollToTop(section);
//     } else if (timeoutId) {
//         console.log('cancel', timeoutId)
//         clearTimeout(timeoutId)
//         timeoutId = null
//     }
//     //   });
// }

// window.addEventListener('scroll', (_, e) => {
//     handleScroll(e)
// });
