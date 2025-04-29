import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import TagInput from "../../Components/Inputs/TagInput";
// import styles from './Home.module.css';
import styles from './AddEditNotes.module.css';
import axiosInstance from "../../utils/axiosInstance";



const AddEditNotes = ({ onClose, noteData, type,  getAllNotes ,showToastMessage}) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  useEffect(() => {
    const firstInput = document.querySelector("input[type='text']");
    firstInput?.focus();
  }, []);

  const addNewNote = async() => {
    try {
      const response = await axiosInstance.post("/add-note",{
        title,
        content,tags
      })
      if(response.data && response.data.note){
        showToastMessage("Notes Added  successfully")
        getAllNotes();
        onClose()
      }
    } catch (error) {
      if(error.response &&
        error.response.data  &&
        error.response.data.message
      )
      {
        setError(error.response.data.message)
      }
      
    }
  };

  const editNote = async () => {
    const noteId = noteData._id
    try {
      const response = await axiosInstance.put(`/edit-note/${noteId}` ,{
        title,
        content,tags
      })
      if(response.data && response.data.note){
        showToastMessage("Notes Edited  successfully","edit")

        getAllNotes();
        onClose()
      }
    } catch (error) {
      if(error.response &&
        error.response.data  &&
        error.response.data.message
      )
      {
        setError(error.response.data.message)
      }
      
    }
    };
  const handleAddNote = () => {
    if (!title) {
      setError("Please enter a title");
      return;
    }
    if (!content) {
      setError("Please enter content");
      return;
    }
    setError(null);
    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
    // const note = {
    //   ...noteData,
    //   title,
    //   content,
    //   tags,
    // };

    // onSave(note);
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    setTags([]);
    setError(null);
    onClose();
  };

  return (
    <div className={styles.wrapper}>
    <button className={styles.closeButton} onClick={handleClose}>
      <MdClose />
    </button>
  
    <div className={styles.inputGroup}>
      <label className={styles.inputLabel}>Title</label>
      <input
        type="text"
        className={styles.inputField}
        value={title}
        onChange={({ target }) => setTitle(target.value)}
        placeholder="e.g., Go to Gym"
      />
    </div>
  
    <div className={styles.inputGroup}>
      <label className={styles.inputLabel}>Content</label>
      <textarea
      type="text"
      placeholder="Content"
        rows={6}
        className={styles.textArea}
        value={content}
        onChange={({ target }) => setContent(target.value)}
      />
    </div>
  
    <div className={styles.inputGroup}>
      <label className={styles.inputLabel}>Tags</label>
      <TagInput tags={tags} setTags={setTags} />
    </div>
  
    {error && <p className={styles.errorText}>{error}</p>}
  
    <button className={styles.saveButton} onClick={handleAddNote}>
      {type === "edit" ? "Update" : "Add"}
    </button>
  </div>
  );
};

export default AddEditNotes;
