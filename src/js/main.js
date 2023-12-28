import { Fancybox } from "@fancyapps/ui";

Fancybox.bind("[data-fancybox]", {
    // Your custom options
});


window.addEventListener('load', function () {
    const images = document.querySelectorAll('.lazy-image')
    console.log('images', images)
    for (let image of images) {
        if (image.dataset.src) {
            image.src = image.dataset.src
            image.style.display = "block";
            console.log(image.parentNode.parentNode)
            image.parentNode.parentNode.style.filter = 'none'
        }
    }
})

// Email.send({
//     Host: "smtp.elasticemail.com",
//     Username: "evgenskaspl@gmail.com",
//     Password: "!qQ5063743",
//     To: 'evgenskas@gmail.com',
//     From: "test1234@gmail.com",
//     Subject: "This is the subject",
//     Body: "And this is the body"
// }).then(
//     message => console.log(message)
// ).catch(e => console.log('e', e));