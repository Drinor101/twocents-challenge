'use client';

import { Post } from "@/lib/api";
import NetWorthPill from "./NetWorthPill";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { MessageCircle, Eye, Heart } from "lucide-react";

interface PostCardProps {
  post: Post;
  onPostClick?: (uuid: string) => void;
  onUserClick?: (uuid: string) => void;
  isViewed?: boolean;
  isVoted?: boolean;
}

export default function PostCard({ 
  post, 
  onPostClick, 
  onUserClick, 
  isViewed, 
  isVoted 
}: PostCardProps) {
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
  
  const getLocationDisplay = () => {
    if (post.author.location) {
      return post.author.location;
    }
    return "Unknown";
  };

  const getAgeGenderDisplay = () => {
    const parts = [];
    if (post.author.age) parts.push(`${post.author.age}y`);
    if (post.author.gender) parts.push(post.author.gender);
    return parts.join(', ') || "Unknown";
  };

  return (
    <div 
      className={cn(
        "bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700",
        "p-6 transition-all duration-200 hover:shadow-md cursor-pointer",
        isViewed && "border-blue-200 dark:border-blue-800",
        isVoted && "border-green-200 dark:border-green-800"
      )}
      onClick={() => onPostClick?.(post.uuid)}
    >
      {/* Author Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <NetWorthPill 
            netWorth={post.author.net_worth || 0}
            username={post.author.username}
            onClick={(e) => {
              e.stopPropagation();
              onUserClick?.(post.author.uuid);
            }}
          />
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <div>{getAgeGenderDisplay()}</div>
            <div>{getLocationDisplay()}</div>
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {timeAgo}
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
          {post.body}
        </p>
      </div>

      {/* Poll Preview */}
      {post.poll && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
            {post.poll.question}
          </h4>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {post.poll.options.length} options • {post.poll.total_votes} votes
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span>{post.views.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4" />
          <span>{post.votes.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4" />
          <span>View comments</span>
        </div>
      </div>
    </div>
  );
}