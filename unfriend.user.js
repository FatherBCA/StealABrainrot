// ==UserScript==
// @name         Roblox Instant Unfriend Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a red button to instantly unfriend users without confirmation on the Roblox friends page.
// @author       YourName
// @match        https://www.roblox.com/users/*/friends*
// @match        https://www.roblox.com/users/friends*
// @match        https://web.roblox.com/users/*/friends*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    function addInstantUnfriendButtons() {
        const friendCards = document.querySelectorAll('.friend-item:not(.has-instant-btn), .friend-card:not(.has-instant-btn)');

        friendCards.forEach(card => {
            const menuBtn = card.querySelector('[data-toggle="dropdown"]') || card.querySelector('.dropdown-toggle');
            if (!menuBtn) return;

            card.classList.add('has-instant-btn');

            const instantBtn = document.createElement('button');
            instantBtn.innerText = '✕';
            instantBtn.title = 'Instant Unfriend';
            
            Object.assign(instantBtn.style, {
                backgroundColor: '#ff4d4d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                marginLeft: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '12px',
                zIndex: '100'
            });

            instantBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Open the native dropdown menu silently to find Roblox's internal unfriend link
                menuBtn.click();
                
                // Small delay to let the menu render in the background, then find the native unfriend link
                setTimeout(() => {
                    const nativeUnfriendBtn = card.querySelector('[data-js="unfriend"]') || 
                                             Array.from(card.querySelectorAll('a, button')).find(el => el.textContent.includes('Unfriend'));
                    
                    if (nativeUnfriendBtn) {
                        nativeUnfriendBtn.click();
                        card.style.transition = 'opacity 0.3s ease';
                        card.style.opacity = '0';
                        setTimeout(() => card.remove(), 300);
                    } else {
                        menuBtn.click();
                    }
                }, 50);
            });

            if (menuBtn.parentElement) {
                menuBtn.parentElement.appendChild(instantBtn);
            }
        });
    }

    const observer = new MutationObserver(() => {
        addInstantUnfriendButtons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(addInstantUnfriendButtons, 1000);
})();
