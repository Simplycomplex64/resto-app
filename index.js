// Import menuArray from data.js
import { menuArray } from '/data.js';

const containerEl = document.getElementById('container-el');
const orderContainer = document.getElementById('order-container');
const elPrice = document.getElementById('price-el');
const checkoutBtnDiv = document.getElementById('checkout-btn-div')
const inputName = document.getElementById('name-input')
const inputNumberCard = document.getElementById('card-number-input')
const inputCvv = document.getElementById('cvv-input')
const btnCancel = document.getElementById('cancel-btn')
const modal2 = document.getElementById('modal2')

btnCancel.addEventListener('click', function(){
    event.preventDefault();
    var modal = document.querySelector('.modal');
    modal.style.display = 'none';

    // Remove focus from any form elements within the modal
    const focusedElement = document.activeElement;
    if (modal.contains(focusedElement)) {
        focusedElement.blur();
    }
});


let orderedItems = [];
var yourOrder = document.querySelector('.your-order')

function renderMenu() {
    const menuHtml = menuArray.map(item => {
        const ingredientList = item.ingredients.join(', ');
        return `
            <div class="container">
                <div class="single-item">
                    <img src="${item.image}">
                </div>
                <div class="item-description">
                    <h2>${item.name}</h2>
                    <p>${ingredientList}</p>
                    <p class="price">$${item.price}</p>
                </div>
                <div class="add-btn">
                    <img src="/images/JJJ’s (5).png" class="add-btn-img" data-item-id="${item.id}">
                </div>
            </div>`;
    }).join('');

    containerEl.innerHTML = menuHtml;
}

function renderOrderedItems() {
    let orderedItemsList = '';
    if(orderedItems.length <= 0){
        yourOrder.style.display = 'none'
    }
    else{
        var modal2 = document.querySelector('.modal2');
        modal2.style.display = 'none';
        yourOrder.style.display = 'block'
        orderedItems.forEach(item => {
            orderedItemsList += `
                <div class="order-details">
                    <h3>${item.name}</h3>
                    <span id="${item.id}">remove</span>
                    <p>$${item.price}</p>
                </div>`;
        });
    
        orderContainer.innerHTML = orderedItemsList;
    
        if (orderContainer.scrollHeight > orderContainer.clientHeight) {
            orderContainer.classList.add('scrollable');
    
            const scrollDownIndicator = document.createElement('div');
            scrollDownIndicator.classList.add('scroll-indicator', 'down');
            scrollDownIndicator.innerHTML = 'Scroll up or down';
            orderContainer.appendChild(scrollDownIndicator);
        } else {
            orderContainer.classList.remove('scrollable');
        }
    
        // Calculate and display total price
        const totalPrice = orderedItems.reduce((acc, item) => acc + item.price, 0);
        elPrice.innerHTML = `$${totalPrice.toFixed(2)}`;
    }
}

renderMenu();

// Event delegation for add buttons
containerEl.addEventListener("click", function(event) {
    if (event.target.classList.contains('add-btn-img')) {
        const clickedId = parseInt(event.target.dataset.itemId);
        const clickedItem = menuArray.find(item => item.id === clickedId);
        orderedItems.push(clickedItem);
        renderOrderedItems();
    }
});

// Event delegation for remove buttons
orderContainer.addEventListener("click", function(event) {
    if (event.target.tagName === 'SPAN') {
        const itemId = parseInt(event.target.id);
        const itemIndex = orderedItems.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            orderedItems.splice(itemIndex, 1);
            renderOrderedItems();
        }
    }
});

const paymentInfosaved = []

function renderPayModal() {
    var modal = document.querySelector('.modal');

    // Set modal display to 'block' to show it
    modal.style.display = 'block';

    // Add event listener to the "Pay" button outside of renderPayModal
        document.getElementById('pay-now').addEventListener('click', function(event) {
            event.preventDefault(); // Prevent form submission

            // Get input values
            const name = inputName.value;
            const cardNumber = inputNumberCard.value;
            const cvv = inputCvv.value;

            // Check if any of the inputs are empty
            if (name.trim() === '' || cardNumber.trim() === '' || cvv.trim() === '') {
                // If any input is empty, do nothing
                return;
            }

            // Validate name: can contain letters and spaces
            if (!/^[a-zA-Z\s]+$/.test(name)) {
                alert('Name must contain only letters and spaces.');
                return;
            }

            // Validate card number: must be 16 digits and contain only numbers
            if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
                alert('Card number must be 16 digits and contain only numbers.');
                return;
            }

            // Validate CVV: must be 3 digits and contain only numbers
            if (!/^\d{3}$/.test(cvv)) {
                alert('CVV must be 3 digits and contain only numbers.');
                return;
            }

            // Create an object with the input values
            const paymentInfo = {
                name: name,
                cardNumber: cardNumber,
                cvv: cvv
            };

            // Add paymentInfo to the orderedItems array
            paymentInfosaved.push(paymentInfo);

            // Optionally, you can clear the input fields after saving the data
            inputName.value = '';
            inputNumberCard.value = '';
            inputCvv.value = '';

            var modal = document.querySelector('.modal');
            modal.style.display = 'none';

            var modal2 = document.querySelector('.modal2');
            modal2.style.display = 'block';
            modal2.innerHTML = `<p>Thanks <span class="thanks">${name}</span> ! Your order is on its way!</p>`;

            // Log the orderedItems array to verify that paymentInfo is added
            console.log(paymentInfosaved);
            orderedItems = [];
            renderOrderedItems();
        });
}


checkoutBtnDiv.addEventListener('click', function(){
    renderPayModal()
})