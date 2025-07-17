'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, Post } from "@/lib/api";
import NetWorthPill from "./NetWorthPill";
import PostCard from "./PostCard";
import LoadingSpinner from "./LoadingSpinner";
import { useRouter } from "next/navigation";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  userPosts: Post[];
  loading: boolean;
}

export default function UserModal({ 
  isOpen, 
  onClose, 
  user, 
  userPosts, 
  loading 
}: UserModalProps) {
  const router = useRouter();

  if (!user && !loading) return null;

  const getLocationDisplay = () => {
    if (user?.location) {
      return user.location;
    }
    return "Unknown";
  };

  const getAgeGenderDisplay = () => {
    const parts = [];
    if (user?.age) parts.push(`${user.age} years old`);
    if (user?.gender) parts.push(user.gender);
    return parts.join(', ') || "Unknown";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : user ? (
          <div className="space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <NetWorthPill 
                netWorth={user.net_worth || 0}
                username={user.username}
              />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <div>{getAgeGenderDisplay()}</div>
                <div>{getLocationDisplay()}</div>
              </div>
            </div>

            {/* User Posts */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Recent Posts ({userPosts.length})
              </h3>
              
              {userPosts.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No posts found for this user.
                </p>
              ) : (
                <div className="space-y-4">
                  {userPosts.map((post) => (
                    <PostCard
                      key={post.uuid}
                      post={post}
                      onPostClick={(uuid) => {
                        onClose();
                        router.push(`/post/${uuid}`);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Failed to load user information.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}