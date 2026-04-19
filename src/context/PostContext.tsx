"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface PostContextType {
  activePostSlug: string | null;
  openPost: (slug: string) => void;
  closePost: () => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: React.ReactNode }) {
  const [activePostSlug, setActivePostSlug] = useState<string | null>(null);

  const openPost = useCallback((slug: string) => {
    setActivePostSlug(slug);
  }, []);

  const closePost = useCallback(() => {
    setActivePostSlug(null);
  }, []);

  return (
    <PostContext.Provider value={{ activePostSlug, openPost, closePost }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePost() {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error("usePost must be used within a PostProvider");
  }
  return context;
}
