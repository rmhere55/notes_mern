import { useEffect, useState } from "react";
import { MdAdd, MdComment } from "react-icons/md";
// import moment from "moment"
import { NoteCard, Navbar } from "../../Components";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../utils/axiosInstance';
import Toast from "../../Components/ToastMessage/Toast";
import EmptyCard from "../../Components/EmptyCard/EmptyCard";
import add from "../../assets/images/add-file-com.svg"
import NoDataImg from "../../assets/images/noData.svg"


const Home = () => {
    const [openAddEditModel, setOpenAddEditModel] = useState({
        inShown: false,
        type: "add",
        data: null,
    });

    

    
         const [allNotes , setAllNotes]= useState([]);
         const [userInfo , setUserInfo]= useState(null);
         const [isSearch , setIsSearch]= useState(null);

         const navigate = useNavigate()

// handleEdit = 
const handleEdit = (noteDetails)=>{
    setOpenAddEditModel({
        inShown:true , data : noteDetails , type :"edit"
    })
}

const [showToastMsg , setShowToastMsg] = useState({
    isShown:false ,
    message:"",
    type:"add",
})
const showToastMessage = (message , type)=>{
    setShowToastMsg({
        isShown:true,
        message,
        type
    })
}

const handleCloseToast =()=>{
    setShowToastMsg({
        isShown:false,
        message:"",
    })
}

// get user info
const getUserInfo = async()=>{
    try {
         const response = await axiosInstance.get("/get-user")
         if(response.data && response.data.user){
            setUserInfo(response.data.user);
         }

    } catch (error) {
        if(error.response.status === 401){
            localStorage.clear();
            navigate("/login");

        }
    }
}
// get all notes
    const getAllNotes = async()=>{
        try {
            const response = await axiosInstance.get("/get-all-notes")
            if(response.data && response.data.notes){
                setAllNotes(response.data.notes)
            }
            
        } catch (error) {
            console.log('An unexpected error occurred Please try again',error);
            
        }
    }

// Delete Note
const deleteNote = async (data)=>{

    const noteId = data._id

    try {
        const response = await axiosInstance.delete("/delete-note/" +  noteId)
        if(response.data && !response.data.error){
          showToastMessage("Notes Deleted  successfully", 'delete')
  
          getAllNotes(); // Refetch notes after delete

        }
      } catch (error) {
        if(error.response &&
          error.response.data  &&
          error.response.data.message
        )
        {
        //   setError(error.response.data.message)
        
        console.log('An unexpected error occurred Please try again',error);
        }
        
      }
      
}



// Search for a Note
const onSearchNote = async (query) => {
    if(!query.trim()){
        setIsSearch(false)
        getAllNotes()
        return
    }
    console.log("Searching for:", query);
    
    try {
      const response = await axiosInstance.get("/search-note", {
        params: { query },
      });
      console.log("Search response:", response.data);  // Add this for debugging

      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };


const updatedPinned =async (noteData)=>{
    const noteId = noteData._id
    try {
      const response = await axiosInstance.put("/update-note-pinned/" +  noteId,{
        "isPinned": !noteData.isPinned
      })
      if(response.data && response.data.note){
        showToastMessage("Notes updated  successfully")

        getAllNotes();
        
      }
    } catch (error) {
     console.log(error);
     
      
    }
   
}


  const handleClearSearch =()=>{
 setIsSearch(false)
 getAllNotes()
  }
  
        useEffect(() => {
            getAllNotes()
            getUserInfo()
            return () => {  
            };
        }, []);

    return (
        <>
            <Navbar userInfo = {userInfo} onSearchNote={onSearchNote}  handleClearSearch={handleClearSearch}  
            />
            <div className={styles.container}>
            {allNotes.length > 0 ? (<div className={styles.notesGrid}>
                {allNotes.map((item , index )=>{
                     return (
                    <NoteCard
                    key={item._id}
                        title={item.title}
                        date={item.createOn}
                        content={item.content}
                        tags={item.tags}
                        isPinned={item.isPinned}
                        onEdit={() => handleEdit(item)}
                        onDelete={() => deleteNote(item)}
                        onPinNote={() => updatedPinned(item)}
                    />
                     )
                })}
                </div>
                ) : (
                    <EmptyCard imgSrc={isSearch ? NoDataImg: add}
                    message={ isSearch ? `Oops! No notes found matching your search`:`Start creating your first note! Click the "Add"button to jot down your thoughts , ideas , and reminders. Let's get started!`}
                    />
                )}
            </div>

            <button
                  className={styles.addButton}

                onClick={() => {
                    setOpenAddEditModel({
                        inShown: true,
                        type: "add",
                        data: null,
                    });
                }}
            >
                  <MdAdd className={styles.addIcon} />
 
            </button>

            <Modal
                isOpen={openAddEditModel.inShown}
                onRequestClose={() => {
                    setOpenAddEditModel({
                        inShown: false,
                        type: "add",
                        data: null,
                    });
                }}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0,0,0,0.2)",
                    },
                }}
                contentLabel="Add/Edit Note"
                className={styles.modalContent}

            >
                <AddEditNotes
                    type={openAddEditModel.type}
                    noteData={openAddEditModel.data}
                    onClose={() => {
                        setOpenAddEditModel({
                            inShown: false,
                            type: "add",
                            data: null,
                        });
                    }}
                    getAllNotes= {getAllNotes}
                    showToastMessage={showToastMessage}
                />
            </Modal>
            <Toast
            isShown = {showToastMsg.isShown}
            message = {showToastMsg.message}
            type ={showToastMsg.type}
            onClose= {handleCloseToast}

            />
        </>
    );
};

export default Home;
