'use client';

import { Comment } from "@/lib/api";
import NetWorthPill from "./NetWorthPill";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface CommentThreadProps {
  comments: Comment[];
  onUserClick?: (uuid: string) => void;
  depth?: number;
}

export default function CommentThread({ 
  comments, 
  onUserClick, 
  depth = 0 
}: CommentThreadProps) {
  const maxDepth = 3;
  
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem 
          key={comment.uuid} 
          comment={comment} 
          onUserClick={onUserClick}
          depth={depth}
          maxDepth={maxDepth}
        />
      ))}
    </div>
  );
}

function CommentItem({ 
  comment, 
  onUserClick, 
  depth, 
  maxDepth 
}: { 
  comment: Comment; 
  onUserClick?: (uuid: string) => void;
  depth: number;
  maxDepth: number;
}) {
  const timeAgo = formatDistanceToNow(new Date(comment.created_at), { addSuffix: true });
  
  const getLocationDisplay = () => {
    if (comment.author.location) {
      return comment.author.location;
    }
    return "Unknown";
  };

  const getAgeGenderDisplay = () => {
    const parts = [];
    if (comment.author.age) parts.push(`${comment.author.age}y`);
    if (comment.author.gender) parts.push(comment.author.gender);
    return parts.join(', ') || "Unknown";
  };

  return (
    <div 
      className={cn(
        "bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4",
        depth > 0 && "ml-6 border-l-2 border-l-blue-200 dark:border-l-blue-800"
      )}
    >
      {/* Author Info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <NetWorthPill 
            netWorth={comment.author.net_worth || 0}
            username={comment.author.username}
            onClick={() => onUserClick?.(comment.author.uuid)}
          />
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <div>{getAgeGenderDisplay()}</div>
            <div>{getLocationDisplay()}</div>
          </div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {timeAgo}
        </div>
      </div>

      {/* Comment Content */}
      <div className="mb-3">
        <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
          {comment.body}
        </p>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && depth < maxDepth && (
        <div className="mt-4">
          <CommentThread 
            comments={comment.replies} 
            onUserClick={onUserClick}
            depth={depth + 1}
          />
        </div>
      )}
      
      {comment.replies && comment.replies.length > 0 && depth >= maxDepth && (
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          ... {comment.replies.length} more replies
        </div>
      )}
    </div>
  );
}