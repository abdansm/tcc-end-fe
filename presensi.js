// Ngambil elemen form
const formulir = document.querySelector("form");
const url = "https://tcc-end-be-425714712446.us-central1.run.app/api/admin/presensi/";
const token = sessionStorage.getItem('jwtToken');
if(token == null){
    window.location.href = 'index.html';
}

  function logout() {
  sessionStorage.removeItem('jwtToken');
   window.location.href = 'index.html';
}


let b = new Date().toLocaleString("id-ID");

// Display output
console.log(b);


// Bikin trigger event submit pada elemen form
formulir.addEventListener("submit", (e) => {
  e.preventDefault();

  // Ngambil elemen input
 
  const elemen_kehadiran = document.querySelector("#kehadiran");

  // Ngambil value (nim) dari elemen input
  
  const kehadiran = elemen_kehadiran.value;
  const tglskr = new Date().toISOString();
  const id = elemen_kehadiran.dataset.id; // <- Khusus edit
 
  // Ngecek apakah harus POST atau PUT
  // Kalo id kosong, jadinya POST
  if (id == "") {
    // Tambah user
    
    console.log(kehadiran);
    fetch(url+"create/", {
      // Adding method type
      method: "POST",
      // Adding body or contents to send
      body: JSON.stringify({
        tgl: tglskr,
        kehadiran: kehadiran,
      }),
      
      // Adding headers to the request
      headers: {
        "Authorization": "Bearer "+ token,
        "Content-type": "application/json; charset=UTF-8"
      },
    })
      // Converting to JSON
      .then((response) => response.json())

      // Displaying results to console
      .then((json) => console.log(json))
      .then(() => {
        elemen_kehadiran.value = "";
        getData();
      });
  } else {
     console.log("Aku Isi");
    fetch(url+"update/" + id, {
      // Adding method type
      method: "PUT",
      // Adding body or contents to send
      body: JSON.stringify({
       
        kehadiran: kehadiran,
      }),

      // Adding headers to the request
      headers: {
        "Authorization": "Bearer "+ token,
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      // Converting to JSON
      .then((response) => response.json())

      // Displaying results to console
      .then((json) => console.log(json))
      .then(() => {
        elemen_kehadiran.value = "";
        getData();
      });
  }
});



// GET User
async function getData() {
  let tampilan = `<tr class="fw-bold">
                            <td>NO</td>
                        <td>Nama Admin</td>
                        <td>Kehadiran</td>
                        <td>Tanggal</td>
                        <td>Aksi</td>
                        <td></td>
                    </tr>`;
  let no = 1;
  try {
    const response = await fetch(url +"get/", {
      method: "GET",
      headers:  {
        "Authorization": "Bearer "+ token,
        "Content-type": "application/javascript; charset=UTF-8",
    }
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const table = document.querySelector("#table1");
    const json = await response.json();
    console.log(json);
    if (json.status == 403) {
      logout();
    }

    for (let x in json.data) {
      tampilan += tampilkanUser(no, json);
      no++;
    }
    table.innerHTML = tampilan;
    hapusUser();
    editUser();
  } catch (error) {
    console.error(error.message);
  }
}

function tampilkanUser(no, obj) {
    let tanggal = new Date(obj.data[no - 1].tgl).toLocaleString("id-ID");

  return `
    <tr>
      <td>${no}</td>
    <td class="nama_admin">${obj.data[no - 1].Admin.name}</td>
      <td class="kehadiran">${obj.data[no - 1].kehadiran}</td>
      <td class="harga">${tanggal}</td>
      <td><button data-id=${
        obj.data[no - 1].id
      } class='btn-edit'>Edit</button></td>
      <td><button data-id=${
        obj.data[no - 1].id
      } class='btn-hapus'>Hapus</button></td>
    </tr>
  `;
}

function hapusUser() {
  const kumpulan_tombol_hapus = document.querySelectorAll(".btn-hapus");

  kumpulan_tombol_hapus.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      try {
        const response = fetch(url +"delete/"+ id, {
          method: "DELETE",
          headers: {
            "Authorization": "Bearer "+ token,
        "Content-type": "application/json; charset=UTF-8",}
        }).then(() => {
          getData();
        });

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const responseText = response.text();
        console.log(responseText); // logs 'OK'
      } catch (error) {
        console.error(error.message);
      }
    });
  });
}

function editUser() {
  const kumpulan_tombol_edit = document.querySelectorAll(".btn-edit");

  kumpulan_tombol_edit.forEach((tombol_edit) => {
    tombol_edit.addEventListener("click", () => {
      // Ngambil value yg ada di form
      const id = tombol_edit.dataset.id;
      const kehadiran =
        tombol_edit.parentElement.parentElement.querySelector(
          ".kehadiran"
        ).innerText;
      
      

      // Ngambil [elemen] input
      const elemen_kehadiran = document.querySelector("#kehadiran");

      // Masukkin value yang ada di baris yang dipilih ke form
      elemen_kehadiran.dataset.id = id;
      elemen_kehadiran.value = kehadiran;
      
    });
  });
}

getData();
