import { doc , getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, deleteField } from "firebase/firestore";

import { db } from './config'





export const saveUserData  = async(userId,userData)=>{

    try{ 
        await setDoc(doc(db, "users", userId), userData);
        console.log("User Added Successfully")
    }
    catch(error){
        console.log("There has been some error" + error)
    }

}



export const addLikeData = async (userId, likedId,type) => {
  try {
    // Reference the specific user's document
    const userDocRef = doc(db, "users", userId);

    // Update the 'Liked' field in the user's document
    await updateDoc(userDocRef, {
      Liked: arrayUnion({ID:likedId,Type:type}), // Add the likedId to the "Liked" array field
    });

    console.log(`Successfully added ${likedId} to the Liked array`);
  } catch (error) {
    if (error.code === "not-found") {
      console.error("Document does not exist.");
    } else {
      console.error("Error updating document: ", error.message);
    }
  }
};



export const addGenreData = async (userId, genreDataArray) => {
    try {
      // Use a batch update to add each genre individually to ensure no duplicates
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        genres: arrayUnion(...genreDataArray) // Spread array to add each item separately
      });
      console.log('Genres added successfully');
    } catch (error) {
      console.error("There was an error adding genres: ", error);
    }
  };




  
export const removeLike = async (userId, likeId, type) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const updatedLikes = userData.Liked
        ? userData.Liked.filter(like => like.ID !== likeId || like.Type !== type)
        : [];

      await updateDoc(userRef, {
        Liked: updatedLikes
      });

      console.log(`Like with ID ${likeId} has been removed for user ${userId}`);
    } else {
      console.log("User not found");
    }
  } catch (error) {
    console.error("Error removing like:", error);
    throw new Error("Failed to remove like. Please try again.");
  }
};



  export const getUserLikes = async (uid) => {

    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
  
    if (!docSnap.exists()) {
      throw new Error("No such document!");
    }
    return docSnap.data().Liked || [];
  };



  export const createUserInFirestore = async (user) => {
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
      }, { merge: true }); // Merge to prevent overwriting existing data
      console.log("User added/updated in Firestore");
    } catch (error) {
      console.error("Error creating user in Firestore: ", error);
    }
  };
  



  export const createWatchlist = async (userId, watchId,type) => {
    try {
      // Reference the specific user's document
      const userDocRef = doc(db, "users", userId);
  
      // Update the 'Liked' field in the user's document
      await updateDoc(userDocRef, {
        Watchlist: arrayUnion({ID:watchId,Type:type}), // Add the likedId to the "Liked" array field
      });
  
      console.log(`Successfully added ${watchId} to the Watchlist `);
    } catch (error) {
      if (error.code === "not-found") {
        console.error("Document does not exist.");
      } else {
        console.error("Error updating document: ", error.message);
      }
    }
  };
  
  


  



  export const removeFromWatchlist = async (userId, watchlistId, type) => {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
  
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const updatedWatchlist = userData.Watchlist
          ? userData.Watchlist.filter(item => item.ID !== watchlistId || item.Type !== type)
          : [];
  
        await updateDoc(userRef, {
          Watchlist: updatedWatchlist
        });
  
        console.log(`Item with ID ${watchlistId} has been removed from Watchlist for user ${userId}`);
      } else {
        console.log("User not found");
      }
    } catch (error) {
      console.error("Error removing item from Watchlist:", error);
      throw new Error("Failed to remove item from Watchlist. Please try again.");
    }
  };

  
export const getUserWatchlist = async (userId) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().Watchlist || []; 
  } else {
    throw new Error("User document not found");
  }
};

