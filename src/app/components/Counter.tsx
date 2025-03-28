"use client";
import { PartyPopper } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/Button";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <Button type="button" variant="outline" onClick={() => setCount(count + 1)}>
      <PartyPopper />
      Hi {count}
    </Button>
  );
}
