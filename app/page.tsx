'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPosts, getUser, Post, User } from '@/lib/api';
import PostCard from '@/components/PostCard';
import PostSkeleton from '@/components/PostSkeleton';
import FilterTabs from '@/components/FilterTabs';
import UserModal from '@/components/UserModal';
import Header from '@/components/Header';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('Top Today');
  const [refreshing, setRefreshing] = useState(false);
  
  // User modal state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userLoading, setUserLoading] = useState(false);

  const router = useRouter();

  const fetchPosts = async (filter: string) => {
    try {
      setError(null);
      const result = await getPosts(filter);
      setPosts(result || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      
      // Provide more specific error messages
      if (errorMessage.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please check your internet connection and try again.');
      } else if (errorMessage.includes('CORS')) {
        setError('Network access blocked. Please try refreshing the page.');
      } else if (errorMessage.includes('HTTP 404')) {
        setError('API endpoint not found. Please contact support.');
      } else if (errorMessage.includes('HTTP 500')) {
        setError('Server error. Please try again in a few moments.');
      } else {
        setError(`Failed to load posts: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts(activeFilter);
  }, [activeFilter]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setLoading(true);
    fetchPosts(filter);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts(activeFilter);
  };

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

  const handlePostClick = (postUuid: string) => {
    router.push(`/post/${postUuid}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Social Feed
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Where your username is your net worth
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <FilterTabs 
          activeFilter={activeFilter} 
          onFilterChange={handleFilterChange}
        />

        {/* Content */}
        {error ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Error Loading Posts
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {error}
              </p>
              <button
                onClick={() => fetchPosts(activeFilter)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No posts found for this filter.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.uuid}
                post={post}
                onPostClick={handlePostClick}
                onUserClick={handleUserClick}
                isViewed={post.views.includes('anon')}
                isVoted={post.votes.includes('anon')}
              />
            ))}
          </div>
        )}
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