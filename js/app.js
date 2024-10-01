const loadData = async (searchId) => {
    try {
        const response = await fetch(`https://openapi.programming-hero.com/api/videos/category/${searchId}`);
        const data = await response.json();
        displayData(data.data);
    } catch (error) {
        console.error('Error:', error);
    }
}


// Call the function with the desired category ID
const loadCategory = async () => {
  const res = await fetch('https://openapi.programming-hero.com/api/videos/categories');
  const data = await res.json();
  displayCategory(data.data);
  
}


// Load categories
loadCategory();


// Display the category
function displayCategory(categories) {
  // console.log(categories);
  
  const categoryContainer = document.getElementById('catogories-container');
  categoryContainer.textContent = ''

  categories.forEach(category => {
    // console.log(category.category);

    const button = document.createElement('button');
    button.classList = `btn rounded bg-[#FF1F3D] text-white border-2 border-transparent hover:bg-transparent hover:border-[#FF1F3D] hover:text-[#FF1F3D]`;
    
    button.textContent = category.category;
    // button.setAttribute('onclick', `loadData('${category.category_id}')`);

    button.addEventListener('click', () => {
      // console.log('Button clicked');
      loadingSpinner(true);
      loadData(category.category_id);
    });

    categoryContainer.appendChild(button);

  });
}


// Convert Second to Time
const convertSecondToTime = (seconds) => {
  const timeContainer = document.getElementById('time-container');
  console.log(timeContainer);
  
  let hours = Math.floor(seconds/3600);
  seconds = seconds%3600;
  let minutes = Math.floor(seconds/60);
  seconds = seconds%60;

  return [hours, minutes];
}


// Display the data
function displayData(data) {
    const cardsContainer = document.getElementById('cards-container');
    const noDataDiv = document.getElementById('no-data-container');
    
    cardsContainer.textContent = '';
    noDataDiv.textContent = '';

    if(data.length === 0) {
      noDataDiv.innerHTML = `
        <img src="./images/Icon.png" alt="" />
        <h1 class="font-bold text-2xl">
          Oops!! Sorry, There is no <br />
          content here!
        </h1>
      `;

      // noDataDiv.textContent = 'No data available';
      // cardsContainer.appendChild(noDataDiv);
      loadingSpinner(false);
      return;
    }

    const sortDataButton = document.getElementById('sort-data-button');

    sortDataButton.addEventListener('click', () => {
        data.sort((a, b) => {
            let aViews = a.others.views.substring(0, a.others.views.length-1);
            let bViews = b.others.views.substring(0, b.others.views.length-1);

            return bViews - aViews;
        });
        displayData(data);
    });


    data.forEach(dataDetails => {
        //  Time conversions
        let time  = [];
        if(dataDetails?.others?.posted_date) {
          time = convertSecondToTime(dataDetails?.others?.posted_date);
        }
        
        const div = document.createElement('div');
        div.classList = `card card-compact bg-base-100 shadow-xl border-t-2`;

        div.innerHTML = `
            <figure class="w-full h-52 relative">
              <img class="h-full w-full" src= ${dataDetails.thumbnail} alt="Shoes" />

              <!-- Time -->
              <div id="time-container" class="absolute bg-gray-600 px-2 py-1 rounded bottom-2 right-2 ">
                <p class="text-white text-sm">
                  <span>${dataDetails?.others?.posted_date ? time[0]+"hrs" : ""}</span> <span>${dataDetails?.others?.posted_date ? time[1]+" min ago" : ""}</span> 
                </p>
              </div>
              
            </figure>

            <div class="card-body">
              <!-- Heading -->
              <div class="flex flex-row justify-start items-center gap-3">
                <!-- Avatar -->
                <div class="avatar">
                  <div class="w-12 rounded-full">
                    <img
                      src="${dataDetails.authors[0].profile_picture}"
                    />
                  </div>
                </div>
                <!-- Title -->
                <div class="">
                  <h1 class="font-bold text-base">
                    ${dataDetails.title}
                  </h1>
                </div>
              </div>

              <!-- Author -->
              <div class="flex flex-row justify-start items-center gap-2 pl-14">
                <div class="">
                  <h1 class="font-bold text-gray-600">${dataDetails.authors[0].profile_name}</h1>
                </div>
                <div class="w-6">
                    <img src="${dataDetails?.authors[0]?.verified ? "./images/verify.png" : ""}" alt="" />
                </div>
              </div>
              <!-- Views -->
              <div class="pl-14">
                <h1 class="font-bold text-gray-600 views"><span>${dataDetails.others.views}</span> views</h1>
              </div>
              <!-- End of Views -->
            </div>
        `;

        cardsContainer.appendChild(div);
        loadingSpinner(false);
    })
}


loadData('1000');


// Loading Spinner Functionality
function loadingSpinner(isLoading) {
    const loadingSpinner = document.getElementById('loading-spinner');

    if(isLoading) {
        loadingSpinner.classList.remove('hidden');
    }
    else {
        loadingSpinner.classList.add('hidden');
    }
}