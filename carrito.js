const cards = document.getElementById("cards");
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const templateCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
let carrito = {};

const fragment = document.createDocumentFragment();

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
  //local storage
  if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
    pintarCarrito();
  }
});

cards.addEventListener("click", (e) => {
  addCarrito(e);
});

items.addEventListener("click", (e) => {
  btnAccion(e);
});

//addCarrito es el evento
const addCarrito = (e) => {
  // console.log(e.target);
  //console.log(e.target.classList.contains("btn-info"));
  if (e.target.classList.contains("btn-info")) {
    // console.log(e.target.parentElement);
    setCarrito(e.target.parentElement);
  }
  e.stopPropagation();
};

const setCarrito = (objeto) => {
  //console.log(objeto);
  //abajo construyo el obj (producto)
  const producto = {
    id: objeto.querySelector(".btn-info").dataset.id,
    title: objeto.querySelector("h5").textContent,
    precio: objeto.querySelector("p").textContent,
    cantidad: 1,
  };
  if (carrito.hasOwnProperty(producto.id)) {
    producto.cantidad = carrito[producto.id].cantidad + 1;
  }
  carrito[producto.id] = { ...producto };
  pintarCarrito();
};

const pintarCarrito = () => {
  console.log(carrito);
  items.innerHTML = "";
  Object.values(carrito).forEach((producto) => {
    templateCarrito.querySelector("th").textContent = producto.id;
    templateCarrito.querySelectorAll("td")[0].textContent = producto.title;
    templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad;
    //botones
    templateCarrito.querySelector(".btn-success").dataset.id = producto.id;
    templateCarrito.querySelector(".btn-danger").dataset.id = producto.id;
    templateCarrito.querySelector("span").textContent =
      producto.cantidad * producto.precio;

    const clone = templateCarrito.cloneNode(true);
    fragment.appendChild(clone);
  });
  //abajo pintar la success en items de la tabla
  items.appendChild(fragment);

  pintarFooter();
  //stringyfy lo pasamos de texto plano a coleccion de objeto
  localStorage.setItem("carrito", JSON.stringify(carrito));
};

const pintarFooter = () => {
  footer.innerHTML = "";
  //abajo pregunto si el carrito tiene elementos
  if (Object.keys(carrito).length == 0) {
    footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`;
    return;
  }

  // sumar cantidad y sumar totales
  const nCantidad = Object.values(carrito).reduce(
    (acumulador, { cantidad }) => acumulador + cantidad,
    0
  );
  //console.log(nCantidad);

  const nPrecio = Object.values(carrito).reduce(
    (acumulador, { cantidad, precio }) => acumulador + cantidad * precio,
    0
  );
  //console.log(nPrecio);
  templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
  templateFooter.querySelector("span").textContent = nPrecio;
  //ahora a clonar el template
  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);

  const btnVaciar = document.getElementById("vaciar-carrito");
  btnVaciar.addEventListener("click", () => {
    carrito = {};
    pintarCarrito();
  });
};

//detecto botones
const btnAccion = (e) => {
  //console.log(e.target)
  //Accion de sumar +
  if (e.target.classList.contains("btn-success")) {
    // console.log(carrito[e.target.dataset.id]);
    const producto = carrito[e.target.dataset.id];
    //producto.cantidad = carrito[e.target.dataset.id].cantidad +1;
    producto.cantidad++;
    carrito[e.target.dataset.id] = { ...producto };
    pintarCarrito();
  }
  //Accion de restar -

  if (e.target.classList.contains("btn-danger")) {
    const producto = carrito[e.target.dataset.id];
    producto.cantidad--;
    if (producto.cantidad === 0) {
      delete carrito[e.target.dataset.id]; // elimina solo el obj q tiene ese index
    }
    pintarCarrito();
  }
  //
  e.stopPropagation();
};

const fetchData = async () => {
  try {
    const resp = await fetch("api.json");
    const data = await resp.json();
    // console.log(data);
    pintarCard(data);
  } catch (error) {
    console.log(error);
  }
};

const pintarCard = (data) => {
  // console.log(data); trae un array de obejtos como el file json
  data.forEach(function (producto) {
    templateCard.querySelector("h5").textContent = producto.title;
    templateCard.querySelector("p").textContent = producto.precio;
    templateCard
      .querySelector("img")
      .setAttribute("src", producto.thumbnailUrl);
    templateCard.querySelector(".btn-info").dataset.id = producto.id;

    const clone = templateCard.cloneNode(true);

    fragment.appendChild(clone);
  });
  cards.appendChild(fragment);
};
