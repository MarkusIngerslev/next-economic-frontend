"use client";

import { useAuth } from "@/context/AuthContext";
import ChatButton from "@/app/ui/shared/chat/ChatButton";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, isAuthReady } = useAuth();

  return (
    <>
      {children}
      {isAuthReady && token && <ChatButton />}
    </>
  );
}
