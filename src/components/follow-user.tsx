"use client";

import { followUser } from "@/actions/followUser";
import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; 

export default function FollowButton({
  targetUserId,
  isFollowing: initialIsFollowing,
}: {
  targetUserId: string;
  isFollowing: boolean;
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [pending, startTransition] = useTransition();

  const handleFollow = () => {
    startTransition(async () => {
      try {
        const result = await followUser(targetUserId);
        if (result.success) {
          setIsFollowing(result.followed);
          toast.success(result.message);
        } else {
          toast.error("Something went wrong.");
        }
      } catch (err: any) {
        toast.error(err.message || "Error performing follow action");
      }
    });
  };

  return (
    <Button variant={isFollowing ? "destructive" : "default"} onClick={handleFollow} disabled={pending} className="mt-4 w-full">
      {pending ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
