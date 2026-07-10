// ============================
// DOM Elements
// ============================

const quote = document.getElementById("quote");
const author = document.getElementById("author");
const category = document.getElementById("category");
const search = document.getElementById("search");
const newQuoteBtn = document.getElementById("newQuote");
const themeBtn = document.getElementById("themeBtn");
const quoteCount = document.getElementById("quoteCount");

// Filtered Quotes
let filteredQuotes = [...quotes];
let currentQuote = null;

// ============================
// Display Quote
// ============================

function displayQuote(data) {

    currentQuote = data;

    quote.classList.remove("fade");
    author.classList.remove("fade");

    setTimeout(() => {

        quote.textContent = `"${data.text}"`;
        author.textContent = `— ${data.author}`;

        quote.classList.add("fade");
        author.classList.add("fade");

        updateCounter();

    }, 150);

}

// ============================
// Random Quote
// ============================

function randomQuote() {

    if (filteredQuotes.length === 0) {

        quote.textContent = "No quotes found.";
        author.textContent = "";

        return;

    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);

    displayQuote(filteredQuotes[randomIndex]);

}

// ============================
// Quote Counter
// ============================

function updateCounter() {

    const index = filteredQuotes.indexOf(currentQuote);

    quoteCount.textContent =
        `Quote ${index + 1} / ${filteredQuotes.length}`;

}

// ============================
// Search
// ============================

search.addEventListener("input", () => {

    filterQuotes();

});

// ============================
// Category
// ============================

category.addEventListener("change", () => {

    filterQuotes();

});

// ============================
// Filter Quotes
// ============================

function filterQuotes() {

    const keyword = search.value.toLowerCase();

    const selectedCategory = category.value;

    filteredQuotes = quotes.filter(item => {

        const matchesSearch =
            item.text.toLowerCase().includes(keyword) ||
            item.author.toLowerCase().includes(keyword);

        const matchesCategory =
            selectedCategory === "All" ||
            item.category === selectedCategory;

        return matchesSearch && matchesCategory;

    });

    randomQuote();

}

// ============================
// New Quote Button
// ============================

newQuoteBtn.addEventListener("click", randomQuote);

// ============================
// Dark Mode
// ============================

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const icon = themeBtn.querySelector("i");

    if (document.body.classList.contains("dark")) {

        icon.className = "fa-solid fa-sun";

        localStorage.setItem("theme", "dark");

    } else {

        icon.className = "fa-solid fa-moon";

        localStorage.setItem("theme", "light");

    }

});

// ============================
// Load Theme
// ============================

window.addEventListener("load", () => {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    }

    randomQuote();

});

// ============================
// Keyboard Shortcut
// ============================

document.addEventListener("keydown", (e) => {

    if (e.code === "Space") {

        e.preventDefault();

        randomQuote();

    }

});
// ============================
// Favorite System
// ============================

const favoriteBtn = document.getElementById("favoriteBtn");
const favoriteCount = document.getElementById("favoriteCount");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];


// ============================
// Add / Remove Favorite
// ============================

favoriteBtn.addEventListener("click", () => {


    if (!currentQuote) return;


    const exists = favorites.some(item =>
        item.text === currentQuote.text
    );


    if (exists) {

        favorites = favorites.filter(item =>
            item.text !== currentQuote.text
        );


        showToast("Removed from favorites");


    } else {


        favorites.push(currentQuote);


        showToast("Added to favorites ❤️");


    }


    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );


    updateFavoriteButton();

    updateFavoriteCount();


});


// ============================
// Update Favorite Button
// ============================

function updateFavoriteButton(){


    if(!currentQuote) return;


    const exists = favorites.some(item =>
        item.text === currentQuote.text
    );


    const icon = favoriteBtn.querySelector("i");


    if(exists){

        icon.className =
        "fa-solid fa-heart";


        favoriteBtn.innerHTML =
        '<i class="fa-solid fa-heart"></i> Saved';


    }else{


        icon.className =
        "fa-regular fa-heart";


        favoriteBtn.innerHTML =
        '<i class="fa-regular fa-heart"></i> Favorite';


    }


}



// ============================
// Favorite Count
// ============================

function updateFavoriteCount(){

    favoriteCount.textContent =
    favorites.length;

}



// Run whenever quote changes

const oldDisplayQuote = displayQuote;


displayQuote = function(data){

    oldDisplayQuote(data);

    setTimeout(()=>{

        updateFavoriteButton();

    },200);

};



// ============================
// Copy Quote
// ============================


const copyBtn =
document.getElementById("copyBtn");


copyBtn.addEventListener("click",()=>{


    if(!currentQuote) return;


    const text =
    `"${currentQuote.text}" - ${currentQuote.author}`;


    navigator.clipboard.writeText(text);


    showToast("Quote copied 📋");


});



// ============================
// Share Quote
// ============================


const shareBtn =
document.getElementById("shareBtn");



shareBtn.addEventListener("click",()=>{


    if(!currentQuote) return;


    const text =
    `"${currentQuote.text}" - ${currentQuote.author}`;


    const url =
    "https://twitter.com/intent/tweet?text="
    +
    encodeURIComponent(text);



    window.open(
        url,
        "_blank"
    );


});



// ============================
// Toast Message
// ============================


const toast =
document.getElementById("toast");



function showToast(message){


    toast.textContent =
    message;


    toast.classList.add("show");


    setTimeout(()=>{


        toast.classList.remove("show");


    },2500);


}



// ============================
// Initial Favorite Count
// ============================

updateFavoriteCount();
// ============================
// Text To Speech
// ============================

const speakBtn = document.getElementById("speakBtn");


speakBtn.addEventListener("click",()=>{


    if(!currentQuote) return;


    const speechText =
    `${currentQuote.text} by ${currentQuote.author}`;


    const speech =
    new SpeechSynthesisUtterance(speechText);


    speech.rate = 0.9;

    speech.pitch = 1;

    speech.volume = 1;


    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(speech);


    showToast("Reading quote 🔊");


});


// ============================
// Auto Change Quote
// ============================

const autoChange =
document.getElementById("autoChange");


let autoTimer = null;



autoChange.addEventListener("change",()=>{


    if(autoChange.checked){


        autoTimer =
        setInterval(()=>{


            randomQuote();


        },15000);


        showToast("Auto mode enabled ⏱");


    }

    else{


        clearInterval(autoTimer);


        autoTimer=null;


        showToast("Auto mode disabled");


    }


});



// ============================
// Download Quote As Image
// ============================


const downloadBtn =
document.getElementById("downloadBtn");



downloadBtn.addEventListener("click",()=>{


    if(!currentQuote) return;



    createQuoteImage();


});





function createQuoteImage(){


    const canvas =
    document.createElement("canvas");


    const ctx =
    canvas.getContext("2d");


    canvas.width = 1200;

    canvas.height = 630;



    // Background

    const gradient =
    ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
    );


    gradient.addColorStop(
        0,
        "#6C63FF"
    );


    gradient.addColorStop(
        1,
        "#06B6D4"
    );


    ctx.fillStyle =
    gradient;


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );



    // Quote Box

    ctx.fillStyle =
    "rgba(255,255,255,0.15)";


    ctx.roundRect(
        100,
        120,
        1000,
        390,
        30
    );


    ctx.fill();



    // Text Style

    ctx.fillStyle =
    "white";


    ctx.textAlign =
    "center";


    ctx.font =
    "bold 45px Poppins";



    wrapText(
        ctx,
        `"${currentQuote.text}"`,
        600,
        260,
        850,
        60
    );



    ctx.font =
    "30px Poppins";


    ctx.fillStyle =
    "#FFD43B";


    ctx.fillText(
        "- " + currentQuote.author,
        600,
        440
    );



    // Download

    const link =
    document.createElement("a");


    link.download =
    "quote.png";


    link.href =
    canvas.toDataURL();


    link.click();


    showToast("Image downloaded 📥");


}




// Text wrapping helper

function wrapText(
    ctx,
    text,
    x,
    y,
    maxWidth,
    lineHeight
){


    const words =
    text.split(" ");


    let line="";


    for(let n=0;n<words.length;n++){


        let testLine =
        line + words[n] + " ";


        let width =
        ctx.measureText(testLine).width;



        if(width > maxWidth && n>0){


            ctx.fillText(
                line,
                x,
                y
            );


            line =
            words[n]+" ";


            y += lineHeight;


        }

        else{


            line=testLine;


        }

    }


    ctx.fillText(
        line,
        x,
        y
    );


}



// ============================
// Statistics
// ============================


const totalQuotes =
document.getElementById("totalQuotes");



function updateStatistics(){


    totalQuotes.textContent =
    quotes.length;


}



updateStatistics();



// ============================
// Quote Change Animation
// ============================


function loadingAnimation(){


    quote.style.opacity="0";


    setTimeout(()=>{


        quote.style.opacity="1";


    },300);


}



// Add animation when changing quote

const oldRandomQuote =
randomQuote;


randomQuote=function(){


    loadingAnimation();


    setTimeout(()=>{


        oldRandomQuote();


    },300);


};



// ============================
// Stop Speech Button Safety
// ============================


window.addEventListener(
"beforeunload",
()=>{


    window.speechSynthesis.cancel();


});



// ============================
// Initialize App
// ============================


updateFavoriteCount();

updateStatistics();
