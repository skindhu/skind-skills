# Industry Analysis Module Library

This document contains industry-specific analysis modules for Claude to dynamically select and integrate when conducting SEC filing analysis.

---

## Usage Instructions

1. **Identify Industry**: Read first 5000 characters of filing, identify company's main business
2. **Select Modules**: Based on business type, select 1-2 most relevant modules
3. **Integrate Analysis**: Integrate selected module analysis points into base framework for execution

---

## 📱 Tech/TMT Module

> Applicable to: Software, Internet, Cloud Computing, SaaS, Semiconductors, Consumer Electronics, etc.

### Core Metrics

| Metric | Calculation | Healthy Threshold | Warning Signal |
| :--- | :--- | :--- | :--- |
| **Rule of 40** | Revenue Growth + FCF Margin | > 40% | < 20% |
| **SBC Ratio** | SBC / Revenue | < 15% | > 25% |
| **Net Dollar Retention** | Existing Customer Revenue Change | > 120% | < 100% |
| **R&D Efficiency** | R&D Spend / New Product Revenue | Industry benchmark | Continuous deterioration |

### SBC (Stock-Based Compensation) Deep Analysis

* **SBC Structure Breakdown**:
  - RSU vs Options vs ESPP proportion
  - Executive vs Employee allocation ratio
* **Dilution Impact**:
  - Outstanding share count growth rate
  - Can buybacks offset dilution?
* **Incentive Reasonableness**:
  - SBC / Net Income ratio trend
  - Is it too high compared to peers?

### User/Subscription Metrics

* **User Quality**:
  - MAU/DAU ratio (stickiness)
  - ARPU trend
  - CAC vs LTV (healthy value LTV/CAC > 3)
* **Subscription Health**:
  - ARR growth rate
  - Churn Rate
  - Expansion Revenue percentage

### R&D Conversion Rate

* **R&D Investment Analysis**:
  - R&D expense / Revenue trend
  - Capitalization vs Expensing ratio
* **Output Assessment**:
  - New product release cadence
  - Patent application quantity trend
  - Technology leadership (vs competitors)

---

## 🏦 Financial/Banking Module

> Applicable to: Commercial Banks, Investment Banks, Insurance, Asset Management, FinTech, etc.

### Core Metrics

| Metric | Calculation | Healthy Threshold | Warning Signal |
| :--- | :--- | :--- | :--- |
| **NIM (Net Interest Margin)** | Net Interest Income / Earning Assets | > 2.5% | < 2.0% |
| **CET1 (Core Equity Tier 1)** | Core Capital / Risk-Weighted Assets | > 10% | < 8% |
| **NPL (Non-Performing Loan Ratio)** | Non-Performing Loans / Total Loans | < 2% | > 4% |
| **ROE** | Net Income / Shareholders' Equity | > 12% | < 8% |

### Asset Quality Analysis

* **Loan Portfolio Breakdown**:
  - By industry, geography, maturity distribution
  - Collateral coverage ratio
* **Provision Coverage**:
  - Provision coverage ratio trend
  - Is provisioning policy aggressive?
* **Risk Concentration**:
  - Single borrower concentration
  - Industry concentration

### Spread and Interest Rate Sensitivity

* **NIM Breakdown**:
  - Asset-side yield changes
  - Liability-side cost changes
  - Deposit-loan spread trend
* **Interest Rate Risk**:
  - Repricing gap
  - Duration matching
  - Interest rate scenario analysis

### Capital Management

* **Capital Structure**:
  - Tier 1/2/3 capital proportions
  - Capital buffer thickness
* **Dividend Capacity**:
  - Payout ratio sustainability
  - Buyback headroom

---

## 🛒 Consumer/Retail Module

> Applicable to: Retail Chains, E-commerce, Consumer Goods, F&B, Apparel, etc.

### Core Metrics

| Metric | Calculation | Healthy Threshold | Warning Signal |
| :--- | :--- | :--- | :--- |
| **Same-Store Sales Growth** | Comparable Store Revenue Change | > 3% | Consecutive negative growth |
| **Inventory Turnover Days** | 365 / Inventory Turnover Rate | Industry benchmark | Continuous increase |
| **Average Transaction Value Change** | Total Revenue / Transaction Count | Stable growth | Promotion-driven |
| **Gross Margin** | Gross Profit / Revenue | Stable | Continuous decline |

### Same-Store Sales Analysis

* **Driver Factor Breakdown**:
  - Traffic change vs Ticket size change
  - New vs Repeat customer contribution
* **Seasonality Adjustment**:
  - Remove holiday effects
  - Weather impact assessment
* **Regional Differences**:
  - Different region/store type performance

### Inventory Health

* **Inventory Structure**:
  - New vs Aged merchandise proportion
  - Inventory age distribution
* **Turnover Efficiency**:
  - Category turnover differences
  - Comparison with peers
* **Impairment Risk**:
  - Inventory write-down reserve trend
  - Promotional clearance intensity

### Channel Efficiency

* **Online vs Offline Comparison**:
  - Revenue share changes by channel
  - Gross margin differences by channel
* **New Store Performance**:
  - New store ramp-up curve
  - Mature vs New store unit economics
* **Supply Chain Efficiency**:
  - Fulfillment cost / Revenue
  - Delivery timeliness

---

## 💊 Pharma/Bio Module

> Applicable to: Pharmaceuticals, Biotech, Medical Devices, CRO/CDMO, Healthcare Services, etc.

### Core Metrics

| Metric | Calculation | Healthy Threshold | Warning Signal |
| :--- | :--- | :--- | :--- |
| **R&D Ratio** | R&D Expense / Revenue | 15-25% (mature) | > 50% (cash burn) |
| **Pipeline Value** | Expected NPV Sum | Covers market cap | Over-reliance on single product |
| **Patent Cliff** | Revenue % Expiring in 5 Years | < 20% | > 40% |
| **Approval Success Rate** | Historical Approvals / Submissions | > 80% | < 50% |

### R&D Pipeline Analysis

* **Pipeline Value Assessment**:
  - Project count by phase (Preclinical/Phase I/II/III/Marketed)
  - Expected peak sales
  - Risk-adjusted NPV
* **Progress Tracking**:
  - Key milestone timeline
  - Competitor progress comparison
* **Success Probability**:
  - Historical success rates
  - Mechanism innovation level

### FDA/Regulatory Milestones

* **Key Dates**:
  - PDUFA dates
  - Advisory Committee meetings
  - Complete Response Letter (CRL) risk
* **Regulatory Strategy**:
  - Accelerated approval eligibility
  - Orphan drug designation
  - Breakthrough therapy status

### Patents & Competition

* **Patent Portfolio**:
  - Core patent expiration dates
  - Patent litigation status
  - Generic/Biosimilar risk
* **Market Competition**:
  - Same-target competitor progress
  - Expected market share evolution

---

## 🏭 Industrial/Manufacturing Module

> Applicable to: Machinery, Automotive, Aerospace, Chemicals, Basic Materials, etc.

### Core Metrics

| Metric | Calculation | Healthy Threshold | Warning Signal |
| :--- | :--- | :--- | :--- |
| **Capacity Utilization** | Actual Output / Design Capacity | > 80% | < 60% |
| **Order Backlog** | Unfilled Orders / Annual Revenue | > 1x | Declining trend |
| **ROIC** | NOPAT / Invested Capital | > WACC | < WACC |
| **CapEx Intensity** | CapEx / Depreciation | 1.0-1.5x | > 2x (over-investment) |

### Capacity & Utilization

* **Capacity Analysis**:
  - Current vs Planned capacity
  - Capacity expansion timeline
  - Geographic distribution
* **Utilization Trend**:
  - Quarterly utilization changes
  - Correlation with industry cycle
  - Position on marginal cost curve

### Orders & Backlog

* **Order Structure**:
  - New orders vs Repeat orders
  - Large customer dependency
  - Order cancellation rate
* **Backlog Quality**:
  - Backlog order aging
  - Delivery timeline
  - Pricing lock-in status

### Cost Structure & Cycle

* **Cost Breakdown**:
  - Raw material proportion and price sensitivity
  - Labor cost trend
  - Energy cost impact
* **Cycle Positioning**:
  - Current cycle phase (Expansion/Peak/Contraction/Trough)
  - Leading indicator tracking
  - Comparison with historical cycles
* **Operating Leverage**:
  - Fixed cost proportion
  - Breakeven capacity utilization

---

## 🔧 Module Combination Examples

### Example 1: Cloud Computing Company (e.g., AWS, Azure)
- **Primary Module**: Tech/TMT Module
- **Secondary**: Cash flow analysis from base framework

### Example 2: Electric Vehicle (e.g., Tesla)
- **Primary Module**: Industrial/Manufacturing Module (capacity, orders)
- **Secondary**: Tech/TMT Module (R&D, user metrics)

### Example 3: Biopharma (e.g., Moderna)
- **Primary Module**: Pharma/Bio Module
- **Secondary**: Tech/TMT Module (R&D efficiency)

### Example 4: FinTech (e.g., Square)
- **Primary Module**: Financial/Banking Module (transaction volume, risk control)
- **Secondary**: Tech/TMT Module (user growth, SBC)
