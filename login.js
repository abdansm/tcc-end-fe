// Ngambil elemen form
const formulir = document.querySelector("form");
const url = "https://tcc-end-be-425714712446.us-central1.run.app/api/admin/login";

formulir.addEventListener("submit", (e) => {
  e.preventDefault();

  // Ngambil elemen input
  const elemen_email = document.querySelector("#email");
  const elemen_password = document.querySelector("#password");

  //elemen notifikasi
  const elemen_notif = document.querySelector("#msg1");

  // Ngambil value (nim) dari elemen input
  const email = elemen_email.value;
  const password = elemen_password.value;
  

  
    // login
    fetch(url, {
      // Adding method type
      method: "POST",
      // Adding body or contents to send
      body: JSON.stringify({
        email: email,
        password: password,
        
      }),

      // Adding headers to the request
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      // Converting to JSON
      .then((response) => response.json())

      // Displaying results to console
      .then((json) => {
        if (json.message == "login success") {
            //console.log(json);
        elemen_email.value = "";
        elemen_password.value = "";
        //console.log(json.data.token);
        sessionStorage.setItem('jwtToken', json.data.token);
        //let token = sessionStorage.getItem("token");
        //console.log(token);
        window.location.href = 'hal_utama.html';
        } else{
            console.log("gagal login");
            elemen_notif.innerHTML = "login gagal";
        }
        


      })
      
  
});

