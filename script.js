document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // --- Theme Logic ---
    body.classList.add('theme-dark');
    localStorage.setItem('theme', 'theme-dark');
    updateThemeToggleIcon('theme-dark');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.remove('theme-light', 'theme-dark');
        body.classList.add(savedTheme);
        updateThemeToggleIcon(savedTheme);
    } else {
        updateThemeToggleIcon('theme-dark');
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('theme-dark')) {
            body.classList.remove('theme-dark');
            body.classList.add('theme-light');
            localStorage.setItem('theme', 'theme-light');
            updateThemeToggleIcon('theme-light');
        } else {
            body.classList.remove('theme-light');
            body.classList.add('theme-dark');
            localStorage.setItem('theme', 'theme-dark');
            updateThemeToggleIcon('theme-dark');
        }
    });

    function updateThemeToggleIcon(currentTheme) {
        const icon = themeToggle.querySelector('i');
        if (currentTheme === 'theme-dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }


    // --- Fetch Content from content.json ---
    fetch('content.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - Could not load content.json. Please check file path and content.`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Data from content.json (received by JS):", data); // <<<--- PENTING: Periksa objek ini di konsol untuk melihat semua datanya

            // --- Global Data ---
            document.getElementById('logo-text').textContent = data.profile && data.profile.logo_text ? data.profile.logo_text : 'Portfolio';
            document.getElementById('footer-name').textContent = data.profile && data.profile.name ? data.profile.name : 'Your Name';
            document.getElementById('current-year').textContent = new Date().getFullYear();

            // --- Hero Section ---
            document.getElementById('hero-name').innerHTML = (data.profile && data.profile.first_name ? `<span>${data.profile.first_name}</span> ` : '') + (data.profile && data.profile.last_name ? data.profile.last_name : 'Your Name');
            document.getElementById('hero-title').textContent = data.profile && data.profile.title ? data.profile.title : 'Professional Title';
            document.getElementById('profile-pic').src = data.profile && data.profile.profile_picture ? data.profile.profile_picture : '';
            document.getElementById('profile-pic').alt = data.profile && data.profile.name ? `Profile Picture of ${data.profile.name}` : 'Profile Picture';

            const heroSocialLinksDiv = document.getElementById('hero-social-links');
            heroSocialLinksDiv.innerHTML = '';
            const filteredSocialLinks = (data.social_links && Array.isArray(data.social_links)) ? data.social_links.filter(link =>
                link.platform === 'LinkedIn' || link.platform === 'Twitter' || link.platform === 'Instagram'
            ) : [];
            if (filteredSocialLinks.length > 0) {
                filteredSocialLinks.forEach(link => {
                    const a = document.createElement('a');
                    a.href = link.url;
                    a.target = "_blank";
                    a.setAttribute('aria-label', link.platform);
                    a.innerHTML = `<i class="${link.icon}"></i>`;
                    heroSocialLinksDiv.appendChild(a);
                });
            } else {
                 heroSocialLinksDiv.innerHTML = `<p style="color: var(--text-muted); font-size:0.9em; margin-top: 10px;">No social links available.</p>`;
            }

            // --- About Section ---
            document.getElementById('about-description-paragraph1').textContent = data.about && data.about.description_p1 ? data.about.description_p1 : 'Description paragraph 1 not available.';
            document.getElementById('about-description-paragraph2').textContent = data.about && data.about.description_p2 ? data.about.description_p2 : 'Description paragraph 2 not available.';
            document.getElementById('about-image-src').src = data.about && data.about.about_image ? data.about.about_image : '';
            document.getElementById('about-image-src').alt = data.profile && data.profile.name ? `About ${data.profile.name}` : 'About Image';

            const aboutDetailsBlocksWrapper = document.getElementById('about-details-blocks');
            aboutDetailsBlocksWrapper.innerHTML = '';
            if (data.about_details_sections && Array.isArray(data.about_details_sections)) {
                data.about_details_sections.forEach(section => {
                    const detailBlock = document.createElement('div');
                    detailBlock.classList.add('about-detail-block');
                    const title = document.createElement('h4');
                    title.textContent = section.title;
                    detailBlock.appendChild(title);
                    const ul = document.createElement('ul');
                    if (section.items && Array.isArray(section.items)) {
                        section.items.forEach(item => {
                            const li = document.createElement('li');
                            li.textContent = item;
                            ul.appendChild(li);
                        });
                    }
                    detailBlock.appendChild(ul);
                    aboutDetailsBlocksWrapper.appendChild(detailBlock);
                });
            } else {
                console.warn("data.about_details_sections is missing or not an array. Skipping about details population.");
                aboutDetailsBlocksWrapper.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 20px; grid-column: 1 / -1;">About details data is missing or not an array.</p>`;
            }


            // --- Experience & Education Section (Tabs) ---
            const experienceTabPane = document.getElementById('experience-pane');
            const educationTabPane = document.getElementById('education-pane');
            experienceTabPane.innerHTML = '';
            educationTabPane.innerHTML = '';

            console.log("Processing Experience data (JS sees):", data.experience); // <<<--- PENTING: Cek ini di konsol
            if (data.experience && Array.isArray(data.experience)) {
                if (data.experience.length === 0) {
                    experienceTabPane.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 20px;">No experience data available.</p>`;
                } else {
                    data.experience.forEach(exp => {
                        console.log("Adding Experience item:", exp.position); // Debugging tiap item
                        const expItem = document.createElement('div');
                        expItem.classList.add('exp-edu-item');
                        expItem.innerHTML = `
                            <h3>${exp.position}</h3>
                            <p class="company-name">${exp.company}</p>
                            <p class="duration">${exp.years}</p>
                            ${exp.description ? `<ul class="exp-edu-description"><li>${exp.description}</li></ul>` : ''}
                        `;
                        experienceTabPane.appendChild(expItem);
                    });
                }
            } else {
                console.warn("data.experience is missing or not an array. Skipping experience population.");
                experienceTabPane.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 20px;">Experience data is missing or not an array.</p>`;
            }

            console.log("Processing Education data (JS sees):", data.education); // <<<--- PENTING: Cek ini di konsol
            if (data.education && Array.isArray(data.education)) {
                if (data.education.length === 0) {
                    educationTabPane.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 20px;">No education data available.</p>`;
                } else {
                    data.education.forEach(edu => {
                        console.log("Adding Education item:", edu.degree); // Debugging tiap item
                        const eduItem = document.createElement('div');
                        eduItem.classList.add('exp-edu-item');
                        eduItem.innerHTML = `
                            <h3>${edu.degree}</h3>
                            <p class="institution-name">${edu.institution}</p>
                            <p class="duration">${edu.years}</p>
                            ${edu.description ? `<ul class="exp-edu-description"><li>${edu.description}</li></ul>` : ''}
                        `;
                        educationTabPane.appendChild(eduItem);
                    });
                }
            } else {
                console.warn("data.education is missing or not an array. Skipping education population.");
                educationTabPane.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 20px;">Education data is missing or not an array.</p>`;
            }

            // Tab logic (Ensure first tab content is displayed by default)
            const initialTabBtn = document.querySelector('.tabs-nav .tab-btn.active');
            if (initialTabBtn) {
                const initialTabPaneId = initialTabBtn.dataset.tab + '-pane';
                const initialTabPane = document.getElementById(initialTabPaneId);
                if (initialTabPane) {
                    initialTabPane.classList.add('active');
                }
            }


            document.querySelectorAll('.tab-btn').forEach(button => {
                button.addEventListener('click', () => {
                    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

                    button.classList.add('active');
                    document.getElementById(button.dataset.tab + '-pane').classList.add('active');
                });
            });


            // --- Skills Section (Progress Bars) ---
            const skillsGrid = document.getElementById('skills-grid');
            skillsGrid.innerHTML = '';
            if (data.skills && Array.isArray(data.skills)) {
                if (data.skills.length === 0) {
                    skillsGrid.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 20px; grid-column: 1 / -1;">No skills data available.</p>`;
                } else {
                    data.skills.forEach(skill => {
                        const skillItem = document.createElement('div');
                        skillItem.classList.add('skill-item');
                        skillItem.innerHTML = `
                            <h4>${skill.name} <span>${skill.level}%</span></h4>
                            <div class="skill-bar">
                                <div class="skill-progress" style="width: ${skill.level}%;"></div>
                            </div>
                        `;
                        skillsGrid.appendChild(skillItem);
                    });
                }
            } else {
                console.warn("data.skills is missing or not an array. Skipping skills population.");
                skillsGrid.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 20px; grid-column: 1 / -1;">Skills data is missing or not an array.</p>`;
            }


            // --- Projects Section ---
            const projectsGrid = document.getElementById('projects-grid');
            projectsGrid.innerHTML = '';
            if (data.projects && Array.isArray(data.projects)) {
                if (data.projects.length === 0) {
                    projectsGrid.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 20px; grid-column: 1 / -1;">No projects data available.</p>`;
                } else {
                    data.projects.forEach(project => {
                        const projectCard = document.createElement('div');
                        projectCard.classList.add('project-card');
                        projectCard.innerHTML = `
                            <img src="${project.image}" alt="${project.title}">
                            <div class="project-content">
                                <h3>${project.title}</h3>
                                <p>${project.description}</p>
                                <a href="${project.link}" target="_blank" class="btn btn-primary">View Project</a>
                            </div>
                        `;
                        projectsGrid.appendChild(projectCard);
                    });
                }
            } else {
                console.warn("data.projects is missing or not an array. Skipping projects population.");
                projectsGrid.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 20px; grid-column: 1 / -1;">Projects data is missing or not an array.</p>`;
            }


            // --- Contact Section ---
            document.getElementById('contact-email').textContent = data.contact && data.contact.email ? data.contact.email : 'N/A';
            document.getElementById('contact-phone').textContent = data.contact && data.contact.phone ? data.contact.phone : 'N/A';
            document.getElementById('contact-location').textContent = data.contact && data.contact.location ? data.contact.location : 'N/A';

            const contactSocialLinksDiv = document.getElementById('social-links-contact');
            contactSocialLinksDiv.innerHTML = '';
            const filteredContactSocialLinks = data.social_links && Array.isArray(data.social_links) ? data.social_links.filter(link =>
                link.platform === 'LinkedIn' || link.platform === 'Twitter' || link.platform === 'Instagram'
            ) : [];
            console.log("Filtered Contact Social Links:", filteredContactSocialLinks);
            if (filteredContactSocialLinks.length > 0) {
                filteredContactSocialLinks.forEach(link => {
                    const a = document.createElement('a');
                    a.href = link.url;
                    a.target = "_blank";
                    a.setAttribute('aria-label', link.platform);
                    a.innerHTML = `<i class="${link.icon}"></i>`;
                    contactSocialLinksDiv.appendChild(a);
                });
            } else {
                 contactSocialLinksDiv.innerHTML = `<p style="text-align: center; color: var(--text-muted); font-size:0.9em; margin-top: 10px;">No social links available.</p>`;
            }


            const footerSocialLinksDiv = document.getElementById('footer-social-links');
            footerSocialLinksDiv.innerHTML = '';
            if (filteredSocialLinks.length > 0) {
                filteredSocialLinks.forEach(link => {
                    const a = document.createElement('a');
                    a.href = link.url;
                    a.target = "_blank";
                    a.setAttribute('aria-label', link.platform);
                    a.innerHTML = `<i class="${link.icon}"></i>`;
                    footerSocialLinksDiv.appendChild(a);
                });
            } else {
                 footerSocialLinksDiv.innerHTML = `<p style="text-align: center; color: var(--text-muted); font-size:0.8em; margin-top: 5px;">No footer social links.</p>`;
            }

        })
        .catch(error => {
            console.error('Error fetching or processing content.json:', error);
            document.body.innerHTML = `
                <div style="text-align: center; padding: 50px; color: #cc0000; font-family: sans-serif; background-color: #fce8e6; border: 1px solid #f5c6cb; border-radius: 8px; margin: 20px;">
                    <h1 style="font-size: 2em; margin-bottom: 20px;">Error Loading Portfolio</h1>
                    <p style="font-size: 1.1em; line-height: 1.5;">Failed to load essential content. This usually happens if 'content.json' is missing, has errors, or cannot be accessed due to browser security policies.</p>
                    <p style="font-size: 0.9em; margin-top: 15px;">**Details:** ${error.message}</p>
                    <p style="font-size: 1em; margin-top: 20px; font-weight: bold;">**Solusi:** Pastikan Anda membuka proyek ini menggunakan server pengembangan lokal (misalnya, ekstensi "Live Server" di VS Code, atau \`python -m http.server\` dari terminal).</p>
                    <p style="font-size: 0.9em; margin-top: 10px;">Juga, periksa tab "Console" dan "Network" di Developer Tools browser Anda untuk detail error lebih lanjut.</p>
                </div>
            `;
        });

    // --- Smooth Scrolling for internal links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});