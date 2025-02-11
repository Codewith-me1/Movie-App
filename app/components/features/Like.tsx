"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "@/app/context/AuthChecker";
import { useRouter } from "next/navigation";
import { addLikeData, removeLike, getUserLikes } from "@/app/firebase/database"; // Import your database functions

interface Props {
  likeId: string;
  type: string;
}

const Like = ({ likeId, type }: Props) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false); // Tracks like state
  const [isLoading, setIsLoading] = useState(false); // Tracks API status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null); // Tracks errors

  // Fetch user's like status

  const verifyUser = async () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth-token="))
      ?.split("=")[1];

    if (!token) {
      router.push("/pages/au"); // Redirect if no token
      return;
    }

    try {
      const response = await fetch(`/api/token?token=${token}`);
      if (!response.ok) throw new Error("Invalid token");

      setIsAuthenticated(true);
    } catch (error) {
      router.push("/pages/au"); // Redirect if verification fails
    }
  };

  useEffect(() => {
    const fetchUserLikes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch the user's likes from the database
        const userLikes = await getUserLikes(user?.uid); // Expects `Liked: [{ ID, Type }]`

        // Check if the current `likeId` and `type` exist in the `userLikes`
        const liked = userLikes.some(
          (item: { ID: number; Type: string }) =>
            item.ID === parseInt(likeId) && item.Type === type
        );

        setIsLiked(liked); // Update the like state
      } catch (err) {
        console.error("Error fetching likes:", err);
        setError("Failed to fetch like status.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserLikes();
  }, [user, likeId, type]); // Add `likeId` and `type` as dependencies

  // Toggle like status
  const handleLikeToggle = async () => {
    verifyUser();

    setIsLiked((prev) => !prev); // Optimistically update UI
    setIsLoading(true);
    setError(null);

    try {
      if (!isLiked) {
        // Add like if not liked
        await addLikeData(user?.uid, likeId, type);
        console.log("Like has been added");
      } else {
        // Remove like if already liked
        await removeLike(likeId, type, user?.uid);
        console.log("Like has been removed");
      }
    } catch (err) {
      console.error("Error updating like:", err);
      setIsLiked((prev) => !prev); // Revert state on failure
      setError("Failed to update like. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleLikeToggle} disabled={isLoading}>
      {isLiked ? <Heart stroke="white" fill="white" /> : <Heart />}
    </button>
  );
};

export default Like;
