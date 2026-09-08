import {
    database,
    ref,
    set,
    get,
    onValue,
    update,
    remove,
    runTransaction
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
const contadorRonda = document.getElementById("contadorRonda");

const panelReconexion = document.getElementById("panelReconexion");
const textoReconexion = document.getElementById("textoReconexion");
const btnReconectar = document.getElementById("btnReconectar");
const btnOlvidarSesion = document.getElementById("btnOlvidarSesion");

const blocNotas = document.getElementById("blocNotas");
const btnLimpiarNotas = document.getElementById("btnLimpiarNotas");
const btnAbrirNotas = document.getElementById("btnAbrirNotas");
const btnCerrarNotas = document.getElementById("btnCerrarNotas");
const fondoNotas = document.getElementById("fondoNotas");

const aviso = document.getElementById("aviso");
const panelModoLibre = document.getElementById("panelModoLibre");
const inputPalabraLibre = document.getElementById("inputPalabraLibre");
const btnGuardarPalabraLibre = document.getElementById("btnGuardarPalabraLibre");
const estadoPalabraLibre = document.getElementById("estadoPalabraLibre");
const ayudaGrilla = document.getElementById("ayudaGrilla");


// ==========================================
// AVISOS
// ==========================================

// Reemplaza a los alert() del navegador. No bloquea el
// hilo, no abre un modal del sistema y se puede seguir
// jugando mientras el cartel está a la vista.
let temporizadorAviso = null;

function mostrarAviso(texto, tipo = "info") {

    aviso.textContent = texto;

    aviso.classList.toggle(
        "aviso-error",
        tipo === "error"
    );

    aviso.classList.add("visible");

    if (temporizadorAviso) {
        clearTimeout(temporizadorAviso);
    }

    // Los mensajes largos quedan un rato más
    const duracion =
        texto.length > 60
            ? 6000
            : 4000;

    temporizadorAviso = setTimeout(
        () => {
            aviso.classList.remove("visible");
            temporizadorAviso = null;
        },
        duracion
    );
}

// ==========================================
// BOTONES OCUPADOS
// ==========================================

// Deshabilita el botón mientras corre la operación.
// Sin esto, un doble click en "Crear sala" (muy fácil
// de hacer sin querer en celular) creaba DOS salas y
// te dejaba en la segunda.
async function conBotonOcupado(boton, tarea) {

    if (boton.disabled) {
        return;
    }

    boton.disabled = true;

    try {
        return await tarea();
    } finally {
        boton.disabled = false;
    }
}

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
const videojuegos = [
    "Minecraft",
    "Fortnite",
    "Grand Theft Auto V",
    "Roblox",
    "Among Us",
    "League of Legends",
    "Valorant",
    "Counter-Strike 2",
    "Call of Duty",
    "Overwatch",
    "Rocket League",
    "Fall Guys",
    "Clash Royale",
    "Clash of Clans",
    "Free Fire",
    "Genshin Impact",
    "The Last of Us",
    "God of War",
    "Uncharted",
    "Ghost of Tsushima",
    "Marvel's Spider-Man",
    "Bloodborne",
    "Detroit: Become Human",
    "Super Mario Bros.",
    "Mario Kart",
    "The Legend of Zelda",
    "Super Smash Bros.",
    "Pokémon Rojo Fuego",
    "Donkey Kong",
    "EA Sports FC",
    "NBA 2K",
    "F1",
    "Need for Speed",
    "Gran Turismo",
    "Tony Hawk's Pro Skater",
    "WWE 2K",
    "Red Dead Redemption 2",
    "Cyberpunk 2077",
    "Elden Ring",
    "Dark Souls",
    "Assassin's Creed",
    "Far Cry",
    "Resident Evil",
    "Silent Hill",
    "Five Nights at Freddy's",
    "Poppy Playtime",
    "Outlast",
    "Dead by Daylight",
    "Phasmophobia",
    "DOOM",
    "Left 4 Dead",
    "Dying Light",
    "Mortal Kombat",
    "Street Fighter",
    "Dragon Ball Z: Budokai Tenkaichi 3",
    "MultiVersus",
    "Cuphead",
    "Hollow Knight",
    "Terraria",
    "Stardew Valley",
    "The Sims",
    "Geometry Dash",
    "Subway Surfers",
    "Candy Crush",
    "Plants vs. Zombies",
    "Angry Birds",
    "Sonic the Hedgehog",
    "Pac-Man",
    "Palworld",
    "Dota 2",
    "ARK: Survival Evolved",
    "Rust",
    "Raft",
    "The Forest",
    "Half-Life",
    "Sea of Thieves",
    "Battlefield",
    "Portal"
];
const peliculas = [
    "Titanic",
    "Avatar",
    "Jurassic Park",
    "Volver al Futuro",
    "E.T.",
    "Tiburón",
    "Indiana Jones",
    "Gladiador",
    "Forrest Gump",
    "El Padrino",
    "Rocky",
    "Rambo",
    "Terminator",
    "Matrix",
    "Náufrago",
    "Harry Potter y la piedra filosofal",
    "El Señor de los Anillos",
    "El Hobbit",
    "Piratas del Caribe",
    "Las Crónicas de Narnia",
    "Crepúsculo",
    "Los Juegos del Hambre",
    "Jumanji",
    "Charlie y la fábrica de chocolate",
    "Mi Pobre Angelito",
    "Star Wars",
    "Interestelar",
    "El Origen",
    "Transformers",
    "Godzilla",
    "Iron Man",
    "Los Vengadores",
    "Spider-Man",
    "Doctor Strange",
    "Guardianes de la Galaxia",
    "Capitán América",
    "Thor",
    "Black Panther",
    "Deadpool",
    "X-Men",
    "Logan",
    "Venom",
    "Batman: El caballero de la noche",
    "Joker",
    "Superman",
    "Wonder Woman",
    "Aquaman",
    "Shrek",
    "Toy Story",
    "Cars",
    "Buscando a Nemo",
    "Los Increíbles",
    "Ratatouille",
    "WALL-E",
    "Up",
    "Monsters, Inc.",
    "Coco",
    "Intensamente",
    "Frozen",
    "El Rey León",
    "Aladdín",
    "La Bella y la Bestia",
    "Moana",
    "Mulán",
    "Kung Fu Panda",
    "Madagascar",
    "La Era de Hielo",
    "Mi Villano Favorito",
    "Los Minions",
    "Cómo entrenar a tu dragón",
    "Lluvia de Hamburguesas",
    "Super Mario Bros.: La película",
    "Pokémon: Detective Pikachu",
    "El Gato con Botas",
    "Megamente",
    "El Conjuro",
    "It",
    "El Exorcista",
    "Scream",
    "Halloween",
    "Actividad Paranormal",
    "Saw",
    "Chucky",
    "Destino Final",
    "El Lobo de Wall Street",
    "Barbie",
    "Karate Kid",
    "El Náufrago",
    "En Busca de la Felicidad",
    "Rescatando al Soldado Ryan",
    "300",
    "El Código Da Vinci",
    "El Resplandor",
    "Annabelle",
    "La Monja",
    "Viernes 13",
    "Soy Leyenda",
    "John Wick",
    "Rápidos y Furiosos",
    "Misión Imposible",
    "Duro de Matar",
    "El Transportador",
    "Kingsman",
    "Los Indestructibles",
    "Bad Boys",
    "Hombres de Negro",
    "El Planeta de los Simios",
    "Encanto",
    "Zootopia",
    "Big Hero 6",
    "Río",
    "Hotel Transylvania",
    "Los Croods",
    "Coraline",
    "El Extraño Mundo de Jack"
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
    },
    videojuegos: {
    nombre: "VideoJuegos",
    titulo: "¿Qué VideoJuego soy?",
    secreto: "Tu VideoJuego secreto es:",
    grilla: "VideoJuegos posibles",
    opciones: videojuegos
},
    peliculas: {
    nombre: "Peliculas",
    titulo: "¿Qué Pelicula soy?",
    secreto: "Tu Pelicula secreta es:",
    grilla: "Peliculas posibles",
    opciones: peliculas
},

libre: {
    nombre: "Libre",
    titulo: "¿Qué soy?",
    secreto: "Tu palabra secreta es:",
    grilla: "",
    opciones: []
},
}
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

// Función para cortar la suscripción a la sala.
// onValue() la devuelve al suscribirse.
let desuscribirSala = null;

// Última clave de notas que se volcó al textarea.
// Sirve para no pisar lo que la persona está escribiendo.
let claveNotasCargada = null;

const CLAVE_SESION =
    "queSoySesionActual";


function guardarSesion(nombre) {

    try {

        const sesion = {
            codigo: codigoActual,
            jugadorId: jugadorActualId,
            nombre: nombre
        };

        localStorage.setItem(
            CLAVE_SESION,
            JSON.stringify(sesion)
        );

    } catch (error) {

        console.warn(
            "No se pudo guardar la sesión:",
            error
        );
    }
}


function obtenerSesion() {

    try {

        const datos =
            localStorage.getItem(
                CLAVE_SESION
            );

        if (!datos) {
            return null;
        }

        return JSON.parse(datos);

    } catch (error) {

        console.warn(
            "No se pudo leer la sesión:",
            error
        );

        return null;
    }
}


function borrarSesion() {

    try {

        localStorage.removeItem(
            CLAVE_SESION
        );

    } catch (error) {

        console.warn(
            "No se pudo borrar la sesión:",
            error
        );
    }
}


function actualizarPanelReconexion() {

    const sesion =
        obtenerSesion();

    if (!sesion) {

        panelReconexion.style.display =
            "none";

        return;
    }

    textoReconexion.textContent =
        `Sala ${sesion.codigo} · ${sesion.nombre}`;

    panelReconexion.style.display =
        "block";
}
// ==========================================
// BLOC DE NOTAS
// ==========================================

function claveNotasActual() {
    return `notas_${codigoActual}_${jugadorActualId}`;
}


function cargarNotas() {

    const clave = claveNotasActual();

    // cargarPartida() corre con CADA actualización de Firebase
    // (cada turno, cada jugador que entra, etc.).
    // Si reescribiéramos el textarea todas esas veces, el cursor
    // saltaría al final mientras la persona está escribiendo.
    // Sólo hay que volcar las notas cuando cambia la sala/jugador.
    if (clave === claveNotasCargada) {
        return;
    }

    claveNotasCargada = clave;

    try {

        blocNotas.value =
            localStorage.getItem(clave) || "";

    } catch (error) {

        console.warn(
            "No se pudieron leer las notas:",
            error
        );

        blocNotas.value = "";
    }
}


function borrarNotasActuales() {

    blocNotas.value = ""; 
    
    claveNotasCargada =
        claveNotasActual();

    try {

        localStorage.removeItem(
            claveNotasActual()
        );

    } catch (error) {

        console.warn(
            "No se pudieron borrar las notas:",
            error
        );
    }
}

// Las notas y los tachados de salas viejas quedaban para
// siempre en localStorage. Al entrar a una sala nos
// quedamos sólo con los de esa sala.
function limpiarGuardadoDeOtrasSalas() {

    try {

        const prefijos = ["notas_", "tachados_"];

        const aBorrar = [];

        for (let i = 0; i < localStorage.length; i++) {

            const clave = localStorage.key(i);

            if (!clave) {
                continue;
            }

            const esNuestro =
                prefijos.some(prefijo =>
                    clave.startsWith(prefijo)
                );

            const esDeEstaSala =
                prefijos.some(prefijo =>
                    clave.startsWith(
                        `${prefijo}${codigoActual}_`
                    )
                );

            if (esNuestro && !esDeEstaSala) {
                aBorrar.push(clave);
            }
        }

        aBorrar.forEach(clave => {
            localStorage.removeItem(clave);
        });

    } catch (error) {

        console.warn(
            "No se pudo limpiar el guardado viejo:",
            error
        );
    }
}


// ==========================================
// TACHADOS
// ==========================================

// Antes tachadosLocales era sólo un Set en memoria: al
// recargar la página se perdía todo lo descartado, que
// es la mitad del juego. Ahora se guarda por sala,
// jugador y ronda, igual que las notas.
function claveTachadosActual() {
    return `tachados_${codigoActual}_${jugadorActualId}_${rondaActual}`;
}


function cargarTachados() {

    tachadosLocales.clear();

    if (
        !codigoActual ||
        !jugadorActualId ||
        rondaActual === null
    ) {
        return;
    }

    try {

        const guardados =
            localStorage.getItem(
                claveTachadosActual()
            );

        if (!guardados) {
            return;
        }

        const lista = JSON.parse(guardados);

        if (Array.isArray(lista)) {
            lista.forEach(valor => {
                tachadosLocales.add(String(valor));
            });
        }

    } catch (error) {

        console.warn(
            "No se pudieron leer los tachados:",
            error
        );
    }
}


function guardarTachados() {

    if (
        !codigoActual ||
        !jugadorActualId ||
        rondaActual === null
    ) {
        return;
    }

    try {

        localStorage.setItem(
            claveTachadosActual(),
            JSON.stringify([...tachadosLocales])
        );

    } catch (error) {

        console.warn(
            "No se pudieron guardar los tachados:",
            error
        );
    }
}


blocNotas.addEventListener(
    "input",
    () => {

        if (
            !codigoActual ||
            !jugadorActualId
        ) {
            return;
        }

        try {

            localStorage.setItem(
                claveNotasActual(),
                blocNotas.value
            );

            claveNotasCargada =
                claveNotasActual();

        } catch (error) {

            console.warn(
                "No se pudieron guardar las notas:",
                error
            );
        }
    }
);


btnLimpiarNotas.addEventListener(
    "click",
    () => {

        if (
            !codigoActual ||
            !jugadorActualId
        ) {
            blocNotas.value = "";
            return;
        }

        borrarNotasActuales();

        // Después de limpiar se sigue escribiendo ahí
        blocNotas.focus();
    }
);


// ==========================================
// ABRIR Y CERRAR EL CUADRO DE NOTAS
// ==========================================

function notasEstanAbiertas() {

    return document.body.classList.contains(
        "notas-abiertas"
    );
}


function abrirNotas() {

    document.body.classList.add(
        "notas-abiertas"
    );

    btnAbrirNotas.setAttribute(
        "aria-expanded",
        "true"
    );

    // Que se pueda escribir de una, sin tener
    // que tocar el textarea aparte
    blocNotas.focus();
}


function cerrarNotas() {

    document.body.classList.remove(
        "notas-abiertas"
    );

    btnAbrirNotas.setAttribute(
        "aria-expanded",
        "false"
    );
}


btnAbrirNotas.addEventListener(
    "click",
    () => {

        if (notasEstanAbiertas()) {
            cerrarNotas();
        } else {
            abrirNotas();
        }
    }
);


btnCerrarNotas.addEventListener(
    "click",
    cerrarNotas
);


// En celular el fondo oscuro cierra al tocarlo.
// En PC ese fondo no se muestra, así que se puede
// seguir tachando la grilla con las notas abiertas.
fondoNotas.addEventListener(
    "click",
    cerrarNotas
);


document.addEventListener(
    "keydown",
    evento => {

        if (
            evento.key === "Escape" &&
            notasEstanAbiertas()
        ) {
            cerrarNotas();
        }
    }
);

// ==========================================
// UTILIDADES
// ==========================================

function cambiarPantalla(pantalla) {
    document.querySelectorAll(".pantalla").forEach(elemento => {
        elemento.classList.remove("activa");
    });

    pantalla.classList.add("activa");

    // El botón de notas sólo tiene sentido durante la partida
    const enJuego = pantalla === pantallaJuego;

    document.body.classList.toggle("en-juego", enJuego);

    if (!enJuego) {
        cerrarNotas();
         document.body.classList.remove(
        "modo-libre"
    );

    }
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

// Las salas nunca se borraban: cada partida dejaba una
// para siempre y el plan gratuito de Firebase es 1 GB.
// Al crear una sala nueva barremos las que ya nadie usa.
const HORAS_PARA_BORRAR_SALA = 12;

async function borrarSalasViejas() {

    try {

        const todasRef = ref(database, "salas");
        const snapshot = await get(todasRef);

        if (!snapshot.exists()) {
            return;
        }

        const limite =
            Date.now() -
            HORAS_PARA_BORRAR_SALA * 60 * 60 * 1000;

        const borrados = [];

        Object.entries(snapshot.val()).forEach(
            ([codigo, sala]) => {

                // Sin creadaEn no sabemos la antigüedad,
                // así que por las dudas no la tocamos
                if (
                    typeof sala?.creadaEn === "number" &&
                    sala.creadaEn < limite
                ) {
                    borrados.push(
                        remove(
                            ref(database, `salas/${codigo}`)
                        )
                    );
                }
            }
        );

        await Promise.all(borrados);

    } catch (error) {

        // Que falle la limpieza no puede impedir jugar
        console.warn(
            "No se pudieron borrar las salas viejas:",
            error
        );
    }
}


btnCrearSala.addEventListener("click", () => conBotonOcupado(btnCrearSala, async () => {
    const nombre = nombreCreador.value.trim();

    if (nombre === "") {
        mostrarAviso("Ingresá tu nombre.");
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
        guardarSesion(nombre);
        codigoSala.textContent = codigoActual;
        escucharSala();
        cambiarPantalla(pantallaLobby);

        // En segundo plano: no hace falta esperarla
        // para empezar a jugar.
        borrarSalasViejas();

    } catch (error) {
        console.error("Error creando sala:", error);
        mostrarAviso("Hubo un error al crear la sala.", "error");
    }
}));

// ==========================================
// UNIRSE A SALA
// ==========================================

btnUnirse.addEventListener("click", () => conBotonOcupado(btnUnirse, async () => {
    const nombre = nombreJugador.value.trim();
    const codigo = codigoSalaInput.value.trim().toUpperCase();

    if (nombre === "") {
        mostrarAviso("Ingresá tu nombre.");
        return;
    }

    if (codigo === "") {
        mostrarAviso("Ingresá el código de la sala.");
        return;
    }

    try {
        const salaRef = ref(database, `salas/${codigo}`);
        const snapshot = await get(salaRef);

        if (!snapshot.exists()) {
            mostrarAviso("La sala no existe.", "error");
            return;
        }

        const sala = snapshot.val();

        if (sala.estado !== "esperando") {
            mostrarAviso("La partida ya comenzó.");
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
        guardarSesion(nombre);
        codigoSala.textContent = codigoActual;
        escucharSala();
        cambiarPantalla(pantallaLobby);

    } catch (error) {
        console.error("Error entrando:", error);
        mostrarAviso("No se pudo entrar a la sala.", "error");
    }
}));


btnReconectar.addEventListener(
    "click",
    () => conBotonOcupado(btnReconectar, async () => {

        const sesion =
            obtenerSesion();

        if (!sesion) {

            mostrarAviso(
                "No hay una sesión guardada."
            );

            actualizarPanelReconexion();

            return;
        }


        try {

            const salaRef =
                ref(
                    database,
                    `salas/${sesion.codigo}`
                );


            const snapshot =
                await get(salaRef);


            if (!snapshot.exists()) {

                mostrarAviso(
                    "La sala ya no existe.",
                    "error"
                );

                borrarSesion();

                actualizarPanelReconexion();

                return;
            }


            const sala =
                snapshot.val();


            const jugador =
                sala.jugadores?.[
                    sesion.jugadorId
                ];


            if (!jugador) {

                mostrarAviso(
                    "Tu jugador ya no existe en esta sala."
                );

                borrarSesion();

                actualizarPanelReconexion();

                return;
            }


            // Recuperamos exactamente
            // el mismo jugador
            codigoActual =
                sesion.codigo;

            jugadorActualId =
                sesion.jugadorId;


            codigoSala.textContent =
                codigoActual;


            escucharSala();


            // No importa si está en lobby
            // o si la partida ya empezó.
            // escucharSala decidirá
            // qué pantalla mostrar.

        } catch (error) {

            console.error(
                "Error reconectando:",
                error
            );

            mostrarAviso(
                "No se pudo reconectar.",
                "error"
            );
        }
    })
);
// ==========================================
// MODO LIBRE - GUARDAR PALABRA
// ==========================================

btnGuardarPalabraLibre.addEventListener(
    "click",
    () => conBotonOcupado(
        btnGuardarPalabraLibre,
        async () => {

            if (!codigoActual || !jugadorActualId) {
                return;
            }

            const palabra =
                inputPalabraLibre.value.trim();

            if (palabra === "") {
                mostrarAviso(
                    "Escribí una palabra antes de guardarla.",
                    "error"
                );
                return;
            }

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

                if (sala.categoria !== "libre") {
                    mostrarAviso(
                        "La sala no está en modo libre.",
                        "error"
                    );
                    return;
                }

                if (sala.estado !== "esperando") {
                    mostrarAviso(
                        "La partida ya comenzó.",
                        "error"
                    );
                    return;
                }

                const jugadorRef =
                    ref(
                        database,
                        `salas/${codigoActual}/jugadores/${jugadorActualId}`
                    );

                await update(
                    jugadorRef,
                    {
                        palabraPropuesta: palabra
                    }
                );

                inputPalabraLibre.value = "";

                mostrarAviso(
                    "✅ Palabra guardada."
                );

            } catch (error) {

                console.error(
                    "Error guardando palabra libre:",
                    error
                );

                mostrarAviso(
                    "No se pudo guardar la palabra.",
                    "error"
                );
            }
        }
    )
);
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
            mostrarAviso("Solo el anfitrión puede cambiar la categoría.");
            return;
        }

        if (sala.estado !== "esperando") {
            selectorCategoria.value = sala.categoria || "numeros";
            mostrarAviso("No se puede cambiar la categoría durante una partida.");
            return;
        }

        await update(salaRef, {
            categoria: selectorCategoria.value
        });

    } catch (error) {
        console.error("Error cambiando categoría:", error);
        mostrarAviso("No se pudo cambiar la categoría.", "error");
    }
});

// ==========================================
// ESCUCHAR FIREBASE
// ==========================================

function dejarDeEscucharSala() {

    if (desuscribirSala) {
        desuscribirSala();
        desuscribirSala = null;
    }
}


// Corta la suscripción, limpia el estado y devuelve
// a la pantalla de inicio. Se usa cuando expulsan al
// jugador y cuando la sala deja de existir.
function volverAlInicio() {

    // Primero cortamos: si no, las siguientes
    // actualizaciones de esa sala nos vuelven a meter
    // en una pantalla de la que ya salimos.
    dejarDeEscucharSala();

    borrarSesion();

    codigoActual = "";
    jugadorActualId = null;
    rondaActual = null;
    claveNotasCargada = null;
    tachadosLocales.clear();

    cambiarPantalla(pantallaInicio);

    actualizarPanelReconexion();
}


function escucharSala() {

    // Si ya estábamos escuchando otra sala (o la misma), cortamos.
    // Antes se acumulaba un listener por cada vez que se entraba
    // o se reconectaba, y todos peleaban por la misma pantalla.
    dejarDeEscucharSala();

    limpiarGuardadoDeOtrasSalas();

    const salaRef = ref(database, `salas/${codigoActual}`);

    desuscribirSala = onValue(salaRef, snapshot => {

        // La sala desapareció (la borró el anfitrión o la
        // limpieza de salas viejas). Antes se avisaba y se
        // hacía return, pero el listener quedaba vivo y uno
        // se quedaba en la pantalla de juego con datos viejos,
        // sin forma de salir salvo recargar.
        if (!snapshot.exists()) {

            volverAlInicio();

            mostrarAviso(
                "La sala ya no existe.",
                "error"
            );

            return;
        }

        const sala = snapshot.val();

        jugadores = sala.jugadores || {};

        // ======================================
        // COMPROBAR SI ME EXPULSARON
        // ======================================

        if (
            jugadorActualId &&
            !jugadores[jugadorActualId]
        ) {

            volverAlInicio();

            mostrarAviso(
                "Fuiste expulsado de la sala por el anfitrión.",
                "error"
            );

            return;
        }

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

    const lista =
        Object.entries(jugadores);

    const soyAnfitrion =
        sala.anfitrionId ===
        jugadorActualId;
    const esModoLibre =
    sala.categoria === "libre";

panelModoLibre.style.display =
    esModoLibre
        ? "block"
        : "none";
    if (esModoLibre) {

    const miJugador =
        jugadores[jugadorActualId];

    const yaGuarde =
        Boolean(
            miJugador?.palabraPropuesta?.trim()
        );

    estadoPalabraLibre.textContent =
        yaGuarde
            ? "✅ Tu palabra ya está guardada."
            : "⏳ Todavía no guardaste una palabra.";

    const cantidadListos =
        Object.values(jugadores)
            .filter(jugador =>
                jugador.palabraPropuesta?.trim()
            )
            .length;

    textoCategoria.textContent =
        `🆓 Modo libre · Palabras listas: ${cantidadListos}/${lista.length}`;
}


    lista.forEach(
        ([id, jugador]) => {

            const fila =
                document.createElement(
                    "div"
                );

            fila.classList.add(
                "jugador"
            );


            const nombre =
                document.createElement(
                    "span"
                );


            nombre.textContent =
                id === sala.anfitrionId
                    ? `${jugador.nombre} 👑`
                    : jugador.nombre;


            fila.appendChild(nombre);


            // ==================================
            // BOTÓN EXPULSAR
            // ==================================

            if (
                soyAnfitrion &&
                id !== jugadorActualId
            ) {

                const btnExpulsar =
                    document.createElement(
                        "button"
                    );

                btnExpulsar.textContent =
                    "Expulsar";


                btnExpulsar.addEventListener(
                    "click",
                    () => conBotonOcupado(btnExpulsar, async () => {

                        const confirmar =
                            confirm(
                                `¿Expulsar a ${jugador.nombre} de la sala?`
                            );


                        if (!confirmar) {
                            return;
                        }


                        try {

                            const jugadorRef =
                                ref(
                                    database,
                                    `salas/${codigoActual}/jugadores/${id}`
                                );


                            await remove(jugadorRef);


                        } catch (error) {

                            console.error(
                                "Error expulsando jugador:",
                                error
                            );

                            mostrarAviso(
                                "No se pudo expulsar al jugador.",
                                "error"
                            );
                        }
                    })
                );


                fila.appendChild(
                    btnExpulsar
                );
            }


            listaJugadores.appendChild(
                fila
            );
        }
    );


    contadorJugadores.textContent =
        `Jugadores: ${lista.length}`;


    btnIniciarPartida.style.display =
        soyAnfitrion
            ? "inline-block"
            : "none";


    selectorCategoria.value =
        sala.categoria || "numeros";


    selectorCategoria.disabled =
        !soyAnfitrion;


    if (soyAnfitrion) {

        textoCategoria.textContent =
            "Elegí una categoría. Toda la sala jugará únicamente con esa categoría.";

    } else {

        // Con fallback, igual que el resto del código: si en
        // la base quedó una categoría desconocida, antes esto
        // tiraba una excepción y rompía todo el lobby.
        const datosCategoria =
            categorias[categoriaActual] ||
            categorias.numeros;

        textoCategoria.textContent =
            `Categoría elegida por el anfitrión: ${datosCategoria.nombre}`;
    }
}

// ==========================================
// INICIAR PARTIDA
// ==========================================

async function iniciarPartidaFirebase() {

    try {

        const salaRef =
            ref(
                database,
                `salas/${codigoActual}`
            );

        const snapshot =
            await get(salaRef);

        if (!snapshot.exists()) {

            mostrarAviso(
                "La sala ya no existe.",
                "error"
            );

            return;
        }

        const sala =
            snapshot.val();

        if (
            sala.anfitrionId !==
            jugadorActualId
        ) {

            mostrarAviso(
                "Solo el anfitrión puede iniciar la partida."
            );

            return;
        }

        const jugadoresSala =
            sala.jugadores || {};

        const entradasJugadores =
            Object.entries(jugadoresSala);

        if (entradasJugadores.length < 2) {

            mostrarAviso(
                "Necesitás al menos 2 jugadores."
            );

            return;
        }

        const categoria =
            sala.categoria || "numeros";


        // ======================================
        // MODO LIBRE
        // ======================================

        if (categoria === "libre") {

            const faltanPalabras =
                entradasJugadores.filter(
                    ([, jugador]) =>
                        !jugador.palabraPropuesta?.trim()
                );

            if (faltanPalabras.length > 0) {

                mostrarAviso(
                    `Faltan ${faltanPalabras.length} jugador(es) por guardar su palabra.`,
                    "error"
                );

                return;
            }


            // Mezclamos jugadores
            const ordenAsignacion =
                mezclarArray(
                    entradasJugadores.map(
                        ([id]) => id
                    )
                );


            const cambios = {

                estado: "jugando",

                opcionesSeleccionadas: [],

                revelados: false,

                ronda: Date.now(),

                rondaNumero: 1,

                rondasTerminadas: false,

                libreTerminado: false,

                ganadorId: null,

                ordenTurnos:
                    mezclarArray(
                        entradasJugadores.map(
                            ([id]) => id
                        )
                    ),

                turnoActual: 0
            };


            // La palabra de cada jugador
            // se la damos al siguiente.
            //
            // De esta manera nadie recibe
            // la palabra que escribió.
            for (
                let i = 0;
                i < ordenAsignacion.length;
                i++
            ) {

                const idQueEscribio =
                    ordenAsignacion[i];

                const idQueRecibe =
                    ordenAsignacion[
                        (i + 1) %
                        ordenAsignacion.length
                    ];

                const palabra =
                    jugadoresSala[
                        idQueEscribio
                    ].palabraPropuesta.trim();

                cambios[
                    `jugadores/${idQueRecibe}/elemento`
                ] = palabra;
            }


            await update(
                salaRef,
                cambios
            );

            return;
        }


        // ======================================
        // MODALIDADES NORMALES
        // ======================================

        const ordenTurnos =
            mezclarArray(
                entradasJugadores.map(
                    ([id]) => id
                )
            );

        if (entradasJugadores.length > 50) {

            mostrarAviso(
                "Puede haber como máximo 50 jugadores."
            );

            return;
        }

        const opciones =
            generar50Opciones(
                categoria
            );

        const opcionesJugadores =
            mezclarArray(opciones);

        const cambios = {

            estado: "jugando",

            opcionesSeleccionadas:
                opciones,

            revelados: false,

            ronda:
                Date.now(),

            rondaNumero: 1,

            rondasTerminadas:
                false,

            libreTerminado:
                false,

            ganadorId:
                null,

            ordenTurnos:
                ordenTurnos,

            turnoActual: 0
        };

        entradasJugadores.forEach(
            ([id], indice) => {

                cambios[
                    `jugadores/${id}/elemento`
                ] =
                    opcionesJugadores[
                        indice
                    ];
            }
        );

        await update(
            salaRef,
            cambios
        );

    } catch (error) {

        console.error(
            "ERROR COMPLETO AL INICIAR:",
            error
        );

        mostrarAviso(
            "Error al iniciar: " +
            (error?.message || String(error)),
            "error"
        );
    }
}

btnIniciarPartida.addEventListener(
    "click",
    () => conBotonOcupado(btnIniciarPartida, iniciarPartidaFirebase)
);

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

        // Si rondaActual era null, esto es la primera carga
        // de la página (o una reconexión): la partida es la
        // misma, así que las notas hay que conservarlas.
        const esPartidaNueva =
            rondaActual !== null;

        rondaActual =
            sala.ronda;

        if (esPartidaNueva) {
            // Los elementos cambiaron: las notas de la
            // partida anterior ya no sirven para nada.
            borrarNotasActuales();
        }

        // La clave incluye la ronda, así que en una partida
        // nueva no hay nada que recuperar y arranca vacío,
        // pero si sólo se recargó la página vuelve todo
        // lo que se había tachado.
        cargarTachados();
    }


    // Primero entramos a la pantalla
    cambiarPantalla(pantallaJuego);


    // Actualizamos los textos
    actualizarTextosDeJuego();


    // Mostramos turno y palabra
    mostrarTurnoActual(sala);


    // Mostramos grilla
    const esModoLibre =
    categoriaActual === "libre";

    document.body.classList.toggle(
    "modo-libre",
    esModoLibre
);

ayudaGrilla.style.display =
    esModoLibre
        ? "none"
        : "";

if (esModoLibre) {

    tituloGrilla.style.display =
        "none";

    grillaNumeros.style.display =
        "none";

} else {

    tituloGrilla.style.display =
        "";

    grillaNumeros.style.display =
        "";

    mostrarGrilla();
}

    cargarNotas();

    const soyAnfitrion =
        sala.anfitrionId ===
        jugadorActualId;
        if (esModoLibre) {

    btnRevelar.style.display =
        soyAnfitrion &&
        sala.libreTerminado === true
            ? "inline-block"
            : "none";

} 


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

    // Los números entran en celdas chicas; los nombres
    // de objetos, animales, profesiones o videojuegos
    // necesitan celdas más anchas (lo resuelve el CSS).
    grillaNumeros.classList.toggle(
        "grilla-palabras",
        categoriaActual !== "numeros"
    );

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

        // Botón y no div: así se puede tachar con el teclado
        // (Tab + Enter) y un lector de pantalla lo anuncia
        // como algo apretable, con su estado de tachado.
        const casilla = document.createElement("button");
        casilla.type = "button";
        casilla.classList.add("numero");
        casilla.textContent = opcion;

        const esDeOtroJugador =
            elementosOtros.has(clave);

        if (esDeOtroJugador) {
            casilla.classList.add("numero-otro-jugador");

            // Ya se sabe de quién es: no hay nada que tachar
            casilla.disabled = true;
            casilla.title = "Es el elemento de otro jugador";
        } else {
            casilla.setAttribute(
                "aria-pressed",
                String(tachadosLocales.has(clave))
            );
        }

        if (tachadosLocales.has(clave)) {
            casilla.classList.add("tachado");
        }

        casilla.addEventListener("click", () => {
            if (esDeOtroJugador) {
                return;
            }

            if (tachadosLocales.has(clave)) {
                tachadosLocales.delete(clave);
                casilla.classList.remove("tachado");
            } else {
                tachadosLocales.add(clave);
                casilla.classList.add("tachado");
            }

            casilla.setAttribute(
                "aria-pressed",
                String(tachadosLocales.has(clave))
            );

            guardarTachados();
        });

        grillaNumeros.appendChild(casilla);
    });
}

// ==========================================
// REVELAR TODOS
// ==========================================

btnRevelar.addEventListener("click", () => conBotonOcupado(btnRevelar, async () => {
    try {
        const salaRef = ref(database, `salas/${codigoActual}`);
        const snapshot = await get(salaRef);

        if (!snapshot.exists()) {
            mostrarAviso("La sala no existe.", "error");
            return;
        }

        const sala = snapshot.val();

        if (sala.anfitrionId !== jugadorActualId) {
            mostrarAviso("Solo el anfitrión puede revelar.");
            return;
        }

        await update(salaRef, {
            revelados: true
        });

    } catch (error) {
        console.error("Error revelando:", error);
        mostrarAviso("No se pudieron revelar los elementos.", "error");
    }
}));

// ==========================================
// NUEVA PARTIDA
// ==========================================

async function nuevaPartidaFirebase() {
    try {
        const salaRef = ref(database, `salas/${codigoActual}`);
        const snapshot = await get(salaRef);

        if (!snapshot.exists()) {
            mostrarAviso("La sala ya no existe.", "error");
            return;
        }

        const sala = snapshot.val();

        if (sala.anfitrionId !== jugadorActualId) {
            mostrarAviso("Solo el anfitrión puede comenzar una nueva partida.");
            return;
        }

        const entradasJugadores = Object.entries(sala.jugadores || {});
        const nuevoOrdenTurnos = mezclarArray(entradasJugadores.map(([id]) => id));
        const categoria = sala.categoria || "numeros";

        const nuevasOpciones = generar50Opciones(categoria);
        const opcionesJugadores = mezclarArray(nuevasOpciones);

        const cambios = {
            estado: "jugando",
            opcionesSeleccionadas: nuevasOpciones,
            revelados: false,
            ronda: Date.now(),

            rondaNumero: 1,
            rondasTerminadas: false,

            ordenTurnos: nuevoOrdenTurnos,
            turnoActual: 0
};

        entradasJugadores.forEach(([id], indice) => {
            cambios[`jugadores/${id}/elemento`] = opcionesJugadores[indice];
        });

        await update(salaRef, cambios);

    } catch (error) {
        console.error("Error nueva partida:", error);
        mostrarAviso("No se pudo comenzar una nueva partida.", "error");
    }
}

btnNuevaPartida.addEventListener(
    "click",
    () => conBotonOcupado(btnNuevaPartida, nuevaPartidaFirebase)
);

// ==========================================
// COPIAR CÓDIGO
// ==========================================

btnCopiarCodigo.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(codigoActual);
        mostrarAviso("Código copiado: " + codigoActual);
    } catch {
        mostrarAviso("Código de sala: " + codigoActual);
    }
});
btnVolverSala.addEventListener(
    "click",
    () => conBotonOcupado(btnVolverSala, async () => {

        try {

            const salaRef = ref(
                database,
                `salas/${codigoActual}`
            );

            const snapshot =
                await get(salaRef);

            if (!snapshot.exists()) {

                mostrarAviso(
                    "La sala ya no existe.",
                    "error"
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

                mostrarAviso(
                    "Solo el anfitrión puede volver a la sala."
                );

                return;
            }


            // Solo después de revelar
            if (
                sala.revelados !== true
            ) {

                mostrarAviso(
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

            mostrarAviso(
                "No se pudo volver a la sala de espera.",
                "error"
            );
        }
    })
);
function mostrarTurnoActual(sala) {

    const orden =
        sala.ordenTurnos || [];

    const indice =
        sala.turnoActual ?? 0;

    const rondaNumero =
        sala.rondaNumero || 1;

    const rondasTerminadas =
        sala.rondasTerminadas === true;
    // ======================================
// MODO LIBRE
// ======================================

if (categoriaActual === "libre") {

    contadorRonda.textContent =
        "♾️ Modo libre";

    // ======================================
// REVELAR EN MODO LIBRE
// ======================================

if (revelados) {

    const miJugador =
        jugadores[jugadorActualId];

    contadorRonda.textContent =
        "✅ Palabras reveladas";

    turnoActualElemento.textContent =
        "🎉 ¡Tu palabra era!";

    palabraTurno.textContent =
        miJugador?.elemento || "???";

    mensajeTurno.textContent =
        "Todos los jugadores ya pueden ver su palabra.";

    btnTerminarTurno.style.display =
        "none";

    btnForzarTurno.style.display =
        "none";

    return;
}

    const orden =
        sala.ordenTurnos || [];

    if (orden.length === 0) {

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


    // ==================================
    // ALGUIEN ADIVINÓ
    // ==================================

    if (sala.libreTerminado === true) {

        const ganador =
            jugadores[
                sala.ganadorId
            ];

        contadorRonda.textContent =
            "🏆 Partida terminada";

        turnoActualElemento.textContent =
            ganador
                ? `🎉 ${ganador.nombre} adivinó`
                : "🎉 ¡Alguien adivinó!";

        const miJugador =
            jugadores[
                jugadorActualId
            ];

        palabraTurno.textContent =
            miJugador?.elemento ||
            "???";

        mensajeTurno.textContent =
            "La partida terminó.";

        btnTerminarTurno.style.display =
            "none";

        btnForzarTurno.style.display =
            "none";


        return;
    }


    const indice =
        sala.turnoActual ?? 0;

    const idTurno =
        orden[indice];

    const jugador =
        jugadores[idTurno];


    if (!jugador) {

        turnoActualElemento.textContent =
            "Esperando...";

        palabraTurno.textContent =
            "???";

        mensajeTurno.textContent =
            "";
        return;
    }


    const esMiTurno =
        idTurno ===
        jugadorActualId;

    const soyAnfitrion =
        sala.anfitrionId ===
        jugadorActualId;


    turnoActualElemento.textContent =
        `🎤 Turno de: ${jugador.nombre}`;


    if (esMiTurno) {

        palabraTurno.textContent =
            "???";

        mensajeTurno.textContent =
            "Hacé una pregunta o arriesgá tu respuesta.";

    } else {

        palabraTurno.textContent =
            jugador.elemento || "???";

        mensajeTurno.textContent =
            `Esperando a que ${jugador.nombre} termine su turno...`;
    }


    btnTerminarTurno.style.display =
        esMiTurno
            ? "inline-block"
            : "none";



    btnForzarTurno.style.display =
        soyAnfitrion
            ? "inline-block"
            : "none";


    return;
}

    if (rondaNumero === 6) {

    contadorRonda.textContent =
        "🎯 Ronda final: Arriesgar";

} else {

    contadorRonda.textContent =
        `Ronda ${rondaNumero} de 5`;
}
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

        // ======================================
    // FINAL DE LAS 5 RONDAS
    // ======================================

    if (rondasTerminadas && !revelados) {

    contadorRonda.textContent =
        "5 de 5 rondas completadas";

    turnoActualElemento.textContent =
        "🏁 ¡Final de la partida!";

    palabraTurno.textContent =
        "5 rondas completadas";

    mensajeTurno.textContent =
        "El anfitrión ya puede revelar los resultados.";

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


    // El jugador de este turno ya no está en la sala:
    // cerró la pestaña o el anfitrión lo expulsó.
    // El anfitrión TIENE que poder forzar el siguiente turno,
    // si no la partida queda trabada para siempre.
    if (!jugador) {

        const soyAnfitrionSinJugador =
            sala.anfitrionId ===
            jugadorActualId;

        turnoActualElemento.textContent =
            "Esperando...";

        palabraTurno.textContent =
            "???";

        mensajeTurno.textContent =
            soyAnfitrionSinJugador
                ? "El jugador de este turno ya no está en la sala. Forzá el siguiente turno para seguir."
                : "El jugador de este turno ya no está en la sala. Esperando al anfitrión...";

        btnTerminarTurno.style.display =
            "none";

        btnForzarTurno.style.display =
            soyAnfitrionSinJugador && !revelados
                ? "inline-block"
                : "none";

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

    const miJugador = jugadores[jugadorActualId];

    let textoRevelado = "🎉 ¡Tu elemento era!";

    if (categoriaActual === "numeros") {
        textoRevelado = "🎲 ¡Tu número era!";
    }

    if (categoriaActual === "objetos") {
        textoRevelado = "📦 ¡Tu objeto era!";
    }

    if (categoriaActual === "profesiones") {
        textoRevelado = "🤵‍♂️ ¡Tu profesión era!";
    }

    if (categoriaActual === "animales") {
        textoRevelado = "🐾 ¡Tu animal era!";
    }

    if (categoriaActual === "videojuegos") {
    textoRevelado = "🎮 ¡Tu videojuego era!";
    }

    if (categoriaActual === "peliculas") {
    textoRevelado = "🎬 ¡Tu Pelicula era!";
    }

    turnoActualElemento.textContent =
        textoRevelado;

    palabraTurno.textContent =
        miJugador?.elemento || "???";

} else {

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

    if (rondaNumero === 6) {

    if (esMiTurno) {

        mensajeTurno.textContent =
            "🎯 Arriesgá qué creés que sos y después terminá tu turno.";

    } else {

        mensajeTurno.textContent =
            `🎯 ${jugador.nombre} está arriesgando su respuesta...`;
    }

} else {

    if (esMiTurno) {

        mensajeTurno.textContent =
            "Hacé tu pregunta y después terminá tu turno.";

    } else {

        mensajeTurno.textContent =
            `Esperando a que ${jugador.nombre} termine su turno...`;
    }
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
   
// ==========================================
// AVANCE DE TURNO (lógica compartida)
// ==========================================

// Devuelve los cambios a escribir en Firebase para pasar
// al siguiente turno, o null si no hay nada que hacer.
//
// De paso saca del orden a los jugadores que ya no están
// en la sala, así el anfitrión no tiene que forzar el mismo
// turno vacío una vez por ronda.
function calcularSiguienteTurno(sala) {

    const jugadoresSala =
        sala.jugadores || {};

    const ordenOriginal =
        sala.ordenTurnos || [];

    const indice =
        sala.turnoActual ?? 0;


    if (ordenOriginal.length === 0) {
        return null;
    }


    const orden =
        ordenOriginal.filter(
            id => jugadoresSala[id]
        );


    if (orden.length === 0) {
        return null;
    }


    // Dónde cae el turno actual dentro del orden ya limpio
    let posicion =
        orden.indexOf(
            ordenOriginal[indice]
        );


    if (posicion === -1) {

        // El jugador del turno se fue de la sala.
        // Nos paramos en el último que SÍ sigue estando
        // antes que él, para no saltear a nadie.
        for (
            let i = 0;
            i < indice && i < ordenOriginal.length;
            i++
        ) {

            const anterior =
                orden.indexOf(ordenOriginal[i]);

            if (anterior !== -1) {
                posicion = anterior;
            }
        }
    }


    let siguiente = posicion + 1;

    let rondaNumero =
        sala.rondaNumero || 1;

    let rondasTerminadas = false;
    // ======================================
    // MODO LIBRE: TURNOS INFINITOS// 
    // ======================================

if (sala.categoria === "libre") {

    if (sala.libreTerminado === true) {
        return null;
    }

    if (siguiente >= orden.length) {
        siguiente = 0;
    }

    return {
        ordenTurnos: orden,
        turnoActual: siguiente,
        rondaNumero: 1,
        rondasTerminadas: false
    };
}


    // Terminó el último jugador de la ronda
    if (siguiente >= orden.length) {

        // La ronda 6 es la de arriesgar: ahí se acaba
        if (rondaNumero >= 6) {

            rondasTerminadas = true;

            // Dejamos el índice en el último jugador
            siguiente = orden.length - 1;

        } else {

            // Volvemos al primero y pasamos de ronda
            siguiente = 0;

            rondaNumero++;
        }
    }


    return {
        ordenTurnos: orden,
        turnoActual: siguiente,
        rondaNumero: rondaNumero,
        rondasTerminadas: rondasTerminadas
    };
}


// ==========================================
// PASAR EL TURNO
// ==========================================

// Antes esto era get() -> calcular -> update(). Si el
// anfitrión forzaba justo cuando el jugador terminaba,
// las dos escrituras se pisaban y se salteaba un turno
// o se pisaba el número de ronda.
//
// runTransaction lee y escribe de forma atómica: si otro
// cliente escribió en el medio, Firebase vuelve a correr
// esta función con el dato nuevo.
async function pasarTurno({ forzado }) {

    if (!codigoActual || !jugadorActualId) {
        return;
    }

    const salaRef =
        ref(database, `salas/${codigoActual}`);

    // La función de abajo puede correr varias veces, así
    // que el motivo del rechazo se guarda acá afuera y se
    // avisa una sola vez, al final.
    let rechazo = null;

    try {

        await runTransaction(salaRef, sala => {

            // Firebase llama primero con lo que tiene en
            // caché. Como escucharSala() mantiene un listener
            // activo sobre esta misma ruta, el dato ya está
            // sincronizado. Si aun así llega vacío, abortamos
            // devolviendo undefined en vez de escribir nada.
            if (!sala) {
                return;
            }

            if (forzado) {

                if (sala.anfitrionId !== jugadorActualId) {

                    rechazo =
                        "Solo el anfitrión puede forzar el turno.";

                    return;
                }

            } else {

                const orden = sala.ordenTurnos || [];
                const indice = sala.turnoActual ?? 0;

                if (orden[indice] !== jugadorActualId) {

                    rechazo = "Todavía no es tu turno.";

                    return;
                }
            }

            const cambios =
                calcularSiguienteTurno(sala);

            if (!cambios) {
                return;
            }

            rechazo = null;

            return { ...sala, ...cambios };
        });

    } catch (error) {

        console.error("Error pasando turno:", error);

        mostrarAviso(
            "No se pudo pasar el turno.",
            "error"
        );

        return;
    }

    if (rechazo) {
        mostrarAviso(rechazo);
    }
}


btnTerminarTurno.addEventListener(
    "click",
    () => conBotonOcupado(
        btnTerminarTurno,
        () => pasarTurno({ forzado: false })
    )
);


btnForzarTurno.addEventListener(
    "click",
    () => conBotonOcupado(
        btnForzarTurno,
        () => pasarTurno({ forzado: true })
    )
);
btnOlvidarSesion.addEventListener(
    "click",
    () => {

        borrarSesion();

        actualizarPanelReconexion();
    }
);
// ==========================================
// COMPROBAR SESIÓN AL ABRIR LA PÁGINA
// ==========================================

actualizarPanelReconexion(); 
