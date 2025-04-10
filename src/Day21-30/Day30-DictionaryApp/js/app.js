
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearBtn');
    const result = document.getElementById("result");
    const sound = document.getElementById("sound");
    const searchForm = document.getElementById("search-form");
    const loading = document.getElementById("loading");
    const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";

    // Show/hide close icon based on input content
    searchInput.addEventListener('input', function() {
      if (this.value.length > 0) {
        clearBtn.classList.remove('hidden');
      } else {
        clearBtn.classList.add('hidden');
      }
    });

    // Clear input when close icon is clicked
    clearBtn.addEventListener('click', function() {
      searchInput.value = '';
      this.classList.add('hidden');
      result.innerHTML = '';
      searchInput.focus();
    });
    
    // Form submission
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      searchWord();
    });
    
    // Also search when user presses Enter
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        searchWord();
      }
    });

    function searchWord() {
      let inpWord = searchInput.value.trim();
      if (!inpWord) return;
      
      // Show loading spinner
      loading.classList.remove('hidden');
      result.innerHTML = '';
      
      fetch(`${url}${inpWord}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Word not found');
          }
          return response.json();
        })
        .then((data) => {
          // Hide loading spinner
          loading.classList.add('hidden');
          
          // Find the first phonetic with audio
          let audioSrc = '';
          if (data[0].phonetics) {
            for (let phonetic of data[0].phonetics) {
              if (phonetic.audio) {
                audioSrc = phonetic.audio;
                break;
              }
            }
          }
          
          // Get phonetic text
          let phoneticText = data[0].phonetic || '';
          if (!phoneticText && data[0].phonetics && data[0].phonetics.length > 0) {
            phoneticText = data[0].phonetics.find(p => p.text)?.text || '';
          }
          
          // Create HTML structure for the result
          let html = `
            <div class="bg-white rounded-lg p-6 shadow-md">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold text-gray-800">${inpWord}</h2>
                ${audioSrc ? `<button id="play-sound" class="p-2 bg-purple-100 rounded-full text-purple-700 hover:bg-purple-200 transition-colors">
                  <i class="fas fa-volume-up"></i>
                </button>` : ''}
              </div>`;
              
          if (phoneticText) {
            html += `<p class="text-gray-500 mb-4">${phoneticText}</p>`;
          }
          
          // Process meanings
          html += `<div class="space-y-4">`;
          data[0].meanings.forEach(meaning => {
            html += `
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <p class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">${meaning.partOfSpeech}</p>
                </div>
                <div class="ml-2 space-y-2">`;
            
            // Add definitions
            meaning.definitions.forEach((def, index) => {
              if (index < 3) { // Limit to 3 definitions per part of speech
                html += `
                  <div class="mb-2">
                    <p class="text-gray-800 mb-1">${index + 1}. ${def.definition}</p>`;
                
                if (def.example) {
                  html += `<p class="text-gray-500 italic ml-4">"${def.example}"</p>`;
                }
                
                html += `</div>`;
              }
            });
            
            // Add synonyms if available
            if (meaning.synonyms && meaning.synonyms.length > 0) {
              html += `
                <div class="mt-2">
                  <span class="text-gray-700 font-medium">Synonyms: </span>
                  <span class="text-purple-600">${meaning.synonyms.slice(0, 5).join(", ")}</span>
                </div>`;
            }
            
            html += `</div></div>`;
          });
          
          html += `</div></div>`;
          
          result.innerHTML = html;
          
          // Set audio source
          if (audioSrc) {
            // Make sure URL is absolute
            if (audioSrc.startsWith('//')) {
              audioSrc = 'https:' + audioSrc;
            }
            sound.setAttribute("src", audioSrc);
            
            // Add event listener to play button
            document.getElementById('play-sound')?.addEventListener('click', playSound);
          }
        })
        .catch((error) => {
          // Hide loading spinner
          loading.classList.add('hidden');
          
          result.innerHTML = `
            <div class="bg-white rounded-lg p-6 shadow-md text-center">
              <i class="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
              <h3 class="text-xl font-medium text-red-500">Couldn't Find "${inpWord}"</h3>
              <p class="text-gray-500 mt-2">Please check the spelling or try another word.</p>
            </div>`;
        });
    }

    function playSound() {
      sound.play().catch(e => console.error("Error playing sound:", e));
    }
 