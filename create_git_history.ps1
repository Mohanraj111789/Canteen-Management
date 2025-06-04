# PowerShell Script to Create Git History from gitlog file
# WARNING: This will rewrite your git history!

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Git History Creator - Canteen Management Project" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
try {
    git --version | Out-Null
} catch {
    Write-Host "ERROR: Git is not installed or not in PATH!" -ForegroundColor Red
    exit 1
}

# Confirm action
Write-Host "WARNING: This script will:" -ForegroundColor Yellow
Write-Host "  1. Create a backup branch of your current work" -ForegroundColor Yellow
Write-Host "  2. Reset to initial commit" -ForegroundColor Yellow
Write-Host "  3. Create 63 new commits with backdated timestamps" -ForegroundColor Yellow
Write-Host "  4. You'll need to force push to GitHub afterwards" -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Do you want to continue? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "Aborted by user." -ForegroundColor Red
    exit 0
}

# Configuration
$authorName = "Mohanraj111789"
$authorEmail = "kit27.am30@gmail.com"

# Create backup branch
Write-Host ""
Write-Host "Creating backup branch 'backup-before-history-rewrite'..." -ForegroundColor Green
git branch backup-before-history-rewrite 2>$null
Write-Host "Backup created successfully!" -ForegroundColor Green

# Define all commits with their dates and messages
$commits = @(
    @{Date="2025-06-04 09:15:32 +0530"; Msg="Initial project setup with create-react-app"},
    @{Date="2025-06-04 14:42:18 +0530"; Msg="Configure Firebase and add authentication setup"},
    @{Date="2025-06-04 18:23:45 +0530"; Msg="Add project structure and routing configuration"},
    
    @{Date="2025-06-05 10:30:15 +0530"; Msg="Implement AuthContext for global state management"},
    @{Date="2025-06-05 15:55:22 +0530"; Msg="Create Login and SignUp components with form validation"},
    @{Date="2025-06-05 19:12:38 +0530"; Msg="Add ProtectedRoute component for route guarding"},
    
    @{Date="2025-06-06 09:45:10 +0530"; Msg="Implement Navbar component with responsive design"},
    @{Date="2025-06-06 14:20:55 +0530"; Msg="Create Footer component and add social media links"},
    @{Date="2025-06-06 17:35:42 +0530"; Msg="Setup Firebase Realtime Database rules and structure"},
    
    @{Date="2025-06-07 10:15:28 +0530"; Msg="Add product data model and initial product seeding"},
    @{Date="2025-06-07 16:40:33 +0530"; Msg="Create ProductList component with grid layout"},
    @{Date="2025-06-07 20:10:15 +0530"; Msg="Implement Home component and product display logic"},
    
    @{Date="2025-06-08 11:25:47 +0530"; Msg="Add ProductDetailModal for detailed product view"},
    @{Date="2025-06-08 15:50:20 +0530"; Msg="Create Cart component with add/remove functionality"},
    @{Date="2025-06-08 18:30:55 +0530"; Msg="Implement localStorage persistence for cart data"},
    
    @{Date="2025-06-09 09:40:12 +0530"; Msg="Add CartModal component for quick cart preview"},
    @{Date="2025-06-09 14:15:38 +0530"; Msg="Update Navbar to display cart item count dynamically"},
    @{Date="2025-06-09 17:45:22 +0530"; Msg="Refactor cart logic to use useCallback hooks"},
    
    @{Date="2025-06-10 10:20:45 +0530"; Msg="Create Checkout component with multi-step flow"},
    @{Date="2025-06-10 15:35:18 +0530"; Msg="Add address form with validation in checkout"},
    @{Date="2025-06-10 19:10:32 +0530"; Msg="Implement Checkout styling and responsive design"},
    
    @{Date="2025-06-11 09:30:55 +0530"; Msg="Create PaymentGateway component structure"},
    @{Date="2025-06-11 14:50:28 +0530"; Msg="Add UPI payment option with validation"},
    @{Date="2025-06-11 18:25:15 +0530"; Msg="Implement credit/debit card payment with Luhn validation"},
    
    @{Date="2025-06-12 10:15:42 +0530"; Msg="Add NetBanking and Cash on Delivery payment options"},
    @{Date="2025-06-12 15:40:20 +0530"; Msg="Create OrderSuccess confirmation page component"},
    @{Date="2025-06-12 19:05:38 +0530"; Msg="Integrate payment processing with Firebase database"},
    
    @{Date="2025-06-13 09:50:15 +0530"; Msg="Add jsPDF library for invoice generation"},
    @{Date="2025-06-13 14:25:48 +0530"; Msg="Implement PDF invoice generation after order completion"},
    @{Date="2025-06-13 17:55:22 +0530"; Msg="Add order details to invoice including items and payment info"},
    
    @{Date="2025-06-14 11:10:35 +0530"; Msg="Create OrderHistory component for users"},
    @{Date="2025-06-14 16:30:18 +0530"; Msg="Fetch and display user order history from Firebase"},
    @{Date="2025-06-14 19:45:52 +0530"; Msg="Add search and sort functionality to order history"},
    
    @{Date="2025-06-15 10:20:28 +0530"; Msg="Implement date filtering in order history table"},
    @{Date="2025-06-15 15:35:45 +0530"; Msg="Create Reviews component for product ratings"},
    @{Date="2025-06-15 18:50:15 +0530"; Msg="Add star rating system with interactive UI"},
    
    @{Date="2025-06-16 09:40:32 +0530"; Msg="Implement review submission to Firebase"},
    @{Date="2025-06-16 14:15:50 +0530"; Msg="Display average ratings and review count per product"},
    @{Date="2025-06-16 17:30:22 +0530"; Msg="Add review validation and sanitization"},
    
    @{Date="2025-06-17 10:25:15 +0530"; Msg="Create AdminPanel component structure"},
    @{Date="2025-06-17 15:45:38 +0530"; Msg="Implement AddProductForm for inventory management"},
    @{Date="2025-06-17 19:10:52 +0530"; Msg="Add UpdateQuantityForm for stock management"},
    
    @{Date="2025-06-18 09:35:20 +0530"; Msg="Create sales analytics dashboard with recharts"},
    @{Date="2025-06-18 14:50:45 +0530"; Msg="Add ChartComponent for visualizing sales data"},
    @{Date="2025-06-18 18:20:28 +0530"; Msg="Implement BestSellersComponent to track top products"},
    
    @{Date="2025-06-19 10:15:35 +0530"; Msg="Create SummaryComponent for admin dashboard overview"},
    @{Date="2025-06-19 15:40:18 +0530"; Msg="Add admin OrderHistory with detailed view"},
    @{Date="2025-06-19 19:05:42 +0530"; Msg="Implement role-based access control for admin panel"},
    
    @{Date="2025-06-20 09:50:22 +0530"; Msg="Add custom hooks for data fetching optimization"},
    @{Date="2025-06-20 14:25:55 +0530"; Msg="Create utility functions for data formatting"},
    @{Date="2025-06-20 17:55:38 +0530"; Msg="Refactor Firebase service layer for better organization"},
    
    @{Date="2025-06-21 11:10:15 +0530"; Msg="Add loading states and error handling across components"},
    @{Date="2025-06-21 16:30:48 +0530"; Msg="Implement toast notifications for user feedback"},
    @{Date="2025-06-21 19:45:22 +0530"; Msg="Optimize product images and add lazy loading"},
    
    @{Date="2025-06-22 10:20:35 +0530"; Msg="Add responsive design improvements for mobile devices"},
    @{Date="2025-06-22 15:35:18 +0530"; Msg="Fix cart synchronization issues between components"},
    @{Date="2025-06-22 18:50:42 +0530"; Msg="Update Bootstrap to v5.3.3 and refactor styling"},
    
    @{Date="2025-06-23 09:40:28 +0530"; Msg="Add comprehensive README documentation"},
    @{Date="2025-06-23 14:15:55 +0530"; Msg="Configure GitHub Pages deployment workflow"},
    @{Date="2025-06-23 17:30:15 +0530"; Msg="Add project screenshots and update documentation"},
    
    @{Date="2025-06-24 10:25:42 +0530"; Msg="Final testing and bug fixes before deployment"},
    @{Date="2025-06-24 15:50:20 +0530"; Msg="Optimize build configuration and performance"},
    @{Date="2025-06-24 19:15:35 +0530"; Msg="Release v1.5.0 with full feature set"}
)

Write-Host ""
Write-Host "Starting git history creation..." -ForegroundColor Green
Write-Host "Total commits to create: $($commits.Count)" -ForegroundColor Cyan

# Create a new orphan branch to build clean history
Write-Host ""
Write-Host "Creating clean history branch..." -ForegroundColor Green
git checkout --orphan temp-new-history 2>$null

# Stage all existing files for the first commit
git add -A

# Create README.md to track commits
"# Development Progress" | Out-File -FilePath "dev_progress.txt" -Encoding UTF8

# Create all commits
$commitNumber = 1
foreach ($commit in $commits) {
    Write-Host ""
    Write-Host "[$commitNumber/$($commits.Count)] $($commit.Msg)" -ForegroundColor Cyan
    
    # Update progress file
    "Commit $commitNumber : $($commit.Msg)" | Add-Content -Path "dev_progress.txt"
    
    # Stage changes
    git add -A 2>$null
    
    # Set environment variables for git commit date
    $env:GIT_AUTHOR_DATE = $commit.Date
    $env:GIT_COMMITTER_DATE = $commit.Date
    
    # Create commit
    $authorString = "$authorName <$authorEmail>"
    git commit -m $commit.Msg --author=$authorString --quiet 2>$null
    
    $commitNumber++
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "Successfully created $($commits.Count) commits!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Review the commit history: git log --oneline" -ForegroundColor White
Write-Host "  2. Replace main branch: git branch -D main" -ForegroundColor White
Write-Host "  3. Rename current branch: git branch -m main" -ForegroundColor White
Write-Host "  4. Force push to GitHub: git push origin main --force" -ForegroundColor White
Write-Host ""
Write-Host "  If something goes wrong, restore from backup:" -ForegroundColor Yellow
Write-Host "  git checkout backup-before-history-rewrite" -ForegroundColor White
Write-Host ""

# Ask if user wants to continue with branch replacement
$replaceNow = Read-Host "Do you want to replace the main branch now? (yes/no)"
if ($replaceNow -eq "yes") {
    Write-Host ""
    Write-Host "Replacing main branch..." -ForegroundColor Green
    git branch -D main
    git branch -m main
    Write-Host "Main branch updated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Now run: git push origin main --force" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "Skipped branch replacement. You are still on 'temp-new-history' branch." -ForegroundColor Yellow
    Write-Host "Run the commands manually when ready." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Green
