interface Product {
    image : {
        thumbnail : string,
        mobile: string,
        tablet: string,
        desktop: string
    }
    name: string,
    category: string,
    price: number
}

//Fetch json data
document.addEventListener('DOMContentLoaded', () => {
    fetch('./data.json').then((response) => {
        return response.json();
    })
    .then((data) => {
        const parentELement = document.getElementById('card-container');
        let htmlContainer = '';

        data.forEach((item : Product) => {
            htmlContainer += `
                <div class="col">
                    <div class="card h-100 product-card" data-product-name="${item.name}">
                        <picture>
                            <source srcset="${item.image.desktop}" media="(min-width: 1200px)">
                            <source srcset="${item.image.tablet}" media="(min-width: 768px)">
                            <source srcset="${item.image.mobile}" media="(min-width: 480px)">
                            <img src="${item.image.thumbnail}" alt="${item.name}" style="width: 100%; border-radius: 6px;">
                        </picture>
                        <div class="btn-div">
                            <button type="button" class="btn btn-primary add-cart-button" data-bs-toggle="button">
                                <img src="./assets/images/icon-add-to-cart.svg" alt="add to cart icon" class="add-to-cart-img">Add to Cart
                            </button>
                        </div>
                        <div class="increment-decrement-el">
                            <button type="button" class="btn decrement-btn data-bs-toggle="button">
                                <img src="./assets/images/icon-decrement-quantity.svg" alt="decrement quantity icon" class="decrement-icon">
                            </button>
                            <p class="product-number">1</p>
                            <button type="button" class="btn increment-btn data-bs-toggle="button">
                                <img src="./assets/images/icon-increment-quantity.svg" alt="increment quantity icon" class="increment-icon">
                            </button>
                        </div>
                        <div class="card-body">
                            <p class="card-text product-category">${item.category}</p>
                            <h5 class="card-title product-name">${item.name}</h5>
                            <p class="product-price">$${item.price.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            `;

            if(parentELement) {
                parentELement.innerHTML = htmlContainer;
            }
            else {
                console.log('element not found');
            }
        });

        const productCards = document.querySelectorAll('.product-card');
        let productListElement = document.querySelector('.product-list');
        const emptyCartElement = document.querySelector('.empty-cart') as HTMLElement;
        const selectedCartELement = document.querySelector('.selected-cart') as HTMLElement;
        let totalOrderPrice = 0;
        let cart: { name: string, quantity: number, price: number }[] = [];

        productCards.forEach((card, _index) => {
            const addButton = card.querySelector('.add-cart-button') as HTMLElement;
            const valueButton = card.querySelector('.increment-decrement-el') as HTMLElement;
            const productQuantityElement = card.querySelector('.product-number') as HTMLElement;
            const incrementButton = card.querySelector('.increment-btn') as HTMLElement;
            const decrementButton = card.querySelector('.decrement-btn') as HTMLElement;

            if(addButton && valueButton) {
                addButton.addEventListener('click', () => {
                    valueButton.style.contentVisibility = 'visible';
                    addButton.style.display = 'none';
                    emptyCartElement.style.display = "none";
                    selectedCartELement.style.display = "block"   
                    
                    const productName = card.getAttribute('data-product-name')!;
                    const productPrice = parseFloat((card.querySelector('.product-price') as HTMLElement).innerText.split('$').join(''));

                    const existingProduct = cart.find(item=> item.name === productName);

                    if (existingProduct) {
                        existingProduct.quantity += 1;
                    } else {
                        cart.push({ name: productName, quantity: 1, price: productPrice });
                    }

                    updateCartList();
                    updateCartTitle();
                });

                incrementButton.addEventListener('click', () => {
                    let quantity = parseInt(productQuantityElement.innerText);
                    quantity += 1;
                    productQuantityElement.innerText = quantity.toString();
                    const productName = card.getAttribute('data-product-name')!;
                    const productInCart = cart.find(item => item.name === productName);
                    if (productInCart) {
                        productInCart.quantity = quantity;
                    }

                    updateCartList();
                    updateCartTitle();
                });

                decrementButton.addEventListener('click', () => {
                    let quantity = parseInt(productQuantityElement.innerText);
                    if (quantity > 1) {
                        quantity -= 1;
                        productQuantityElement.innerText = quantity.toString();

                        const productName = card.getAttribute('data-product-name')!;
                        const productInCart = cart.find(item => item.name === productName);
                        if (productInCart) {
                            productInCart.quantity = quantity;
                        }

                        updateCartList();
                        updateCartTitle();
                    }
                })
            }
        });

        function updateCartList() {
            if (productListElement) {
                let cartList = '';
                totalOrderPrice = 0;

                cart.forEach(item => {
                    const totalPrice = item.quantity * item.price;
                    totalOrderPrice += totalPrice;
                    cartList += `
                        <li class="list-group-item product-title" data-product-name="${item.name}">
                            <div class="order-details">
                                <p>${item.name}</p>
                                <p class="product-details"><span class="quantity">${item.quantity}x</span> <span class="price">@${item.price.toFixed(2)}</span> <span class="total-price">$${totalPrice.toFixed(2)}</span></p>
                            </div>
                            <div class="remove-product">
                                <img src="./assets/images/icon-remove-item.svg" alt="remove icon" class="remove-icon-img">
                            </div>
                        </li>
                    `;
                });

                productListElement.innerHTML = cartList;
                const totalCartPriceElement = document.getElementById('totalOrderPrice') as HTMLElement;
                totalCartPriceElement.innerText = `$${totalOrderPrice.toFixed(2)}`;

                document.querySelectorAll('.remove-product').forEach((removeButton) => {
                    removeButton.addEventListener('click', () => {
                        const productName = (removeButton.closest('.list-group-item') as HTMLElement).getAttribute('data-product-name');

                        const itemIndex = cart.findIndex(item => item.name === productName);
                        if(itemIndex !== -1) {
                            cart.splice(itemIndex, 1);
                        }

                        const productCard = Array.from(productCards).find(card => card.getAttribute('data-product-name') === productName);
                        if(productCard) {
                            const valueButton = productCard.querySelector('.increment-decrement-el') as HTMLElement;
                            const addButton = productCard.querySelector('.add-cart-button') as HTMLElement;

                            if (valueButton) {
                                valueButton.style.contentVisibility = 'hidden';
                            }
                            if (addButton) {
                                addButton.style.display = 'block';
                            }
                        }

                        if(cart.length === 0) {
                            (document.querySelector('.selected-cart') as HTMLElement).style.display = 'none';
                            (document.querySelector('.empty-cart') as HTMLElement).style.display = 'block';
                        }

                        updateCartList();
                        updateCartTitle();
                    })
                });
            }
        }

        function updateCartTitle() {
            const totalQuantity = cart.reduce((acc, item) => {
                console.log(acc, item);
                return acc + item.quantity;
            },0);
            console.log(totalQuantity)
            const cartTitleElement = document.querySelector('.cart-title') as HTMLElement;
        
            if (cartTitleElement) {
                cartTitleElement.innerText = `Your Cart (${totalQuantity})`;
            }
        }
        
        document.getElementById('confirm-btn')?.addEventListener('click', () => {
            const modalProductList = document.querySelector('.modal-product-list') as HTMLElement;

            if(modalProductList) {
                modalProductList.innerHTML = '';
                cart.forEach((item) => {
                    const product = data.find((product:{name:string}) => product.name === item.name);

                    modalProductList.innerHTML += `
                        <li class="modal-list" data-product-name="${item.name}">
                            <div class="modal-image-div">
                                <img src="${product.image.mobile}" alt="${product.name}" class="modal-product-image">
                            </div>
                            <div class="modal-product-details">
                                <div class="div-1">
                                    <h5 class="modal-product-name">${product.name}</h5>
                                    <p><span class="">${item.quantity}x</span> <span class="price">@$${product.price.toFixed(2)}</span></p>                               
                                </div>
                                <div class="div-2">
                                    <p class="modal-quantity-price">$${(item.quantity * item.price).toFixed(2)}</p>
                                </div>
                            </div>
                        </li>
                    `;

                    (document.getElementById('modalTotalOrderPrice') as HTMLElement).innerHTML = `$${totalOrderPrice.toFixed(2)}`

                });
            }
        });

        document.getElementById('startNewOrderBtn')?.addEventListener('click', function () {
            cart = [];

            document.querySelectorAll('.product-card').forEach(card => {
                const valueButton = card.querySelector('.increment-decrement-el') as HTMLElement;
                const addButton = card.querySelector('.add-cart-button') as HTMLElement;
                const productQuantityElement = card.querySelector('.product-number') as HTMLElement;
        
                if (valueButton) {
                    valueButton.style.contentVisibility = 'hidden';
                }
                if (addButton) {
                    addButton.style.display = 'block';
                }
                if (productQuantityElement) {
                    productQuantityElement.innerText = '1'; 
                }
            });
    
            if(cart.length === 0) {
                (document.querySelector('.selected-cart') as HTMLElement).style.display = 'none';
                (document.querySelector('.empty-cart') as HTMLElement).style.display = 'block';
            }

            updateCartList();
            updateCartTitle();
        })
    });
});