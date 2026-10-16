// jobs.js - Job search and career progression system

// Job definitions with experience requirements
const JOBS = {
  // Entry level jobs (0 days experience required)
  'Fast Food Worker': { 
    salary: 35, 
    experienceRequired: 0, 
    description: 'Work at a fast food restaurant. No experience needed.',
    category: 'Service'
  },
  'Cashier': { 
    salary: 40, 
    experienceRequired: 0, 
    description: 'Handle transactions at retail stores. Basic customer service.',
    category: 'Retail'
  },
  'Warehouse Worker': { 
    salary: 45, 
    experienceRequired: 0, 
    description: 'Pack and move inventory in warehouses. Physical work.',
    category: 'Labor'
  },
  
  // Basic jobs (30+ days experience)
  'Office Clerk': { 
    salary: 65, 
    experienceRequired: 30, 
    description: 'Handle paperwork and basic office tasks.',
    category: 'Office'
  },
  'Retail Supervisor': { 
    salary: 70, 
    experienceRequired: 30, 
    description: 'Supervise cashiers and manage store operations.',
    category: 'Retail'
  },
  'Security Guard': { 
    salary: 60, 
    experienceRequired: 30, 
    description: 'Monitor and protect property and people.',
    category: 'Security'
  },
  
  // Skilled jobs (90+ days experience)
  'Administrative Assistant': { 
    salary: 85, 
    experienceRequired: 90, 
    description: 'Support office operations and management.',
    category: 'Office'
  },
  'Sales Representative': { 
    salary: 95, 
    experienceRequired: 90, 
    description: 'Sell products and build client relationships.',
    category: 'Sales'
  },
  'Customer Service Manager': { 
    salary: 90, 
    experienceRequired: 90, 
    description: 'Lead customer service teams and resolve issues.',
    category: 'Management'
  },
  
  // Professional jobs (180+ days experience)
  'Marketing Specialist': { 
    salary: 120, 
    experienceRequired: 180, 
    description: 'Create marketing campaigns and analyze market trends.',
    category: 'Marketing'
  },
  'IT Support Technician': { 
    salary: 115, 
    experienceRequired: 180, 
    description: 'Troubleshoot computer systems and networks.',
    category: 'Technology'
  },
  'Operations Manager': { 
    salary: 140, 
    experienceRequired: 180, 
    description: 'Oversee business operations and manage teams.',
    category: 'Management'
  },
  
  // Senior jobs (365+ days experience)
  'Software Developer': { 
    salary: 180, 
    experienceRequired: 365, 
    description: 'Design and develop software applications.',
    category: 'Technology'
  },
  'Project Manager': { 
    salary: 160, 
    experienceRequired: 365, 
    description: 'Lead complex projects and coordinate teams.',
    category: 'Management'
  },
  'Financial Analyst': { 
    salary: 170, 
    experienceRequired: 365, 
    description: 'Analyze financial data and provide business insights.',
    category: 'Finance'
  },
  
  // Executive jobs (730+ days experience)
  'Senior Manager': { 
    salary: 220, 
    experienceRequired: 730, 
    description: 'Lead major business divisions and strategic initiatives.',
    category: 'Executive'
  },
  'Principal Engineer': { 
    salary: 250, 
    experienceRequired: 730, 
    description: 'Lead technical architecture and mentor developers.',
    category: 'Technology'
  },
  'Director': { 
    salary: 280, 
    experienceRequired: 730, 
    description: 'Oversee multiple departments and drive company strategy.',
    category: 'Executive'
  }
};

function openJobSearch() {
  const data = loadGameData();
  openApp('💼 Job Search', getJobSearchContent());
  window.currentApp = 'jobs';
}

function getJobSearchContent() {
  const data = loadGameData();
  const availableJobs = getAvailableJobs(data);
  
  let content = `
    <div class="job-search-container">
      <div class="current-job-status" style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; color: #667eea;">Current Status</h3>
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span>Job:</span>
          <span style="font-weight: bold;">${data.profession}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span>Daily Salary:</span>
          <span style="color: #28a745; font-weight: bold;">€${data.salary}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Work Experience:</span>
          <span style="color: #6f42c1; font-weight: bold;">${data.workExperience} days</span>
        </div>
      </div>
      
      <div class="job-categories">
        <div class="category-tabs" style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;">
          <button class="category-tab active" onclick="filterJobsByCategory('all')" style="padding: 8px 15px; border: none; border-radius: 20px; background: #667eea; color: white; font-size: 12px;">All</button>
          <button class="category-tab" onclick="filterJobsByCategory('Service')" style="padding: 8px 15px; border: none; border-radius: 20px; background: #e9ecef; color: #495057; font-size: 12px;">Service</button>
          <button class="category-tab" onclick="filterJobsByCategory('Office')" style="padding: 8px 15px; border: none; border-radius: 20px; background: #e9ecef; color: #495057; font-size: 12px;">Office</button>
          <button class="category-tab" onclick="filterJobsByCategory('Technology')" style="padding: 8px 15px; border: none; border-radius: 20px; background: #e9ecef; color: #495057; font-size: 12px;">Tech</button>
          <button class="category-tab" onclick="filterJobsByCategory('Management')" style="padding: 8px 15px; border: none; border-radius: 20px; background: #e9ecef; color: #495057; font-size: 12px;">Management</button>
        </div>
      </div>
      
      <div class="available-jobs" id="jobs-list">
  `;
  
  availableJobs.forEach(jobName => {
    const job = JOBS[jobName];
    const canApply = data.workExperience >= job.experienceRequired;
    const isCurrentJob = data.profession === jobName;
    
    content += `
      <div class="job-listing" data-category="${job.category}" style="background: white; border: 1px solid #e9ecef; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
          <div>
            <h4 style="margin: 0; color: #495057;">${jobName}</h4>
            <p style="margin: 5px 0; color: #6c757d; font-size: 12px;">${job.category}</p>
          </div>
          <div style="text-align: right;">
            <div style="color: #28a745; font-weight: bold; font-size: 16px;">€${job.salary}/day</div>
            <div style="color: #6c757d; font-size: 12px;">Experience: ${job.experienceRequired} days</div>
          </div>
        </div>
        <p style="color: #6c757d; font-size: 14px; margin-bottom: 15px;">${job.description}</p>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          ${canApply && !isCurrentJob ? 
            `<button onclick="applyForJob('${jobName}')" style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 5px; font-size: 14px;">Apply</button>` :
            isCurrentJob ? 
            `<span style="color: #6f42c1; font-weight: bold;">Current Job</span>` :
            `<span style="color: #dc3545; font-size: 12px;">Need ${job.experienceRequired - data.workExperience} more days experience</span>`
          }
          <div style="color: #6c757d; font-size: 12px;">
            ${canApply ? '✓ Qualified' : '✗ Not qualified'}
          </div>
        </div>
      </div>
    `;
  });
  
  content += `
      </div>
      
      ${data.profession === 'Unemployed' ? `
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 10px; padding: 15px; margin-top: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #856404;">💡 Job Search Tips</h4>
          <ul style="margin: 0; padding-left: 20px; color: #856404; font-size: 14px;">
            <li>Start with entry-level jobs that require no experience</li>
            <li>Work for 30+ days to unlock better paying positions</li>
            <li>Higher experience unlocks management and technical roles</li>
            <li>Your work experience carries over between jobs</li>
          </ul>
        </div>
      ` : ''}
    </div>
  `;
  
  return content;
}

function getAvailableJobs(data) {
  // Return all jobs, filtering will be done by UI
  return Object.keys(JOBS);
}

function applyForJob(jobName) {
  const data = loadGameData();
  const job = JOBS[jobName];
  
  if (!job) {
    showToast('Job not found!', 'error');
    return;
  }
  
  if (data.workExperience < job.experienceRequired) {
    showToast(`You need ${job.experienceRequired - data.workExperience} more days of work experience!`, 'warning');
    return;
  }
  
  if (data.profession === jobName) {
    showToast('You already have this job!', 'warning');
    return;
  }
  
  // Apply for the job
  const oldJob = data.profession;
  const oldSalary = data.salary;
  
  data.profession = jobName;
  data.salary = job.salary;
  
  // Add event
  data.events.push({
    message: `🎉 Congratulations! You got hired as a ${jobName}. Salary: €${job.salary}/day`,
    date: new Date().toISOString(),
    read: false
  });
  
  saveGameData(data);
  updateAllUI();
  showToast(`Congratulations! You're now working as a ${jobName}!`, 'success');
  
  // Refresh the job search content
  document.getElementById('modal-body').innerHTML = getJobSearchContent();
}

function filterJobsByCategory(category) {
  const jobListings = document.querySelectorAll('.job-listing');
  const categoryTabs = document.querySelectorAll('.category-tab');
  
  // Update active tab
  categoryTabs.forEach(tab => {
    tab.classList.remove('active');
    tab.style.background = '#e9ecef';
    tab.style.color = '#495057';
  });
  
  event.target.classList.add('active');
  event.target.style.background = '#667eea';
  event.target.style.color = 'white';
  
  // Filter jobs
  jobListings.forEach(listing => {
    const listingCategory = listing.getAttribute('data-category');
    if (category === 'all' || listingCategory === category) {
      listing.style.display = 'block';
    } else {
      listing.style.display = 'none';
    }
  });
}

// Export functions
window.openJobSearch = openJobSearch;
window.applyForJob = applyForJob;
window.filterJobsByCategory = filterJobsByCategory;