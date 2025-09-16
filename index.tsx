/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from '@google/genai';

const services = [
  {
    title: 'Real Estate Development',
    prompt:
      'Engage in real estate business, including purchase, lease, development, and construction of all types of properties.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"/></svg>`,
  },
  {
    title: 'Sustainable Infrastructure',
    prompt:
      'Act as town planners and infrastructure developers with a focus on sustainability.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-5.3 0-9.8 3.9-10.8 9h2.1c.9-4.2 4.5-7.5 8.7-7.5s7.8 3.3 8.7 7.5h2.1c-1-5.1-5.5-9-10.8-9zM12 22c5.3 0 9.8-3.9 10.8-9h-2.1c-.9 4.2-4.5 7.5-8.7 7.5s-7.8-3.3-8.7-7.5H1.2C2.2 18.1 6.7 22 12 22zm-4-9c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z"/></svg>`,
  },
  {
    title: 'Renovation & Redevelopment',
    prompt: 'Undertake renovation and redevelopment of existing structures.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>`,
  },
  {
    title: 'AI-Driven Solutions',
    prompt:
      'Provide AI-driven construction, design, and professional services.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 18H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8-4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8-4H7V8h2v2zm4 0h-2V8h2v2zm4 0h-2V8h2v2zm-8-4H7V4h2v2zm4 0h-2V4h2v2zm4 0h-2V4h2v2z"/></svg>`,
  },
];

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
      Based on the following services, generate a catchy, professional tagline for the company and a short, engaging description (around 30-40 words) for each service.

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

    data.serviceDescriptions.forEach((item: { title: string; description: string }) => {
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
    });
  } catch (error) {
    console.error('Error generating content:', error);
    taglineEl.textContent = 'Error loading content. Please try again later.';
    taglineEl.classList.remove('loading-placeholder');
    const descriptionElements = servicesContainer.querySelectorAll('.description');
    descriptionElements.forEach((el) => {
      el.textContent = 'Could not load description.';
      el.classList.remove('loading-placeholder');
    });
  }
}

main();
