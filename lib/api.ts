export interface Post {
  uuid: string;
  body: string;
  author: {
    uuid: string;
    username: string;
    age?: number;
    gender?: string;
    location?: string;
    net_worth?: number;
  };
  created_at: string;
  views: string[];
  votes: string[];
  poll?: {
    uuid: string;
    question: string;
    options: Array<{
      text: string;
      votes: number;
    }>;
    total_votes: number;
  };
}

export interface Comment {
  uuid: string;
  body: string;
  author: {
    uuid: string;
    username: string;
    age?: number;
    gender?: string;
    location?: string;
    net_worth?: number;
  };
  created_at: string;
  replies?: Comment[];
}

export interface User {
  uuid: string;
  username: string;
  age?: number;
  gender?: string;
  location?: string;
  net_worth?: number;
  posts?: Post[];
}

export interface Poll {
  uuid: string;
  question: string;
  options: Array<{
    text: string;
    votes: number;
  }>;
  total_votes: number;
}

// API Response types based on the Swift code
export interface APIResponse {
  Posts: {
    Feed: {
      posts: Post[];
      views?: Array<{ content_uuid: string }>;
      votes?: Array<{ content_uuid: string; vote_type: number }>;
    };
    Get: {
      post: Post;
    };
  };
  Comments: {
    Get: {
      comments: Comment[];
    };
  };
  Polls: {
    Get: {
      poll: Poll;
    };
  };
  Users: {
    Get: {
      user: User;
    };
  };
}

// Mock data for development (fallback when API is unavailable)
const mockUsers = [
  {
    uuid: "user-1",
    username: "CryptoKing",
    age: 28,
    gender: "Male",
    location: "San Francisco, CA",
    net_worth: 2500000
  },
  {
    uuid: "user-2", 
    username: "TechGuru",
    age: 35,
    gender: "Male",
    location: "Seattle, WA",
    net_worth: 1800000
  },
  {
    uuid: "user-3",
    username: "StartupQueen",
    age: 31,
    gender: "Female", 
    location: "Austin, TX",
    net_worth: 3200000
  },
  {
    uuid: "user-4",
    username: "InvestorPro",
    age: 42,
    gender: "Male",
    location: "New York, NY", 
    net_worth: 8500000
  },
  {
    uuid: "user-5",
    username: "FinanceWiz",
    age: 29,
    gender: "Female",
    location: "Boston, MA",
    net_worth: 1200000
  }
];

const mockPosts = [
  {
    uuid: "post-1",
    body: "Just sold my startup for $50M! The journey from my garage to this exit has been incredible. Key lesson: focus on solving real problems, not just building cool tech.",
    author: mockUsers[0],
    created_at: "2024-01-15T10:30:00Z",
    views: ["anon", "user-2", "user-3"],
    votes: ["anon", "user-2"],
    poll: {
      uuid: "poll-1",
      question: "What's the most important factor for startup success?",
      options: [
        { text: "Product-Market Fit", votes: 45 },
        { text: "Team Quality", votes: 32 },
        { text: "Timing", votes: 28 },
        { text: "Funding", votes: 15 }
      ],
      total_votes: 120
    }
  },
  {
    uuid: "post-2",
    body: "The AI revolution is happening faster than anyone predicted. Companies that don't adapt will be left behind. What's your take on the future of work?",
    author: mockUsers[1],
    created_at: "2024-01-15T09:15:00Z", 
    views: ["anon", "user-1", "user-4"],
    votes: ["anon", "user-1", "user-4", "user-5"]
  },
  {
    uuid: "post-3",
    body: "Diversification is key! Don't put all your eggs in one basket. My portfolio: 40% stocks, 30% real estate, 20% crypto, 10% bonds. How do you allocate?",
    author: mockUsers[3],
    created_at: "2024-01-15T08:45:00Z",
    views: ["anon", "user-1", "user-2", "user-5"],
    votes: ["anon", "user-2", "user-5"]
  },
  {
    uuid: "post-4",
    body: "Remote work is here to stay. My team's productivity increased 40% since going fully remote. The key is trust and clear communication.",
    author: mockUsers[2],
    created_at: "2024-01-15T07:20:00Z",
    views: ["anon", "user-1", "user-3", "user-4"],
    votes: ["anon", "user-1", "user-3"]
  },
  {
    uuid: "post-5",
    body: "Compound interest is the 8th wonder of the world. Started investing $500/month at 25, now worth $2.3M at 45. Start early, stay consistent!",
    author: mockUsers[4],
    created_at: "2024-01-15T06:30:00Z",
    views: ["anon", "user-2", "user-3", "user-4"],
    votes: ["anon", "user-2", "user-3", "user-4"]
  }
];

const mockComments = [
  {
    uuid: "comment-1",
    body: "Congratulations! What was the biggest challenge you faced during the journey?",
    author: mockUsers[1],
    created_at: "2024-01-15T11:00:00Z",
    replies: [
      {
        uuid: "reply-1",
        body: "Thanks! The biggest challenge was finding product-market fit. We pivoted 3 times before getting it right.",
        author: mockUsers[0],
        created_at: "2024-01-15T11:15:00Z"
      }
    ]
  },
  {
    uuid: "comment-2",
    body: "This is inspiring! How did you handle the early days when you had no funding?",
    author: mockUsers[4],
    created_at: "2024-01-15T11:30:00Z"
  }
];

import { API_CONFIG, DEV_CONFIG } from './config';

export async function call<T>(method: string, parameters: Record<string, any> = {}): Promise<T> {
  const requestId = crypto.randomUUID(); 
  const body = {
    jsonrpc: "2.0",
    id: requestId,
    method,
    params: parameters, 
  };

  try {
    
    console.debug("API Request:", { method, parameters });

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    const response = await fetch(API_CONFIG.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Origin": typeof window !== 'undefined' ? window.location.origin : "http://localhost:3000"
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const rawText = await response.text();
    const truncatedText = rawText.length > 500 ? rawText.slice(0, 500) + "..." : rawText;
    console.debug("API Response:", truncatedText); // Debug logging

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${rawText || response.statusText}`);
    }

    const data = JSON.parse(rawText);

    // Handle JSON-RPC error (like Swift's `if let error = decodedResponse.error`)
    if (data.error) {
      throw new Error(`JSON-RPC Error ${data.error.code}: ${data.error.message}`);
    }

    return data.result as T;
  } catch (error) {
    console.error("API Call Failed:", { method, parameters, error: error instanceof Error ? error.message : error });
    
    // Fallback to mock data for development
    if (DEV_CONFIG.ENABLE_MOCK_FALLBACK) {
      return getMockData(method, parameters);
    }
    throw error;
  }
}

function getMockData<T>(method: string, parameters: Record<string, any>): Promise<T> {
  // Simulate API delay
  return new Promise(resolve => {
    setTimeout(() => {
      switch (method) {
        case '/v1/posts/arena':
          const { filter } = parameters;
          let filteredPosts = [...mockPosts];
          
          switch (filter) {
            case 'Top Today':
              filteredPosts.sort((a, b) => b.votes.length - a.votes.length);
              break;
            case 'New Today':
              filteredPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
              break;
            case 'Top All Time':
              filteredPosts.sort((a, b) => (b.votes.length + b.views.length) - (a.votes.length + a.views.length));
              break;
            case 'Controversial All Time':
              filteredPosts.sort((a, b) => {
                const aRatio = a.views.length > 0 ? a.votes.length / a.views.length : 0;
                const bRatio = b.views.length > 0 ? b.votes.length / b.views.length : 0;
                return Math.abs(0.5 - aRatio) - Math.abs(0.5 - bRatio);
              });
              break;
          }
          
          resolve({
            posts: filteredPosts,
            views: [
              { content_uuid: "post-1" },
              { content_uuid: "post-2" },
              { content_uuid: "post-3" }
            ],
            votes: [
              { content_uuid: "post-1", vote_type: 1 },
              { content_uuid: "post-2", vote_type: 1 },
              { content_uuid: "post-3", vote_type: -1 }
            ]
          } as T);
          break;
          
        case '/v1/posts/get':
          const { post_uuid } = parameters;
          const post = mockPosts.find(p => p.uuid === post_uuid);
          resolve({ post: post || mockPosts[0] } as T);
          break;
          
        case '/v1/comments/get':
          const { post_uuid: commentPostUuid } = parameters;
          resolve({ comments: commentPostUuid === 'post-1' ? mockComments : [] } as T);
          break;
          
        case '/v1/polls/get':
          const { post_uuid: pollPostUuid } = parameters;
          const pollPost = mockPosts.find(p => p.uuid === pollPostUuid);
          resolve({ poll: pollPost?.poll || null } as T);
          break;
          
        case '/v1/users/get':
          const { user_uuid } = parameters;
          const user = mockUsers.find(u => u.uuid === user_uuid);
          if (!user) {
            throw new Error('User not found');
          }
          
          const userPosts = mockPosts.filter(p => p.author.uuid === user_uuid);
          resolve({ user: { ...user, posts: userPosts } } as T);
          break;
          
        default:
          // For unknown methods, return a generic success response
          resolve({ status: 'ok', method, parameters } as T);
      }
    }, DEV_CONFIG.MOCK_DELAY);
  });
}

export async function getPosts(filter: string): Promise<Post[]> {
  try {
    const result = await call<APIResponse['Posts']['Feed']>('/v1/posts/arena', { filter });
    return result.posts || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

export async function getPost(postUuid: string): Promise<Post | null> {
  try {
    const result = await call<APIResponse['Posts']['Get']>('/v1/posts/get', { post_uuid: postUuid });
    return result.post;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
}

export async function getComments(postUuid: string): Promise<Comment[]> {
  try {
    const result = await call<APIResponse['Comments']['Get']>('/v1/comments/get', { post_uuid: postUuid });
    return result.comments || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}

export async function getPoll(postUuid: string): Promise<Poll | null> {
  try {
    const result = await call<APIResponse['Polls']['Get']>('/v1/polls/get', { post_uuid: postUuid });
    return result.poll;
  } catch (error) {
    console.error('Error fetching poll:', error);
    throw error;
  }
}

export async function getUser(userUuid: string): Promise<User> {
  try {
    const result = await call<APIResponse['Users']['Get']>('/v1/users/get', { user_uuid: userUuid });
    return result.user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}
