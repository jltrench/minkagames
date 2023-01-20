let  cart = [];
let modalQt = 1;
let modalKey = 0;

// Simplificacao do querySelector/All
const s = (el) => document.querySelector(el); 
const sa = (el) => document.querySelectorAll(el);

//Listagem
gamesJson.map((item, index) => {
    let gameItem = s('.models .game-item').cloneNode(true);

    gameItem.setAttribute('data-key', index);
    gameItem.querySelector('.game-item--img img').src = item.img;
    gameItem.querySelector('.game-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    gameItem.querySelector('.game-item--name').innerHTML = item.name;
    gameItem.querySelector('.game-item--desc').innerHTML = item.description;
    gameItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();

        let key = e.target.closest('.game-item').getAttribute("data-key");
        modalQt = 1;
        modalKey = key;

        s('.gameBig img').src = gamesJson[key].img;
        s('.gameInfo h1').innerHTML = gamesJson[key].name;
        s('.gameInfo--desc').innerHTML = gamesJson[key].description;
        s('.gameInfo--actualPrice').innerHTML = `R$ ${gamesJson[key].price.toFixed(2)}`;
        s('.gameInfo--size.selected').classList.remove('selected');
        sa('.gameInfo--size').forEach((size, sizeIndex) => {
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }
            
            size.querySelector('span').innerHTML = gamesJson[key].sizes[sizeIndex];
        });

        s('.gameInfo--qt').innerHTML = modalQt;

        s('.gameWindowArea').style.opacity = 0;
        s('.gameWindowArea').style.display = 'flex';
        setTimeout(() => {
            s('.gameWindowArea').style.opacity = 1;
        }, 200)
    });
    
    
    s('.game-area').append(gameItem); 
});

// Eventos do Modal
function closeModal() {
    s('.gameWindowArea').style.opacity = 0;
    setTimeout(() => {
        s('.gameWindowArea').style.display = 'none';
    }, 500);
}
sa('.gameInfo--cancelButton, .gameInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
})
s('.gameInfo--qtmenos').addEventListener('click', () => {
    if(modalQt > 1) {
        modalQt--;
        s('.gameInfo--qt').innerHTML = modalQt;
    }
    
})
s('.gameInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    s('.gameInfo--qt').innerHTML = modalQt;
})
sa('.gameInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        s('.gameInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});
s('.gameInfo--addButton').addEventListener('click', () => {
    let size = parseInt(s('.gameInfo--size.selected').getAttribute('data-key'));

    let identifier = gamesJson[modalKey].id + '@' + size;

    let key = cart.findIndex((item) => item.identifier == identifier);

    if(key > -1) {
        cart[key].qt += modalQt;
    }
    else {
        cart.push({
            identifier,
            id: gamesJson[modalKey].id,
            size,
            qt: modalQt
        });
    }

    updateCart();

    closeModal();
});

// Mobile
s('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) {
        s('aside').style.left = '0';
    }
});
s('.menu-closer').addEventListener('click', () => {
    s('aside').style.left = '100vw';
});
// --- x ---

function updateCart() {
    s('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        s('aside').classList.add('show');
        s('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let gameItem = gamesJson.find((item) => item.id == cart[i].id);
            subtotal += gameItem.price * cart[i].qt;

            let cartItem = s('.models .cart--item').cloneNode(true);

            let gameSizeName;
            switch(cart[i].size) {
                case 0:
                    gameSizeName = 'PlayStation';
                    break;
                case 1:
                    gameSizeName = 'Xbox';
                    break;
                case 2:
                    gameSizeName = 'PC';
                    break;
            };

            let gameName = `${gameItem.name} (${gameSizeName})`

            cartItem.querySelector('img').src = gameItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = gameName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                }
                else {
                    cart.splice(i, 1);
                }
                updateCart();
            })
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++; 
                updateCart();
            })

            s('.cart').append(cartItem);
        }

        desconto = subtotal * 0.05;
        total = subtotal - desconto;

        s('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        s('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        s('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    }
    else {
        s('aside').classList.remove('show');
        s('aside').style.left = '100vw'; // Mobile
    }
}