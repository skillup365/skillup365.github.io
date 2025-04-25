// DOM Elements
const elements = {
  title: document.getElementById('lesson-title'),
  description: document.getElementById('lesson-description'),
  vocabulary: document.getElementById('vocabulary-list'),
  conversations: document.getElementById('conversation-list'),
  grammar: document.getElementById('grammar-tips')
};

// Main Loader
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const lessonNum = window.location.pathname.match(/lesson(\d+)\.html/)[1];
    const response = await fetch(`../../data/lesson${lessonNum}.json`);
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    renderLesson(data);
  } catch (error) {
    console.error('Failed to load lesson:', error);
    showError(error);
  }
});

// Render All Sections
function renderLesson(data) {
  // Meta Data
  document.title = `${data.meta.title} | SkillUp365`;
  elements.title.textContent = data.meta.title;
  elements.description.textContent = data.meta.description;

  // Vocabulary
  if (data.vocabulary) {
    elements.vocabulary.innerHTML = data.vocabulary.map(createVocabCard).join('');
  }

  // Conversations
  if (data.conversations) {
    elements.conversations.innerHTML = data.conversations.map(createConversationCard).join('');
    setupAudioPlayers();
  }

  // Grammar Tips
  if (data.grammarTips) {
    elements.grammar.innerHTML = data.grammarTips.map(createGrammarCard).join('');
  }
}

// Component Builders
function createVocabCard(item) {
  return `
    <div class="col-md-4">
      <div class="vocab-card h-100">
        <div class="card-body">
          <h5 class="card-title">${item.shona}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${item.pronunciation}</h6>
          <p class="card-text">${item.english}</p>
          ${item.category ? `<span class="badge bg-primary">${item.category}</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

function createConversationCard(conv, index) {
  return `
    <div class="conversation-card mb-4">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h5>${conv.title}</h5>
        </div>
        <div class="card-body">
          <div class="conversation-lines">
            ${conv.lines.map(line => `
              <div class="conversation-line ${line.speaker.includes('A') ? 'speaker-a' : 'speaker-b'}">
                <div class="speaker-badge">${line.speaker}</div>
                <div class="shona-text">${line.shona}</div>
                <div class="english-text">${line.english}</div>
              </div>
            `).join('')}
          </div>
          <div class="mt-3">
            <button class="btn btn-success play-btn" data-audio-id="audio-${index}">
              <i class="fas fa-play"></i> Play Conversation
            </button>
            <audio id="audio-${index}" src="${conv.audio}"></audio>
          </div>
          ${conv.notes ? `<div class="alert alert-info mt-3">${conv.notes}</div>` : ''}
        </div>
      </div>
    </div>
  `;
}

function createGrammarCard(tip) {
  return `
    <div class="col-12">
      <div class="grammar-card card mb-3">
        <div class="card-body">
          <h5 class="card-title">${tip.title}</h5>
          <p class="card-text">${tip.content}</p>
          ${tip.example ? `<div class="example-box p-2 bg-light">${tip.example}</div>` : ''}
        </div>
      </div>
    </div>
  `;
}

// Audio Handling
function setupAudioPlayers() {
  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const audioId = this.getAttribute('data-audio-id');
      const audio = document.getElementById(audioId);
      
      // Pause all other audios
      document.querySelectorAll('audio').forEach(a => {
        if (a !== audio) {
          a.pause();
          a.currentTime = 0;
        }
      });
      
      // Toggle play/pause
      if (audio.paused) {
        audio.play();
        this.innerHTML = '<i class="fas fa-pause"></i> Pause';
      } else {
        audio.pause();
        this.innerHTML = '<i class="fas fa-play"></i> Play Conversation';
      }
    });
  });
}

// Error Handling
function showError(error) {
  const errorHtml = `
    <div class="alert alert-danger">
      <h4>Error Loading Lesson</h4>
      <p>${error.message}</p>
      <button onclick="location.reload()" class="btn btn-warning">
        <i class="fas fa-sync-alt"></i> Try Again
      </button>
    </div>
  `;
  
  document.querySelector('.container').innerHTML = errorHtml;
}