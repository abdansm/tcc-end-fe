// Ngambil elemen form
const formulir = document.querySelector("form");
const url = "https://tcc-end-be-425714712446.us-central1.run.app/api/admin/member/";
const token = sessionStorage.getItem('jwtToken');
if(token == null || token == ""){
    window.location.href = 'index.html';
}

  function logout() {
  sessionStorage.removeItem('jwtToken');
   window.location.href = 'index.html';
}

// Bikin trigger event submit pada elemen form
formulir.addEventListener("submit", (e) => {
  e.preventDefault();

  // Ngambil elemen input
  const elemen_nik = document.querySelector("#nik");
  const elemen_nama = document.querySelector("#nama");
  const elemen_alamat = document.querySelector("#alamat");

  // Ngambil value (nim) dari elemen input
  const nik = elemen_nik.value;
  const nama = elemen_nama.value;
  const alamat = elemen_alamat.value;

  const id = elemen_nik.dataset.id; // <- Khusus edit
 
  // Ngecek apakah harus POST atau PUT
  // Kalo id kosong, jadinya POST
  if (id == "") {
    // Tambah user
    console.log(nik);
    console.log(nama);
    fetch(url+"create/", {
      // Adding method type
      method: "POST",
      // Adding body or contents to send
      body: JSON.stringify({
        nama: nama,
        nik: nik,
        alamat: alamat
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
        elemen_nik.value = "";
        elemen_nama.value = "";
        elemen_alamat.value = "";
        getData();
      });
  } else {
     console.log("Aku Isi");
    fetch(url+"update/" + id, {
      // Adding method type
      method: "PUT",
      // Adding body or contents to send
      body: JSON.stringify({
         nama: nama,
        nik: nik,
        alamat: alamat
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
        elemen_nik.value = "";
        elemen_nama.value = "";
        elemen_alamat.value = "";
        getData();
      });
  }
});



// GET User
async function getData() {
  let tampilan = `<tr class="fw-bold">
                            <td>NO</td>
                        <td>Nama</td>
                        <td>NIK</td>
                        <td>Alamat</td>
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
    if (json.status == 403) {
      logout();
    }
    console.log(json);

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
  return `
    <tr>
      <td>${no}</td>
      <td class="nama">${obj.data[no - 1].nama}</td>
      <td class="nik">${obj.data[no - 1].nik}</td>
      <td class="alamat">${obj.data[no - 1].alamat}</td>
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
      const nama =
        tombol_edit.parentElement.parentElement.querySelector(
          ".nama"
        ).innerText;
      const nik =
        tombol_edit.parentElement.parentElement.querySelector(
          ".nik"
        ).innerText;
        const alamat =
        tombol_edit.parentElement.parentElement.querySelector(
          ".alamat"
        ).innerText;
      

      // Ngambil [elemen] input
      const elemen_nama = document.querySelector("#nama");
      const elemen_nik = document.querySelector("#nik");
      const elemen_alamat = document.querySelector("#alamat");

      // Masukkin value yang ada di baris yang dipilih ke form
      elemen_nik.dataset.id = id;
      elemen_nama.value = nama;
      elemen_nik.value = nik;
      elemen_alamat.value = alamat;
    });
  });
}

getData();
