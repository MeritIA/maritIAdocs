/* ==========================================================================
   MeritIA · Documentación — comportamiento compartido
   Sin dependencias. Inyecta el marco (barra, lateral, pie), tema, buscador,
   índice del contenido y renderizado de Mermaid.
   ========================================================================== */
(() => {
  'use strict';

  const RAIZ = document.documentElement;
  const PAGINA = RAIZ.dataset.page || 'inicio';
  const BASE = document.body.dataset.base || '';

  /* --- Navegación -------------------------------------------------------- */
  const NAV = [
    {
      grupo: 'Empezar',
      enlaces: [
        { id: 'inicio', href: 'index.html', texto: 'Inicio', desc: 'Qué es MeritIA' },
        { id: 'estado', href: 'estado.html', texto: 'Estado del proyecto', desc: 'Qué está hecho y qué falta' },
      ],
    },
    {
      grupo: 'El sistema',
      enlaces: [
        { id: 'arquitectura', href: 'arquitectura.html', texto: 'Arquitectura', desc: 'Vista general y decisiones' },
        { id: 'frontend', href: 'frontend.html', texto: 'Frontend', desc: 'Angular, mobile y diseño' },
        { id: 'backend', href: 'backend.html', texto: 'Backend', desc: 'Módulos, API y datos' },
        { id: 'ia', href: 'ia.html', texto: 'Servicio de IA', desc: 'Evaluación con modelos' },
        { id: 'rag', href: 'rag.html', texto: 'Mentor RAG', desc: 'Recuperación híbrida' },
      ],
    },
    {
      grupo: 'Cumplimiento',
      enlaces: [
        { id: 'leyes', href: 'leyes.html', texto: 'Leyes y privacidad', desc: 'Normativa aplicable' },
        { id: 'requisitos', href: 'requisitos.html', texto: 'Requisitos', desc: 'RF, RNF y trazabilidad' },
      ],
    },
    {
      grupo: 'Operación',
      enlaces: [
        { id: 'operacion', href: 'operacion.html', texto: 'Operación', desc: 'Despliegue, CI/CD y runbook' },
        { id: 'decisiones', href: 'decisiones.html', texto: 'Decisiones (ADR)', desc: '17 decisiones registradas' },
      ],
    },
  ];

  const NAV_SUPERIOR = [
    { id: 'arquitectura', href: 'arquitectura.html', texto: 'Arquitectura' },
    { id: 'frontend', href: 'frontend.html', texto: 'Frontend' },
    { id: 'backend', href: 'backend.html', texto: 'Backend' },
    { id: 'ia', href: 'ia.html', texto: 'IA' },
    { id: 'rag', href: 'rag.html', texto: 'RAG' },
    { id: 'leyes', href: 'leyes.html', texto: 'Leyes' },
  ];

  const REPO = 'https://github.com/MeritIA/maritIAdocs';
  const ORG = 'https://github.com/MeritIA';

  /* --- Utilidades -------------------------------------------------------- */
  const el = (etiqueta, attrs = {}, html = '') => {
    const nodo = document.createElement(etiqueta);
    for (const [k, v] of Object.entries(attrs)) {
      if (v !== null && v !== undefined) nodo.setAttribute(k, v);
    }
    if (html) nodo.innerHTML = html;
    return nodo;
  };

  const escapar = (texto) =>
    String(texto).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  const normalizar = (texto) =>
    String(texto).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const icono = (nombre) => {
    const trazos = {
      buscar: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
      sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
      luna: '<path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8Z"/>',
      menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
      cerrar: '<path d="M6 6l12 12M18 6L6 18"/>',
      github: '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-5.9 0-1.3-.5-2.4-1.3-3.2.1-.3.6-1.5-.1-3.2 0 0-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 3.9 5.4 4.2 5.4 4.2c-.7 1.7-.2 2.9-.1 3.2A4.6 4.6 0 0 0 4 10.6c0 4.5 2.7 5.6 5.5 5.9-.6.6-.6 1.2-.5 2V21"/>',
      flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>',
      rayo: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
      escudo: '<path d="M12 3 5 6v5c0 4.4 3 8.4 7 10 4-1.6 7-5.6 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
      capas: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
      documento: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
      terminal: '<path d="m5 7 5 5-5 5M13 17h6"/>',
      libro: '<path d="M4 5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-2V5Z"/><path d="M8 3v18"/>',
    };
    return `<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${trazos[nombre] || ''}</svg>`;
  };

  /* --- Tema -------------------------------------------------------------- */
  const CLAVE_TEMA = 'meritia-docs-tema';
  const aplicarTema = (tema) => {
    RAIZ.dataset.tema = tema;
    try { localStorage.setItem(CLAVE_TEMA, tema); } catch { /* almacenamiento no disponible */ }
    document.querySelectorAll('[data-accion="tema"]').forEach((boton) => {
      boton.setAttribute('aria-label', tema === 'claro' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro');
      boton.innerHTML = tema === 'claro' ? icono('luna') : icono('sol');
      boton.setAttribute('title', tema === 'claro' ? 'Tema oscuro' : 'Tema claro');
    });
    document.dispatchEvent(new CustomEvent('meritia:tema', { detail: { tema } }));
  };

  const temaGuardado = (() => {
    try { return localStorage.getItem(CLAVE_TEMA); } catch { return null; }
  })();
  RAIZ.dataset.tema = temaGuardado === 'claro' ? 'claro' : 'oscuro';

  /* --- Marco: barra ------------------------------------------------------ */
  const construirBarra = () => {
    const destino = document.getElementById('sitio-barra');
    if (!destino) return;
    const enlaces = NAV_SUPERIOR.map(
      (e) => `<a href="${e.href}"${e.id === PAGINA ? ' aria-current="page"' : ''}>${e.texto}</a>`,
    ).join('');

    destino.innerHTML = `
      <div class="progreso" aria-hidden="true"><span id="progreso-linea"></span></div>
      <header class="barra">
        <button class="icono-boton hamburguesa" data-accion="menu" aria-label="Abrir navegación" aria-expanded="false" aria-controls="sitio-lateral">
          ${icono('menu')}
        </button>
        <a class="marca" href="index.html" aria-label="MeritIA · Inicio de la documentación">
          <span class="marca__logo" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2.5 20 12l-8 9.5L4 12Z" stroke="currentColor" stroke-width="1.1"/>
              <path d="M12 7 16.2 12 12 17 7.8 12Z" fill="#5FD49B"/>
            </svg>
          </span>
          <span class="marca__texto">
            <span class="marca__nombre">MeritIA</span>
            <span class="marca__sub">Documentación</span>
          </span>
        </a>
        <nav class="barra__nav" aria-label="Secciones principales">${enlaces}</nav>
        <div class="barra__acciones">
          <button class="boton-buscar" data-accion="buscar" aria-label="Buscar en la documentación">
            ${icono('buscar')}<span>Buscar</span><kbd>⌘K</kbd>
          </button>
          <button class="icono-boton" data-accion="tema" aria-label="Cambiar de tema" title="Cambiar de tema"></button>
          <a class="icono-boton" href="${REPO}" target="_blank" rel="noopener" aria-label="Repositorio en GitHub" title="GitHub">
            ${icono('github')}
          </a>
        </div>
      </header>`;
  };

  /* --- Marco: lateral ---------------------------------------------------- */
  const construirLateral = () => {
    const destino = document.getElementById('sitio-lateral');
    if (!destino) return;
    const grupos = NAV.map((grupo) => `
      <div class="lateral__grupo">
        <p class="lateral__titulo">${grupo.grupo}</p>
        <ul class="lateral__lista">
          ${grupo.enlaces.map(
            (e) => `<li><a class="lateral__enlace" href="${e.href}"${e.id === PAGINA ? ' aria-current="page"' : ''}>
              <span class="lateral__punto" aria-hidden="true"></span>${e.texto}
            </a></li>`,
          ).join('')}
        </ul>
      </div>`).join('');

    destino.className = 'lateral';
    destino.id = 'sitio-lateral';
    destino.setAttribute('aria-label', 'Navegación de la documentación');
    destino.innerHTML = `${grupos}
      <div class="lateral__pie">
        <span class="insignia insignia--ok">v1.0</span>
        <p style="margin:8px 0 0">Estado del código: noviembre de 2026.</p>
        <p style="margin:6px 0 0"><a href="https://github.com/MeritIA" target="_blank" rel="noopener">Organización MeritIA</a></p>
      </div>`;
  };

  /* --- Marco: pie -------------------------------------------------------- */
  const construirPie = () => {
    const destino = document.getElementById('sitio-pie');
    if (!destino) return;
    destino.className = 'pie';
    destino.innerHTML = `
      <div class="pie__interior">
        <div class="pie__marca">
          <span class="marca__logo" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2.5 20 12l-8 9.5L4 12Z" stroke="currentColor" stroke-width="1.1"/>
              <path d="M12 7 16.2 12 12 17 7.8 12Z" fill="#5FD49B"/>
            </svg>
          </span>
          <div>
            <strong style="display:block;font-weight:500">MeritIA</strong>
            <span>Evaluación técnica con evidencia.</span>
          </div>
        </div>
        <div class="pie__columnas">
          <div class="pie__columna">
            <b>Documentación</b>
            <a href="arquitectura.html">Arquitectura</a>
            <a href="backend.html">Backend</a>
            <a href="frontend.html">Frontend</a>
            <a href="leyes.html">Leyes y privacidad</a>
          </div>
          <div class="pie__columna">
            <b>Servicios</b>
            <a href="ia.html">Servicio de IA</a>
            <a href="rag.html">Mentor RAG</a>
            <a href="operacion.html">Operación</a>
            <a href="decisiones.html">Decisiones</a>
          </div>
          <div class="pie__columna">
            <b>Proyecto</b>
            <a href="${ORG}" target="_blank" rel="noopener">Organización</a>
            <a href="${REPO}" target="_blank" rel="noopener">Este repositorio</a>
            <a href="requisitos.html">Requisitos</a>
            <a href="estado.html">Estado</a>
          </div>
        </div>
        <div class="pie__legal">
          Documentación técnica de MeritIA · Contenido derivado del código y de los documentos de ingeniería del proyecto.
          Las cifras corresponden al estado verificado en noviembre de 2026. MeritIA es una marca del proyecto; este sitio no
          recoge datos personales ni usa cookies de seguimiento.
        </div>
      </div>`;
  };

  /* --- Tabla de contenido ------------------------------------------------ */
  const slug = (texto) =>
    normalizar(texto).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

  const construirToc = () => {
    const destino = document.getElementById('sitio-toc');
    const principal = document.getElementById('contenido');
    if (!destino || !principal) return;
    const titulos = [...principal.querySelectorAll('h2, h3')].filter((h) => !h.closest('.no-toc'));
    if (titulos.length < 3) { destino.hidden = true; return; }

    titulos.forEach((h) => {
      if (!h.id) h.id = slug(h.textContent);
      const ancla = el('a', { class: 'ancla', href: `#${h.id}`, 'aria-label': 'Enlace a esta sección' }, '#');
      h.appendChild(ancla);
    });

    destino.className = 'toc';
    destino.innerHTML = `<p class="toc__titulo">En esta página</p>
      <ul class="toc__lista">
        ${titulos.map((h) => `<li class="nivel-${h.tagName === 'H3' ? 3 : 2}"><a href="#${h.id}">${escapar(h.textContent.replace(/#$/, '').trim())}</a></li>`).join('')}
      </ul>`;

    const enlaces = [...destino.querySelectorAll('a')];
    const porId = new Map(titulos.map((h, i) => [h.id, enlaces[i]]));
    const observador = new IntersectionObserver(
      (entradas) => {
        const visibles = entradas.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (!visibles.length) return;
        enlaces.forEach((a) => a.classList.remove('activo'));
        porId.get(visibles[0].target.id)?.classList.add('activo');
      },
      { rootMargin: '-84px 0px -70% 0px', threshold: 0 },
    );
    titulos.forEach((h) => observador.observe(h));
  };

  /* --- Buscador ---------------------------------------------------------- */
  const estadoBusqueda = { indice: null, cargando: false, activo: 0, resultados: [] };

  const cargarIndice = async () => {
    if (estadoBusqueda.indice || estadoBusqueda.cargando) return estadoBusqueda.indice;
    estadoBusqueda.cargando = true;
    try {
      const respuesta = await fetch('assets/search.json', { cache: 'force-cache' });
      if (!respuesta.ok) throw new Error(String(respuesta.status));
      estadoBusqueda.indice = await respuesta.json();
    } catch {
      estadoBusqueda.indice = [];
    } finally {
      estadoBusqueda.cargando = false;
    }
    return estadoBusqueda.indice;
  };

  const resaltar = (texto, terminos) => {
    let salida = escapar(texto);
    for (const termino of terminos.slice(0, 4)) {
      if (termino.length < 2) continue;
      const regex = new RegExp(`(${termino.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      salida = salida.replace(regex, '<mark>$1</mark>');
    }
    return salida;
  };

  const crearBuscador = () => {
    const caja = el('div', { class: 'buscador', id: 'buscador', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Buscar en la documentación', 'data-abierto': 'false' });
    caja.innerHTML = `
      <div class="buscador__caja">
        <div class="buscador__campo">
          ${icono('buscar')}
          <input id="buscador-entrada" type="search" placeholder="Buscar arquitectura, leyes, endpoints…" autocomplete="off" spellcheck="false" aria-label="Término de búsqueda" aria-controls="buscador-resultados">
          <kbd>Esc</kbd>
        </div>
        <div class="buscador__resultados" id="buscador-resultados" role="listbox" aria-label="Resultados"></div>
        <div class="buscador__pie">
          <span><kbd>↑</kbd><kbd>↓</kbd> navegar</span>
          <span><kbd>↵</kbd> abrir</span>
          <span style="margin-left:auto">Búsqueda local · sin seguimiento</span>
        </div>
      </div>`;
    document.body.appendChild(caja);

    const entrada = caja.querySelector('#buscador-entrada');
    const resultados = caja.querySelector('#buscador-resultados');

    const abrir = async (termino = '') => {
      caja.dataset.abierto = 'true';
      document.body.style.overflow = 'hidden';
      entrada.value = termino;
      entrada.focus();
      await cargarIndice();
      pintar(termino);
    };
    const cerrar = () => {
      caja.dataset.abierto = 'false';
      document.body.style.overflow = '';
      entrada.value = '';
    };
    const pintar = (consulta) => {
      const terminos = normalizar(consulta).split(/\s+/).filter(Boolean);
      const indice = estadoBusqueda.indice || [];
      const encontrados = [];

      for (const doc of indice) {
        const campos = normalizar(`${doc.t} ${doc.d} ${(doc.h || []).join(' ')} ${doc.x || ''}`);
        if (!terminos.every((t) => campos.includes(t))) continue;
        let puntaje = 0;
        const titulo = normalizar(doc.t);
        const desc = normalizar(doc.d || '');
        for (const t of terminos) {
          if (titulo.includes(t)) puntaje += 12;
          if (desc.includes(t)) puntaje += 6;
          if ((doc.h || []).some((h) => normalizar(h).includes(t))) puntaje += 4;
          puntaje += 1;
        }
        encontrados.push({ ...doc, puntaje });
      }
      encontrados.sort((a, b) => b.puntaje - a.puntaje);
      estadoBusqueda.resultados = encontrados.slice(0, 14);
      estadoBusqueda.activo = 0;

      if (!consulta.trim()) {
        resultados.innerHTML = `<div class="buscador__vacio">Escribe para buscar en las ${indice.length || 11} secciones de la documentación.<br><span style="font-size:.8em">Prueba «consentimiento», «RRF», «módulos» o «despliegue».</span></div>`;
        return;
      }
      if (!estadoBusqueda.resultados.length) {
        resultados.innerHTML = `<div class="buscador__vacio">Sin resultados para <strong>${escapar(consulta)}</strong>.</div>`;
        return;
      }

      resultados.innerHTML = estadoBusqueda.resultados.map((r, i) => `
        <button class="buscador__item" role="option" data-indice="${i}" data-activo="${i === 0}" data-href="${escapar(r.u)}">
          <strong>${resaltar(r.t, terminos)}</strong>
          <span>${resaltar(r.d || '', terminos)}</span>
        </button>`).join('');

      resultados.querySelectorAll('.buscador__item').forEach((boton) => {
        boton.addEventListener('click', () => { window.location.href = boton.dataset.href; });
      });
    };
    const mover = (delta) => {
      const items = [...resultados.querySelectorAll('.buscador__item')];
      if (!items.length) return;
      estadoBusqueda.activo = (estadoBusqueda.activo + delta + items.length) % items.length;
      items.forEach((item, i) => item.dataset.activo = String(i === estadoBusqueda.activo));
      items[estadoBusqueda.activo].scrollIntoView({ block: 'nearest' });
    };
    const abrirActivo = () => {
      const item = resultados.querySelector(`.buscador__item[data-indice="${estadoBusqueda.activo}"]`);
      if (item) window.location.href = item.dataset.href;
    };

    entrada.addEventListener('input', (e) => pintar(e.target.value));
    entrada.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); mover(1); }
      if (e.key === 'ArrowUp') { e.preventDefault(); mover(-1); }
      if (e.key === 'Enter') { e.preventDefault(); abrirActivo(); }
      if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
    });
    caja.addEventListener('click', (e) => { if (e.target === caja) cerrar(); });

    document.addEventListener('keydown', (e) => {
      const escribiendo = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '');
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        caja.dataset.abierto === 'true' ? cerrar() : abrir();
      } else if (e.key === '/' && !escribiendo && caja.dataset.abierto !== 'true') {
        e.preventDefault();
        abrir();
      } else if (e.key === 'Escape' && caja.dataset.abierto === 'true') {
        cerrar();
      }
    });

    document.querySelectorAll('[data-accion="buscar"]').forEach((b) => b.addEventListener('click', () => abrir()));
    window.__abrirBuscador = abrir;
  };

  /* --- Drawer móvil ------------------------------------------------------ */
  const prepararDrawer = () => {
    const lateral = document.getElementById('sitio-lateral');
    const boton = document.querySelector('[data-accion="menu"]');
    if (!lateral || !boton) return;
    const velo = el('div', { class: 'velo', 'data-visible': 'false' });
    document.body.appendChild(velo);
    const fijar = (abierto) => {
      lateral.dataset.abierto = String(abierto);
      velo.dataset.visible = String(abierto);
      boton.setAttribute('aria-expanded', String(abierto));
      boton.innerHTML = abierto ? icono('cerrar') : icono('menu');
      document.body.style.overflow = abierto ? 'hidden' : '';
    };
    boton.addEventListener('click', () => fijar(lateral.dataset.abierto !== 'true'));
    velo.addEventListener('click', () => fijar(false));
    lateral.addEventListener('click', (e) => { if (e.target.closest('a')) fijar(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fijar(false); });
  };

  /* --- Código: botón copiar --------------------------------------------- */
  const prepararCodigo = () => {
    document.querySelectorAll('.prosa pre').forEach((pre) => {
      if (pre.closest('.bloque-codigo')) return;
      const contenedor = el('div', { class: 'bloque-codigo' });
      const lenguaje = pre.dataset.lenguaje || pre.querySelector('code')?.dataset.lenguaje || 'código';
      const barra = el('div', { class: 'bloque-codigo__barra' }, `
        <span class="bloque-codigo__puntos" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="bloque-codigo__lenguaje">${escapar(lenguaje)}</span>
        <button class="bloque-codigo__copiar" type="button">Copiar</button>`);
      pre.parentNode.insertBefore(contenedor, pre);
      contenedor.appendChild(barra);
      contenedor.appendChild(pre);
      const boton = barra.querySelector('button');
      boton.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(pre.innerText);
          boton.textContent = 'Copiado';
          setTimeout(() => (boton.textContent = 'Copiar'), 1400);
        } catch {
          boton.textContent = 'No disponible';
        }
      });
    });
  };

  /* --- Mermaid ----------------------------------------------------------- */
  const variablesMermaid = (tema) => {
    const claro = tema === 'claro';
    return {
      darkMode: !claro,
      background: 'transparent',
      primaryColor: claro ? '#e8f6ef' : '#122019',
      primaryTextColor: claro ? '#15161a' : '#eef0f3',
      primaryBorderColor: claro ? '#14825a' : '#5fd49b',
      secondaryColor: claro ? '#eef1f8' : '#161a24',
      secondaryTextColor: claro ? '#15161a' : '#eef0f3',
      secondaryBorderColor: claro ? '#2b5fd9' : '#7fa9ff',
      tertiaryColor: claro ? '#f6f0e2' : '#201b10',
      tertiaryTextColor: claro ? '#15161a' : '#eef0f3',
      tertiaryBorderColor: claro ? '#96620a' : '#e3b341',
      lineColor: claro ? '#5a5d66' : '#82858f',
      textColor: claro ? '#15161a' : '#eef0f3',
      fontSize: '13px',
      fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
      nodeBorder: claro ? '#14825a' : '#5fd49b',
      clusterBkg: claro ? '#f1f1f4' : '#101014',
      clusterBorder: claro ? '#c9c9d1' : '#2a2a33',
      edgeLabelBackground: claro ? '#f7f7f8' : '#08080a',
      actorBkg: claro ? '#e8f6ef' : '#122019',
      actorBorder: claro ? '#14825a' : '#5fd49b',
      actorTextColor: claro ? '#15161a' : '#eef0f3',
      signalColor: claro ? '#5a5d66' : '#9a9da6',
      signalTextColor: claro ? '#15161a' : '#eef0f3',
      labelBoxBkgColor: claro ? '#e8f6ef' : '#122019',
      labelBoxBorderColor: claro ? '#14825a' : '#5fd49b',
      labelTextColor: claro ? '#15161a' : '#eef0f3',
      loopTextColor: claro ? '#15161a' : '#eef0f3',
      noteBkgColor: claro ? '#f6f0e2' : '#201b10',
      noteBorderColor: claro ? '#96620a' : '#e3b341',
      noteTextColor: claro ? '#15161a' : '#eef0f3',
      activationBkgColor: claro ? '#d9efe4' : '#1b3a2b',
      activationBorderColor: claro ? '#14825a' : '#5fd49b',
      sequenceNumberColor: claro ? '#ffffff' : '#04140d',
    };
  };

  const renderizarMermaid = async () => {
    if (!window.mermaid) return;
    const tema = RAIZ.dataset.tema || 'oscuro';
    window.mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      securityLevel: 'strict',
      themeVariables: variablesMermaid(tema),
      flowchart: { htmlLabels: true, curve: 'basis', padding: 14, nodeSpacing: 42, rankSpacing: 52 },
      sequence: { actorMargin: 46, messageMargin: 34, mirrorActors: false, wrap: true, width: 150 },
      er: { useMaxWidth: true },
      state: { useMaxWidth: true },
    });
    const bloques = [...document.querySelectorAll('.mermaid')];
    for (const bloque of bloques) {
      if (!bloque.dataset.fuente) bloque.dataset.fuente = bloque.textContent.trim();
      bloque.removeAttribute('data-processed');
      bloque.innerHTML = bloque.dataset.fuente;
      const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
      try {
        const { svg } = await window.mermaid.render(id, bloque.dataset.fuente);
        bloque.innerHTML = svg;
      } catch (error) {
        bloque.innerHTML = `<div class="aviso aviso--peligro" style="text-align:left"><p class="aviso__titulo">Diagrama no disponible</p><p>${escapar(String(error?.message || error)).slice(0, 240)}</p></div>`;
      }
    }
  };

  /* --- Barra de progreso ------------------------------------------------ */
  const progreso = () => {
    const linea = document.getElementById('progreso-linea');
    if (!linea) return;
    const actualizar = () => {
      const alto = document.documentElement.scrollHeight - window.innerHeight;
      const avance = alto > 0 ? Math.min(1, Math.max(0, window.scrollY / alto)) : 0;
      linea.style.width = `${(avance * 100).toFixed(2)}%`;
    };
    actualizar();
    window.addEventListener('scroll', actualizar, { passive: true });
    window.addEventListener('resize', actualizar);
  };

  /* --- Arranque ---------------------------------------------------------- */
  const arrancar = () => {
    construirBarra();
    construirLateral();
    construirPie();
    construirToc();
    crearBuscador();
    prepararDrawer();
    prepararCodigo();
    progreso();
    aplicarTema(RAIZ.dataset.tema || 'oscuro');
    renderizarMermaid();
    document.dispatchEvent(new CustomEvent('meritia:listo'));
  };

  document.addEventListener('click', (e) => {
    const boton = e.target.closest('[data-accion="tema"]');
    if (!boton) return;
    aplicarTema(RAIZ.dataset.tema === 'claro' ? 'oscuro' : 'claro');
    renderizarMermaid();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arrancar);
  } else {
    arrancar();
  }
})();
