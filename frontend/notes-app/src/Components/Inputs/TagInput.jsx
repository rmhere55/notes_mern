import { useState } from "react";
import styles from './TagInput.module.css';
import { MdClose, MdAdd } from "react-icons/md";

const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const addNewTag = () => {
    const newTag = inputValue.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    setInputValue(""); // Reset input after adding the tag
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addNewTag();
    }
  };

  return (
    <div className={styles.container}>
      { tags?.length  > 0 &&(
      <div className={styles.tags}>
        {tags.map((tag, index) => (
          <div key={index} className={styles.tag}>
            #{tag}
            <button
              className={styles.removeIcon}
              onClick={() => handleRemoveTag(tag)}
                aria-label={`Remove tag ${tag}`}

            >
              <MdClose />
            </button>
          </div>
        ))}
      </div>
      )}
      <div className={styles.inputGroup}>
        <input
          type="text"
          placeholder="Add tags"
          value={inputValue}
          onChange={ handleInputChange}
          onKeyDown={handleKeyDown}
          aria-label="Add tag input"

        />
        <button type="button" onClick={addNewTag}>
          <MdAdd />
        </button>
      </div>
    </div>
  );
};

export default TagInput;
