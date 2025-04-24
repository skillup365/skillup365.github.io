fetch('data/lesson01.json')
  .then(response => response.json())
  .then(data => {
    document.getElementById("lesson-title").textContent = data.title;

    const vocabContainer = document.getElementById("vocab-list");
    data.vocabulary.forEach(item => {
      const col = document.createElement('div');
      col.className = "col-md-6";
      col.innerHTML = `
        <div class="p-3 border rounded bg-white shadow-sm">
          <h5>${item.word} → <span class="text-primary">${item.shona}</span></h5>
          <p><strong>Pronunciation:</strong> ${item.pronunciation}</p>
          <audio controls src="${item.audio}"></audio>
        </div>
      `;
      vocabContainer.appendChild(col);
    });

    const dialogueBox = document.getElementById("dialogue");
    data.dialogue.forEach(line => {
      const p = document.createElement('p');
      p.innerHTML = `<strong>${line.speaker}:</strong> ${line.text}`;
      dialogueBox.appendChild(p);
    });
  });