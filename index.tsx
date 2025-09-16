/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from '@google/genai';

const services = [
  {
    title: 'Roads & Highways',
    prompt:
      'Describe our expertise in designing, constructing, and maintaining roads and highways, emphasizing durability, safety, and modern engineering.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9,8.47H15.42V4.49a.53.53,0,0,0-.53-.53H9.11a.53.53,0,0,0-.53.53V8.47H5.1a.53.53,0,0,0-.53.53v6.32a.53.53,0,0,0,.53.53H8.58v4h6.84v-4h3.48a.53.53,0,0,0,.53-.53V9a.53.53,0,0,0-.53-.53ZM9.64,5h4.72V8.47H9.64ZM14.36,19H9.64V15.76h4.72Zm4-4.24H5.63V9.53H18.37Z"/></svg>`,
  },
  {
    title: 'Bridges & Flyovers',
    prompt:
      'Detail our capabilities in constructing bridges and flyovers, focusing on innovative design, structural integrity, and connecting communities.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21,11H17.92L14,5.15V3a1,1,0,0,0-1-1H11a1,1,0,0,0-1,1V5.15L6.08,11H3a1,1,0,0,0-1,1v2a1,1,0,0,0,1,1H4v4a1,1,0,0,0,1,1H7a1,1,0,0,0,1-1V15h8v4a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V15h1a1,1,0,0,0,1-1V12A1,1,0,0,0,21,11ZM5,13H3V12H5Zm6-8h2V3H11ZM8,13H6V12H8Zm4,0H10V12h2Zm4,0H14V12h2Zm3,6H17V15h2Zm-5,0H12V15h2Zm-4,0H8V15h2Zm-4,0H5V15H7Zm14-5H19V12h2Z"/></svg>`,
  },
  {
    title: 'Buildings & Industrial Structures',
    prompt:
      'Showcase our work in building commercial, residential, and industrial complexes, highlighting quality, functionality, and architectural excellence.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19,21H5a1,1,0,0,1-1-1V6A1,1,0,0,1,5,5H19a1,1,0,0,1,1,1V20A1,1,0,0,1,19,21ZM6,19H18V7H6Zm11-6H13V9a1,1,0,0,0-2,0v4H7a1,1,0,0,0,0,2h4v4a1,1,0,0,0,2,0V15h4a1,1,0,0,0,0-2Z"/></svg>`,
  },
  {
    title: 'Water & Wastewater Management',
    prompt:
      'Explain our role in developing water and wastewater infrastructure, including treatment plants and pipeline networks, focusing on efficiency and environmental responsibility.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2a10,10,0,0,0-8,3.74,1,1,0,0,0,1.42,1.42,8,8,0,0,1,13.14,0,1,1,0,0,0,1.42-1.42A10,10,0,0,0,12,2Zm0,17.5A4.5,4.5,0,0,1,7.5,15,4.5,4.5,0,0,1,12,10.5,4.5,4.5,0,0,1,16.5,15,4.5,4.5,0,0,1,12,19.5ZM12,6A10,10,0,0,0,2,9.32V20a1,1,0,0,0,1,1H21a1,1,0,0,0,1-1V9.32A10,10,0,0,0,12,6Zm8,13H4V9.41c.21-.12.42-.25.63-.38A8,8,0,0,1,12,8a8,8,0,0,1,7.37,3c.21.13.42.26.63.38Z"/></svg>`,
  },
  {
    title: 'Energy Infrastructure',
    prompt:
      'Describe our projects in the energy sector, such as power transmission lines and substations, emphasizing reliability and support for renewable energy.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14.29,1,7.07,10.26a1,1,0,0,0,.76,1.63H12v8.18a1,1,0,0,0,1.76.65L21,11.74a1,1,0,0,0-.76-1.63H15V2.82A1,1,0,0,0,14.29,1Z"/></svg>`,
  },
];

function initializeContactForm() {
  const form = document.getElementById('contact-form') as HTMLFormElement;
  if (!form) return;

  const nameInput = document.getElementById('name') as HTMLInputElement;
  const emailInput = document.getElementById('email') as HTMLInputElement;
  const messageInput = document.getElementById(
    'message',
  ) as HTMLTextAreaElement;
  const formStatus = document.getElementById('form-status');
  const submitButton = form.querySelector(
    'button[type="submit"]',
  ) as HTMLButtonElement;

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const showError = (input: HTMLElement, message: string) => {
    const formGroup = input.parentElement;
    const errorEl = formGroup?.querySelector('.error-message');
    if (errorEl) {
      errorEl.textContent = message;
    }
    input.classList.add('invalid');
  };

  const clearError = (input: HTMLElement) => {
    const formGroup = input.parentElement;
    const errorEl = formGroup?.querySelector('.error-message');
    if (errorEl) {
      errorEl.textContent = '';
    }
    input.classList.remove('invalid');
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Clear previous errors
    clearError(nameInput);
    clearError(emailInput);
    clearError(messageInput);
    if (formStatus) formStatus.textContent = '';

    // Validate Name
    if (nameInput.value.trim() === '') {
      showError(nameInput, 'Name is required.');
      isValid = false;
    }

    // Validate Email
    if (emailInput.value.trim() === '') {
      showError(emailInput, 'Email is required.');
      isValid = false;
    } else if (!validateEmail(emailInput.value)) {
      showError(emailInput, 'Please enter a valid email address.');
      isValid = false;
    }

    // Validate Message
    if (messageInput.value.trim() === '') {
      showError(messageInput, 'Message is required.');
      isValid = false;
    }

    if (isValid && formStatus) {
      formStatus.textContent = 'Sending message...';
      formStatus.style.color = 'var(--secondary-color)';
      submitButton.disabled = true;

      // Simulate network request
      setTimeout(() => {
        formStatus.textContent = 'Message sent successfully!';
        formStatus.style.color = 'green';
        form.reset();
        submitButton.disabled = false;
        clearError(nameInput);
        clearError(emailInput);
        clearError(messageInput);
      }, 1000);
    }
  });
}

async function main() {
  const taglineEl = document.getElementById('tagline');
  const servicesContainer = document.getElementById('services-container');

  if (!taglineEl || !servicesContainer) {
    console.error('Required elements not found');
    return;
  }

  // 1. Render initial structure with loading placeholders
  servicesContainer.innerHTML = services
    .map(
      (service) => `
    <div class="service-card" data-title="${service.title}">
      <div class="icon" aria-hidden="true">${service.icon}</div>
      <h3>${service.title}</h3>
      <p class="description loading-placeholder"></p>
    </div>
  `,
    )
    .join('');

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const servicePrompts = services
      .map((s) => `- ${s.title}: ${s.prompt}`)
      .join('\n');
    const prompt = `
      You are a marketing expert for a company called "VRC INFRAMAX PRIVATE LIMITED".
      Based on the following services, generate a catchy, professional tagline for the company (around 8-12 words) and a short, engaging description (around 25-35 words) for each service.

      Services:
      ${servicePrompts}

      Return the response in a JSON format.
    `;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        tagline: {
          type: Type.STRING,
          description: 'A catchy tagline for the company.',
        },
        serviceDescriptions: {
          type: Type.ARRAY,
          description: 'An array of descriptions for the services provided.',
          items: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: 'The title of the service.',
              },
              description: {
                type: Type.STRING,
                description: 'A short, engaging description of the service.',
              },
            },
            required: ['title', 'description'],
          },
        },
      },
      required: ['tagline', 'serviceDescriptions'],
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema,
      },
    });

    const data = JSON.parse(response.text);

    // 3. Populate UI with generated content
    taglineEl.textContent = data.tagline;
    taglineEl.classList.remove('loading-placeholder');

    data.serviceDescriptions.forEach(
      (item: { title: string; description: string }) => {
        const card = servicesContainer.querySelector(
          `.service-card[data-title="${item.title}"]`,
        );
        if (card) {
          const p = card.querySelector('.description');
          if (p) {
            p.textContent = item.description;
            p.classList.remove('loading-placeholder');
          }
        }
      },
    );
  } catch (error) {
    console.error('Error generating content:', error);
    taglineEl.textContent = 'Building the Foundations of Tomorrow.';
    taglineEl.classList.remove('loading-placeholder');
    const descriptionElements =
      servicesContainer.querySelectorAll('.description');
    descriptionElements.forEach((el) => {
      el.textContent = 'Could not load description.';
      el.classList.remove('loading-placeholder');
    });
  }

  initializeContactForm();
}

main();
