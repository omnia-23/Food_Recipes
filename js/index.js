let data = document.getElementById("data");

get_meals();

let val = $(".content").outerWidth(true);

let open = false;
$("#open-close").click(function () {
  if (!open) {
    open = true;
    openBar();
  } else {
    open = false;
    closeBar();
  }
});
function openBar() {
  $(".sideBar").animate({ left: "0px" });
  $("#open").addClass("d-none");
  $("#close").removeClass("d-none");
  for (let i = 0; i < 5; i++) {
    $(".sideBar span").eq(i).animate({
        top: 0
    }, (i + 5) * 100)
}
}
function closeBar() {
  for (let i = 0; i < 5; i++) {
    $(".sideBar span").eq(i).animate({
        top:"300px"
    }, (i + 5) * 100)
  }
  $(".sideBar").animate({ left: `-${val}px`},1000);
  $("#open").removeClass("d-none");
  $("#close").addClass("d-none");
 
}

async function get_meals() {
  await get_mealsByNames("");
  $("#loading").fadeOut(100);
  $("body").css("overflow", "auto");
  closeBar();
}
function displayMeals(array) {
  $("#loading").fadeOut(100);
  $("body").css("overflow", "auto");
  let body = ``;
  for (let i = 0; i < array.length; i++) {
    body += `
          <div class="col-md-3">
            <div class="image" id="${array[i].idMeal}">
                <img class="w-100" src="${array[i].strMealThumb}" alt="" />
                <div class="layer d-flex align-items-center"><span>${array[i].strMeal}</span></div>
            </div>
          </div>`;
  }
  data.innerHTML = body;
  $(".image").click(function () {
    let id = $(this).attr("id");
    get_details(id);
  });
}

///details
async function get_details(id) {
  $("#loading").fadeIn(100);
  $("body").css("overflow", "hidden");
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  response = await response.json();
  display_details(response.meals[0]);
}
function display_details(res) {
  $("#loading").fadeOut(100);
  $("body").css("overflow", "auto");
  let tags = res.strTags.split(",");
  let strtags = ``;
  for (let i = 0; i < tags.length; i++) {
    strtags += ` <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
  }
  let ingredients = ``;

  for (let i = 1; i <= 20; i++) {
    let m = `strMeasure${i}`;
    let ing = `strIngredient${i}`;
    if (res[ing]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${res[m]} ${res[ing]}</li>`;
    }
  }

  let body = `<div class="col-md-4 text-white">
  <img
    class="w-100 rounded-3"
    src="${res.strMealThumb}"
    alt=""
  />
  <h2>${res.strMeal}</h2>
</div>
<div class="col-md-8 text-white">
  <h2>Instructions</h2>
  <p> ${res.strInstructions}</p>
  <h3><span class="fw-bolder">Area : </span>${res.strArea}</h3>
  <h3><span class="fw-bolder">Category : </span>${res.strCategory}</h3>
  <h3>Recipes :</h3>
  <ul class="list-unstyled d-flex g-3 flex-wrap">
   ${ingredients}
  </ul>
  <h3>Tags :</h3>
  <ul class="list-unstyled d-flex g-3 flex-wrap">
   ${strtags}
  </ul>

  <a
    target="_blank"
    href =${res.strSource}
    class="btn btn-success"
    >Source</a
  >
  <a
    target="_blank"
    href="${res.strYoutube}"
    class="btn btn-danger"
    >Youtube</a
  >
    </div>`;

  data.innerHTML = body;
}

/// search
$("#search-link").click(function () {
  $("#search").removeClass("d-none");
  $("#home").removeClass("d-none");
  closeBar();
  data.innerHTML = ``;
});

$("#text-name").keyup(function () {
  let val = $(this).val();
  if (val == "") data.innerHTML = ``;
  else get_mealsByNames(val);
});
$("#text-letter").keyup(function () {
  let val = $(this).val();
  if (val == "") data.innerHTML = ``;
  else get_mealsByLetter(val);
});

async function get_mealsByNames(name) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
  );
  response = await response.json();
  displayMeals(response.meals);
}
async function get_mealsByLetter(letter) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
  );
  response = await response.json();
  displayMeals(response.meals);
}

///categories
$("#categories-link").click(function () {
  $("#search").addClass("d-none");
  $("#contact").addClass("d-none");
  $("#home").removeClass("d-none");
  closeBar();
  get_categories();
});
async function get_categories() {
  $("#loading").fadeIn(100);
  $("body").css("overflow", "hidden");
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  response = await response.json();
  displayCategory(response.categories);
}
function displayCategory(array) {
  $("#loading").fadeOut(100);
  $("body").css("overflow", "auto");
  let body = ``;
  for (let i = 0; i < array.length; i++) {
    body += `
       <div class="col-md-3 ">
          <div id="list">
           <img class="w-100" src="${array[i].strCategoryThumb}" alt="" />
              <div class="layer d-flex flex-column justify-content-start align-items-center ">
                <span>${array[i].strCategory}</span>
                <p class="text-center">${array[i].strCategoryDescription
                  .split(" ")
                  .slice(0, 20)
                  .join(" ")}</p>
              </div>    
          </div>
              
      </div>`;
  }
  data.innerHTML = body;
  $("#home #list .layer").click(function () {
    let child = $(this).children()[0];
    get_mealsCategory($(child).text());
  });
}
async function get_mealsCategory(Category) {
  $("#loading").fadeIn(100);
  $("body").css("overflow", "hidden");
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${Category}`
  );
  response = await response.json();
  displayMeals(response.meals.slice(0, 20));
}

/// area
$("#Areas-link").click(function () {
  $("#search").addClass("d-none");
  $("#contact").addClass("d-none");
  $("#home").removeClass("d-none");
  closeBar();
  get_areas();
});
async function get_areas() {
  $("#loading").fadeIn(100);
  $("body").css("overflow", "hidden");
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  response = await response.json();
  displayAreas(response.meals.slice(0, 20));
}
function displayAreas(array) {
  $("#loading").fadeOut(100);
  $("body").css("overflow", "auto");
  let body = ``;
  for (let i = 0; i < array.length; i++) {
    body += `
      <div class="col-md-3">
        <div class="box rounded-2 text-center">
          <i class="fa fa-home text-light" aria-hidden="true"></i>
          <h3>${array[i].strArea}</h3>
        </div>
      </div>`;
  }
  data.innerHTML = body;

  $(".box").click(function () {
    let area = $(this).children()[1];
    get_mealsArea($(area).text());
  });
}
async function get_mealsArea(area) {
  $("#loading").fadeOut(100);
  $("body").css("overflow", "auto");
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  response = await response.json();
  displayMeals(response.meals.slice(0, 20));
}

/// Ingredients
$("#Ingredients-link").click(function () {
  $("#search").addClass("d-none");
  $("#contact").addClass("d-none");
  $("#home").removeClass("d-none");
  closeBar();
  get_Ingredients();
});

async function get_Ingredients() {
  $("#loading").fadeIn(100);
  $("body").css("overflow", "hidden");
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  response = await response.json();
  displayIngredients(response.meals.slice(0, 20));
}
function displayIngredients(arr) {
  $("#loading").fadeOut(100);
  $("body").css("overflow", "auto");
  let body = ``;
  for (let i = 0; i < arr.length; i++) {
    body += `
    <div class="col-md-3">
    <div class="box rounded-2 text-center cursor-pointer text-light">
        <i class="fa fa-drumstick-bite"></i>
        <h3>${arr[i].strIngredient}</h3>
        <p>${arr[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
    </div>
    </div>`;
  }
  data.innerHTML = body;

  $(".box").click(function () {
    let area = $(this).children()[1];
    get_mealIngredients($(area).text());
  });
}

async function get_mealIngredients(Ingredients) {
  $("#loading").fadeIn(100);
  $("body").css("overflow", "hidden");
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${Ingredients}`
  );
  response = await response.json();
  displayMeals(response.meals.slice(0, 20));
}

/// contact
$("#contact-link").click(function () {
  $("#search").addClass("d-none");
  $("#contact").removeClass("d-none");
  $("#home").addClass("d-none");
  closeBar();
});

let flagName = false,
  flagEmail = false,
  flagPhone = false,
  flagAge = false,
  flagPassword = false,
  flagRepass = false;

$("#inp1").keyup(function () {
  let val = $(this).val();
  if (/^[a-zA-Z ]+$/.test(val)) {
    flagName = true;
    $("#nameAlert").addClass("d-none");
  } else {
    $("#nameAlert").removeClass("d-none");
    flagName = false;
  }
  check();
});

$("#inp2").keyup(function () {
  let val = $(this).val();
  if (
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      val
    )
  ) {
    flagEmail = true;
    $("#emailAlert").addClass("d-none");
  } else {
    $("#emailAlert").removeClass("d-none");
    flagName = false;
  }
  check();
});

$("#inp3").keyup(function () {
  let val = $(this).val();

  if (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(val)) {
    flagPhone = true;
    $("#phoneAlert").addClass("d-none");
  } else {
    $("#phoneAlert").removeClass("d-none");
    flagPhone = false;
  }
  check();
});

$("#inp4").keyup(function () {
  let val = $(this).val();

  if (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(val)) {
    flagAge = true;
    $("#ageAlert").addClass("d-none");
  } else {
    $("#ageAlert").removeClass("d-none");
    flagAge = false;
  }
  check();
});
let pass;
$("#inp5").keyup(function () {
  let val = $(this).val();

  if (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(val)) {
    flagPassword = true;
    $("#passwordAlert").addClass("d-none");
    pass = val;
  } else {
    $("#passwordAlert").removeClass("d-none");
    flagPassword = false;
  }
  check();
});

$("#inp6").keyup(function () {
  let val = $(this).val();

  if (val === pass) {
    flagRepass = true;
    $("#repasswordAlert").addClass("d-none");
  } else {
    $("#repasswordAlert").removeClass("d-none");
    flagRepass = false;
  }
  check();
});

function check() {
  if (
    flagName &&
    flagEmail &&
    flagPhone &&
    flagAge &&
    flagPassword &&
    flagRepass
  ) {
    $("#Submit").removeClass("disabled");
  } else {
    $("#Submit").addClass("disabled");
  }
}

$("#Submit").click(function () {
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Your work has been saved",
    showConfirmButton: false,
    timer: 1500,
    width: "25%",
  });
  $("#inp1").val("");
  $("#inp2").val("");
  $("#inp3").val("");
  $("#inp4").val("");
  $("#inp5").val("");
  $("#inp6").val("");
});
