'use strict'

const addEvent = (element, event, delegate )  => {
    if (typeof (window.event) != 'undefined' && element.attachEvent)
        element.attachEvent(`on${event}`, delegate);
    else 
        element.addEventListener(event, delegate, false);
}

const emptyBasket = () => {
    let ul = document.getElementById('basket');
    let liNodes = 0;
    
    for (let i = 0; i < ul.childNodes.length; i++) {
        if (ul.childNodes[i].nodeName == "LI") {
            liNodes++;
        }
    }
    console.log(liNodes);

    while (liNodes != 0) {
        ul.removeChild(ul.lastElementChild);
        liNodes--;
    }

    let price = document.getElementsByClassName('total');
    price[0].innerText = "0.00";
    
}

addEvent(document, 'readystatechange', () => {
    if ( document.readyState !== "complete" ) 
        return true;

    const items = document.querySelectorAll("section.products ul li");
    const cart = document.querySelectorAll("#cart ul")[0];

    const updateCart = () => {
        let total = 0.0;
        const cart_items = document.querySelectorAll("#cart ul li");

        for (const cart_item of cart_items) {
            const quantity = cart_item.getAttribute('data-quantity');
            const price = cart_item.getAttribute('data-price');

            const sub_total = parseFloat(quantity * parseFloat(price));
            cart_item.querySelectorAll("span.sub-total")[0].innerHTML = ` = ${sub_total.toFixed(2)}`;

            total += sub_total;
        }

        document.querySelectorAll("#cart span.total")[0].innerHTML = total.toFixed(2);
    }

    const addCartItem = (item, id) => {
        const clone = item.cloneNode(true);
        clone.setAttribute('data-id', id);
        clone.setAttribute('data-quantity', 1);
        clone.removeAttribute('id');
        
        let fragment = document.createElement('span');
        fragment.setAttribute('class', 'quantity');
        fragment.innerHTML = ' x 1';
        clone.appendChild(fragment);	
        
        fragment = document.createElement('span');
        fragment.setAttribute('class', 'sub-total');
        clone.appendChild(fragment);					
        cart.appendChild(clone);
    }

    const updateCartItem = (item) => {
        let quantity = item.getAttribute('data-quantity');
        quantity = parseInt(quantity) + 1
        item.setAttribute('data-quantity', quantity);
        const span = item.querySelectorAll('span.quantity');
        span[0].innerHTML = ` x ${quantity}`;
    }

    const onDrop = (event) => {			
        if(event.preventDefault) event.preventDefault();
        if (event.stopPropagation) event.stopPropagation();
        else event.cancelBubble = true;
        
        const id = event.dataTransfer.getData("Text");
        const item = document.getElementById(id);			
                    
        const exists = document.querySelectorAll(`#cart ul li[data-id='${id}']`);
        
        if(exists.length > 0){
            updateCartItem(exists[0]);
        } else {
            addCartItem(item, id);
        }
        
        updateCart();
        
        return false;
    }

    const onDragOver = (event) => {
        if(event.preventDefault) event.preventDefault();
        if (event.stopPropagation) event.stopPropagation();
        else event.cancelBubble = true;
        return false;
    }

    addEvent(cart, 'drop', onDrop);
    addEvent(cart, 'dragover', onDragOver);

    const onDrag = (event) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.dropEffect = "move";
        const target = event.target || event.srcElement;
        const success = event.dataTransfer.setData('Text', target.id);
    }


    for (const item of items) {
        item.setAttribute("draggable", "true");
        addEvent(item, 'dragstart', onDrag);
    }
});