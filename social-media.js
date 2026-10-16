// social-media.js - Social Media influencer app

// Social media posts and their engagement potential
const SOCIAL_MEDIA_POSTS = [
  // Lifestyle posts
  { category: "lifestyle", text: "Just had the most amazing coffee ☕", engagement: { base: 15, happiness: 2 }, cost: 0 },
  { category: "lifestyle", text: "Living my best life! 🌟", engagement: { base: 25, happiness: 3 }, cost: 0 },
  { category: "lifestyle", text: "New day, new opportunities 💪", engagement: { base: 20, happiness: 2 }, cost: 0 },
  { category: "lifestyle", text: "Grateful for this beautiful morning 🌅", engagement: { base: 18, happiness: 3 }, cost: 0 },
  
  // Fashion/Shopping posts  
  { category: "fashion", text: "Check out my new outfit! Looking fresh 👗", engagement: { base: 30, happiness: 1 }, cost: 50 },
  { category: "fashion", text: "Retail therapy was exactly what I needed 🛍️", engagement: { base: 35, happiness: 2 }, cost: 100 },
  { category: "fashion", text: "Feeling fabulous in my new shoes! 👠", engagement: { base: 28, happiness: 1 }, cost: 75 },
  
  // Food posts
  { category: "food", text: "This meal is absolutely incredible! 🍽️", engagement: { base: 40, happiness: 4 }, cost: 25 },
  { category: "food", text: "Homemade dinner never tasted so good 👨‍🍳", engagement: { base: 35, happiness: 3 }, cost: 15 },
  { category: "food", text: "Trying out this trendy new restaurant 🍕", engagement: { base: 45, happiness: 3 }, cost: 40 },
  
  // Travel/Adventure posts
  { category: "travel", text: "Exploring new places fills my soul ✈️", engagement: { base: 60, happiness: 5 }, cost: 200 },
  { category: "travel", text: "Weekend getaway vibes! 🏖️", engagement: { base: 55, happiness: 4 }, cost: 150 },
  { category: "travel", text: "Adventure awaits around every corner 🗺️", engagement: { base: 50, happiness: 4 }, cost: 100 },
  
  // Achievement posts
  { category: "achievement", text: "Just got promoted at work! Hard work pays off 🎉", engagement: { base: 80, happiness: 5 }, cost: 0 },
  { category: "achievement", text: "Reached a new personal milestone today! 🏆", engagement: { base: 70, happiness: 4 }, cost: 0 },
  { category: "achievement", text: "Finally completed that project I've been working on 💼", engagement: { base: 65, happiness: 3 }, cost: 0 },
  
  // Luxury posts
  { category: "luxury", text: "Treated myself to something special today 💎", engagement: { base: 100, happiness: 3 }, cost: 500 },
  { category: "luxury", text: "Living the luxury lifestyle! 🥂", engagement: { base: 120, happiness: 4 }, cost: 300 },
  { category: "luxury", text: "Sometimes you have to splurge on yourself ✨", engagement: { base: 90, happiness: 3 }, cost: 250 }
];

// Follower milestones and their benefits
const FOLLOWER_MILESTONES = {
  100: { bonus: 10, message: "🎉 100 followers! You're building a community!" },
  500: { bonus: 50, message: "🚀 500 followers! You're gaining influence!" },
  1000: { bonus: 150, message: "⭐ 1K followers! You're an influencer now!" },
  5000: { bonus: 500, message: "🌟 5K followers! Brands want to work with you!" },
  10000: { bonus: 1200, message: "👑 10K followers! You're social media royalty!" },
  25000: { bonus: 3000, message: "💎 25K followers! Major influencer status!" },
  50000: { bonus: 6000, message: "🏆 50K followers! You're practically famous!" }
};

let socialMediaState = {
  followers: 0,
  totalLikes: 0,
  totalPosts: 0,
  wallet: 0,
  dailyPostsLeft: 3,
  lastPostTime: null,
  influencerLevel: 'Beginner',
  engagementRate: 1.0
};

/**
 * Open Social Media App
 */
function openSocialMedia() {
  const data = loadGameData();
  socialMediaState.wallet = data.bankBalance || 0;
  
  // Initialize or load social media data
  if (data.socialMediaStats) {
    socialMediaState.followers = data.socialMediaStats.followers || 0;
    socialMediaState.totalLikes = data.socialMediaStats.totalLikes || 0;
    socialMediaState.totalPosts = data.socialMediaStats.totalPosts || 0;
    socialMediaState.dailyPostsLeft = data.socialMediaStats.dailyPostsLeft || 3;
  }
  
  updateInfluencerLevel();
  
  document.getElementById('modal-title').innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <div style="width: 32px; height: 32px; background: linear-gradient(45deg, #f58529, #dd2a7b, #8134af, #515bd4); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
        <span style="color: white; font-size: 16px;">📷</span>
      </div>
      <span>Instagram</span>
    </div>
  `;
  document.getElementById('modal-body').innerHTML = `
    <div class="instagram-app">
      <!-- Instagram Header -->
      <div class="instagram-header">
        <div class="header-left">
          <div class="instagram-logo">Instagram</div>
        </div>
        <div class="header-right">
          <div class="header-icon">💌</div>
          <div class="header-icon">❤️</div>
        </div>
      </div>

      <!-- Stories Section -->
      <div class="stories-section">
        <div class="story-item my-story">
          <div class="story-ring">
            <div class="story-avatar">📷</div>
            <div class="add-story-plus">+</div>
          </div>
          <div class="story-label">Your story</div>
        </div>
        <div class="story-item">
          <div class="story-ring">
            <div class="story-avatar">🧑‍💼</div>
          </div>
          <div class="story-label">Alex</div>
        </div>
        <div class="story-item">
          <div class="story-ring viewed">
            <div class="story-avatar">👩‍🎨</div>
          </div>
          <div class="story-label">Maya</div>
        </div>
        <div class="story-item">
          <div class="story-ring">
            <div class="story-avatar">🧑‍🎯</div>
          </div>
          <div class="story-label">Jake</div>
        </div>
      </div>

      <!-- Profile Stats -->
      <div class="profile-section">
        <div class="profile-pic">📷</div>
        <div class="profile-stats">
          <div class="stat-item">
            <div class="stat-number">${socialMediaState.totalPosts}</div>
            <div class="stat-label">posts</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${formatNumber(socialMediaState.followers)}</div>
            <div class="stat-label">followers</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${formatNumber(socialMediaState.totalLikes)}</div>
            <div class="stat-label">likes</div>
          </div>
        </div>
      </div>

      <!-- Bio -->
      <div class="profile-bio">
        <div class="profile-name">${data.name || 'Player'}</div>
        <div class="profile-title">${socialMediaState.influencerLevel}</div>
        <div class="earning-info">💰 €${socialMediaState.wallet} earned</div>
        <div class="posts-status">${socialMediaState.dailyPostsLeft}/3 posts remaining today</div>
      </div>

      <!-- Stats Dashboard -->
      <div class="social-stats">
        <div class="stat-card">
          <div class="stat-value">${socialMediaState.totalPosts}</div>
          <div class="stat-label">Posts</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${formatNumber(socialMediaState.totalLikes)}</div>
          <div class="stat-label">Total Likes</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${Math.round(socialMediaState.engagementRate * 100)}%</div>
          <div class="stat-label">Engagement</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${socialMediaState.dailyPostsLeft}</div>
          <div class="stat-label">Posts Left</div>
        </div>
      </div>

      <!-- Post Creation -->
      <div class="post-creation">
        <h3>Create a Post</h3>
        <div class="post-categories">
          <button class="category-filter active" onclick="filterPosts('all')">All</button>
          <button class="category-filter" onclick="filterPosts('lifestyle')">Lifestyle</button>
          <button class="category-filter" onclick="filterPosts('fashion')">Fashion</button>
          <button class="category-filter" onclick="filterPosts('food')">Food</button>
          <button class="category-filter" onclick="filterPosts('travel')">Travel</button>
          <button class="category-filter" onclick="filterPosts('luxury')">Luxury</button>
        </div>
        
        <div id="post-options" class="post-options">
          ${generatePostOptions('all')}
        </div>
      </div>

      <!-- Recent Activity Feed -->
      <div class="activity-feed">
        <h3>Recent Activity</h3>
        <div id="recent-posts" class="recent-posts">
          ${socialMediaState.totalPosts > 0 ? 'Your posts will appear here after you start posting!' : 'Start posting to build your social media presence!'}
        </div>
      </div>

      <!-- Monetization Info -->
      <div class="monetization-info">
        <h4>💰 Earnings Potential</h4>
        <div class="earning-breakdown">
          <div class="earning-item">
            <span>Per 100 Likes:</span>
            <span>€${Math.round(socialMediaState.followers / 100)}</span>
          </div>
          <div class="earning-item">
            <span>Follower Bonus:</span>
            <span>€${Math.round(socialMediaState.followers * 0.01)}</span>
          </div>
          <div class="earning-item">
            <span>Engagement Multiplier:</span>
            <span>${socialMediaState.engagementRate.toFixed(1)}x</span>
          </div>
        </div>
      </div>

      <!-- Tips -->
      <div style="background: #e7f3ff; border: 1px solid #b3d9ff; border-radius: 10px; padding: 15px; margin-top: 15px; font-size: 14px;">
        <h4 style="margin: 0 0 10px 0; color: #0066cc;">💡 Social Media Tips</h4>
        <ul style="margin: 0; padding-left: 20px; color: #0066cc;">
          <li>Post 3 times daily for maximum growth</li>
          <li>Higher cost posts usually get more engagement</li>
          <li>Reach follower milestones for bonus rewards</li>
          <li>Build consistent engagement to increase your influence</li>
          <li>Different post types attract different audiences</li>
        </ul>
      </div>
    </div>
  `;
  
  document.getElementById('app-modal').classList.remove('hidden');
  addSocialMediaStyles();
}

/**
 * Filter post options by category
 */
function filterPosts(category) {
  // Update active button
  document.querySelectorAll('.category-filter').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Update post options
  document.getElementById('post-options').innerHTML = generatePostOptions(category);
}

/**
 * Generate post option buttons
 */
function generatePostOptions(category) {
  const posts = category === 'all' ? SOCIAL_MEDIA_POSTS : SOCIAL_MEDIA_POSTS.filter(post => post.category === category);
  
  return posts.map((post, index) => {
    const canAfford = socialMediaState.wallet >= post.cost;
    const canPost = socialMediaState.dailyPostsLeft > 0;
    const globalIndex = SOCIAL_MEDIA_POSTS.indexOf(post);
    
    return `
      <div class="post-option ${!canAfford || !canPost ? 'disabled' : ''}" 
           onclick="${canAfford && canPost ? `createPost(${globalIndex})` : ''}">
        <div class="post-text">${post.text}</div>
        <div class="post-stats">
          <div class="engagement-preview">~${Math.round(post.engagement.base * socialMediaState.engagementRate)} likes</div>
          <div class="post-cost">${post.cost > 0 ? `€${post.cost}` : 'Free'}</div>
        </div>
        ${!canAfford && post.cost > 0 ? '<div class="disabled-reason">Can\'t afford</div>' : ''}
        ${!canPost ? '<div class="disabled-reason">Daily limit reached</div>' : ''}
      </div>
    `;
  }).join('');
}

/**
 * Create a social media post
 */
function createPost(postIndex) {
  if (socialMediaState.dailyPostsLeft <= 0) {
    showToast('Daily post limit reached! Try again tomorrow.', 'warning');
    return;
  }
  
  const post = SOCIAL_MEDIA_POSTS[postIndex];
  
  if (socialMediaState.wallet < post.cost) {
    showToast('Insufficient funds for this post!', 'error');
    return;
  }
  
  // Deduct cost and update posts left
  socialMediaState.wallet -= post.cost;
  socialMediaState.dailyPostsLeft--;
  socialMediaState.totalPosts++;
  
  // Calculate engagement
  const baseEngagement = post.engagement.base;
  const followerBonus = Math.floor(socialMediaState.followers * 0.1);
  const randomMultiplier = 0.8 + Math.random() * 0.4; // 0.8x to 1.2x random variance
  
  const finalLikes = Math.round((baseEngagement + followerBonus) * socialMediaState.engagementRate * randomMultiplier);
  socialMediaState.totalLikes += finalLikes;
  
  // Calculate earnings (followers and engagement based)
  const baseEarnings = Math.floor(finalLikes / 10); // €0.1 per like
  const followerBonus2 = Math.floor(socialMediaState.followers * 0.01); // €0.01 per follower
  const totalEarnings = baseEarnings + followerBonus2;
  
  socialMediaState.wallet += totalEarnings;
  
  // Gain followers based on engagement
  const newFollowers = Math.max(1, Math.floor(finalLikes / 20 + Math.random() * 3));
  const oldFollowers = socialMediaState.followers;
  socialMediaState.followers += newFollowers;
  
  // Update happiness
  const data = loadGameData();
  data.happiness = Math.min(100, data.happiness + post.engagement.happiness);
  
  // Check for milestone bonuses
  checkFollowerMilestones(oldFollowers, socialMediaState.followers);
  
  // Update engagement rate based on performance
  updateEngagementRate(finalLikes, baseEngagement);
  updateInfluencerLevel();
  
  // Save data
  saveSocialMediaData();
  updateSocialMediaDisplay();
  
  // Show success message
  showToast(`Posted! +${finalLikes} likes, +${newFollowers} followers, earned €${totalEarnings}`, 'success');
  
  // Add to recent activity
  addRecentActivity(post.text, finalLikes, newFollowers, totalEarnings);
  
  // Refresh post options to show updated state
  const activeCategory = document.querySelector('.category-filter.active').textContent.toLowerCase();
  document.getElementById('post-options').innerHTML = generatePostOptions(activeCategory === 'all' ? 'all' : activeCategory);
}

/**
 * Check for follower milestone bonuses
 */
function checkFollowerMilestones(oldCount, newCount) {
  const milestones = Object.keys(FOLLOWER_MILESTONES).map(Number).sort((a, b) => a - b);
  
  for (const milestone of milestones) {
    if (oldCount < milestone && newCount >= milestone) {
      const bonus = FOLLOWER_MILESTONES[milestone];
      socialMediaState.wallet += bonus.bonus;
      showToast(bonus.message + ` Bonus: €${bonus.bonus}`, 'success');
    }
  }
}

/**
 * Update engagement rate based on recent performance
 */
function updateEngagementRate(actualLikes, expectedLikes) {
  const performance = actualLikes / expectedLikes;
  
  if (performance > 1.1) {
    socialMediaState.engagementRate = Math.min(2.0, socialMediaState.engagementRate + 0.05);
  } else if (performance < 0.9) {
    socialMediaState.engagementRate = Math.max(0.5, socialMediaState.engagementRate - 0.02);
  }
}

/**
 * Update influencer level based on followers
 */
function updateInfluencerLevel() {
  const followers = socialMediaState.followers;
  
  if (followers >= 50000) {
    socialMediaState.influencerLevel = 'Mega Influencer';
  } else if (followers >= 25000) {
    socialMediaState.influencerLevel = 'Major Influencer';
  } else if (followers >= 10000) {
    socialMediaState.influencerLevel = 'Top Influencer';
  } else if (followers >= 5000) {
    socialMediaState.influencerLevel = 'Rising Influencer';
  } else if (followers >= 1000) {
    socialMediaState.influencerLevel = 'Micro Influencer';
  } else if (followers >= 500) {
    socialMediaState.influencerLevel = 'Content Creator';
  } else if (followers >= 100) {
    socialMediaState.influencerLevel = 'Aspiring Creator';
  } else {
    socialMediaState.influencerLevel = 'Beginner';
  }
}

/**
 * Add activity to recent posts feed
 */
function addRecentActivity(postText, likes, followers, earnings) {
  const recentPosts = document.getElementById('recent-posts');
  const activity = `
    <div class="recent-activity" style="animation: slideIn 0.5s ease-out;">
      <div class="activity-post">${postText}</div>
      <div class="activity-stats">
        <span>❤️ ${likes}</span>
        <span>👥 +${followers}</span>
        <span>💰 €${earnings}</span>
      </div>
      <div class="activity-time">Just now</div>
    </div>
  `;
  
  recentPosts.innerHTML = activity + recentPosts.innerHTML;
  
  // Keep only last 5 activities
  const activities = recentPosts.querySelectorAll('.recent-activity');
  if (activities.length > 5) {
    activities[activities.length - 1].remove();
  }
}

/**
 * Update social media display
 */
function updateSocialMediaDisplay() {
  document.getElementById('social-wallet').textContent = `€${socialMediaState.wallet}`;
  document.querySelector('.followers-count').textContent = `${formatNumber(socialMediaState.followers)} followers`;
  document.querySelector('.influencer-level').textContent = socialMediaState.influencerLevel;
  
  // Update stats
  const statCards = document.querySelectorAll('.stat-card .stat-value');
  statCards[0].textContent = socialMediaState.totalPosts;
  statCards[1].textContent = formatNumber(socialMediaState.totalLikes);
  statCards[2].textContent = `${Math.round(socialMediaState.engagementRate * 100)}%`;
  statCards[3].textContent = socialMediaState.dailyPostsLeft;
  
  // Update monetization info
  document.querySelectorAll('.earning-item span')[1].textContent = `€${Math.round(socialMediaState.followers / 100)}`;
  document.querySelectorAll('.earning-item span')[3].textContent = `€${Math.round(socialMediaState.followers * 0.01)}`;
  document.querySelectorAll('.earning-item span')[5].textContent = `${socialMediaState.engagementRate.toFixed(1)}x`;
}

/**
 * Save social media data to game state
 */
function saveSocialMediaData() {
  const data = loadGameData();
  data.bankBalance = socialMediaState.wallet;
  
  data.socialMediaStats = {
    followers: socialMediaState.followers,
    totalLikes: socialMediaState.totalLikes,
    totalPosts: socialMediaState.totalPosts,
    dailyPostsLeft: socialMediaState.dailyPostsLeft,
    engagementRate: socialMediaState.engagementRate,
    influencerLevel: socialMediaState.influencerLevel
  };
  
  saveGameData(data);
  updateAllUI();
}

/**
 * Reset daily post limit (called by daily tick)
 */
function resetDailyPosts() {
  socialMediaState.dailyPostsLeft = 3;
}

/**
 * Format large numbers for display
 */
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toString();
  }
}

/**
 * Add CSS styles for social media app
 */
function addSocialMediaStyles() {
  if (document.getElementById('social-media-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'social-media-styles';
  style.textContent = `
    .instagram-app {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #fafafa;
      min-height: 100vh;
    }
    
    .instagram-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: white;
      border-bottom: 1px solid #dbdbdb;
    }
    
    .instagram-logo {
      font-family: 'Billabong', cursive;
      font-size: 24px;
      font-weight: normal;
      color: #262626;
    }
    
    .header-right {
      display: flex;
      gap: 16px;
    }
    
    .header-icon {
      font-size: 24px;
      cursor: pointer;
    }
    
    .stories-section {
      display: flex;
      gap: 8px;
      padding: 16px;
      background: white;
      border-bottom: 1px solid #dbdbdb;
      overflow-x: auto;
    }
    
    .story-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 66px;
      cursor: pointer;
    }
    
    .story-ring {
      width: 66px;
      height: 66px;
      border-radius: 50%;
      background: linear-gradient(45deg, #f58529, #dd2a7b, #8134af, #515bd4);
      padding: 2px;
      position: relative;
    }
    
    .story-ring.viewed {
      background: #c7c7cc;
    }
    
    .story-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    
    .my-story .story-avatar {
      background: #f8f8f8;
    }
    
    .add-story-plus {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 20px;
      height: 20px;
      background: #0095f6;
      color: white;
      border: 2px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    }
    
    .story-label {
      font-size: 12px;
      margin-top: 4px;
      text-align: center;
      color: #262626;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 66px;
    }
    
    .profile-section {
      display: flex;
      align-items: center;
      padding: 16px;
      background: white;
      gap: 16px;
    }
    
    .profile-pic {
      width: 77px;
      height: 77px;
      border-radius: 50%;
      background: linear-gradient(45deg, #f58529, #dd2a7b, #8134af, #515bd4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      color: white;
      flex-shrink: 0;
    }
    
    .profile-stats {
      display: flex;
      flex: 1;
      justify-content: space-around;
    }
    
    .stat-item {
      text-align: center;
    }
    
    .stat-number {
      font-weight: 600;
      font-size: 18px;
      color: #262626;
      margin-bottom: 4px;
    }
    
    .stat-label {
      font-size: 14px;
      color: #8e8e8e;
    }
    
    .profile-bio {
      padding: 0 16px 16px;
      background: white;
      border-bottom: 1px solid #dbdbdb;
    }
    
    .profile-name {
      font-weight: 600;
      font-size: 14px;
      color: #262626;
      margin-bottom: 4px;
    }
    
    .profile-title {
      font-size: 14px;
      color: #8e8e8e;
      margin-bottom: 8px;
    }
    
    .earning-info {
      font-size: 14px;
      color: #0095f6;
      margin-bottom: 4px;
    }
    
    .posts-status {
      font-size: 12px;
      color: #8e8e8e;
    }
    .social-media-app {
      max-width: 100%;
      margin: 0 auto;
    }
    
    .profile-header {
      display: flex;
      align-items: center;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 15px;
      color: white;
      margin-bottom: 20px;
    }
    
    .profile-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: rgba(255,255,255,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin-right: 15px;
    }
    
    .profile-info {
      flex: 1;
    }
    
    .profile-name {
      font-size: 1.3rem;
      font-weight: bold;
      margin-bottom: 2px;
    }
    
    .influencer-level {
      font-size: 0.9rem;
      opacity: 0.9;
      margin-bottom: 2px;
    }
    
    .followers-count {
      font-size: 0.85rem;
      opacity: 0.8;
    }
    
    .social-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 20px;
    }
    
    .stat-card {
      background: white;
      padding: 15px;
      border-radius: 10px;
      text-align: center;
      border: 1px solid #e9ecef;
    }
    
    .stat-value {
      font-size: 1.2rem;
      font-weight: bold;
      color: #495057;
      margin-bottom: 5px;
    }
    
    .stat-label {
      font-size: 0.8rem;
      color: #6c757d;
    }
    
    .post-creation {
      background: white;
      border-radius: 15px;
      padding: 20px;
      margin-bottom: 20px;
      border: 1px solid #e9ecef;
    }
    
    .post-categories {
      display: flex;
      gap: 5px;
      margin: 15px 0;
      flex-wrap: wrap;
    }
    
    .category-filter {
      padding: 8px 16px;
      border: 1px solid #dee2e6;
      background: white;
      border-radius: 20px;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .category-filter.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }
    
    .post-options {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-height: 300px;
      overflow-y: auto;
    }
    
    .post-option {
      padding: 15px;
      border: 1px solid #dee2e6;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
      background: white;
    }
    
    .post-option:hover:not(.disabled) {
      border-color: #667eea;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .post-option.disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background: #f8f9fa;
    }
    
    .post-text {
      font-weight: 500;
      margin-bottom: 8px;
      color: #495057;
    }
    
    .post-stats {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
    }
    
    .engagement-preview {
      color: #28a745;
      font-weight: 500;
    }
    
    .post-cost {
      color: #dc3545;
      font-weight: 500;
    }
    
    .disabled-reason {
      margin-top: 5px;
      font-size: 0.75rem;
      color: #dc3545;
      font-style: italic;
    }
    
    .activity-feed {
      background: white;
      border-radius: 15px;
      padding: 20px;
      margin-bottom: 20px;
      border: 1px solid #e9ecef;
    }
    
    .recent-activity {
      padding: 12px;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      margin-bottom: 10px;
      background: #f8f9fa;
    }
    
    .activity-post {
      font-weight: 500;
      margin-bottom: 8px;
      color: #495057;
    }
    
    .activity-stats {
      display: flex;
      gap: 15px;
      font-size: 0.85rem;
      color: #6c757d;
      margin-bottom: 5px;
    }
    
    .activity-time {
      font-size: 0.75rem;
      color: #adb5bd;
    }
    
    .monetization-info {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 10px;
      padding: 15px;
      margin-bottom: 15px;
    }
    
    .monetization-info h4 {
      margin: 0 0 10px 0;
      color: #856404;
    }
    
    .earning-breakdown {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    
    .earning-item {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      color: #856404;
    }
    
    @keyframes slideIn {
      0% { transform: translateY(-20px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    
    @media (max-width: 480px) {
      .social-stats {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .post-categories {
        justify-content: center;
      }
      
      .category-filter {
        font-size: 0.75rem;
        padding: 6px 12px;
      }
      
      .profile-header {
        flex-direction: column;
        text-align: center;
        gap: 10px;
      }
      
      .profile-avatar {
        margin-right: 0;
      }
    }
  `;
  
  document.head.appendChild(style);
}