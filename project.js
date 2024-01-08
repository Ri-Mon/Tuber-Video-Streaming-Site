let current_ID = 1000;

// script for tooltip :
document.addEventListener('DOMContentLoaded', function () {
    var sortButton = document.getElementById('categoryList');

    if (sortButton) { // initializing tooltip
        var tooltip = new bootstrap.Tooltip(sortButton, {
            delay: { "show": 0, "hide": 0 },
            trigger: 'manual'
        });

        var ascending = true;

        sortButton.addEventListener('click', function () {
            ascending = !ascending;
            var newTitle = ascending ? 'Highest To Lowest' : 'Lowest To Highest';
            tooltip.dispose();
            sortButton.setAttribute('title', newTitle);
            // re-initialization of the tooltip : 
            tooltip = new bootstrap.Tooltip(sortButton, {
                delay: { "show": 0, "hide": 0 },
                trigger: 'manual'
            });
            tooltip.show();
        });

        sortButton.addEventListener('mouseover', function () {
            tooltip.show();
        });

        sortButton.addEventListener('mouseout', function () {
            tooltip.hide();
        });
    }
});

//sort by views :
let sortOrder = true;
const toggleOrder = async() => {
    sortOrder? sortOrder = false : sortOrder = true;

    try {
        const response = await fetch(`https://openapi.programming-hero.com/api/videos/category/${current_ID}`);
        const data = await response.json();

        const sortedData = data.data;
        if(sortedData.length > 0){
            sortedData.sort((a, b) => {
                const viewsA = parseInt(a.others.views);
                const viewsB = parseInt(b.others.views);
    
                return sortOrder? (viewsA - viewsB) : (viewsB - viewsA); // returns higher-lower or lower-higher
            });
        }
        
        displayData(data.data);
    } 
    catch (error) {
        console.error('Error fetching or sorting data:', error);
    }   
};


// Options : 
const dataLoad = async() => {
   
    const options = document.getElementById('option');
    const innerDiv = document.createElement('div');
    innerDiv.classList.add('buttons', 'container', 'd-flex', 'justify-content-center', 'pt-4');
    try {
        const response = await fetch(`https://openapi.programming-hero.com/api/videos/categories`);
        const data = await response.json();

        const category = data.data;
        category.forEach(element => {
                const op = document.createElement('div');
                op.classList.add('optn');
            op.innerHTML= 
            `
            <button onclick="activeClick(this, '${element.category}'); loadAllData(${element.category_id});" class="btns text-center border-0 rounded-2 fw-semibold
            ${category[0] == element? "active" : ""}">
            ${element.category}
            </button> 
            `
        innerDiv.appendChild(op);
            
        });
        options.appendChild(innerDiv);
    } 
    catch (error) {
        console.error('Error:', error);
    }
};
function activeClick(button, category){
    // Remove 'active' class from all buttons
    const buttons = document.querySelectorAll('.btns');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    // Add 'active' class to the clicked button
    button.classList.add('active');
}

dataLoad();

const loadAllData = async (val) => {
    try {
        current_ID = val;
        const response = await fetch(`https://openapi.programming-hero.com/api/videos/category/${val}`);
        const data = await response.json();
        displayData(data.data);
        } 
    catch (error) 
    {
        console.error('Error loading data:', error);
    }
};

const content = document.getElementById('Content');
function displayData(data){

    content.innerHTML="";

    if(data.length)
    {
        console.log(data);
        data.forEach(element => {
            const time = element.others.posted_date

            const card = document.createElement('div');
            card.classList.add("col-lg-3", "col-md-6", "col-sm-12")
            card.innerHTML=`
                <div class="card text-start border-0">
                    <div class="video-container pb-3">
                        <img class="vc rounded-2"  src =${element.thumbnail}/>
                        <div class="overlay rounded-1" ${time? `style="background-color: rgb(23,23,23);"`: ""}>${time? convert(time): ""}</div>
                    </div>
                    <div class="innerDiv d-flex">
                        <div class="icon pt-1">
                            <img width="40px" height="40px" class="pic" src=${element.authors[0].profile_picture} alt="">                            
                        </div>
                        <div class="text">
                            <div class="caption">
                                <h5>${element.title}</h5>                             
                            </div>
                            <div class="others">
                                    <p class="text-start mb-1 ">
                                        ${element.authors[0].profile_name}
                                        <span>
                                        ${element.authors[0].verified? `<img width="20" height="20" src="https://img.icons8.com/fluency/20/000000/verified-badge--v1.png" alt="verified-badge--v1"/>`: ""}                            
                                        </span>
                                    </p>                            
                            </div>
                            <p>${element.others.views} views</p>
                        </div>
                    </div>
                </div>       
            `;
            content.appendChild(card);
        })  
    }
    else{
            const card = document.createElement('div');
            card.innerHTML=
                `
                    <div class="container cc align-items-center d-flex flex-column justify-content-center ">
                        <div>
                            <img src="./Resources/Icon.png" alt=""/>
                        </div>
                        <div>
                            <h1 class="card c w-75 fw-bold pt-3 text-center border-0">Oops!! Sorry, There is no content here</h1>
                        </div>
                    </div> 
                `;

            content.appendChild(card);
        }
};

const convert = sec => {
        const hours = Math.floor(sec / 3600);
        const minutes = Math.floor((sec % 3600) / 60);
        return `${hours}hrs ${minutes} min ago`;    
}
loadAllData(1000);

