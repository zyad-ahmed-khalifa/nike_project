let latestSection = document.querySelector("section#latest .products"),
    featuresSection = document.querySelector("#features .container .row"),
    form = document.querySelector("nav.navbar form"),
    popup = Array.from(document.querySelectorAll("section.popup")),
    popupKeys = Array.from(document.querySelectorAll("nav ul.nav-icons li")),
    products = [],
    slides = Array.from(document.querySelectorAll("section#landing .slide")),
    nextBtn = document.querySelector("button.right"),
    prevBtn = document.querySelector("button.left"),
    colors = ["251, 37, 39", "15, 121, 214", "237, 152, 33"];



if (localStorage.getItem("products") === null) {
    localStorage.setItem("products", JSON.stringify(products));
} else {
    products = JSON.parse(localStorage.getItem("products")) || [];
}
showProductsInCart()

let slideIndex = localStorage.getItem("slideIndex") || 0
slides.forEach(function (slide, index) {
    slide.classList.remove("show")
    slide.classList.remove("active")
    if (index == slideIndex) {
        slide.classList.add("active")
        setTimeout(function () {
            slide.classList.add("show")
        }, 100)
    }
    document.documentElement.style.setProperty("--main-color", colors[slideIndex])

})

nextBtn.addEventListener("click", function () {
    let currentSlide = document.querySelector("#landing .slide.active"),
        index = +currentSlide.getAttribute("data-index"),
        nextSlide = slides[index + 1];
    nextSlide = (nextSlide == null) ? slides[0] : nextSlide;

    currentSlide.classList.remove("show")
    currentSlide.classList.remove("active")
    nextSlide.classList.add("active")
    setTimeout(function () {
        nextSlide.classList.add("show")
    }, 100)
    index = (index+1 == 3)? -1:index
    document.documentElement.style.setProperty("--main-color", colors[index + 1])
    localStorage.setItem("slideIndex", index+1)
})

prevBtn.addEventListener("click", function () {
    let currentSlide = document.querySelector("#landing .slide.active"),
        index = +currentSlide.getAttribute("data-index")
        prevSlide = slides[index - 1]
    prevSlide = (prevSlide == null) ? slides[slides.length -1] : prevSlide;

    currentSlide.classList.remove("show")
    currentSlide.classList.remove("active")
    prevSlide.classList.add("active")
    setTimeout(function () {
        prevSlide.classList.add("show")
    }, 100)
    index = (index - 1 == -1) ? 3 : index
    document.documentElement.style.setProperty("--main-color", colors[index - 1])
    localStorage.setItem("slideIndex", index-1)
})

function updateLocalStorage() {
    localStorage.setItem("products", JSON.stringify(products));
}


popupKeys.forEach(function (key) {
    key.addEventListener("click", function () {
        let targetPopup = this.getAttribute("data-popup");
        openPopup(targetPopup)
    })
});

function openPopup(targetPopup) {
    let popup = document.querySelector(`section#${targetPopup}`)
    popup.classList.add("active");
    setTimeout(function () {
        popup.firstElementChild.classList.add("show");
    }, 100)
};

popup.forEach(function (pop) {
    pop.addEventListener("click", function () {
        pop.firstElementChild.classList.remove("show");
        setTimeout(function () {
            pop.classList.remove("active");
        }, 700)
    })
    pop.firstElementChild.addEventListener("click", function (event) {
        event.stopPropagation()
    })
});


function showLatest() {
    latestSection.innerHTML=``
    latest.forEach(function (product) {
        
        let condArr = [], btnCond;
        JSON.parse(localStorage.getItem("products")).forEach(function (item) {
            condArr.push(item.id)
            btnCond = condArr.includes(product.id)
        })
        let btn = `
            ${(btnCond) ? `<button class="btn btn-outline-success" onclick="removeFromCart(${product.id}, this)" data-type="remove">remove from cart</button>`: `<button class="btn" onclick = "addToCart(${product.id}, this)" data-type="add" > Add to cart</button>`}
        `

        let imgs = ``
        product.images.forEach(function (img) {
            imgs += `
            <div class="col-3 col-md-12 mb-2" onclick="changeImg(this)">
                <img class="img-fluid" src="./images/${img}" alt="">
            </div>
            `
        })
        let allSizes = ``
        Array.from(product.sizes).forEach(function (size, index) {
            allSizes += `
            <li class="me-2 ${index == 0 ? "active" : ""}" onclick="select(this)">${size}</li>
            `
        })
        let card = `
        <div class="item rounded-4 p-3 mb-3 bg-white">
            <div class="row">
                <div class="col-lg-6 imgs">
                    <div class="row h-100">
                        <div class="col-md-2 ul-imgs">
                            <div class="row align-content-between h-100">
                                ${imgs}
                            </div>
                        </div>
                        <div class="col-md-10 main-img">
                            <img src="./images/${product.images[0]}" alt="" class="img-fluid">
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 text">
                    <div class="box">
                        <h2>${product.name}</h2>
                        <p class="text-black-50">${product.description}</p>
                        <p><span class="fw-bolder fs-5">Price:</span> <span class="text-decoration-line-through">${product.price}<sup>$</sup></span> <span>${Math.round(product.price - (product.price * product.discount))}<sup>$</sup></span></p>
                        <div class="sizes d-flex fs-5 fw-bolder align-items-center">
                            <p>sizes : </p>
                            <ul class="list-unstyled d-flex ms-2 ">
                                ${allSizes}
                            </ul>
                        </div>
                        ${btn}
                    </div>
                </div>
            </div>
        </div>
    `
        latestSection.innerHTML += card
    })

}
showLatest()

function changeImg(that) {
    let currentImg = that.parentElement.parentElement.nextElementSibling.firstElementChild
    let imgSrc = that.children[0].getAttribute("src");
    currentImg.setAttribute("src", imgSrc)
}

function select(that) {
    let sizesElements = Array.from(that.parentElement.children)
    sizesElements.forEach(function (li) {
        li.classList.remove("active")
        that.classList.add("active")
    })
}

function addToCart(productId, that) {
    let selectedProduct = all.find(function (item) {
        return item.id == productId
    })
    let chosenSize = Array.from(that.previousElementSibling.children[1].children).find(function (li) {
        return li.classList.contains("active")
    })
    selectedProduct.sizes = chosenSize.innerHTML
    convertToRemoveFromCart(productId, that)
    products.push(selectedProduct)
    updateLocalStorage()
    showProductsInCart()
    console.log(products)
}

function convertToRemoveFromCart(productId, that) {
    that.innerHTML = "remove from cart"
    that.setAttribute("data-type", "remove")
    that.classList.add("btn-outline-success")
    that.setAttribute("onclick", `removeFromCart(${productId},this)`)
}

function removeFromCart(productId, that) {
    that.innerHTML = "add to cart"
    that.setAttribute("data-type", "add")
    that.classList.remove("btn-outline-success")
    that.setAttribute("onclick", `addToCart(${productId},this)`)
    let index = products.findIndex(function (item) {
        return item.id == productId
    })
    products.splice(index, 1)
    updateLocalStorage()
    showProductsInCart()
    showLatest()
    console.log(products)
}

(function showFeatures() {
    features.forEach(function (item) {
        let imgIndicators = ``;
        item.images.forEach(function (image, index) {
            imgIndicators += `<span class="${index == 0 ? "active" : ""}" onclick="currentImg(this, ${index}, ${item.id})"></span>`
        })
        let card = `
        <div class="col-sm-6 col-md-4 col-lg-3 mb-3 px-5 px-sm-2">
            <div class="card border-0 position-relative rounded-2" data-id="${item.id}">
                <i class="fa-solid fa-heart position-absolute top-50 start-50 z-3"></i>
                <div class="offer text-center ${item.discount == 0 ? "d-none" : ""}">${item.discount * 100}%</div>
                <div class="head pb-3">
                    <img src="./images/${item.images[0]}" class="card-img-top" alt="...">
                    <div class="indicators position-absolute mb-1">
                        <button class="btn p-0 mb-3" onclick="openDiscoverPopup(${item.id})">
                            <span class="icon"><i class="fa-solid fa-magnifying-glass"></i></span>
                        </button>
                        <div class="inner-indicators">
                        ${imgIndicators}
                        </div>
                    </div>
                </div>
                <div class="card-body text-center">
                    <h6 class="card-title">${item.name}</h6>
                    <p class="card-text"><span class="text-decoration-line-through ${item.discount == 0 ? "d-none" : ""}">${item.price}</span><sup class="${item.discount == 0 ? "d-none" : ""}">$</sup> ${Math.round(item.price - (item.price * item.discount))}<sup>$</sup></p>
                </div>
            </div>
        </div>
        `;
        featuresSection.innerHTML += card;
    })
})()

function openDiscoverPopup(itemId) {
    document.querySelector("section#product-info .box").innerHTML =``
    openPopup(`product-info`)
    let featureItem = features.find(function (item) {
        return item.id == itemId
    })

    let condArr = [], btnCond;
    JSON.parse(localStorage.getItem("products")).forEach(function (item) {
        condArr.push(item.id)
        btnCond = condArr.includes(featureItem.id)
    })
    let btn = `
            ${(btnCond) ? `<button class="btn btn-outline-success" onclick="removeFromCart(${featureItem.id}, this)" data-type="remove">remove from cart</button>` : `<button class="btn" onclick = "addToCart(${featureItem.id}, this)" data-type="add" > Add to cart</button>`}
        `
    

    let imgIndicators = ``;
    featureItem.images.forEach(function (image, index) {
        imgIndicators += `
        <div class="col p-0 px-md-2">
            <img class="img-fluid" src="./images/${image}" alt="" onclick="currentImg2(this)" style="cursor:pointer;">
        </div>
        `
    })
    let sizeIndicators = ``;
    Array.from(featureItem.sizes).forEach(function (size, index) {
        sizeIndicators += `
            <li class="me-2 ${index == 0 ? "active" : ""}" onclick="select(this)">${size}</li>
        `
    })
    let colorIndicators = ``;
    featureItem.colors.forEach(function (color, index) {
        colorIndicators += `
            <li class="me-2 ${index == 0 ? "active" : ""}" style="background-color:${color};" onclick="select(this)"></li>
        `
    })

    let popupContent = `
        <div class="row">
                <div class="col-lg-6">
                    <div class="row">
                        <div class="col-12">
                            <img class=" main-img" src="./images/${featureItem.images[0]}" alt="">
                        </div>
                        <div class="col-12">
                            <div class="row ul-imgs">
                                ${imgIndicators}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 text-start text-light">
                    <h2 class="text-light">${featureItem.name}</h2>
                    <p class="card-text"><span class="text-decoration-line-through ${featureItem.discount == 0 ? "d-none" : ""}">${featureItem.price}</span><sup class="${featureItem.discount == 0 ? "d-none" : ""}">$</sup> ${Math.round(featureItem.price - (featureItem.price * featureItem.discount))}<sup>$</sup></p>
                    <p class="border-top pt-3">${featureItem.description}</p>
                    <div class="sizes d-flex fs-5 fw-bolder align-items-center">
                        <p>sizes : </p>
                        <ul class="list-unstyled d-flex ms-2 ">
                            ${sizeIndicators}
                        </ul>
                    </div>
                    <div class="sizes d-flex fs-5 fw-bolder align-items-center">
                        <p>colors : </p>
                        <ul class="list-unstyled d-flex ms-2 colors">
                            ${colorIndicators}
                        </ul>
                    </div>
                    ${btn}
                </div>
            </div>
    `
    document.querySelector("section#product-info .box").innerHTML = popupContent
}

function addToCart2(productId, that) {
    let selectedProduct = all.find(function (item) {
        return item.id == productId
    })
    let chosenSize = Array.from(that.previousElementSibling.previousElementSibling.children[1].children).find(function (li) {
        return li.classList.contains("active")
    })
    let chosenColor = Array.from(that.previousElementSibling.children[1].children).find(function (li) {
        return li.classList.contains("active");
    })
    selectedProduct.sizes = chosenSize.innerHTML
    selectedProduct.colors = chosenColor.style.backgroundColor;
    convertToRemoveFromCart(productId, that)
    products.push(selectedProduct)
    updateLocalStorage()
    showProductsInCart()
    console.log(products)
}

function currentImg2(that) {
    let mainImg = that.parentElement.parentElement.parentElement.previousElementSibling.firstElementChild
    let currentSrc = that.getAttribute("src");
    mainImg.setAttribute("src", currentSrc);
}

function currentImg(that, imgIndex, itemId) {
    let indicators = Array.from(that.parentElement.children)

    indicators.forEach(function (span) {
        span.classList.remove("active")
        that.classList.add("active")
    })
    let img = that.parentElement.parentElement.parentElement.children[0];
    let item = features.find(function (element) {
        return element.id == itemId
    })
    let imagesList = item.images,
        wantedImg = imagesList[imgIndex];
    img.setAttribute("src", `./images/${wantedImg}`)

}

function showProductsInCart() {
    let cart = document.querySelector("section#cart .items .row"),
        emptyCartNote = document.querySelector("section#cart div.empty-cart"),
        buyBtn = document.querySelector("section#cart button.empty-cart")
    if (products.length == 0) {
        emptyCartNote.classList.remove("d-none")
        buyBtn.classList.add("d-none")
    } else {
        emptyCartNote.classList.add("d-none")
        buyBtn.classList.remove("d-none")
    }
    cart.innerHTML =``
    products.forEach(function (product) {
        let contentCard = `
        <div class="col-sm-6 col-lg-4 col-xl-3">
            <div class="item p-0 w-100 h-100">
                <div class="card m-auto w-100 h-100">
                    <img src="./images/${product.images[0]}" class="d-block m-auto" alt="...">
                    <div class="card-body">
                        <h5 class="card-title text-start" title="${product.name}">${product.name}</h5>
                        <ul class="list-unstyled text-start">
                            <li><span class="fw-bold">Price:</span> <span class="text-decoration-line-through special">${product.price}<sup>$</sup></span> <span>${Math.round(product.price - (product.price * product.discount))}<sup>$</sup></span></li>
                            <li><span class="fw-bold">Size:</span> <span class="special">${product.sizes} <span></li>
                            <li><span class="fw-bold">Colors:</span> <span class="color" style="background-color:${product.colors};"></span></li>
                        </ul>
                        <button class="btn btn-danger w-100" onclick="removeFromCart(${product.id}, this)">remove</button>
                    </div>
                </div>
            </div>
        </div>
    `
        cart.innerHTML += contentCard
    })
}





let cards = Array.from(featuresSection.querySelectorAll(".card"));
let favorites = [];




favorites = localStorage.getItem("favorites") || [];
if (favorites.length !== 0) {
    favorites = favorites.split(",")
}

function showFav() {
    cards.forEach(function (card) {
        let itemId = card.getAttribute("data-id")
        if (favorites.includes(itemId)) {
            card.classList.add("bg-danger-subtle")
            card.setAttribute("data-love", "true")
        } else {
            card.classList.remove("bg-danger-subtle")
            card.setAttribute("data-love", "false")
        }
    })
}
showFav()

cards.forEach(function (card) {
    card.addEventListener("dblclick", function () {
        let itemId = +this.getAttribute("data-id")
        if (this.getAttribute("data-love") == "true") {
            let index = Array.from(favorites).findIndex(function (ele) {
                return ele == itemId
            })
            favorites.splice(index, 1)
            this.setAttribute("data-love", "false")
            this.classList.remove("bg-danger-subtle")
            localStorage.setItem("favorites", favorites)
            showProductsInFavorite()
        } else {
            this.firstElementChild.classList.add("love")
            this.setAttribute("data-love", "true")
            favorites.push(itemId)
            this.classList.add("bg-danger-subtle")
            localStorage.setItem("favorites", favorites)
            showProductsInFavorite()
        }
    })
})

function showProductsInFavorite() {
    let fav = document.querySelector("section#favorite .items .row"),
        emptyFavNote = document.querySelector("section#favorite div.empty-fav"),
        buyBtn = document.querySelector("section#favorite button.empty-fav")
    if (favorites.length == 0) {
        emptyFavNote.classList.remove("d-none")
        buyBtn.classList.add("d-none")
    } else {
        emptyFavNote.classList.add("d-none")
        buyBtn.classList.remove("d-none")
    }
    fav.innerHTML = ``
    
    favorites.forEach(function (item) {
        let product = features[+item]
        let contentCard = `
        <div class="col-sm-6 col-lg-4 col-xl-3">
            <div class="item p-0 w-100 h-100">
                <div class="card m-auto w-100 h-100">
                    <img src="./images/${product.images[0]}" class="d-block m-auto" alt="...">
                    <div class="card-body">
                        <h5 class="card-title text-start" title="${product.name}">${product.name}</h5>
                        <ul class="list-unstyled text-start">
                            <li><span class="fw-bold">Price:</span> <span class="text-decoration-line-through special">${product.price}<sup>$</sup></span> <span>${Math.round(product.price - (product.price * product.discount))}<sup>$</sup></span></li>
                            <li><span class="fw-bold">Size:</span> <span class="special">${product.sizes} <span></li>
                            <li><span class="fw-bold">Colors:</span> <span class="color" style="background-color:${product.colors};"></span></li>
                        </ul>
                        <button class="btn btn-danger w-100" onclick="removeFromFav(${product.id}, this)">remove</button>
                    </div>
                </div>
            </div>
        </div>
    `
        fav.innerHTML += contentCard
    })
}
showProductsInFavorite()

function removeFromFav(productId, that) {
    let index = favorites.findIndex(function (item) {
        return item.id == productId
    })
    favorites.splice(index, 1)
    localStorage.setItem("favorites", favorites)
    showProductsInFavorite()
    showFav()
    console.log(products)
}









form.addEventListener("submit", function (event) {
    event.preventDefault()
    let searchWord = this.querySelector("input").value
    if (searchWord.length != 0) {
        let wantedProduct = Array.from(featuresSection.children).filter(function (item) {
            let condition = item.children[0].children[2].firstElementChild.innerHTML.toLocaleLowerCase().trim().includes(searchWord.toLocaleLowerCase().trim());
            return condition;
        })
        wantedProduct.forEach(function (card) {
            card.firstElementChild.classList.add("bg-success-subtle")
            setTimeout(function () {
                card.firstElementChild.classList.remove("bg-success-subtle")
            }, 2000)
        })
        if (wantedProduct.length != 0) {
            let result = wantedProduct[0].offsetTop
            window.scrollTo(0, result - 40)
            wantedProduct = []
        } else {
            document.querySelector("#formSearch .modal-body").innerHTML = "please try in different words"
            document.querySelector("#formSearch button").click()
        }
        this.reset()
    }
    else {
        document.querySelector("#formSearch .modal-body").innerHTML = "please write something to search"
        document.querySelector("#formSearch button").click()
    }
})

window.onload = function () {
    let loading = document.querySelector("#loading")
    loading.classList.add("show")
    setTimeout(function () {
        loading.classList.remove("active")
        document.body.style.overflow = "initial"
    }, 100)
}

let latestScroll = document.querySelector("section#latest").offsetTop,
    featuresScroll = document.querySelector("section#features").offsetTop,
    navTabs = Array.from(document.querySelectorAll("nav ul.navbar-nav:nth-of-type(1) li"));

    
window.addEventListener("scroll", function () {
    navTabs.forEach(function (li) {
        li.firstElementChild.classList.remove("active")
    })
    if (Math.round(this.scrollY) < latestScroll) {
        navTabs[0].firstElementChild.classList.add("active");
    }
    if (Math.round(this.scrollY) >= latestScroll && Math.round(this.scrollY) < featuresScroll) {
        navTabs[1].firstElementChild.classList.add("active");
    }
    if (Math.round(this.scrollY) >= featuresScroll) {
        navTabs[2].firstElementChild.classList.add("active");
    }
})