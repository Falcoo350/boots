// ---------- Datos de la carta ----------
const platos = [
  { cat: "rosse", nombre: "Margherita DOP", precio: 11.5, desc: "Tomate San Marzano, mozzarella de búfala, albahaca fresca y aceite de oliva.", etiqueta: "Vegetariana" },
  { cat: "rosse", nombre: "Diavola", precio: 13.0, desc: "Tomate, fior di latte, salami picante de Calabria y un hilo de miel.", etiqueta: "Picante" },
  { cat: "rosse", nombre: "Marinara", precio: 9.0, desc: "Tomate, ajo, orégano siciliano y aceite de oliva virgen extra.", etiqueta: "Vegana" },
  { cat: "bianche", nombre: "Quattro Formaggi", precio: 14.0, desc: "Fior di latte, gorgonzola, parmigiano reggiano y pecorino romano.", etiqueta: "Favorita" },
  { cat: "bianche", nombre: "Mortadella e Pistacchio", precio: 15.5, desc: "Mortadela de Bolonia, burrata, crema y pistacho de Bronte.", etiqueta: "Favorita" },
  { cat: "bianche", nombre: "Funghi e Tartufo", precio: 16.0, desc: "Setas de temporada, fior di latte y aceite de trufa negra.", etiqueta: "Vegetariana" },
  { cat: "antipasti", nombre: "Burrata Pugliese", precio: 12.0, desc: "Burrata cremosa con tomates cherry asados, albahaca y pan de la casa.", etiqueta: "Para compartir" },
  { cat: "antipasti", nombre: "Arancini Siciliani", precio: 8.5, desc: "Cuatro croquetas de arroz rellenas de ragú y mozzarella.", etiqueta: "Favorita" },
  { cat: "antipasti", nombre: "Focaccia al Rosmarino", precio: 5.5, desc: "Focaccia del horno de leña con romero, sal en escamas y aceite.", etiqueta: "Vegana" },
];

const grid = document.getElementById("carta-grid");
const tabs = document.querySelectorAll("#tabs .tab");
const euros = (n) => n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

function pintarCarta(cat = "todo") {
  const lista = cat === "todo" ? platos.slice(0, 6) : platos.filter((p) => p.cat === cat);
  grid.innerHTML = lista
    .map(
      (p) => `
      <article class="plato" data-cat="${p.cat}">
        <div>
          <div class="flex justify-between items-start gap-2 mb-2">
            <h3 class="font-display text-lg font-bold text-horno-900">${p.nombre}</h3>
            <span class="font-bold text-tomate-600 shrink-0">${euros(p.precio)}</span>
          </div>
          <p class="text-horno-800/75 text-sm mb-5">${p.desc}</p>
        </div>
        <span class="self-start rounded bg-horno-900 px-2.5 py-1 text-xs font-semibold text-tomate-300">${p.etiqueta}</span>
      </article>`
    )
    .join("");
}

tabs.forEach((tab) =>
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
    pintarCarta(tab.dataset.cat);
  })
);
pintarCarta();

// ---------- Menú móvil ----------
const menuBtn = document.getElementById("menu-btn");
const menuMovil = document.getElementById("menu-movil");

function alternarMenu(abierto) {
  menuMovil.classList.toggle("hidden", !abierto);
  menuMovil.classList.toggle("flex", abierto);
  menuBtn.setAttribute("aria-expanded", String(abierto));
}
menuBtn.addEventListener("click", () => alternarMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
menuMovil.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => alternarMenu(false)));

// ---------- Reservas ----------
const form = document.getElementById("form-reserva");
const fecha = document.getElementById("fecha");
const hora = document.getElementById("hora");
const nombre = document.getElementById("nombre");
const resultado = document.getElementById("resultado");

// Fecha mínima: hoy
const hoy = new Date();
fecha.min = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000).toISOString().split("T")[0];

// Horas de 13:00 a 23:30, cada 30 min
for (let h = 13; h <= 23; h++) {
  for (const m of ["00", "30"]) {
    if (h === 23 && m === "30") {
      hora.add(new Option("23:30", "23:30"));
      continue;
    }
    hora.add(new Option(`${h}:${m}`, `${h}:${m}`));
  }
}
hora.value = "21:00";

function mostrarError(campo, mensaje) {
  campo.setAttribute("aria-invalid", mensaje ? "true" : "false");
  document.querySelector(`[data-error-for="${campo.id}"]`).textContent = mensaje;
}

function validar() {
  let valido = true;
  mostrarError(fecha, "");
  mostrarError(nombre, "");

  if (!fecha.value) {
    mostrarError(fecha, "Elige una fecha.");
    valido = false;
  } else if (new Date(fecha.value + "T12:00").getDay() === 1) {
    mostrarError(fecha, "Cerramos los lunes. Elige otro día.");
    valido = false;
  }
  if (nombre.value.trim().split(/\s+/).filter(Boolean).length < 2) {
    mostrarError(nombre, "Escribe nombre y apellido.");
    valido = false;
  }
  return valido;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  resultado.className = "text-sm rounded-md px-3 py-2";
  if (!validar()) {
    resultado.classList.add("ko");
    resultado.textContent = "Revisa los campos marcados.";
    return;
  }
  const dia = new Date(fecha.value + "T12:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
  const personas = document.getElementById("comensales").value;
  resultado.classList.add("ok");
  resultado.textContent = `Reserva confirmada para ${nombre.value.trim()}: ${personas} personas, ${dia} a las ${hora.value}.`;
  form.reset();
  hora.value = "21:00";
});
