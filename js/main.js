// Global variables
let exampleInputUsrname = document.querySelector("#exampleInputUsrname");
let submitBtn = document.querySelector("#submit-btn");
let loadingBtn = document.querySelector("#loading-btn");
let showData = document.querySelector("#show-data");
let tableContent = document.querySelector(".table-responsive");


// handle functions
submitBtn.onclick = function () {
    getRepo();
}

function getRepo() {
    let inputValue = exampleInputUsrname.value
    if (inputValue == "") {
        exampleInputUsrname.classList.add("is-invalid")
        return false;
    } else {
        submitBtn.style.display = "none";
        loadingBtn.style.display = "block";
        fetch(`https://api.github.com/users/${inputValue}/repos?per_page=500`)
            .then((res) => {
                submitBtn.style.display = "block";
                loadingBtn.style.display = "none";
                if (res.status == 200) {
                    showData.innerHTML = "";
                    exampleInputUsrname.classList.remove("is-invalid")
                    exampleInputUsrname.classList.add("is-valid")
                    return res.json();
                } else if (res.status == 404) {
                    $(".table-responsive").slideUp();
                    setTimeout(() => {
                        exampleInputUsrname.classList.remove("is-valid")
                        exampleInputUsrname.classList.add("is-invalid")
                        showData.innerHTML = "<p> Sorry, username not found. </p>";
                        var cartona = "";
                        document.getElementById("tbody").innerHTML = cartona; 
                    }, 400);
                }
            })
            .then((repos) => {
                patchData(repos);
            })
            .catch((err) => {
                console.log('err', err)
            })
    }
}


// function to prevent user from enter spaces
$("#exampleInputUsrname").on({
    keydown: function (e) {
        if (e.which == 32) {
            return false;
        } else if (e.target.value.length == 1) {
            exampleInputUsrname.classList.remove("is-invalid")
            exampleInputUsrname.classList.remove("is-valid");
            showData.innerHTML = ""
        }
    },
    change: function () {
        this.value = this.value.replace(/\s/g, "");
    }
})


function patchData(repos) {
    console.log('repos-2', repos);
    var cartona = "";
    if(repos.length!=0) {
       for (let i = 0; i < repos.length; i++) {
        cartona += `<tr>
                        <th>${i+1}</th>
                        <td>${repos[i].name}</td>
                        <td>${returnDate(repos[i].created_at)}</td>
                        <td>${repos[i].language}</td>
                        <td>${repos[i].size} kb</td>
                        <td>${repos[i].stargazers_count}</td>
                        <td>${repos[i].visibility}</td>
                        <td>${repos[i].watchers_count}</td>
                        <td><a target="_blank" href="${repos[i].html_url}"><i class="fa-solid fa-link"></i></a></td>
                        <td><a target="_blank" href="${repos[i].homepage}"><i class="fa-solid fa-paperclip"></i></td>
                    </tr>`;
       };
       document.getElementById("tbody").innerHTML = cartona;
    }
    console.log("test")
    $(".table-responsive").slideDown()
}

// function to get date with custom syntax
function returnDate(dateAt) {
    const date = new Date(dateAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}
