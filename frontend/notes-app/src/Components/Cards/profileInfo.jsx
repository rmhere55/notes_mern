import React from 'react';
import { getInitials } from '../../utils/helper';
import styles from './ProfileInfo.module.css'; // 👈 Import CSS module

const ProfileInfo = ({ userInfo ,onLogout }) => {
  if (!userInfo) return null; // Prevent errors if userInfo is not available

  return (
    <div className={styles.container}>
      <div className={styles.avatar}>
        {getInitials(userInfo?.fullName)}
      </div>
      <div>
        <p className={styles.name}>{userInfo?.fullName}</p>
        <button className={styles.logoutBtn} onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
