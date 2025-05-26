// Ngambil elemen form
const formulir = document.querySelector("form");
const url = "https://tcc-end-be-425714712446.us-central1.run.app/api/admin/item/";
const token = localStorage.getItem('jwtToken');
// Bikin trigger event submit pada elemen form
formulir.addEventListener("submit", (e) => {
  e.preventDefault();

  // Ngambil elemen input
  const elemen_price = document.querySelector("#harga");
  const elemen_item_name = document.querySelector("#produk");

  // Ngambil value (nim) dari elemen input
  const price = elemen_price.value;
  const item_name = elemen_item_name.value;

  const id = elemen_price.dataset.id; // <- Khusus edit
 
  // Ngecek apakah harus POST atau PUT
  // Kalo id kosong, jadinya POST
  if (id == "") {
    // Tambah user
    fetch(url+"create/", {
      // Adding method type
      method: "POST",
      // Adding body or contents to send
      body: JSON.stringify({
        price: price,
        item_name: item_name,
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
        elemen_price.value = "";
        elemen_item_name.value = "";
        getData();
      });
  } else {
    fetch(url+"update/" + id, {
      // Adding method type
      method: "PUT",
      // Adding body or contents to send
      body: JSON.stringify({
        price: price,
        item_name: item_name,
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
        elemen_price.value = "";
        elemen_item_name.value = "";
        getData();
      });
  }
});

// GET User
async function getData() {
  let tampilan = `<tr class="fw-bold">
                            <td>NO</td>
                        <td>Nama Produk</td>
                        <td>Harga</td>
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
      <td class="item_name">${obj.data[no - 1].item_name}</td>
      <td class="harga">${obj.data[no - 1].price}</td>
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
      const item_name =
        tombol_edit.parentElement.parentElement.querySelector(
          ".produk"
        ).innerText;
      const price =
        tombol_edit.parentElement.parentElement.querySelector(
          ".harga"
        ).innerText;
      

      // Ngambil [elemen] input
      const elemen_item_name = document.querySelector("#produk");
      const elemen_price = document.querySelector("#harga");

      // Masukkin value yang ada di baris yang dipilih ke form
      elemen_price.dataset.id = id;
      elemen_item_name.value = item_name;
      elemen_price.value = price;
    });
  });
}

getData();
