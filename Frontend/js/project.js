// js/project.js
document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name');
    const contentInput = document.getElementById('content');
    const guestbookEntriesDiv = document.getElementById('guestbook-entries');
    const submitButton = document.getElementById('submit-button');
    const navButtons = document.querySelectorAll('.nav-button');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = document.querySelector(button.getAttribute('data-target'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    const fetchEntries = async () => {
        try {
            const response = await axios.get('/guestbook/');
            const entries = response.data;
            guestbookEntriesDiv.innerHTML = '';
            entries.forEach(entry => {
                const entryDiv = document.createElement('div');
                entryDiv.className = 'message';
                entryDiv.innerHTML = `
                    <div class="author">${entry.name}</div>
                    <div class="content">${entry.content}</div>
                    <div class="timestamp">${new Date(entry.created_at).toLocaleString()}</div>
                    <button class="delete-button" data-id="${entry.id}">X</button>
                `;
                guestbookEntriesDiv.appendChild(entryDiv);
            });
        } catch (error) {
            console.error('Error fetching entries:', error);
        }
    };

    const addEntry = async (entry) => {
        try {
            await axios.post('/guestbook/', entry);
            fetchEntries();
        } catch (error) {
            console.error('Error adding entry:', error);
        }
    };

    const deleteEntry = async (entryId) => {
        try {
            await axios.delete(`/guestbook/${entryId}`);
            fetchEntries();
        } catch (error) {
            console.error('Error deleting entry:', error);
        }
    };

    if (submitButton) {
        submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            const name = nameInput.value;
            const content = contentInput.value;
            const newEntry = { name, content };
            addEntry(newEntry);
            nameInput.value = '';
            contentInput.value = '';
        });
    } else {
        console.error('Submit button not found');
    }

    guestbookEntriesDiv.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-button')) {
            const entryId = e.target.getAttribute('data-id');
            deleteEntry(entryId);
        }
    });

    fetchEntries();
});
