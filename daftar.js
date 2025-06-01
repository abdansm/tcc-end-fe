const formulir = document.querySelector("form");
const url = "https://tcc-end-be-425714712446.us-central1.run.app/api/admin/register";

formulir.addEventListener("submit", (e) => {
  e.preventDefault();

  // Ngambil elemen input
  const elemen_email = document.querySelector("#email");
  const elemen_nama = document.querySelector("#nama");
  const elemen_password1 = document.querySelector("#password1");
  const elemen_password2 = document.querySelector("#password2");

  //elemen notifikasi
  const elemen_notif = document.querySelector("#msg2");

  // Ngambil value (nim) dari elemen input
  const email = elemen_email.value;
  const nama = elemen_nama.value;
  const password1 = elemen_password1.value; 
  const password2 = elemen_password2.value;

  if (password1 == password2) {
    console.log(email);
    console.log(nama);
    console.log(password1);
    fetch(url, {
      // Adding method type
      method: "POST",
      // Adding body or contents to send
      body: JSON.stringify({
        name: nama,
        email: email,
        password: password1
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
        if (json.message == "admin created") {
            console.log(json);
        //elemen_email.value = "";
       // elemen_password1.value = "";
        //console.log(json.data.token);
       // sessionStorage.setItem('jwtToken', json.data.token);
        //let token = sessionStorage.getItem("token");
        //console.log(token);
        elemen_notif.innerHTML = "Admin berhasil didaftarkan, silahkan masuk";
        //window.location.href = 'hal_utama.html';
        } else{
            console.log(json);
            elemen_notif.innerHTML = "Gagal mendaftarkan admin";
        }
        


      })
    
  } else {
     elemen_notif.innerHTML = "Masukkan password dengan benar";

  }

  
    
    
      
  
});

