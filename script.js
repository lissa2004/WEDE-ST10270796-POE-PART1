document.addEventListener('DOMContentLoaded', () => {

//Part 3 Initialize Leaflet map if element exists
if(document.getElementById('map') && typeof L !== 'undefined'){
    const lat = -25.8583, lng = 25.6469;
    const map = L.map('map').setView([lat,lng],13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
    L.marker([lat,lng]).addTo(map).bindPopup('Perspective Cloud Accountants — Office').openPopup();
}

//Part 3 Accordion toggle functionality
document.querySelectorAll('.accordion-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const panel = btn.nextElementSibling;
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !expanded);
        if (!expanded) { panel.removeAttribute('hidden'); panel.classList.add('open'); }
        else { panel.classList.remove('open'); setTimeout(() => panel.setAttribute('hidden', ''), 350); }
    });
});

//Part 3 Tab functionality
document.querySelectorAll('[role="tab"]').forEach(tab => {
    tab.addEventListener('click', () => {
        const parent = tab.parentElement;
        parent.querySelectorAll('[role="tab"]').forEach(t => t.setAttribute('aria-selected', 'false'));
        document.querySelectorAll('[role="tabpanel"]').forEach(panel => { panel.setAttribute('hidden', ''); panel.classList.remove('active'); });
        tab.setAttribute('aria-selected', 'true');
        const panelID = tab.getAttribute('aria-controls');
        const panel = document.getElementById(panelID);
        panel.removeAttribute('hidden'); panel.classList.add('active');
    });
});

//Part 3 Scroll reveal for fade-in elements
const fadeElements = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.15 });
fadeElements.forEach(el => fadeObserver.observe(el));

//Part 3 Dynamic services list
const services = [
    { title: 'Financial Management', desc: 'Real-time reporting and budgeting', tags: 'financial' },
    { title: 'Technology Integration', desc: 'Cloud accounting setup', tags: 'tech' },
    { title: 'Governance Support', desc: 'SGB advisory', tags: 'governance' }
];
const container = document.getElementById('services-list');
if(container){
    services.forEach(s=>{
        const div = document.createElement('div');
        div.className = 'service-item';
        div.dataset.tags = s.tags;
        div.innerHTML = `<h3>${s.title}</h3><p>${s.desc}</p>`;
        container.appendChild(div);
    });
}

// Debounce helper for search inputs
function debounce(fn, delay=300){ let t; return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn(...args), delay); }; }


// Part 3 Load testimonials dynamically
    async function loadTestimonials(){
        try {
            const response = await fetch('data/testimonials.json');
            const data = await response.json();
            const testContainer = document.getElementById('testimonials-container');
            if(!testContainer) return;
            testContainer.innerHTML = ''; 
            data.forEach(item => {
                const card = document.createElement('div');
                card.classList.add('testimonial-card');
                card.innerHTML = `
                    <h3>${item.name}</h3>
                    <small>${item.role}</small>
                    <p>${item.message}</p>
                `;
                testContainer.appendChild(card);
            });
        } catch(error){
            console.error('Error loading testimonials:', error);
        }
    }

    loadTestimonials();

// Part 3 Contact form submission
const conForm = document.getElementById('contactForm');
const conResponse = document.getElementById('contact-response');
conForm?.addEventListener('submit', e=>{
    e.preventDefault();
    const name = document.getElementById('con-name').value.trim();
    const email = document.getElementById('con-email').value.trim();
    const phone = document.getElementById('con-phone').value.trim();
    const type = document.getElementById('con-type').value;
    const msg = document.getElementById('con-message').value.trim();
    if(!name||!email||!phone||!type||!msg){ conResponse.textContent="Please complete all fields."; conResponse.style.color="red"; return; }
    const subject = `New ${type} message from ${name}`;
    const body = `Name: ${name}%0AEmail: ${email}%0APhone: ${phone}%0AMessage:%0A${msg}`;
    window.location.href = `mailto:abbey@pcaccountants.co.za?subject=${subject}&body=${body}`;
    conResponse.textContent="Your message has been prepared in your email app."; conResponse.style.color="green";
});


// Part 3 Model 
// Modal elements
const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.getElementById('closeModal');
const modalSubmit = document.getElementById('modal-submit');
const modalEmail = document.getElementById('modal-email');
const modalMsg = document.getElementById('modal-msg');

// Open modal
openModalBtn.addEventListener('click', () => {
modal.classList.add('active');
modal.setAttribute('aria-hidden', 'false');
});

// Close modal
closeModalBtn.addEventListener('click', () => {
modal.classList.remove('active');
modal.setAttribute('aria-hidden', 'true');
modalMsg.textContent = ''; // 
modalEmail.value = '';     //
});

// Handle modal form submission
modalSubmit.addEventListener('click', () => {
const email = modalEmail.value.trim();
if(!email){
modalMsg.textContent = 'Please enter your email.';
modalMsg.style.color = 'red';
return;
}

// Show success message
modalMsg.textContent = 'Your request has been sent successfully!';
modalMsg.style.color = 'green';

// Close modal 
setTimeout(() => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    modalMsg.textContent = '';
    modalEmail.value = '';
}, 2000);

});

const serviceSearch = document.getElementById('service-search');

if (serviceSearch) {
    function filterServices() {
        const query = serviceSearch.value.toLowerCase().trim();
        const serviceItems = document.querySelectorAll('.service-item'); 
        let anyVisible = false;

        serviceItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            const isMatch = text.includes(query);
            item.style.display = isMatch ? 'block' : 'none';
            if (isMatch) anyVisible = true;
        });

        let noResultEl = document.getElementById('no-results');
        if (!noResultEl) {
            noResultEl = document.createElement('p');
            noResultEl.id = 'no-results';
            noResultEl.style.color = 'red';
            noResultEl.style.textAlign = 'center';
            noResultEl.style.marginTop = '10px';
            serviceSearch.parentElement.appendChild(noResultEl);
        }
        noResultEl.textContent = anyVisible ? '' : 'No services found.';
    }

    // Filter on input
    serviceSearch.addEventListener('input', filterServices);

    // Filter on Enter key
    serviceSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            filterServices();
        }
    });
}


});



