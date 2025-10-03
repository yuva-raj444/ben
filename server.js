const express = require('express');
const { chromium } = require('playwright');

// ==================== CONFIGURATION ====================
const CONFIG = {
  MOBILE_NUMBER: '9876543210',  // Replace with your mobile number
  UPI_ID: 'yourname@upi',        // Replace with your UPI ID
  PORT: 3000
};
// =======================================================

const app = express();
app.use(express.json());

// POST /recharge endpoint
app.post('/recharge', async (req, res) => {
  let browser = null;
  
  try {
    console.log('Starting Jio recharge automation...');
    
    // Launch browser
    browser = await chromium.launch({ 
      headless: false,  // Set to true for production
      executablePath: '/usr/bin/chromium'  // Use system chromium
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Step 1: Navigate to the Jio plans page
    console.log('Navigating to Jio plans page...');
    await page.goto('https://www.jio.com/selfcare/plans/mobility/prepaid-plans-list/?category=Popular%20Plans&categoryId=UG9wdWxhciBQbGFucw==&subcategory=MS41IEdCL2RheSBQbGFucw==', {
      waitUntil: 'networkidle',
      timeout: 60000
    });
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Step 2: Find the ₹299 plan card and click its Buy button
    console.log('Looking for ₹299 plan...');
    
    // Try different selectors to find the 299 plan
    const buyButtonClicked = await page.evaluate(() => {
      // Look for elements containing "299" and "Buy"
      const allElements = document.querySelectorAll('*');
      let planCard = null;
      
      for (let elem of allElements) {
        const text = elem.textContent || '';
        if (text.includes('₹299') || text.includes('299')) {
          // Found a plan card with 299
          planCard = elem;
          
          // Find the Buy button within this card or nearby
          let buyButton = planCard.querySelector('button');
          if (!buyButton) {
            // Try to find button in parent or sibling elements
            let current = planCard;
            for (let i = 0; i < 5; i++) {
              if (current.parentElement) {
                current = current.parentElement;
                buyButton = current.querySelector('button');
                if (buyButton && (buyButton.textContent.toLowerCase().includes('buy') || 
                    buyButton.textContent.toLowerCase().includes('recharge'))) {
                  break;
                }
              }
            }
          }
          
          if (buyButton) {
            buyButton.click();
            return true;
          }
        }
      }
      return false;
    });
    
    if (!buyButtonClicked) {
      // Try alternative approach - look for any button with "Buy" near 299
      const buyButton = await page.locator('button:has-text("Buy"), button:has-text("Recharge")').first();
      if (await buyButton.count() > 0) {
        await buyButton.click();
      } else {
        throw new Error('Could not find ₹299 plan or Buy button');
      }
    }
    
    console.log('Clicked Buy button for ₹299 plan');
    await page.waitForTimeout(2000);
    
    // Step 3: Enter mobile number
    console.log('Entering mobile number...');
    
    // Wait for mobile number input field
    await page.waitForSelector('input[type="tel"], input[type="text"], input[placeholder*="mobile"], input[placeholder*="number"]', { timeout: 10000 });
    
    // Find and fill mobile number input
    const mobileInput = await page.locator('input[type="tel"], input[type="text"], input[placeholder*="mobile"], input[placeholder*="number"]').first();
    await mobileInput.fill(CONFIG.MOBILE_NUMBER);
    
    console.log('Mobile number entered');
    await page.waitForTimeout(1000);
    
    // Step 4: Submit and continue
    console.log('Submitting mobile number...');
    
    // Find and click continue/submit button
    const continueButton = await page.locator('button:has-text("Continue"), button:has-text("Submit"), button:has-text("Proceed")').first();
    await continueButton.click();
    
    console.log('Proceeding to payment page...');
    await page.waitForTimeout(5000);
    
    // Step 5: On payment page, navigate to UPI payment method
    console.log('Looking for UPI payment option...');
    
    // Wait for payment options to load
    await page.waitForTimeout(3000);
    
    // Click on UPI payment method if not already selected
    const upiOption = await page.locator('text=UPI, text="UPI", [data-payment="upi"], .upi-option').first();
    if (await upiOption.count() > 0) {
      await upiOption.click();
      await page.waitForTimeout(1000);
    }
    
    // Step 6: Click "See All" under UPI
    console.log('Clicking "See All" under UPI...');
    
    const seeAllButton = await page.locator('button:has-text("See All"), a:has-text("See All"), text="See All"').first();
    if (await seeAllButton.count() > 0) {
      await seeAllButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Step 7: Select "Pay via UPI ID"
    console.log('Selecting "Pay via UPI ID"...');
    
    const upiIdOption = await page.locator('text="Pay via UPI ID", text="UPI ID", button:has-text("UPI ID")').first();
    await upiIdOption.click();
    await page.waitForTimeout(1000);
    
    // Step 8: Enter UPI ID
    console.log('Entering UPI ID...');
    
    const upiInput = await page.locator('input[placeholder*="UPI"], input[name*="upi"], input[type="text"]').last();
    await upiInput.fill(CONFIG.UPI_ID);
    
    console.log('UPI ID entered');
    await page.waitForTimeout(1000);
    
    // Step 9: Click "Verify & Pay"
    console.log('Clicking "Verify & Pay"...');
    
    const verifyPayButton = await page.locator('button:has-text("Verify"), button:has-text("Pay"), button:has-text("Verify & Pay")').first();
    await verifyPayButton.click();
    
    console.log('Automation completed successfully!');
    await page.waitForTimeout(3000);
    
    // Keep browser open for user to complete UPI payment
    console.log('Browser will remain open for UPI approval...');
    
    // Return success response
    res.json({
      status: 'success',
      message: 'Recharge initiated. Approve in UPI app.'
    });
    
  } catch (error) {
    console.error('Error during automation:', error.message);
    
    if (browser) {
      await browser.close();
    }
    
    res.status(500).json({
      status: 'error',
      message: error.message,
      details: error.stack
    });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    message: 'Jio Recharge Automation API',
    endpoints: {
      recharge: 'POST /recharge'
    },
    config: {
      mobileNumber: CONFIG.MOBILE_NUMBER,
      upiId: CONFIG.UPI_ID
    }
  });
});

app.listen(CONFIG.PORT, () => {
  console.log(`Server running on http://localhost:${CONFIG.PORT}`);
  console.log(`Mobile Number: ${CONFIG.MOBILE_NUMBER}`);
  console.log(`UPI ID: ${CONFIG.UPI_ID}`);
  console.log('\nTo initiate recharge, send POST request to http://localhost:3000/recharge');
});
