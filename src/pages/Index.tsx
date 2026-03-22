import { useState } from "react";
import PasswordGate from "@/components/PasswordGate";
import FileExplorer from "@/components/FileExplorer";

const Index = () => {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  return <FileExplorer />;
};

export default Index;
