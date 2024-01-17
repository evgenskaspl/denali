import { Fancybox } from "@fancyapps/ui";

Fancybox.bind("[data-fancybox]", {});

const formEmailUrl = 'https://formsubmit.co/ajax/web.denali@gmail.com';
const fetchConfig = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
}


const disableFormElements = () => {
    for (let i = 0; i < form.elements.length; i++) {
        const element = form.elements[i];

        if (!element.disabled) {
            element.disabled = true

            if (element.id === 'submit') {
                element.textContent = ''
                const loader = document.createElement('span');
                loader.classList.add('lds-dual-ring')
                element.appendChild(loader)
            }
        }
    }
}


const enableFormElements = () => {
    for (let i = 0; i < form.elements.length; i++) {
        const element = form.elements[i];

        if (element.disabled) {
            element.disabled = false
            element.value = ''

            if (element.id === 'submit') {
                element.removeChild(element.firstChild)
                element.textContent = 'REQUEST A CALL'
            }
        }
    }
}

const handleSubmitForm = async (body) => {
    const errorText = 'Something went wrong, try submitting the form again.'
    const content = document.getElementById('popup-content')
    return fetch(formEmailUrl, {
        ...fetchConfig,
        body: JSON.stringify(body)
    })
        .then(response => {
            if (!response.ok) {
                content.textContent = errorText
            }
            return response.json();
        })
        .then(data => {
            if (data?.success === 'true') {
                content.textContent = 'Thank you, we will get back to you as soon as possible.'
            } else {
                content.textContent = errorText
            }
        })
        .catch(error => {
            content.textContent = errorText

            console.error('Fetch Error:', error);
        })
        .finally(() => {
            popup.classList.add('active')
            enableFormElements()
        })
}

window.addEventListener('load', function () {

    const images = document.querySelectorAll('.lazy-image')
    const form = document.getElementById('form')
    const popupCloseBtn = document.getElementById('popup-close-button')
    const popup = document.getElementById('popup')

    for (let image of images) {
        if (image.src) {
            image.style.display = "block";
        }
        image.addEventListener('load', function () {
            image.parentNode.parentNode.style.filter = 'none'
        })
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        } else {

            const formData = new FormData(form);
            const formObject = {};

            formData.forEach(function (value, key) {
                formObject[key] = value;
            });
            disableFormElements();
            handleSubmitForm(formObject)

        }

        form.classList.add('was-validated');
    });


    popupCloseBtn.addEventListener('click', function (e) {
        popup.classList.remove('active')
    })

})
