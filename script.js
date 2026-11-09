
document.addEventListener("DOMContentLoaded", () => {
    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // ==========================================
    // 1. CARREGAMENTO E ANO
    // ==========================================

    const loader = $("#loader");

    function hideLoader() {
        loader?.classList.add("loaded");
    }

    window.addEventListener("load", hideLoader, { once: true });
    setTimeout(hideLoader, 2500);

    $("#year").textContent = new Date().getFullYear();

    // ==========================================
    // 2. MENU RESPONSIVO
    // ==========================================

    const menuToggle = $("#menuToggle");
    const navigation = $("#navigation");

    function closeMenu() {
        navigation.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
        menuToggle.textContent = "☰";
    }

    menuToggle.addEventListener("click", () => {
        const isOpen =
            menuToggle.getAttribute("aria-expanded") === "true";

        navigation.classList.toggle("open", !isOpen);
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Abrir menu" : "Fechar menu"
        );
        menuToggle.textContent = isOpen ? "☰" : "✕";
    });

    // ==========================================
    // 3. ANIMAÇÕES AO ROLAR A PÁGINA
    // ==========================================

    const revealElements = $$(".reveal");

    if ("IntersectionObserver" in window && !reducedMotion) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealElements.forEach(element => observer.observe(element));
    } else {
        revealElements.forEach(element => element.classList.add("visible"));
    }

    // ==========================================
    // 4. PARTÍCULAS VERMELHAS
    // ==========================================

    const canvas = $("#particles");
    const ctx = canvas.getContext("2d");

    let particles = [];
    let width = 0;
    let height = 0;
    let animationId = null;

    const particleColors = [
        "237, 24, 56",
        "178, 14, 41",
        "100, 8, 24",
        "255, 100, 120"
    ];

    function createParticle() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.7 + 0.4,
            speed: Math.random() * 0.45 + 0.12,
            drift: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.55 + 0.15,
            phase: Math.random() * Math.PI * 2,
            color: particleColors[
                Math.floor(Math.random() * particleColors.length)
            ]
        };
    }

    function resizeCanvas() {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);

        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = width * ratio;
        canvas.height = height * ratio;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

        const count = Math.min(
            75,
            Math.max(20, Math.floor(width / 17))
        );

        particles = Array.from({ length: count }, createParticle);
        drawParticles();
    }

    function drawParticles() {
        if (document.hidden || reducedMotion) return;

        ctx.clearRect(0, 0, width, height);

        particles.forEach(particle => {
            particle.phase += 0.025;
            particle.y -= particle.speed;
            particle.x += particle.drift + Math.sin(particle.phase) * 0.12;

            if (particle.y < -5) {
                particle.y = height + 5;
                particle.x = Math.random() * width;
            }

            if (particle.x < 0) particle.x = width;
            if (particle.x > width) particle.x = 0;

            ctx.beginPath();
            ctx.arc(
                particle.x,
                particle.y,
                particle.radius,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(${particle.color}, ${particle.alpha})`;

            ctx.fill();
        });

        animationId = requestAnimationFrame(drawParticles);
    }

    resizeCanvas();

    window.addEventListener("resize", () => {
        if (animationId !== null) {
            cancelAnimationFrame(animationId);
        }
        resizeCanvas();
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
            animationId = null;
        } else {
            drawParticles();
        }
    });

    // ==========================================
    // 5. PERSONAGENS
    // Substitua pelos dados reais do seu livro.
    // ==========================================

    const characters = {
        isabella: {
            label: "ARQUIVO 001 • O ENIGMA",
            name: "Isabella Morningstar",
            paragraphs: [
                "Forte, sarcástica, orgulhosa e enigmática, Isabella é uma presença impossível de ignorar.",
                "Seus cabelos cacheados vermelhos e seus olhos de tonalidades incomuns parecem combinar com o mistério que a acompanha.",
                "Ela conhece fragmentos do passado, mas ainda não sabe quais deles foram cuidadosamente escondidos."
            ],
            secret: "REGISTRO RESTRITO: um documento antigo menciona seu nome antes mesmo de seu nascimento."
        },

        damien: {
            label: "ARQUIVO 002 • O PERIGO",
            name: "Damien Blackwood",
            paragraphs: [
                "Elegante, calculista e reservado, Damien raramente revela suas verdadeiras intenções.",
                "Ele parece conhecer detalhes que nunca foram compartilhados com ele.",
                "Sua ligação com Isabella pode esconder uma promessa antiga."
            ],
            secret: "REGISTRO RESTRITO: seu passado contém uma lacuna que ninguém consegue explicar."
        },

        seraphine: {
            label: "ARQUIVO 003 • A MÁSCARA",
            name: "Seraphine Vale",
            paragraphs: [
                "Inteligente e observadora, Seraphine sabe que informação é uma forma de poder.",
                "Ela sempre parece estar um passo à frente, mas suas contradições levantam suspeitas.",
                "A pergunta não é o que ela sabe, mas por que decidiu permanecer em silêncio."
            ],
            secret: "REGISTRO RESTRITO: uma carta desapareceu depois de sua última visita à propriedade."
        },

        lucien: {
            label: "ARQUIVO 004 • O IMPOSSÍVEL",
            name: "Lucien Ravenscroft",
            paragraphs: [
                "Ligado a uma família antiga e a registros misteriosos, Lucien parece carregar lembranças de uma época que não viveu.",
                "Sua presença está associada a acontecimentos que desafiam qualquer explicação racional.",
                "Ninguém sabe se ele protege um segredo ou se é parte dele."
            ],
            secret: "REGISTRO RESTRITO: um retrato centenário apresenta alguém com sua aparência."
        }
    };

    // ==========================================
    // 6. MODAL DOS PERSONAGENS
    // ==========================================

    const characterModal = $("#characterModal");
    const modalTitle = $("#modalTitle");
    const modalLabel = $("#modalLabel");
    const modalContent = $("#modalContent");

    let previousFocus = null;

    function openCharacter(character) {
        if (!character) return;

        previousFocus = document.activeElement;

        modalLabel.textContent = character.label;
        modalTitle.textContent = character.name;
        modalContent.replaceChildren();

        character.paragraphs.forEach(text => {
            const paragraph = document.createElement("p");
            paragraph.textContent = text;
            modalContent.appendChild(paragraph);
        });

        const secret = document.createElement("p");
        secret.className = "classified";
        secret.textContent = character.secret;
        secret.style.cssText =
            "padding:15px;border-left:2px solid #ed1838;background:rgba(100,0,20,.15);";

        modalContent.appendChild(secret);

        characterModal.classList.add("visible");
        characterModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");

        $(".modal-close", characterModal).focus();
    }

    function closeCharacterModal() {
        characterModal.classList.remove("visible");
        characterModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");

        if (previousFocus) previousFocus.focus();
    }

    $$(".character-card").forEach(card => {
        const show = () => openCharacter(characters[card.dataset.character]);

        card.addEventListener("click", show);

        card.addEventListener("keydown", event => {
            if (
                event.target === card &&
                (event.key === "Enter" || event.key === " ")
            ) {
                event.preventDefault();
                show();
            }
        });
    });

    $$("[data-close-modal]").forEach(element => {
        element.addEventListener("click", closeCharacterModal);
    });

    // ==========================================
    // 7. DIÁRIO SECRETO
    // ==========================================

    const diaryForm = $("#diaryForm");
    const passwordInput = $("#diaryPassword");
    const feedback = $("#diaryFeedback");
    const diaryLock = $("#diaryLock");
    const secretDiary = $("#secretDiary");

    /*
      Palavras-chave de demonstração:
      rosa
      morningstar
      meia-noite

      Para adicionar outra palavra, inclua uma entrada
      no objeto diaryPages abaixo.
    */

    const diaryPages = {
        rosa: [
            {
                title: "A rosa da meia-noite",
                text: "A rosa não foi deixada por acaso. Sua fita negra carrega um símbolo que aparece em documentos antigos da família. Alguém deseja que Isabella descubra a verdade, mas não quer ser identificado."
            },
            {
                title: "O símbolo esquecido",
                text: "O desenho gravado na fita aparece em um retrato antigo. No verso da moldura, uma frase foi escrita à mão: algumas promessas sobrevivem até mesmo à morte."
            },
            {
                title: "A testemunha",
                text: "Uma pessoa viu a rosa ser colocada diante da porta. Contudo, seu depoimento desapareceu do arquivo na manhã seguinte. O nome da testemunha foi removido de todas as cópias."
            },
            {
                title: "A última página",
                text: "Se você chegou até aqui, compreendeu que a rosa era apenas o começo. A próxima pista não está na propriedade, mas em uma carta que ainda não foi entregue."
            }
        ],

        morningstar: [
            {
                title: "O nome Morningstar",
                text: "Em um registro antigo, o sobrenome Morningstar aparece ao lado de um símbolo desconhecido. A data é anterior à existência dos documentos oficiais da família."
            },
            {
                title: "A herança",
                text: "Uma cláusula esquecida menciona uma herança que não pode ser transferida. Ninguém sabe se ela representa uma fortuna, uma obrigação ou um segredo."
            },
            {
                title: "A fotografia",
                text: "Na fotografia, uma figura aparece parcialmente escondida pela sombra. A semelhança é perturbadora, mas o rosto permanece impossível de identificar."
            },
            {
                title: "O arquivo final",
                text: "O sobrenome não explica tudo. É preciso descobrir quem o registrou, por que o documento foi escondido e quem continua procurando por ele."
            }
        ],

        "meia-noite": [
            {
                title: "Quando o relógio para",
                text: "Todos os relatos mencionam a mesma hora. O relógio da propriedade para por alguns segundos e, nesse intervalo, alguém escuta passos no corredor vazio."
            },
            {
                title: "O corredor",
                text: "As portas permanecem trancadas, mas uma delas apresenta marcas recentes. Atrás da parede existe um espaço que não aparece em nenhuma planta da casa."
            },
            {
                title: "A voz",
                text: "A gravação contém uma voz quase inaudível. Ela pronuncia um nome e, logo depois, o som desaparece. O arquivo foi criado antes da chegada dos moradores atuais."
            },
            {
                title: "A hora marcada",
                text: "O relógio volta a funcionar normalmente. Sobre a mesa, porém, há um papel com uma única frase: não abra a porta quando ouvir seu próprio nome."
            }
        ]
    };

    let currentPages = [];
    let currentPageIndex = 0;

    function normalizeKeyword(value) {
        return value
            .trim()
            .toLocaleLowerCase("pt-BR")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    // O formulário usa palavras normalizadas para facilitar a digitação.
    const keywordLookup = new Map();

    Object.keys(diaryPages).forEach(keyword => {
        keywordLookup.set(normalizeKeyword(keyword), keyword);
    });

    function renderDiaryPage() {
        const page = currentPages[currentPageIndex];

        $("#diaryPageTitle").textContent = page.title;

        const content = $("#diaryPageContent");
        const paragraph = document.createElement("p");
        paragraph.textContent = `“${page.text}”`;
        content.replaceChildren(paragraph);

        $("#pageNumber").textContent =
            `${String(currentPageIndex + 1).padStart(2, "0")} / ` +
            `${String(currentPages.length).padStart(2, "0")}`;

        $("#previousPage").disabled = currentPageIndex === 0;
        $("#nextPage").disabled =
            currentPageIndex === currentPages.length - 1;

        $("#previousPage").style.opacity =
            currentPageIndex === 0 ? ".4" : "1";

        $("#nextPage").style.opacity =
            currentPageIndex === currentPages.length - 1 ? ".4" : "1";

        content.classList.remove("page-animation");
        void content.offsetWidth;
        content.classList.add("page-animation");
    }

    diaryForm.addEventListener("submit", event => {
        event.preventDefault();

        const input = normalizeKeyword(passwordInput.value);
        const keyword = keywordLookup.get(input);

        if (!keyword) {
            feedback.textContent =
                "A palavra não abriu este arquivo. Procure outra pista.";
            passwordInput.value = "";
            passwordInput.focus();
            return;
        }

        currentPages = diaryPages[keyword];
        currentPageIndex = 0;

        renderDiaryPage();

        diaryLock.classList.add("hidden");
        secretDiary.classList.remove("hidden");
        secretDiary.setAttribute("aria-hidden", "false");

        feedback.textContent = "";
        passwordInput.value = "";

        $("#lockDiary").focus();
    });

    $("#togglePassword").addEventListener("click", () => {
        const showing = passwordInput.type === "text";
        passwordInput.type = showing ? "password" : "text";

        $("#togglePassword").setAttribute(
            "aria-label",
            showing ? "Mostrar palavra-chave" : "Ocultar palavra-chave"
        );
    });

    $("#previousPage").addEventListener("click", () => {
        if (currentPageIndex > 0) {
            currentPageIndex--;
            renderDiaryPage();
        }
    });

    $("#nextPage").addEventListener("click", () => {
        if (currentPageIndex < currentPages.length - 1) {
            currentPageIndex++;
            renderDiaryPage();
        }
    });

    $("#lockDiary").addEventListener("click", () => {
        secretDiary.classList.add("hidden");
        secretDiary.setAttribute("aria-hidden", "true");
        diaryLock.classList.remove("hidden");
        passwordInput.focus();
    });

    // ==========================================
    // 8. GALERIA AMPLIADA
    // ==========================================

    const galleryItems = $$(".gallery-item");
    const lightbox = $("#lightbox");
    const lightboxImage = $("#lightboxImage");
    const lightboxCaption = $("#lightboxCaption");

    let currentImageIndex = 0;
    let galleryFocus = null;

    function showGalleryImage(index) {
        if (!galleryItems.length) return;

        currentImageIndex =
            (index + galleryItems.length) % galleryItems.length;

        const item = galleryItems[currentImageIndex];
        const image = $("img", item);

        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;

        lightboxCaption.textContent =
            item.dataset.caption || image.alt;
    }

    function openGallery(index) {
        galleryFocus = document.activeElement;
        showGalleryImage(index);

        lightbox.classList.add("visible");
        lightbox.setAttribute("aria-hidden", "false");

        $(".lightbox-close").focus();
    }

    function closeGallery() {
        lightbox.classList.remove("visible");
        lightbox.setAttribute("aria-hidden", "true");
        lightboxImage.removeAttribute("src");

        if (galleryFocus) galleryFocus.focus();
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener("click", () => openGallery(index));
    });

    $(".lightbox-close").addEventListener("click", closeGallery);

    $(".lightbox-prev").addEventListener("click", () => {
        showGalleryImage(currentImageIndex - 1);
    });

    $(".lightbox-next").addEventListener("click", () => {
        showGalleryImage(currentImageIndex + 1);
    });

    lightbox.addEventListener("click", event => {
        if (event.target === lightbox) closeGallery();
    });

    // ==========================================
    // 9. MENU ATIVO CONFORME A SEÇÃO
    // ==========================================

    const navLinks = $$(".navigation a");

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                navLinks.forEach(link => {
                    const active =
                        link.getAttribute("href") === `#${entry.target.id}`;

                    link.classList.toggle("active", active);
                });
            });
        }, {
            rootMargin: "-20% 0px -65% 0px"
        });

        navLinks.forEach(link => {
            const section = $(link.getAttribute("href"));
            if (section) sectionObserver.observe(section);
        });
    }

    // Navegação suave e fechamento do menu.
    navLinks.forEach(link => {
        link.addEventListener("click", event => {
            const target = $(link.getAttribute("href"));
            if (!target) return;

            event.preventDefault();
            closeMenu();

            target.scrollIntoView({
                behavior: reducedMotion ? "auto" : "smooth",
                block: "start"
            });

            history.replaceState(null, "", link.getAttribute("href"));
        });
    });

    // ==========================================
    // 10. TECLADO
    // ==========================================

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            if (characterModal.classList.contains("visible")) {
                closeCharacterModal();
            }

            if (lightbox.classList.contains("visible")) {
                closeGallery();
            }

            closeMenu();
        }

        if (lightbox.classList.contains("visible")) {
            if (event.key === "ArrowRight") {
                showGalleryImage(currentImageIndex + 1);
            }

            if (event.key === "ArrowLeft") {
                showGalleryImage(currentImageIndex - 1);
            }
        }
    });
});
