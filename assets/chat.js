(function () {
  'use strict';
  document.querySelectorAll('.soc-chat').forEach(function (root) {
    const form = root.querySelector('.soc-chat__form');
    const input = root.querySelector('.soc-chat__question');
    const messages = root.querySelector('.soc-chat__messages');
    const button = form.querySelector('button');
    function message(text, who) {
      const p = document.createElement('p');
      p.className = 'soc-chat__message soc-chat__' + who;
      p.textContent = text;
      messages.appendChild(p);
      messages.scrollTop = messages.scrollHeight;
      return p;
    }
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      const question = input.value.trim();
      if (!question || button.disabled) return;
      message(question, 'user');
      input.value = '';
      button.disabled = true;
      const pending = message('Sto cercando nei contenuti del sito…', 'bot');
      try {
        const response = await fetch(socChatConfig.endpoint, {
          method: 'POST', headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({question: question})
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Errore di comunicazione');
        pending.textContent = data.answer;
        if (Array.isArray(data.sources) && data.sources.length) {
          const list = document.createElement('ul');
          list.className = 'soc-chat__sources';
          data.sources.forEach(function (source) {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = source.url;
            link.textContent = source.title || 'Fonte';
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            li.appendChild(link);
            list.appendChild(li);
          });
          messages.appendChild(list);
        }
      } catch (error) {
        pending.textContent = error.message || 'Si è verificato un errore.';
      } finally {
        button.disabled = false;
        input.focus();
        messages.scrollTop = messages.scrollHeight;
      }
    });
  });
})();
