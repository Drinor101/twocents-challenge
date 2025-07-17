'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPost, getComments, getPoll, getUser, Post, Comment, User } from '@/lib/api';
import NetWorthPill from '@/components/NetWorthPill';
import CommentThread from '@/components/CommentThread';
import PollDisplay from '@/components/PollDisplay';
import UserModal from '@/components/UserModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import Header from '@/components/Header';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Eye, Heart, MessageCircle, AlertCircle } from 'lucide-react';

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
  const postUuid = params.uuid as string;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [poll, setPoll] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User modal state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userLoading, setUserLoading] = useState(false);

  const fetchPostData = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const [postData, commentsData, pollData] = await Promise.allSettled([
        getPost(postUuid),
        getComments(postUuid),
        getPoll(postUuid)
      ]);

      if (postData.status === 'fulfilled') {
        setPost(postData.value);
      } else {
        throw new Error('Failed to load post');
      }

      if (commentsData.status === 'fulfilled') {
        setComments(commentsData.value || []);
      }

      if (pollData.status === 'fulfilled') {
        setPoll(pollData.value);
      }
    } catch (err) {
      console.error('Error fetching post data:', err);
      setError('Failed to load post. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [postUuid]);

  useEffect(() => {
    if (postUuid) {
      fetchPostData();
    }
  }, [postUuid, fetchPostData]);

  const handleUserClick = async (userUuid: string) => {
    setUserModalOpen(true);
    setUserLoading(true);
    setSelectedUser(null);
    setUserPosts([]);

    try {
      const user = await getUser(userUuid);
      setSelectedUser(user);
      setUserPosts(user.posts || []);
    } catch (err) {
      console.error('Error fetching user:', err);
    } finally {
      setUserLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Error Loading Post
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {error || 'Post not found'}
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go Back Home
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Feed
        </button>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Post Content */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {/* Author Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <NetWorthPill 
                  netWorth={post.author.net_worth || 0}
                  username={post.author.username}
                  onClick={() => handleUserClick(post.author.uuid)}
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

            {/* Post Body */}
            <div className="mb-6">
              <p className="text-gray-900 dark:text-gray-100 leading-relaxed text-lg">
                {post.body}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{post.views.length} views</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{post.votes.length} votes</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{comments.length} comments</span>
              </div>
            </div>
          </div>

          {/* Poll Display */}
          {poll && (
            <PollDisplay
              question={poll.question}
              options={poll.options}
              totalVotes={poll.total_votes}
            />
          )}

          {/* Comments Section */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Comments ({comments.length})
            </h2>
            
            {comments.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <CommentThread 
                comments={comments} 
                onUserClick={handleUserClick}
              />
            )}
          </div>
        </div>
      </main>

      {/* User Modal */}
      <UserModal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        user={selectedUser}
        userPosts={userPosts}
        loading={userLoading}
      />
    </div>
  );
}