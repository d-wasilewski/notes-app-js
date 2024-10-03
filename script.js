const notes = [];
let noteToDeleteId = null;

const addNoteBtn = document.getElementById('add-note-btn');
const noNotesAddNoteBtn = document.getElementById('no-notes-add-note-btn');
const notesList = document.getElementById('notes-list');
const searchInput = document.getElementById('search');
const noNotesDiv = document.getElementById('no-notes');

const deleteModal = document.getElementById('delete-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

const createNote = () => {
  searchInput.value = '';
  const newNote = {
    title: '',
    description: '',
    isEditing: true,
    date: new Date(),
  };
  notes.unshift(newNote);
  renderNotes(searchInput.value);
  addNoteBtn.style.display = 'none';
};

addNoteBtn.addEventListener('click', createNote);
noNotesAddNoteBtn.addEventListener('click', createNote);

const renderNotes = (filter = '') => {
  const filteredNotes = notes.filter((note) => {
    return (
      note.title.toLowerCase().includes(filter.toLowerCase()) ||
      note.description.toLowerCase().includes(filter.toLowerCase())
    );
  });
  notesList.innerHTML = '';

  if (filteredNotes.length === 0) {
    noNotesDiv.style.display = 'flex';
    addNoteBtn.style.display = 'none';
  } else {
    noNotesDiv.style.display = 'none';
    filteredNotes.forEach((note, index) => {
      let noteElement;
      if (note.isEditing) {
        addNoteBtn.style.display = 'none';
        noteElement = createEditingNoteElement(note, index);
      } else {
        addNoteBtn.style.display = 'block';
        noteElement = createNoteElement(note, index);
      }
      notesList.appendChild(noteElement);
    });
  }
};

const createNoteElement = (note, index) => {
  const noteDiv = document.createElement('div');
  noteDiv.classList.add('note');

  const noteHeader = document.createElement('div');
  noteHeader.classList.add('note-header');

  const noteTitle = document.createElement('div');
  noteTitle.classList.add('note-title');
  noteTitle.textContent = note.title;
  noteHeader.appendChild(noteTitle);

  const noteActions = document.createElement('div');
  noteActions.classList.add('note-actions');

  const editBtn = document.createElement('button');
  editBtn.classList.add('edit-btn');
  const editIcon = document.createElement('img');
  editIcon.src = './assets/edit-icon.svg';
  editIcon.alt = 'Edit this note';
  editBtn.appendChild(editIcon);
  editBtn.addEventListener('click', () => editNote(index));
  noteActions.appendChild(editBtn);

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete-btn');
  const deleteIcon = document.createElement('img');
  deleteIcon.src = './assets/delete-icon.svg';
  deleteIcon.alt = 'Delete this note';
  deleteBtn.appendChild(deleteIcon);
  deleteBtn.addEventListener('click', () => confirmDelete(index));
  noteActions.appendChild(deleteBtn);

  noteHeader.appendChild(noteActions);
  noteDiv.appendChild(noteHeader);

  const noteDescription = document.createElement('div');
  noteDescription.classList.add('note-description');
  noteDescription.textContent = note.description;
  noteDiv.appendChild(noteDescription);

  const noteDate = document.createElement('div');
  noteDate.classList.add('note-date');
  noteDate.textContent = formatDate(note.date);
  noteDiv.appendChild(noteDate);

  return noteDiv;
};

const createEditingNoteElement = (note, index) => {
  const noteEditingDiv = document.createElement('div');
  noteEditingDiv.classList.add('note-editing');

  const noteEditingHeader = document.createElement('div');
  noteEditingHeader.classList.add('note-editing-header');

  const headerTitle = document.createElement('div');
  headerTitle.textContent = note.title ? 'Edit note' : 'Add new note';
  noteEditingHeader.appendChild(headerTitle);

  const cancelButton = document.createElement('button');
  cancelButton.classList.add('cancel-button');
  cancelButton.textContent = 'Cancel';
  cancelButton.addEventListener('click', () => cancelEdit(index));
  noteEditingHeader.appendChild(cancelButton);

  noteEditingDiv.appendChild(noteEditingHeader);

  const titleInput = document.createElement('input');
  titleInput.classList.add('input');
  titleInput.type = 'text';
  titleInput.placeholder = 'Note title';
  titleInput.value = note.title;
  noteEditingDiv.appendChild(titleInput);

  const descTextarea = document.createElement('textarea');
  descTextarea.classList.add('input', 'textarea');
  descTextarea.placeholder = 'Note description';
  descTextarea.value = note.description;
  noteEditingDiv.appendChild(descTextarea);

  const saveBtn = document.createElement('button');
  saveBtn.classList.add('button-primary', 'save-button');
  saveBtn.textContent = 'Save';
  saveBtn.addEventListener('click', () =>
    saveEdit(index, titleInput.value, descTextarea.value)
  );
  noteEditingDiv.appendChild(saveBtn);

  return noteEditingDiv;
};

const saveEdit = (index, newTitle, newDescription) => {
  notes[index].title = newTitle.trim();
  notes[index].description = newDescription.trim();
  notes[index].isEditing = false;
  notes[index].date = new Date();
  if (notes[index].title === '' && notes[index].description === '') {
    notes.splice(index, 1);
  }
  renderNotes(searchInput.value);
};

const editNote = (index) => {
  notes[index].isEditing = true;
  renderNotes(searchInput.value);
};

const cancelEdit = (index) => {
  if (notes[index].title === '' && notes[index].description === '') {
    notes.splice(index, 1);
  } else {
    notes[index].isEditing = false;
  }
  renderNotes(searchInput.value);
};

const confirmDelete = (index) => {
  noteToDeleteId = index;
  deleteModal.style.display = 'flex';
};

confirmDeleteBtn.addEventListener('click', () => {
  notes.splice(noteToDeleteId, 1);
  deleteModal.style.display = 'none';
  renderNotes(searchInput.value);
});

cancelDeleteBtn.addEventListener('click', () => {
  deleteModal.style.display = 'none';
  noteToDeleteId = null;
});

searchInput.addEventListener('input', (e) => {
  renderNotes(e.target.value);
});

const formatDate = (date) => {
  const options = { month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-EN', options);
};

renderNotes();
