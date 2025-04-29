// import React, { useEffect } from "react";
// import { LuCheck } from "react-icons/lu";
// import { MdDeleteOutline } from "react-icons/md";
// import styles from "./Toast.module.css";

// const Toast = ({ isShown, message, type, onClose }) => {
// useEffect(() => {
//    const timeoutId = setTimeout(()=>{
//     onClose()
//    },3000)
//   return () => {
//     clearTimeout(timeoutId)
//   };
// }, [onClose]);

//   return (
//     <div
//       className={`${styles.toastWrapper} ${isShown ? styles.opacity100 : styles.opacity0}`}
//       aria-live="polite" // Added for accessibility
//       role="alert" // Added for accessibility
//     >
//       <div
//         className={`${styles.toastBox} ${
//           type === "delete" ? styles.afterBgRed : styles.afterBgGreen
//         }`}
//       >
//         <div className={styles.toastContent}>
//           <div
//             className={`${styles.iconCircle} ${
//               type === "delete" ? styles.iconRed : styles.iconGreen
//             }`}
//           >
//             {type === "delete" ? (
//               <MdDeleteOutline className={`${styles.icon} ${styles.iconRedText}`} />
//             ) : (
//               <LuCheck className={`${styles.icon} ${styles.iconGreenText}`} />
//             )}
//           </div>
//           <p className={styles.toastMessage}>{message}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Toast;

import React, { useEffect } from "react";
import { LuCheck } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import styles from "./Toast.module.css";

const Toast = ({ isShown, message, type, onClose, timeout = 3000 }) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onClose();
    }, timeout);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [onClose, timeout]);

  return (
    <div
      className={`${styles.toastWrapper} ${isShown ? styles.opacity100 : styles.opacity0}`}
      aria-live="polite" // Added for accessibility
      role="alert" // Added for accessibility
    >
      <div
        className={`${styles.toastBox} ${
          type === "delete" ? styles.afterBgRed : styles.afterBgGreen
        }`}
      >
        <div className={styles.toastContent}>
          <div
            className={`${styles.iconCircle} ${
              type === "delete" ? styles.iconRed : styles.iconGreen
            }`}
          >
            {type === "delete" ? (
              <MdDeleteOutline className={`${styles.icon} ${styles.iconRedText}`} />
            ) : (
              <LuCheck className={`${styles.icon} ${styles.iconGreenText}`} />
            )}
          </div>
          <p className={styles.toastMessage}>{message}</p>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close Toast"
          >
            X
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;

