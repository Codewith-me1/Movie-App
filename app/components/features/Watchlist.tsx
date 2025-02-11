"use client";

import { SquarePlus } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthChecker";

import {
  createWatchlist,
  removeFromWatchlist,
  getUserWatchlist,
} from "@/app/firebase/database";
import { useRouter } from "next/navigation";

interface Props {
  watchListId: string;
  type: string;
}

const Watchlist = ({ watchListId, type }: Props) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false); // Tracks watchlist state
  const [isLoading, setIsLoading] = useState(false); // Tracks loading state
  const [error, setError] = useState(""); // Tracks errors
  const { user } = useAuth();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch the user's watchlist and check if the current item is in the list

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
    const fetchWatchlist = async () => {
      setIsLoading(true);
      setError("");

      try {
        if (user) {
          const watchlist = await getUserWatchlist(user?.uid); // Fetch user's watchlist

          const liked = watchlist.some(
            (item: { ID: number; Type: string }) =>
              item.ID === parseInt(watchListId) && item.Type === type
          );

          setIsInWatchlist(liked);
        }
      } catch (err) {
        console.error("Error fetching watchlist:", err);
        setError("Failed to fetch watchlist.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchlist();
  }, [user, watchListId]);

  // Add or remove the item from the watchlist
  const handleWatchlistToggle = async () => {
    verifyUser();

    setIsInWatchlist((prev) => !prev); // Optimistically update UI
    setIsLoading(true);
    setError("");

    try {
      if (!isInWatchlist) {
        // Add to watchlist
        if (user) {
          await createWatchlist(watchListId, type, user?.uid);
        }

        console.log("Added to Watchlist");
      } else {
        // Remove from watchlist
        if (user) {
          await removeFromWatchlist(watchListId, type, user?.uid);
        }
        console.log("Removed from Watchlist");
      }
    } catch (err) {
      console.error("Error updating watchlist:", err);
      setError("Failed to update watchlist. Please try again.");
      setIsInWatchlist((prev) => !prev); // Revert state on failure
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleWatchlistToggle} disabled={isLoading}>
      {isInWatchlist ? (
        <SquarePlus stroke="#3e4050" fill="white" />
      ) : (
        <SquarePlus />
      )}
    </button>
  );
};

export default Watchlist;
