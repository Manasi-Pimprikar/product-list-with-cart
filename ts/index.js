//Fetch json data
document.addEventListener('DOMContentLoaded', function () {
    fetch('./data.json').then(function (response) {
        return response.json();
    })
        .then(function (data) {
        var _a, _b;
        var parentELement = document.getElementById('card-container');
        var htmlContainer = '';
        data.forEach(function (item) {
            htmlContainer += "\n                <div class=\"col\">\n                    <div class=\"card h-100 product-card\" data-product-name=\"".concat(item.name, "\">\n                        <picture>\n                            <source srcset=\"").concat(item.image.desktop, "\" media=\"(min-width: 1200px)\">\n                            <source srcset=\"").concat(item.image.tablet, "\" media=\"(min-width: 768px)\">\n                            <source srcset=\"").concat(item.image.mobile, "\" media=\"(min-width: 480px)\">\n                            <img src=\"").concat(item.image.thumbnail, "\" alt=\"").concat(item.name, "\" style=\"width: 100%; border-radius: 6px;\">\n                        </picture>\n                        <div class=\"btn-div\">\n                            <button type=\"button\" class=\"btn btn-primary add-cart-button\" data-bs-toggle=\"button\">\n                                <img src=\"./assets/images/icon-add-to-cart.svg\" alt=\"add to cart icon\" class=\"add-to-cart-img\">Add to Cart\n                            </button>\n                        </div>\n                        <div class=\"increment-decrement-el\">\n                            <button type=\"button\" class=\"btn decrement-btn data-bs-toggle=\"button\">\n                                <img src=\"./assets/images/icon-decrement-quantity.svg\" alt=\"decrement quantity icon\" class=\"decrement-icon\">\n                            </button>\n                            <p class=\"product-number\">1</p>\n                            <button type=\"button\" class=\"btn increment-btn data-bs-toggle=\"button\">\n                                <img src=\"./assets/images/icon-increment-quantity.svg\" alt=\"increment quantity icon\" class=\"increment-icon\">\n                            </button>\n                        </div>\n                        <div class=\"card-body\">\n                            <p class=\"card-text product-category\">").concat(item.category, "</p>\n                            <h5 class=\"card-title product-name\">").concat(item.name, "</h5>\n                            <p class=\"product-price\">$").concat(item.price.toFixed(2), "</p>\n                        </div>\n                    </div>\n                </div>\n            ");
            if (parentELement) {
                parentELement.innerHTML = htmlContainer;
            }
            else {
                console.log('element not found');
            }
        });
        var productCards = document.querySelectorAll('.product-card');
        var productListElement = document.querySelector('.product-list');
        var emptyCartElement = document.querySelector('.empty-cart');
        var selectedCartELement = document.querySelector('.selected-cart');
        var totalOrderPrice = 0;
        var cart = [];
        productCards.forEach(function (card, _index) {
            var addButton = card.querySelector('.add-cart-button');
            var valueButton = card.querySelector('.increment-decrement-el');
            var productQuantityElement = card.querySelector('.product-number');
            var incrementButton = card.querySelector('.increment-btn');
            var decrementButton = card.querySelector('.decrement-btn');
            if (addButton && valueButton) {
                addButton.addEventListener('click', function () {
                    valueButton.style.contentVisibility = 'visible';
                    addButton.style.display = 'none';
                    emptyCartElement.style.display = "none";
                    selectedCartELement.style.display = "block";
                    var productName = card.getAttribute('data-product-name');
                    var productPrice = parseFloat(card.querySelector('.product-price').innerText.split('$').join(''));
                    var existingProduct = cart.find(function (item) { return item.name === productName; });
                    if (existingProduct) {
                        existingProduct.quantity += 1;
                    }
                    else {
                        cart.push({ name: productName, quantity: 1, price: productPrice });
                    }
                    updateCartList();
                    updateCartTitle();
                });
                incrementButton.addEventListener('click', function () {
                    var quantity = parseInt(productQuantityElement.innerText);
                    quantity += 1;
                    productQuantityElement.innerText = quantity.toString();
                    var productName = card.getAttribute('data-product-name');
                    var productInCart = cart.find(function (item) { return item.name === productName; });
                    if (productInCart) {
                        productInCart.quantity = quantity;
                    }
                    updateCartList();
                    updateCartTitle();
                });
                decrementButton.addEventListener('click', function () {
                    var quantity = parseInt(productQuantityElement.innerText);
                    if (quantity > 1) {
                        quantity -= 1;
                        productQuantityElement.innerText = quantity.toString();
                        var productName_1 = card.getAttribute('data-product-name');
                        var productInCart = cart.find(function (item) { return item.name === productName_1; });
                        if (productInCart) {
                            productInCart.quantity = quantity;
                        }
                        updateCartList();
                        updateCartTitle();
                    }
                });
            }
        });
        function updateCartList() {
            if (productListElement) {
                var cartList_1 = '';
                totalOrderPrice = 0;
                cart.forEach(function (item) {
                    var totalPrice = item.quantity * item.price;
                    totalOrderPrice += totalPrice;
                    cartList_1 += "\n                        <li class=\"list-group-item product-title\" data-product-name=\"".concat(item.name, "\">\n                            <div class=\"order-details\">\n                                <p>").concat(item.name, "</p>\n                                <p class=\"product-details\"><span class=\"quantity\">").concat(item.quantity, "x</span> <span class=\"price\">@").concat(item.price.toFixed(2), "</span> <span class=\"total-price\">$").concat(totalPrice.toFixed(2), "</span></p>\n                            </div>\n                            <div class=\"remove-product\">\n                                <img src=\"./assets/images/icon-remove-item.svg\" alt=\"remove icon\" class=\"remove-icon-img\">\n                            </div>\n                        </li>\n                    ");
                });
                productListElement.innerHTML = cartList_1;
                var totalCartPriceElement = document.getElementById('totalOrderPrice');
                totalCartPriceElement.innerText = "$".concat(totalOrderPrice.toFixed(2));
                document.querySelectorAll('.remove-product').forEach(function (removeButton) {
                    removeButton.addEventListener('click', function () {
                        var productName = removeButton.closest('.list-group-item').getAttribute('data-product-name');
                        var itemIndex = cart.findIndex(function (item) { return item.name === productName; });
                        if (itemIndex !== -1) {
                            cart.splice(itemIndex, 1);
                        }
                        var productCard = Array.from(productCards).find(function (card) { return card.getAttribute('data-product-name') === productName; });
                        if (productCard) {
                            var valueButton = productCard.querySelector('.increment-decrement-el');
                            var addButton = productCard.querySelector('.add-cart-button');
                            if (valueButton) {
                                valueButton.style.contentVisibility = 'hidden';
                            }
                            if (addButton) {
                                addButton.style.display = 'block';
                            }
                        }
                        if (cart.length === 0) {
                            document.querySelector('.selected-cart').style.display = 'none';
                            document.querySelector('.empty-cart').style.display = 'block';
                        }
                        updateCartList();
                        updateCartTitle();
                    });
                });
            }
        }
        function updateCartTitle() {
            var totalQuantity = cart.reduce(function (acc, item) {
                console.log(acc, item);
                return acc + item.quantity;
            }, 0);
            console.log(totalQuantity);
            var cartTitleElement = document.querySelector('.cart-title');
            if (cartTitleElement) {
                cartTitleElement.innerText = "Your Cart (".concat(totalQuantity, ")");
            }
        }
        (_a = document.getElementById('confirm-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
            var modalProductList = document.querySelector('.modal-product-list');
            if (modalProductList) {
                modalProductList.innerHTML = '';
                cart.forEach(function (item) {
                    var product = data.find(function (product) { return product.name === item.name; });
                    modalProductList.innerHTML += "\n                        <li class=\"modal-list\" data-product-name=\"".concat(item.name, "\">\n                            <div class=\"modal-image-div\">\n                                <img src=\"").concat(product.image.mobile, "\" alt=\"").concat(product.name, "\" class=\"modal-product-image\">\n                            </div>\n                            <div class=\"modal-product-details\">\n                                <div class=\"div-1\">\n                                    <h5 class=\"modal-product-name\">").concat(product.name, "</h5>\n                                    <p><span class=\"\">").concat(item.quantity, "x</span> <span class=\"price\">@$").concat(product.price.toFixed(2), "</span></p>                               \n                                </div>\n                                <div class=\"div-2\">\n                                    <p class=\"modal-quantity-price\">$").concat((item.quantity * item.price).toFixed(2), "</p>\n                                </div>\n                            </div>\n                        </li>\n                    ");
                    document.getElementById('modalTotalOrderPrice').innerHTML = "$".concat(totalOrderPrice.toFixed(2));
                });
            }
        });
        (_b = document.getElementById('startNewOrderBtn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
            cart = [];
            document.querySelectorAll('.product-card').forEach(function (card) {
                var valueButton = card.querySelector('.increment-decrement-el');
                var addButton = card.querySelector('.add-cart-button');
                var productQuantityElement = card.querySelector('.product-number');
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
            if (cart.length === 0) {
                document.querySelector('.selected-cart').style.display = 'none';
                document.querySelector('.empty-cart').style.display = 'block';
            }
            updateCartList();
            updateCartTitle();
        });
    });
});
