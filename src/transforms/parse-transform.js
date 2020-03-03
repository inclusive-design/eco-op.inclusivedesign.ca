const jsdom = require('@tbranyen/jsdom');
const { JSDOM } = jsdom;
const minify = require('../utils/minify.js');
const slugify = require('slugify');

module.exports = function(value, outputPath) {
  if (outputPath.endsWith('.html')) {
    const DOM = new JSDOM(value, {
      resources: 'usable'
    });

    const document = DOM.window.document;
    const headings = [
        ...document.querySelectorAll('h2')
    ];
    
    if (headings.length) {
      const nav = document.querySelector('ol.nav');
      const classes = ['about', 'workshop', 'get-involved'];
      let i = 0;
      headings.forEach(heading => {
        const headingText = heading.textContent;
        const headingSlug = slugify(headingText.toLowerCase());
        const navItem = document.createElement('li');
        navItem.innerHTML = `<a href="#${headingSlug}">${headingText}</a>`;
        heading.innerHTML = `<a name="${headingSlug}">${headingText}</a>`;

        nav.appendChild(navItem);

        // Function to create a node list 
        // of the content between this <h2> and the next
        const getContent = (elem) => {
          let elems = []
          while (elem.nextElementSibling && elem.nextElementSibling.tagName !== 'H2') {
            elems.push(elem.nextElementSibling)
            elem = elem.nextElementSibling
          }
            
            // Delete the old versions of the content nodes
          elems.forEach((node) => {
            node.parentNode.removeChild(node);
          });
    
          return elems;
        }
      
        let contents = getContent(heading);

        let wrapper = document.createElement('section');
        wrapper.className = classes[i];

        let textBlock = document.createElement('div');
        textBlock.className = 'text-block';

        wrapper.appendChild(textBlock);
        
        // Add each element of `contents` to `wrapper`
        contents.forEach(node => {
            textBlock.appendChild(node)
        })
        
        // Add the wrapped content back into the DOM 
        // after the heading
        heading.parentNode.insertBefore(wrapper, heading.nextElementSibling)
        textBlock.prepend(heading);
        if (classes[i] === 'about' || classes[i] === 'workshop') {
            const img = document.createElement('img');
            img.setAttribute('src', `/images/${classes[i]}.svg`);
            img.setAttribute('alt', '');
            if (classes[i] === 'about') {
                textBlock.prepend(img);
            } else {
                textBlock.firstChild.insertAdjacentHTML("afterend", img.outerHTML);
            }
        }
        i++;
      });
    }

    return '<!DOCTYPE html>\r\n' + document.documentElement.outerHTML;
  }
  return value;
};
