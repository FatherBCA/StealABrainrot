// ==UserScript==
// @name         Roblox Instant Unfriend Button
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Adds an instant red button next to usernames on Roblox Friends page
// @match        https://www.roblox.com/users/*/friends*
// @match        https://www.roblox.com/users/friends*
// @match        https://web.roblox.com/users/*/friends*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    function addInstantUnfriendButtons() {
        // Targets Roblox's updated list container layout
        const friendItems = document.querySelectorAll('li.list-item.friend-item:not(.has-instant-btn), .friend-card:not(.has-instant-btn), [class*="friend-card"]:not(.has-instant-btn)');

        friendItems.forEach(card => {
            // Find the 3-dots menu button inside the card container
            const menuBtn = card.querySelector('[data-toggle="dropdown"]') || 
                            card.querySelector('.dropdown-toggle') || 
                            card.querySelector('.icon-more') ||
                            card.querySelector('button[id*="dropdown"]');
                            
            if (!menuBtn) return;

            card.classList.add('has-instant-btn');

            // Create the red button
            const instantBtn = document.createElement('button');
            instantBtn.innerText = '✕';
            instantBtn.title = 'Instant Unfriend';
            
            // Custom red styling to match your iPad screen layout smoothly
            Object.assign(instantBtn.style, {
                backgroundColor: '#ff4d4d',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                marginLeft: '12px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: '9999',
                position: 'relative'
            });

            // The one-tap instant trigger
            instantBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // 1. Instantly trigger the native dropdown menu hidden in the background
                menuBtn.click();
                
                // 2. Wait a split second for Roblox's native unfriend button to load, then click it
                setTimeout(() => {
                    const nativeUnfriendBtn = card.querySelector('[data-js="unfriend"]') || 
                                             Array.from(card.querySelectorAll('a, button, li')).find(el => el.textContent.includes('Unfriend'));
                    
                    if (nativeUnfriendBtn) {
                        nativeUnfriendBtn.click();
                        
                        // 3. Immediately slide and hide the friend card from your screen visually
                        card.style.transition = 'all 0.2s ease';
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.9)';
                        setTimeout(() => card.remove(), 200);
                    } else {
                        // Clean fallback if dropdown menu closes
                        menuBtn.click();
                    }
                }, 40);
            });

            // Inject the button directly next to the 3-dots menu element
            if (menuBtn.parentElement) {
                menuBtn.parentElement.style.display = 'flex';
                menuBtn.parentElement.style.alignItems = 'center';
                menuBtn.parentElement.appendChild(instantBtn);
            }
        });
    }

    // Continuously check for new cards when scrolling down your 993 friends
    const observer = new MutationObserver(() => addInstantUnfriendButtons());
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial pass-through
    setTimeout(addInstantUnfriendButtons, 500);
})();
