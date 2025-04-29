// import React from "react";
// import { MdOutlinePushPin, MdCreate, MdDelete } from "react-icons/md";
// import styles from "./NoteCard.module.css"; // 👈 Import CSS module
// import moment from "moment";

// const NoteCard = ({
//   title,
//   date,
//   content,
//   tags,
//   isPinned,
//   onEdit,
//   onDelete,
//   onPinNote,
// }) => {
//   return (
//     <div className={styles.card}>
//       <div className={styles.header}>
//         <div>
//           <h6 className={styles.title}>{title}</h6>
//           <span className={styles.date}>{moment(date).format('Do MMM YYYY')}</span>
//         </div>
//         <MdOutlinePushPin
//           className={`${styles.iconBtn} ${isPinned ? styles.pinned : styles.unpinned}`}
//           onClick={onPinNote}
//         />
//       </div>

//       <p className={styles.content}>{content?.slice(0, 60)}</p>

//       <div className={styles.footer}>
//         <div className={styles.tags}>{tags.map((item)=>{
//             `#${item}`
//         })}</div>
//         <div className={styles.actions}>
//           <MdCreate
//             className={`${styles.iconBtn} ${styles.editIcon}`}
//             onClick={onEdit}
//           />
//           <MdDelete
//             className={`${styles.iconBtn} ${styles.deleteIcon}`}
//             onClick={onDelete}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NoteCard;


import React from "react";
import { MdOutlinePushPin, MdCreate, MdDelete } from "react-icons/md";
import styles from "./NoteCard.module.css"; // Import CSS module
import moment from "moment";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h6 className={styles.title}>{title}</h6>
          <span className={styles.date}>
            {moment(date).format('Do MMM YYYY')}
          </span>
        </div>
        <MdOutlinePushPin
          className={`${styles.iconBtn} ${isPinned ? styles.pinned : styles.unpinned}`}
          onClick={onPinNote}
        />
      </div>

      <p className={styles.content}>
        {content?.slice(0, 60)}
      </p>

      {/* <div className={styles.footer}>
        <div className={styles.tags}>
          {tags.map((item, index) => (
            <span key={index} className={styles.tag}>
              #{item}
            </span>
          ))}
        </div>

        <div className={styles.actions}>
          <MdCreate
            className={`${styles.iconBtn} ${styles.editIcon}`}
            onClick={onEdit}
          />
          <MdDelete
            className={`${styles.iconBtn} ${styles.deleteIcon}`}
            onClick={onDelete}
          />
        </div>
      </div> */}

<div className={styles.footer}>
        {tags?.length > 0 && (
          <div className={styles.tags}>
            {tags.map((item, index) => (
              <span key={index} className={styles.tag}>
                #{item}
              </span>
            ))}
          </div>
        )}

        <div className={styles.actions}>
          <MdCreate
            className={`${styles.iconBtn} ${styles.editIcon}`}
            onClick={onEdit}
          />
          <MdDelete
            className={`${styles.iconBtn} ${styles.deleteIcon}`}
            onClick={onDelete}
          />
        </div>
      </div>

    </div>
  );
};

export default NoteCard;
