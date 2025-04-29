// require("dotenv").config();
require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

console.log(process.env.MONGO_URI);

// Ensure that the connection string is defined
if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is undefined! Make sure your .env file is loaded.");
    process.exit(1);
  }
  mongoose.connect(process.env.MONGO_URI)  
  .then(() => console.log("Database connected successfully"))
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });


const express = require("express");
const cors = require("cors");
const app = express();
const User = require("./models/user.model");  // Import User model
const Note = require("./models/notes.model");  // Import User model

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities/utilities");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});


// Backend Ready 

// create Account

app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: true, message: "Please fill in all fields" });
  }

  try {
    const isUser = await User.findOne({ email });
    if (isUser) {
      return res.status(400).json({ error: true, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ fullName, email, password: hashedPassword });
    const savedUser = await user.save();

    const sanitizedUser = {
      _id: savedUser._id,
      fullName: savedUser.fullName,
      email: savedUser.email,
    };

    const accessToken = jwt.sign({ user: sanitizedUser }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1h',
    });

    return res.json({
      error: false,
      user: sanitizedUser,
      accessToken,
      message: "Account created successfully",
    });
  } catch (error) {
    res.status(400).json({ message: "Failed to create account", error });
  }
});




// Login 
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: true,
      message: "Please fill in all fields",
    });
  }

  const userInfo = await User.findOne({ email: email });
  if (!userInfo) {
    return res.status(400).json({ error: true, message: "Email not found" });
  }

  // ✅ Compare hashed password
  const isPasswordValid = await bcrypt.compare(password, userInfo.password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: true, message: "Invalid email or password" });
  }

  const user = {
    _id: userInfo._id,
    fullName: userInfo.fullName,
    email: userInfo.email,
  };

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Logged in successfully",
  });
});


// Get users
app.get("/get-user", authenticateToken , async (req, res) => {
  const {user} = req.user
  const isUser = await User.findOne({ _id: user._id});

  if(!isUser){
    return res.sendStatus(401)
  }

  return res.json({
    user: { fullName: isUser.fullName , email: isUser.email ,"_id": isUser._id,
      createdOn : isUser.createOn
     },
    message: "",
  })

})


// Add Notes api
app.post("/add-note" , authenticateToken , async (req , res)=>{
  const {title, content , tags} = req.body;
  const {user } = req.user
  if (!title 
    || !content 
  ){
    return res.status(400).json({
      error: true,
      message: "Please fill in all fields",
    })
  }
try{
  const note = new Note({
    title ,
    content ,
    tags : tags || [],
    userId : user._id 
    });
    await note.save();
    return res.status(201).json({
      error: false,
      note,
      message: "Note added successfully",
      });
      } catch (error) {
        return res.status(500).json({
          error: true,
          message: "Failed to add note",
          });
          
}
})


// const mongoose = require("mongoose");
// EDIT API   

app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId.trim(); // Trim to remove unwanted characters
  const { title, content, tags, isPinned } = req.body;
  const user = req.user.user; // Extracting the actual user object from the JWT payload

  // Check if noteId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    return res.status(400).json({
      error: true,
      message: "Invalid note ID format",
    });
  }

  // Validation: ensure at least one field to update is provided
  if (!title && !content && !tags && typeof isPinned === 'undefined') {
    return res.status(400).json({
      error: true,
      message: "No changes provided",
    });
  }

  try {
    // Ensure the note belongs to the user
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({
        error: true,
        message: "Note not found or you do not have permission to edit it",
      });
    }

    // Update fields if provided
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags !== undefined) note.tags = tags;
    if (typeof isPinned !== 'undefined') note.isPinned = isPinned;

    const updatedNote = await note.save();

    return res.status(200).json({
      error: false,
      note: updatedNote,
      message: "Note updated successfully",
    });
  } catch (error) {
    console.error("Error updating note:", error);
    return res.status(500).json({
      error: true,
      message: "Failed to update note",
    });
  }
});


//  get all notes 
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  const { user } = req.user;
  
  console.log(user);

  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
    return res.json({
      error: false,
      notes,
      message: "Notes retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving notes:", error);
    return res.status(500).json({
      error: true,
      message: "Failed to retrieve notes",
    });
  }
});

// //  Delete notes 
// app.delete("/delete-notes/:noteId", authenticateToken, async (req, res) => {
//   const noteId = req.params.noteId;
//   const { user } = req.user;

//   try {
//     const notes = await Note.find({ userId: user._id , _id: noteId}).sort({ isPinned: -1 });

//     if(!note){
//       return res.status(404).json({
//         error: true,
//         message: "Note not found",
//       })
//     }

//     await Note.deleteOne({_id: noteId, userId: user._id})

//     return res.json({
//       error: false,
//       message: "Notes delete successfully",
//     });
//   } catch (error) {
//     console.error("Error delete notes:", error);
//     return res.status(500).json({
//       error: true,
//       message: "Failed to delete notes",
//     });
//   }
// });

app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;

  try {
    const deletedNote = await Note.findOneAndDelete({ _id: noteId, userId: user._id });

    if (!deletedNote) {
      return res.status(404).json({
        error: true,
        message: "Note not found",
      });
    }

    return res.json({
      error: false,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting note:", error);
    return res.status(500).json({
      error: true,
      message: "Failed to delete note",
    });
  }
});



// update is pinned Value
// app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
//   const noteId = req.params.noteId.trim(); // Trim to remove unwanted characters
//   const { title, content, tags, isPinned } = req.body;
//   const user = req.user.user; // Extracting the actual user object from the JWT payload

//   // Check if noteId is a valid MongoDB ObjectId
//   if (!mongoose.Types.ObjectId.isValid(noteId)) {
//     return res.status(400).json({
//       error: true,
//       message: "Invalid note ID format",
//     });
//   }

//   // Validation: ensure at least one field to update is provided
//   if (!title && !content && !tags && typeof isPinned === 'undefined') {
//     return res.status(400).json({
//       error: true,
//       message: "No changes provided",
//     });
//   }

//   try {
//     // Ensure the note belongs to the user
//     const note = await Note.findOne({ _id: noteId, userId: user._id });

//     if (!note) {
//       return res.status(404).json({
//         error: true,
//         message: "Note not found or you do not have permission to edit it",
//       });
//     }

//     // Update fields if provided
//     if (title !== undefined) note.title = title;
//     if (content !== undefined) note.content = content;
//     if (tags !== undefined) note.tags = tags;
//     if (typeof isPinned !== 'undefined') note.isPinned = isPinned;

//     const updatedNote = await note.save();

//     return res.status(200).json({
//       error: false,
//       note: updatedNote,
//       message: "Note updated successfully",
//     });
//   } catch (error) {
//     console.error("Error updating note:", error);
//     return res.status(500).json({
//       error: true,
//       message: "Failed to update note",
//     });
//   }
// });

app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId.trim();
  const { isPinned } = req.body;
  const user = req.user.user;

  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    return res.status(400).json({
      error: true,
      message: "Invalid note ID format",
    });
  }

  if (typeof isPinned !== 'boolean') {
    return res.status(400).json({
      error: true,
      message: "'isPinned' must be true or false",
    });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({
        error: true,
        message: "Note not found or you do not have permission to edit it",
      });
    }

    note.isPinned = isPinned;
    const updatedNote = await note.save();

    return res.status(200).json({
      error: false,
      note: updatedNote,
      message: `Note ${isPinned ? 'pinned' : 'unpinned'} successfully`,
    });
  } catch (error) {
    console.error("Error updating pinned status:", error);
    return res.status(500).json({
      error: true,
      message: "Failed to update pinned status",
    });
  }
});


// search notes
app.get("/search-note/", authenticateToken, async (req, res) => {
 const {user} = req.user;
 const {query} = req.query;
 console.log(query);
 
 if (!query) {
  return res.status(400).json({
    error: true,
    message: "Search query is required",
  });
}
try {
  const matchingNotes = await Note.find({
    userId: user._id,
    $or: [
      { title: { $regex: new RegExp(query, "i") } },
      { content: { $regex: new RegExp(query, "i") } },
    ],
  });
  return res.json({
    error: false,
    notes: matchingNotes,
    message: "Notes matching the search query retrieved successfully",
  });
} catch (error) {
  return res.status(500).json({
    error: true,
    message: "Internal Server Error",
  });
}
});






app.listen(8000, () => {
    console.log("Server is running on port 8000");
});


module.exports = app;
