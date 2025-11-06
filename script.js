// script.js

// Initialize Feather Icons
feather.replace();

// Theme toggle
const themeToggle = document.getElementById('theme_toggle');
const html = document.documentElement;

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        
        const icon = html.classList.contains('dark') ? 'sun' : 'moon';
        themeToggle.innerHTML = `<i data-feather="${icon}"></i>`;
        localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
        feather.replace();
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        html.classList.add('dark');
        themeToggle.innerHTML = '<i data-feather="sun"></i>';
    } else {
        html.classList.remove('dark');
        themeToggle.innerHTML = '<i data-feather="moon"></i>';
    }
    feather.replace();
}

// Mobile menu toggle
const menuToggle = document.getElementById('menu_toggle');
const mobileMenu = document.getElementById('mobile_menu');

if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const icon = mobileMenu.classList.contains('hidden') ? 'menu' : 'x';
        menuToggle.innerHTML = `<i data-feather="${icon}"></i>`;
        feather.replace();
    });
}

// Новый модал для выбора мессенджера
const messengerModal = document.getElementById('messenger_modal');
const messengerOverlay = document.getElementById('messenger_overlay');
const messengerClose = document.getElementById('messenger_close');
const whatsappChoice = document.getElementById('whatsapp_choice');
const telegramChoice = document.getElementById('telegram_choice');

let currentMessage = ''; // Глобальная переменная для хранения сообщения

function showMessengerChoice(message) {
    currentMessage = message;
    if (messengerModal) {
        messengerModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeMessengerModal() {
    if (messengerModal) {
        messengerModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// Обработчики для модала мессенджера
if (messengerClose) {
    messengerClose.addEventListener('click', closeMessengerModal);
}
if (messengerOverlay) {
    messengerOverlay.addEventListener('click', closeMessengerModal);
}
if (whatsappChoice) {
    whatsappChoice.addEventListener('click', () => {
        const phone = '+79114562713';
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(currentMessage)}`;
        window.open(url, '_blank');
        closeMessengerModal();
    });
}
if (telegramChoice) {
    telegramChoice.addEventListener('click', () => {
        const url = `https://t.me/VyaheslavIsaev?text=${encodeURIComponent(currentMessage)}`;
        window.open(url, '_blank');
        closeMessengerModal();
    });
}

// Обработчик для кнопки WhatsApp (теперь button)
const whatsappBtn = document.getElementById('whatsapp_btn');
if (whatsappBtn) {
    whatsappBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const defaultMessage = 'Здравствуйте! Хочу узнать о ваших услугах по ремонту.';
        showMessengerChoice(defaultMessage);
    });
}

// Contact form to Messenger Choice
const contactForm = document.getElementById('contact_form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value || 'Без сообщения';
        
        const fullMessage = `Заявка с сайта:\nИмя: ${name}\nТелефон: ${phone}\nСообщение: ${message}`;
        
        showMessengerChoice(fullMessage);
        contactForm.reset(); // Сбрасываем форму после показа модала
    });
}

// Brands slider interaction (improved with faster animation and better manual control)
const brandsSlider = document.querySelector('.brands_slider');
const brandsTrack = document.querySelector('.brands_track');

if (brandsSlider && brandsTrack) {
    let isPaused = false;
    let isInteracting = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationDuration = 20000; // Accelerated to 20s
    let uniqueWidth = 0;
    let animationId = null;
    let resumeTimeout = null;

    const pauseAnimation = () => {
        if (isPaused) return;
        brandsTrack.style.animationPlayState = 'paused';
        isPaused = true;
        if (resumeTimeout) clearTimeout(resumeTimeout);
    };

    const resumeAnimation = () => {
        if (!isPaused || isInteracting) return;
        brandsTrack.style.animationPlayState = 'running';
        isPaused = false;
    };

    const startInteraction = () => {
        isInteracting = true;
        pauseAnimation();
        if (resumeTimeout) clearTimeout(resumeTimeout);
    };

    const endInteraction = () => {
        isInteracting = false;
        // Resume after 2 seconds of inactivity
        resumeTimeout = setTimeout(() => {
            if (!isInteracting) {
                resumeAnimation();
            }
        }, 2000);
    };

    // Pause on hover/focus
    brandsSlider.addEventListener('mouseenter', startInteraction);
    brandsSlider.addEventListener('mouseleave', endInteraction);
    brandsSlider.addEventListener('focusin', startInteraction);
    brandsSlider.addEventListener('focusout', endInteraction);

    // Function to adjust animation delay based on position (for seamless resume)
    const adjustAnimationDelay = () => {
        if (uniqueWidth === 0) {
            uniqueWidth = brandsTrack.scrollWidth / 2;
        }
        const percentage = Math.max(0, Math.min(1, -currentTranslate / uniqueWidth));
        const progressMs = percentage * animationDuration;
        const delay = -(progressMs % animationDuration);
        brandsTrack.style.animationDelay = `${delay}ms`;
    };

    // Mouse drag for desktop
    brandsSlider.addEventListener('mousedown', (e) => {
        startInteraction();
        isInteracting = true;
        startX = e.pageX;
        prevTranslate = currentTranslate;
        brandsTrack.style.transition = 'none';
        e.preventDefault();
    });

    brandsSlider.addEventListener('mousemove', (e) => {
        if (!isInteracting) return;
        const x = e.pageX;
        currentTranslate = prevTranslate + (x - startX);
        brandsTrack.style.transform = `translateX(${currentTranslate}px)`;
        adjustAnimationDelay();
    });

    brandsSlider.addEventListener('mouseup', () => {
        if (!isInteracting) return;
        brandsTrack.style.transition = 'transform 0.3s ease';
        endInteraction();
    });

    brandsSlider.addEventListener('mouseleave', () => {
        if (isInteracting) {
            brandsTrack.style.transition = 'transform 0.3s ease';
            endInteraction();
        }
    });

    // Improved wheel support for horizontal scrolling (convert vertical wheel to horizontal)
    let wheelTimeout;
    brandsSlider.addEventListener('wheel', (e) => {
        e.preventDefault();
        startInteraction();
        
        // Use deltaX if available, else convert deltaY to horizontal
        const delta = e.deltaX !== 0 ? e.deltaX : (e.deltaY > 0 ? -50 : 50);
        currentTranslate += delta;
        brandsTrack.style.transform = `translateX(${currentTranslate}px)`;
        brandsTrack.style.transition = 'none';
        adjustAnimationDelay();

        // Clear previous timeout
        if (wheelTimeout) clearTimeout(wheelTimeout);
        // Resume after short delay if no more wheel events
        wheelTimeout = setTimeout(() => {
            brandsTrack.style.transition = 'transform 0.3s ease';
            endInteraction();
        }, 150);
    }, { passive: false });

    // Touch support for mobile
    brandsSlider.addEventListener('touchstart', (e) => {
        startInteraction();
        const touch = e.touches[0];
        startX = touch.pageX;
        prevTranslate = currentTranslate;
        brandsTrack.style.transition = 'none';
    }, { passive: true });

    brandsSlider.addEventListener('touchmove', (e) => {
        if (!isInteracting) return;
        e.preventDefault();
        const touch = e.touches[0];
        const x = touch.pageX;
        currentTranslate = prevTranslate + (x - startX);
        brandsTrack.style.transform = `translateX(${currentTranslate}px)`;
        adjustAnimationDelay();
    }, { passive: false });

    brandsSlider.addEventListener('touchend', () => {
        if (!isInteracting) return;
        brandsTrack.style.transition = 'transform 0.3s ease';
        endInteraction();
    }, { passive: true });
}

// Projects dynamic loading
const projectsData = [
    {
        image: 'src/bathrooms/grok-video-12fb785a-aab6-4b46-8236-90bbdfb1b556-5.mp4',
        alt: 'Дизайн ванной комнаты',
        title: 'Современные ванные комнаты',
        desc: 'Эргономичные решения с premium-отделкой и умным зонированием пространства',
        status: 'completed',
        statusText: 'реализованны',
        link: '#',
        images: [
            'src/bathrooms/bathrooms1.jpg',
            'src/bathrooms/bathrooms2.jpg',
            'src/bathrooms/bathrooms4.jpg',
            'src/bathrooms/bathrooms3.jpg',
            'src/bathrooms/bathrooms5.jpg',
            'src/bathrooms/bathrooms6.jpg',
            'src/bathrooms/bathrooms7.jpg',
            'src/bathrooms/bathrooms8.jpg',
        ]
    },
    {
        image: 'src/rooms/grok-video-53242f51-ef67-4572-ae08-9697cfbbda8b-4.mp4',
        alt: 'Интерьер спальни',
        title: 'Авторские спальни',
        desc: 'Индивидуальные проекты с продуманными системами хранения и атмосферой релакса',
        status: 'completed',
        statusText: 'реализованны',
        link: '#',
        images: [
            'src/rooms/rooms1.jpg',
            'src/rooms/rooms2.jpg',
            'src/rooms/rooms3.jpg',
            'src/rooms/rooms4.jpg',
            'src/rooms/rooms5.jpg',
            'src/rooms/rooms6.jpg',
            'src/rooms/rooms7.jpg',
            'src/rooms/rooms8.jpg',
            'src/rooms/rooms9.jpg',
            'src/rooms/rooms10.jpg',
        ]
    },
    {
        image: 'src/Kitchen/grok-video-ca55c9c3-0c86-4a2d-ab9d-fdd9eed59fee-0.mp4',
        alt: 'Дизайн кухни',
        title: 'Кухни-Столовые',
        desc: 'Многофункциональные кухонные пространства со скрытыми коммуникациями и техникой',
        status: 'completed',
        statusText: 'реализованны',
        link: '#',
        images: [
            'src/Kitchen/Kitchen1.jpg',
            'src/Kitchen/Kitchen2.jpg',
            'src/Kitchen/Kitchen3.jpg',
            'src/Kitchen/Kitchen4.jpg',
            'src/Kitchen/Kitchen5.jpg',
            'src/Kitchen/Kitchen6.jpg',
            'src/Kitchen/Kitchen7.jpg',
        ]
    },
    {
        image: 'src/livingroom/grok-video-558430c4-add0-43e2-8761-dc20fc3e3726-4.mp4',
        alt: 'Интерьер гостиной',
        title: 'Многофункциональные гостиные',
        desc: 'Комплексные решения для семейного отдыха и приема гостей с кастомной мебелью',
        status: 'completed',
        statusText: 'реализованны',
        link: '#',
        images: [
            'src/livingroom/livingroom1.jpg',
            'src/livingroom/livingroom2.jpg',
            'src/livingroom/livingroom3.jpg',
            'src/livingroom/livingroom4.jpg',
            'src/livingroom/livingroom5.jpg',
        ]
    },
];

let loadedProjects = 0;
let initialProjectsCount = 0;
let currentProjectIndex = -1;
const projectsGrid = document.getElementById('projects_grid');
const loadMoreBtn = document.getElementById('load_more_projects');
const collapseBtn = document.getElementById('collapse_projects');
const totalProjects = projectsData.length;
const modal = document.getElementById('project_modal');
const modalTitle = document.getElementById('modal_title');
const modalDesc = document.getElementById('modal_desc');
const modalStatus = document.getElementById('modal_status');
const galleryTrack = document.getElementById('gallery_track');
const totalImages = document.getElementById('total_images');
const currentImage = document.getElementById('current_image');
const prevBtn = document.getElementById('prev_btn');
const nextBtn = document.getElementById('next_btn');
const modalClose = document.getElementById('modal_close');
const modalOverlay = document.getElementById('modal_overlay');

function getProjectsPerLoad() {
    const isAndroid = /Android/i.test(navigator.userAgent);
    if (isAndroid) {
        return 1;
    } else {
        return window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 768 ? 2 : 1);
    }
}

function createProjectCard(project, index) {
    const statusClass = project.status === 'completed' ? 'completed' : 'in_progress';
    const isVideo = project.image.toLowerCase().endsWith('.mp4');
    const mediaElement = isVideo
        ? `<video src="${project.image}" alt="${project.alt}" class="project_image" muted autoplay loop></video>`
        : `<img src="${project.image}" alt="${project.alt}" class="project_image">`;
    return `
        <div class="project_card">
            ${mediaElement}
            <div class="project_info">
                <h3 class="project_title">${project.title}</h3>
                <p class="project_desc">${project.desc}</p>
                <div class="project_footer">
                    <span class="project_status ${statusClass}">${project.statusText}</span>
                    <a href="#" class="project_link" data-project="${index}">Смотреть все фото</a>
                </div>
            </div>
        </div>
    `;
}

function loadProjects(count) {
    const projectsToLoad = projectsData.slice(loadedProjects, loadedProjects + count);
    projectsToLoad.forEach((project, relativeIndex) => {
        const globalIndex = loadedProjects + relativeIndex;
        projectsGrid.insertAdjacentHTML('beforeend', createProjectCard(project, globalIndex));
    });
    loadedProjects += count;
    const remaining = totalProjects - loadedProjects;
    if (remaining > 0) {
        loadMoreBtn.textContent = `Показать ещё (${remaining})`;
    } else {
        loadMoreBtn.textContent = 'Все проекты загружены';
        loadMoreBtn.disabled = true;
    }
    if (loadedProjects > initialProjectsCount) {
        collapseBtn.classList.remove('hidden');
    }
    attachProjectListeners();
}

function loadMoreHandler(e) {
    e.preventDefault();
    const perLoad = getProjectsPerLoad();
    loadProjects(perLoad);
}

function collapseProjectsHandler(e) {
    e.preventDefault();
    // Remove all cards except the initial ones
    const cards = projectsGrid.querySelectorAll('.project_card');
    for (let i = initialProjectsCount; i < cards.length; i++) {
        cards[i].remove();
    }
    loadedProjects = initialProjectsCount;
    loadMoreBtn.textContent = `Показать ещё (${totalProjects - loadedProjects})`;
    loadMoreBtn.disabled = false;
    collapseBtn.classList.add('hidden');
    // Scroll to top of section
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
}

function attachProjectListeners() {
    const links = projectsGrid.querySelectorAll('.project_link');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const index = parseInt(e.currentTarget.dataset.project);
            showProjectModal(index);
        });
    });
}

function showProjectModal(index) {
    const project = projectsData[index];
    currentProjectIndex = index;
    modalTitle.textContent = project.title;
    modalDesc.textContent = project.desc;
    const statusClass = project.status === 'completed' ? 'completed' : 'in_progress';
    modalStatus.textContent = project.statusText;
    modalStatus.className = `project_status ${statusClass}`;
    
    // Load images
    galleryTrack.innerHTML = '';
    project.images.forEach(imgSrc => {
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = project.title;
        img.className = 'gallery_image';
        galleryTrack.appendChild(img);
    });
    totalImages.textContent = project.images.length;
    currentImageSpan = 1;
    currentImage.textContent = `1 / ${project.images.length}`;
    
    // Reset slider
    galleryTrack.style.transform = 'translateX(0)';
    currentImageSpan = 1;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

let currentImageSpan = 1;
function nextGallery() {
    const total = projectsData[currentProjectIndex].images.length;
    if (currentImageSpan < total) {
        currentImageSpan++;
        galleryTrack.style.transform = `translateX(-${(currentImageSpan - 1) * 100}%)`;
        currentImage.textContent = `${currentImageSpan} / ${total}`;
    }
}

function prevGallery() {
    if (currentImageSpan > 1) {
        currentImageSpan--;
        galleryTrack.style.transform = `translateX(-${(currentImageSpan - 1) * 100}%)`;
        currentImage.textContent = `${currentImageSpan} / ${totalImages.textContent}`;
    }
}

// Event listeners for modal
if (modalClose) modalClose.addEventListener('click', () => {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
});
if (modalOverlay) modalOverlay.addEventListener('click', () => {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
});
if (nextBtn) nextBtn.addEventListener('click', nextGallery);
if (prevBtn) prevBtn.addEventListener('click', prevGallery);

// Brands dynamic loading
const brandsData = [
    {
        image: 'https://cdn1.flamp.ru/28cf205b76c8cbf7ae5fa5bca7641f23.png',
        name: 'Керасфера'
    },
    {
        image: 'https://static.tildacdn.com/tild6535-6333-4037-b966-323539383566/874cbdd5-82ca-478e-a.jpg',
        name: 'OTTINGER'
    },
    {
        image: 'https://pic.rutubelist.ru/user/5c/22/5c22513177ced4ef436553969dd9d7f8.jpg',
        name: 'Лемана ПРО'
    },
    {
        image: 'https://avatars.mds.yandex.net/i?id=4c05b60d6296e20c5c13a87b43e31fff_l-10256307-images-thumbs&n=13',
        name: 'Бауцентр'
    },
    {
        image: 'https://avatars.mds.yandex.net/get-market-shop-logo/1531890/2a000001890c2dfcd84ebf214d987d6cbefe/orig',
        name: 'АБК Фасад'
    },
    {
        image: 'https://sun1-90.userapi.com/s/v1/if1/XQGV4HHhHotzV8Z2GBRniDy9KXLZw_fhcEQ1uF3zOEZFGU2bRxsEoa0qo6dLUBaTcXgkNeaQ.jpg?quality=96&crop=56,56,288,288&as=32x32,48x48,72x72,108x108,160x160,240x240&ava=1&cs=200x200',
        name: 'АэроБлок'
    },
    {
        image: 'https://megadveri39.ru/wp-content/uploads/2022/01/tdstroitel_logo_400x400.png?v=1641807887',
        name: 'Торговый дом Строитель'
    },
    {
        image: 'https://static.tildacdn.com/tild6333-6537-4330-b936-613239656536/Frame_15.png',
        name: 'Балтламинат'
    }
];

function generateBrandsSlider() {
    const track = document.querySelector('.brands_track');
    if (!track) return;
    const uniqueBrands = brandsData.map(brand => `
        <div class="brand_card">
            <img src="${brand.image}" alt="${brand.name}" class="brand_logo">
            <span class="brand_name">${brand.name}</span>
        </div>
    `).join('');
    track.innerHTML = uniqueBrands + uniqueBrands; // Duplicate for seamless infinite scroll
}

if (loadMoreBtn) {
    loadMoreBtn.onclick = loadMoreHandler;
}

if (collapseBtn) {
    collapseBtn.onclick = collapseProjectsHandler;
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    feather.replace();
    initialProjectsCount = getProjectsPerLoad();
    loadProjects(initialProjectsCount);
    generateBrandsSlider();
});