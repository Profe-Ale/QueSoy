import {
    database,
    ref,
    set,
    get,
    onValue,
    update
} from "./firebase.js";

// ==========================================
// ELEMENTOS DEL HTML
// ==========================================

const pantallaInicio = document.getElementById("pantallaInicio");
const pantallaLobby = document.getElementById("pantallaLobby");
const pantallaJuego = document.getElementById("pantallaJuego");

const nombreCreador = document.getElementById("nombreCreador");
const nombreJugador = document.getElementById("nombreJugador");
const codigoSalaInput = document.getElementById("codigoSalaInput");

const btnCrearSala = document.getElementById("btnCrearSala");
const btnUnirse = document.getElementById("btnUnirse");
const codigoSala = document.getElementById("codigoSala");
const listaJugadores = document.getElementById("listaJugadores");
const contadorJugadores = document.getElementById("contadorJugadores");
const btnIniciarPartida = document.getElementById("btnIniciarPartida");
const btnCopiarCodigo = document.getElementById("btnCopiarCodigo");

const selectorCategoria = document.getElementById("selectorCategoria");
const textoCategoria = document.getElementById("textoCategoria");

const grillaNumeros = document.getElementById("grillaNumeros");
const tituloJuego = document.getElementById("tituloJuego");
const tituloGrilla = document.getElementById("tituloGrilla");

const btnRevelar = document.getElementById("btnRevelar");
const btnNuevaPartida = document.getElementById("btnNuevaPartida");
const btnVolverSala = document.getElementById("btnVolverSala");

const turnoActualElemento = document.getElementById("turnoActual");
const mensajeTurno = document.getElementById("mensajeTurno");
const btnTerminarTurno = document.getElementById("btnTerminarTurno");
const btnForzarTurno = document.getElementById("btnForzarTurno");
const palabraTurno = document.getElementById("palabraTurno");

// ==========================================
// CATEGORÍAS
// ==========================================

const objetos = [
    'Martillo',
    'Taza',
    'Pelota',
    'Lámpara',
    'Teléfono',
    'Mochila',
    'Llave',
    'Silla',
    'Mesa',
    'Cuchara',
    'Tenedor',
    'Cuchillo',
    'Plato',
    'Vaso',
    'Botella',
    'Paraguas',
    'Reloj',
    'Anteojos',
    'Gorra',
    'Zapato',
    'Zapatilla',
    'Camisa',
    'Pantalón',
    'Cinturón',
    'Billetera',
    'Computadora',
    'Teclado',
    'Mouse',
    'Monitor',
    'Auriculares',
    'Televisor',
    'Control remoto',
    'Cámara',
    'Micrófono',
    'Parlante',
    'Calculadora',
    'Cuaderno',
    'Libro',
    'Lápiz',
    'Lapicera',
    'Regla',
    'Tijera',
    'Pegamento',
    'Borrador',
    'Sacapuntas',
    'Pincel',
    'Escoba',
    'Pala',
    'Balde',
    'Esponja',
    'Almohada',
    'Manta',
    'Colchón',
    'Espejo',
    'Peine',
    'Cepillo de dientes',
    'Toalla',
    'Jabón',
    'Secador de pelo',
    'Ventilador',
    'Heladera',
    'Microondas',
    'Horno',
    'Tostadora',
    'Licuadora',
    'Sartén',
    'Olla',
    'Abrelatas',
    'Destornillador',
    'Pinza',
    'Taladro',
    'Serrucho',
    'Escalera',
    'Candado',
    'Linterna',
    'Vela',
    'Encendedor',
    'Caja',
    'Valija',
    'Canasto',
    'Cuerda',
    'Cadena',
    'Imán',
    'Globo',
    'Dado',
    'Carta',
    'Rompecabezas',
    'Muñeca',
    'Bicicleta',
    'Patineta',
    'Casco',
    'Raqueta',
    'Silbato',
    'Guitarra',
    'Piano',
    'Tambor',
    'Flauta',
    'Mapa',
    'Brújula',
    'Binoculares'
];
const animales = [
    "Perro",
    "Gato",
    "León",
    "Tigre",
    "Elefante",
    "Jirafa",
    "Caballo",
    "Vaca",
    "Oveja",
    "Cerdo",
    "Mono",
    "Gorila",
    "Cebra",
    "Hipopótamo",
    "Rinoceronte",
    "Cocodrilo",
    "Tortuga",
    "Serpiente",
    "Águila",
    "Búho",
    "Pingüino",
    "Delfín",
    "Ballena",
    "Tiburón",
    "Pulpo",
    "Cangrejo",
    "Conejo",
    "Ratón",
    "Ardilla",
    "Lobo",
    "Zorro",
    "Oso",
    "Oso polar",
    "Panda",
    "Camello",
    "Canguro",
    "Koala",
    "Gallina",
    "Gallo",
    "Pato",
    "Paloma",
    "Loro",
    "Flamenco",
    "Avestruz",
    "Murciélago",
    "Rana",
    "Sapo",
    "Iguana",
    "Camaleón",
    "Lagarto",
    "Gecko",
    "Mariposa",
    "Abeja",
    "Hormiga",
    "Mosca",
    "Mosquito",
    "Araña",
    "Escorpión",
    "Caracol",
    "Babosa",
    "Saltamontes",
    "Grillo",
    "Libélula",
    "Escarabajo",
    "Mantis religiosa",
    "Mariquita",
    "Oruga",
    "Medusa",
    "Estrella de mar",
    "Caballito de mar",
    "Calamar",
    "Langosta",
    "Camarón",
    "Foca",
    "Morsa",
    "Nutria",
    "Castor",
    "Ciervo",
    "Reno",
    "Alce",
    "Jabalí",
    "Hiena",
    "Leopardo",
    "Puma",
    "Lince",
    "Suricata",
    "Mapache",
    "Perezoso",
    "Armadillo",
    "Oso hormiguero",
    "Topo",
    "Erizo",
    "Cabra",
    "Burro",
    "Llama"
];
const profesiones = [
    'Médico',
    'Enfermero',
    'Profesor',
    'Bombero',
    'Policía',
    'Arquitecto',
    'Ingeniero',
    'Abogado',
    'Juez',
    'Veterinario',
    'Dentista',
    'Psicólogo',
    'Farmacéutico',
    'Cirujano',
    'Paramédico',
    'Nutricionista',
    'Fisioterapeuta',
    'Biólogo',
    'Químico',
    'Físico',
    'Astrónomo',
    'Geólogo',
    'Matemático',
    'Programador',
    'Diseñador gráfico',
    'Fotógrafo',
    'Periodista',
    'Escritor',
    'Traductor',
    'Bibliotecario',
    'Contador',
    'Economista',
    'Administrador',
    'Secretario',
    'Recepcionista',
    'Vendedor',
    'Cajero',
    'Cocinero',
    'Chef',
    'Panadero',
    'Pastelero',
    'Carnicero',
    'Mozo',
    'Bartender',
    'Barista',
    'Peluquero',
    'Maquillador',
    'Modista',
    'Sastre',
    'Zapatero',
    'Carpintero',
    'Electricista',
    'Plomero',
    'Albañil',
    'Pintor',
    'Soldador',
    'Mecánico',
    'Cerrajero',
    'Jardinero',
    'Agricultor',
    'Ganadero',
    'Pescador',
    'Leñador',
    'Minero',
    'Chofer',
    'Taxista',
    'Camionero',
    'Colectivero',
    'Piloto',
    'Azafata',
    'Marinero',
    'Maquinista',
    'Repartidor',
    'Cartero',
    'Guardia de seguridad',
    'Detective',
    'Militar',
    'Guardavidas',
    'Actor',
    'Director de cine',
    'Músico',
    'Cantante',
    'Bailarín',
    'DJ',
    'Productor musical',
    'Locutor',
    'Presentador de TV',
    'Animador',
    'Entrenador',
    'Futbolista',
    'Árbitro',
    'Personal trainer',
    'Científico',
    'Arqueólogo',
    'Historiador',
    'Sociólogo',
    'Diseñador de moda',
    'Decorador',
    'Tatuador',
    'Guía turístico'
];

const categorias = {
    numeros: {
        nombre: "Números",
        titulo: "¿Qué edad tengo?",
        secreto: "Tu número secreto es:",
        grilla: "Números posibles",
        opciones: Array.from({ length: 100 }, (_, i) => i + 1)
    },
    objetos: {
        nombre: "Objetos",
        titulo: "¿Qué objeto soy?",
        secreto: "Tu objeto secreto es:",
        grilla: "Objetos posibles",
        opciones: objetos
    },
    profesiones: {
        nombre: "Profesiones",
        titulo: "¿Qué profesión soy?",
        secreto: "Tu profesión secreta es:",
        grilla: "Profesiones posibles",
        opciones: profesiones
    },
    animales: {
        nombre: "Animal",
        titulo: "¿Qué animal soy?",
        secreto: "Tu animal secreto es:",
        grilla: "Animales posibles",
        opciones: animales
    }
};

// ==========================================
// VARIABLES
// ==========================================

let jugadores = {};
let opcionesSeleccionadas = [];
let codigoActual = "";
let jugadorActualId = null;
let revelados = false;
let rondaActual = null;
let categoriaActual = "numeros";
let tachadosLocales = new Set();
let jugadorTurnoActualId = null;
// ==========================================
// UTILIDADES
// ==========================================

function cambiarPantalla(pantalla) {
    document.querySelectorAll(".pantalla").forEach(elemento => {
        elemento.classList.remove("activa");
    });

    pantalla.classList.add("activa");
}

function generarCodigoSala() {
    const caracteres = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let codigo = "";

    for (let i = 0; i < 5; i++) {
        const posicion = Math.floor(Math.random() * caracteres.length);
        codigo += caracteres[posicion];
    }

    return codigo;
}

function mezclarArray(array) {
    const copia = [...array];

    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }

    return copia;
}

function generar50Opciones(categoria) {
    const datosCategoria = categorias[categoria];

    if (!datosCategoria) {
        throw new Error("Categoría inválida.");
    }

    return mezclarArray(datosCategoria.opciones).slice(0, 50);
}

function actualizarTextosDeJuego() {

    const datos =
        categorias[categoriaActual] || 
        categorias.numeros;

        tituloJuego.textContent = datos.titulo;

        tituloGrilla.textContent = datos.grilla;
}

// ==========================================
// CREAR SALA
// ==========================================

btnCrearSala.addEventListener("click", async () => {
    const nombre = nombreCreador.value.trim();

    if (nombre === "") {
        alert("Ingresá tu nombre.");
        return;
    }

    try {
        let codigoDisponible = false;

        while (!codigoDisponible) {
            codigoActual = generarCodigoSala();

            const comprobarRef = ref(database, `salas/${codigoActual}`);
            const comprobacion = await get(comprobarRef);

            if (!comprobacion.exists()) {
                codigoDisponible = true;
            }
        }

        jugadorActualId = crypto.randomUUID();

        const salaRef = ref(database, `salas/${codigoActual}`);

        const datosSala = {
            estado: "esperando",
            anfitrionId: jugadorActualId,
            creadaEn: Date.now(),
            revelados: false,
            categoria: "numeros",
            jugadores: {
                [jugadorActualId]: {
                    nombre,
                    anfitrion: true,
                    elemento: ""
                }
            }
        };

        await set(salaRef, datosSala);

        codigoSala.textContent = codigoActual;
        escucharSala();
        cambiarPantalla(pantallaLobby);

    } catch (error) {
        console.error("Error creando sala:", error);
        alert("Hubo un error al crear la sala.");
    }
});

// ==========================================
// UNIRSE A SALA
// ==========================================

btnUnirse.addEventListener("click", async () => {
    const nombre = nombreJugador.value.trim();
    const codigo = codigoSalaInput.value.trim().toUpperCase();

    if (nombre === "") {
        alert("Ingresá tu nombre.");
        return;
    }

    if (codigo === "") {
        alert("Ingresá el código de la sala.");
        return;
    }

    try {
        const salaRef = ref(database, `salas/${codigo}`);
        const snapshot = await get(salaRef);

        if (!snapshot.exists()) {
            alert("La sala no existe.");
            return;
        }

        const sala = snapshot.val();

        if (sala.estado !== "esperando") {
            alert("La partida ya comenzó.");
            return;
        }

        jugadorActualId = crypto.randomUUID();
        codigoActual = codigo;

        const jugadorRef = ref(
            database,
            `salas/${codigoActual}/jugadores/${jugadorActualId}`
        );

        await set(jugadorRef, {
            nombre,
            anfitrion: false,
            elemento: ""
        });

        codigoSala.textContent = codigoActual;
        escucharSala();
        cambiarPantalla(pantallaLobby);

    } catch (error) {
        console.error("Error entrando:", error);
        alert("No se pudo entrar a la sala.");
    }
});

// ==========================================
// SELECCIONAR CATEGORÍA
// ==========================================

selectorCategoria.addEventListener("change", async () => {
    if (!codigoActual || !jugadorActualId) return;

    try {
        const salaRef = ref(database, `salas/${codigoActual}`);
        const snapshot = await get(salaRef);

        if (!snapshot.exists()) return;

        const sala = snapshot.val();

        if (sala.anfitrionId !== jugadorActualId) {
            selectorCategoria.value = sala.categoria || "numeros";
            alert("Solo el anfitrión puede cambiar la categoría.");
            return;
        }

        if (sala.estado !== "esperando") {
            selectorCategoria.value = sala.categoria || "numeros";
            alert("No se puede cambiar la categoría durante una partida.");
            return;
        }

        await update(salaRef, {
            categoria: selectorCategoria.value
        });

    } catch (error) {
        console.error("Error cambiando categoría:", error);
        alert("No se pudo cambiar la categoría.");
    }
});

// ==========================================
// ESCUCHAR FIREBASE
// ==========================================

function escucharSala() {
    const salaRef = ref(database, `salas/${codigoActual}`);

    onValue(salaRef, snapshot => {
        if (!snapshot.exists()) {
            alert("La sala ya no existe.");
            return;
        }

        const sala = snapshot.val();

        jugadores = sala.jugadores || {};
        categoriaActual = sala.categoria || "numeros";

        if (sala.estado === "esperando") {
            actualizarLobby(sala);
            cambiarPantalla(pantallaLobby);
        }

        if (sala.estado === "jugando") {
            cargarPartida(sala);
        }
    });
}

// ==========================================
// LOBBY
// ==========================================

function actualizarLobby(sala) {
    listaJugadores.innerHTML = "";

    const lista = Object.entries(jugadores);

    lista.forEach(([id, jugador]) => {
        const fila = document.createElement("div");
        fila.classList.add("jugador");

        const nombre = document.createElement("span");

        nombre.textContent =
            id === sala.anfitrionId
                ? `${jugador.nombre} 👑`
                : jugador.nombre;

        fila.appendChild(nombre);
        listaJugadores.appendChild(fila);
    });

    contadorJugadores.textContent = `Jugadores: ${lista.length}`;

    const soyAnfitrion = sala.anfitrionId === jugadorActualId;

    btnIniciarPartida.style.display =
        soyAnfitrion ? "inline-block" : "none";

    selectorCategoria.value = sala.categoria || "numeros";
    selectorCategoria.disabled = !soyAnfitrion;

    if (soyAnfitrion) {
        textoCategoria.textContent =
            "Elegí una categoría. Toda la sala jugará únicamente con esa categoría.";
    } else {
        textoCategoria.textContent =
            `Categoría elegida por el anfitrión: ${categorias[categoriaActual].nombre}`;
    }
}

// ==========================================
// INICIAR PARTIDA
// ==========================================

async function iniciarPartidaFirebase() {
    try {
        const salaRef = ref(database, `salas/${codigoActual}`);
        const snapshot = await get(salaRef);

        if (!snapshot.exists()) {
            alert("La sala ya no existe.");
            return;
        }

        const sala = snapshot.val();

        if (sala.anfitrionId !== jugadorActualId) {
            alert("Solo el anfitrión puede iniciar la partida.");
            return;
        }

        const jugadoresSala = sala.jugadores || {};
        const listaJugadores = Object.entries(jugadoresSala);
        const ordenTurnos = mezclarArray(listaJugadores.map(([id]) => id));

        if (listaJugadores.length < 2) {
            alert("Necesitás al menos 2 jugadores.");
            return;
        }

        if (listaJugadores.length > 50) {
            alert("Puede haber como máximo 50 jugadores.");
            return;
        }

        const categoria = sala.categoria || "numeros";
        const opciones = generar50Opciones(categoria);
        const opcionesJugadores = mezclarArray(opciones);

        const cambios = {
            estado: "jugando",
            opcionesSeleccionadas: opciones,
            revelados: false,
            ronda: Date.now(),
            ordenTurnos: ordenTurnos,
            turnoActual: 0
};

        listaJugadores.forEach(([id], indice) => {
            cambios[`jugadores/${id}/elemento`] = opcionesJugadores[indice];
        });

        await update(salaRef, cambios);

    } catch (error) {
        console.error("Error iniciando:", error);
        alert("Ocurrió un error al iniciar la partida.");
    }
}

btnIniciarPartida.addEventListener("click", iniciarPartidaFirebase);

// ==========================================
// CARGAR PARTIDA
// ==========================================

function cargarPartida(sala) {

    jugadores =
        sala.jugadores || {};

    categoriaActual =
        sala.categoria || "numeros";

    opcionesSeleccionadas =
        sala.opcionesSeleccionadas || [];

    revelados =
        sala.revelados === true;


    if (rondaActual !== sala.ronda) {

        rondaActual =
            sala.ronda;

        tachadosLocales.clear();
    }


    // Primero entramos a la pantalla
    cambiarPantalla(pantallaJuego);


    // Actualizamos los textos
    actualizarTextosDeJuego();


    // Mostramos turno y palabra
    mostrarTurnoActual(sala);


    // Mostramos grilla
    mostrarGrilla();


    const soyAnfitrion =
        sala.anfitrionId ===
        jugadorActualId;


    btnRevelar.style.display =
        soyAnfitrion
            ? "inline-block"
            : "none";


    btnNuevaPartida.style.display =
        soyAnfitrion
            ? "inline-block"
            : "none";


    btnRevelar.textContent =
        revelados
            ? "Elementos revelados"
            : "Revelar todos";


    btnVolverSala.style.display =
        soyAnfitrion && revelados
            ? "inline-block"
            : "none";
}
// ==========================================
// GRILLA
// ==========================================

function mostrarGrilla() {
    grillaNumeros.innerHTML = "";

    const opcionesOrdenadas =
        categoriaActual === "numeros"
            ? [...opcionesSeleccionadas].sort((a, b) => Number(a) - Number(b))
            : [...opcionesSeleccionadas].sort((a, b) =>
                String(a).localeCompare(String(b), "es")
              );

    const elementosOtros = new Set();

    Object.entries(jugadores).forEach(([id, jugador]) => {
        if (
            id !== jugadorActualId &&
            jugador.elemento !== undefined &&
            jugador.elemento !== null &&
            jugador.elemento !== ""
        ) {
            elementosOtros.add(String(jugador.elemento));
        }
    });

    opcionesOrdenadas.forEach(opcion => {
        const clave = String(opcion);

        const casilla = document.createElement("div");
        casilla.classList.add("numero");
        casilla.textContent = opcion;

        if (elementosOtros.has(clave)) {
            casilla.classList.add("numero-otro-jugador");
        }

        if (tachadosLocales.has(clave)) {
            casilla.classList.add("tachado");
        }

        casilla.addEventListener("click", () => {
            if (elementosOtros.has(clave)) {
                return;
            }

            if (tachadosLocales.has(clave)) {
                tachadosLocales.delete(clave);
                casilla.classList.remove("tachado");
            } else {
                tachadosLocales.add(clave);
                casilla.classList.add("tachado");
            }
        });

        grillaNumeros.appendChild(casilla);
    });
}

// ==========================================
// REVELAR TODOS
// ==========================================

btnRevelar.addEventListener("click", async () => {
    try {
        const salaRef = ref(database, `salas/${codigoActual}`);
        const snapshot = await get(salaRef);

        if (!snapshot.exists()) {
            alert("La sala no existe.");
            return;
        }

        const sala = snapshot.val();

        if (sala.anfitrionId !== jugadorActualId) {
            alert("Solo el anfitrión puede revelar.");
            return;
        }

        await update(salaRef, {
            revelados: true
        });

    } catch (error) {
        console.error("Error revelando:", error);
        alert("No se pudieron revelar los elementos.");
    }
});

// ==========================================
// NUEVA PARTIDA
// ==========================================

async function nuevaPartidaFirebase() {
    try {
        const salaRef = ref(database, `salas/${codigoActual}`);
        const snapshot = await get(salaRef);

        if (!snapshot.exists()) {
            alert("La sala ya no existe.");
            return;
        }

        const sala = snapshot.val();

        if (sala.anfitrionId !== jugadorActualId) {
            alert("Solo el anfitrión puede comenzar una nueva partida.");
            return;
        }

        const listaJugadores = Object.entries(sala.jugadores || {});
        const nuevoOrdenTurnos = mezclarArray(listaJugadores.map(([id]) => id));
        const categoria = sala.categoria || "numeros";

        const nuevasOpciones = generar50Opciones(categoria);
        const opcionesJugadores = mezclarArray(nuevasOpciones);

        const cambios = {
            estado: "jugando",
            opcionesSeleccionadas: nuevasOpciones,
            revelados: false,
            ronda: Date.now(),
            ordenTurnos: nuevoOrdenTurnos,
            turnoActual: 0
        };

        listaJugadores.forEach(([id], indice) => {
            cambios[`jugadores/${id}/elemento`] = opcionesJugadores[indice];
        });

        await update(salaRef, cambios);

    } catch (error) {
        console.error("Error nueva partida:", error);
        alert("No se pudo comenzar una nueva partida.");
    }
}

btnNuevaPartida.addEventListener("click", nuevaPartidaFirebase);

// ==========================================
// COPIAR CÓDIGO
// ==========================================

btnCopiarCodigo.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(codigoActual);
        alert("Código copiado: " + codigoActual);
    } catch {
        alert("Código de sala: " + codigoActual);
    }
});
btnVolverSala.addEventListener(
    "click",
    async () => {

        try {

            const salaRef = ref(
                database,
                `salas/${codigoActual}`
            );

            const snapshot =
                await get(salaRef);

            if (!snapshot.exists()) {

                alert(
                    "La sala ya no existe."
                );

                return;
            }

            const sala =
                snapshot.val();


            // Solo el anfitrión
            if (
                sala.anfitrionId !==
                jugadorActualId
            ) {

                alert(
                    "Solo el anfitrión puede volver a la sala."
                );

                return;
            }


            // Solo después de revelar
            if (
                sala.revelados !== true
            ) {

                alert(
                    "Primero deben revelar los elementos."
                );

                return;
            }


            // Volvemos al lobby
            await update(
                salaRef,
                {
                    estado: "esperando",
                    revelados: false
                }
            );


        } catch (error) {

            console.error(
                "Error volviendo a la sala:",
                error
            );

            alert(
                "No se pudo volver a la sala de espera."
            );
        }
    }
);
function mostrarTurnoActual(sala) {

    const orden =
        sala.ordenTurnos || [];

    const indice =
        sala.turnoActual ?? 0;


    // Si todavía no existen turnos
    if (orden.length === 0) {

        turnoActualElemento.textContent =
            "Sin turno";

        palabraTurno.textContent =
            "???";

        mensajeTurno.textContent =
            "";

        jugadorTurnoActualId =
            null;

        btnTerminarTurno.style.display =
            "none";

        btnForzarTurno.style.display =
            "none";

        return;
    }


    const idTurno =
        orden[indice];


    const jugador =
        jugadores[idTurno];


    // Si por algún motivo el jugador
    // todavía no se cargó
    if (!jugador) {

        turnoActualElemento.textContent =
            "Esperando...";

        palabraTurno.textContent =
            "???";

        mensajeTurno.textContent =
            "";

        btnTerminarTurno.style.display =
            "none";

        btnForzarTurno.style.display =
            "none";

        return;
    }


    jugadorTurnoActualId =
        idTurno;


    // Nombre de quien pregunta
    turnoActualElemento.textContent =
        `🎤 Turno de: ${jugador.nombre}`;


    const esMiTurno =
        idTurno === jugadorActualId;


    const soyAnfitrion =
        sala.anfitrionId ===
        jugadorActualId;


    // ======================================
    // PALABRA DEL JUGADOR
    // ======================================

    // El jugador NO puede ver
    // su propia palabra.
    //
    // Después de revelar sí la puede ver.

if (revelados) {

    // Cada computadora busca SU propio jugador
    const miJugador = jugadores[jugadorActualId];

    if (miJugador && miJugador.elemento) {

        turnoActualElemento.textContent =
            "🎉 ¡Tu componente/profesión era!";

        palabraTurno.textContent =
            miJugador.elemento;

    } else {

        palabraTurno.textContent = "???";
    }

} else {

    // Durante la partida funciona como siempre
    if (esMiTurno) {

        palabraTurno.textContent = "???";

    } else {

        palabraTurno.textContent =
            jugador.elemento || "???";
    }
}
    // ======================================
    // MENSAJE
    // ======================================

    if (esMiTurno) {

        mensajeTurno.textContent =
            "Hacé tu pregunta y después terminá tu turno.";

    } else {

        mensajeTurno.textContent =
            `Esperando a que ${jugador.nombre} termine su turno...`;
    }


    // ======================================
    // BOTONES
    // ======================================

    // Solo quien tiene el turno
    // puede terminarlo.
    btnTerminarTurno.style.display =
        esMiTurno && !revelados
            ? "inline-block"
            : "none";


    // El anfitrión siempre puede
    // forzar el siguiente turno.
    btnForzarTurno.style.display =
        soyAnfitrion && !revelados
            ? "inline-block"
            : "none";
}
    btnTerminarTurno.addEventListener(
        "click",
            async () => {

            try {

            const salaRef =
                ref(
                    database,
                    `salas/${codigoActual}`
                );

            const snapshot =
                await get(salaRef);

            if (!snapshot.exists()) {
                return;
            }

            const sala =
                snapshot.val();


            const orden =
                sala.ordenTurnos || [];

            const indice =
                sala.turnoActual || 0;


            if (orden.length === 0) {
                return;
            }


            // Comprobamos que realmente
            // sea el turno de esta persona
            if (
                orden[indice] !==
                jugadorActualId
            ) {

                alert(
                    "Todavía no es tu turno."
                );

                return;
            }


            const siguiente =
                (indice + 1) %
                orden.length;


            await update(
                salaRef,
                {
                    turnoActual:
                        siguiente
                }
            );

        } catch (error) {

            console.error(
                "Error pasando turno:",
                error
            );
        }
    }
);
btnForzarTurno.addEventListener(
    "click",
    async () => {

        try {

            const salaRef =
                ref(
                    database,
                    `salas/${codigoActual}`
                );

            const snapshot =
                await get(salaRef);

            if (!snapshot.exists()) {
                return;
            }

            const sala =
                snapshot.val();


            if (
                sala.anfitrionId !==
                jugadorActualId
            ) {

                alert(
                    "Solo el anfitrión puede forzar el turno."
                );

                return;
            }


            const orden =
                sala.ordenTurnos || [];

            const indice =
                sala.turnoActual || 0;


            if (orden.length === 0) {
                return;
            }


            const siguiente =
                (indice + 1) %
                orden.length;


            await update(
                salaRef,
                {
                    turnoActual:
                        siguiente
                }
            );

        } catch (error) {

            console.error(
                "Error forzando turno:",
                error
            );
        }
    }
);
