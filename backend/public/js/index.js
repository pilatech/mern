const alertbox = document.querySelector('.alert-box');
const alertclose = document.querySelector('.alert-close');

alertclose.addEventListener('click', (e) => {
    alertbox.style.display = 'none'
})


const prescriptionImageModal = document.getElementById('prescriptionImageModal')
const modalInput = document.getElementById('modalInput')

prescriptionImageModal.addEventListener('shown.bs.modal', function () {
  modalInput.focus()
})