# Adoption Trends: Offer Business Process - Data Availability

## ⚠️ Current Limitation

The Tableau Adoption Insights Dashboard **cannot provide time-series trend data** via the MCP export. Here's what I found:

### What the Dashboard Contains (via API export):

1. **Metrics Summary View** ✅ (Successfully queried)
   - Feature definitions
   - Adoption/usage metric definitions
   - Product area mapping
   - **Does NOT contain:** Actual numbers, trends, or time-series

2. **Adoption Insights Dashboard** ✅ (Successfully queried)
   - Customer-level data (7,100 customers)
   - Which customers have activated which features
   - Feature activation rates per customer
   - **Does NOT contain:** Time-series trends, monthly changes, adoption % over time

3. **Feature Insights Dashboard** ❌ (Returned empty)
   - Likely requires interactive filters/parameters
   - Cannot be queried via static CSV export
   - Would need to use the dashboard interactively in Tableau

---

## 🎯 What You're Looking For

**Adoption trends for Offer Business Process** would typically show:
- Monthly adoption rate (% of customers using it)
- New adopters per month
- Usage frequency over time
- YoY growth
- Cohort analysis

**This data exists in Tableau** but requires:
- Interactive dashboard use (not API export)
- Or direct database/warehouse access
- Or a scheduled report configured to include time dimensions

---

## 🔍 What I **Can** Tell You About Offer Business Process

From the "Metrics Summary View" I queried:

### Feature Definition
**Offer Business Process** enables you to:
- Create offers with compensation
- Generate and review offer letters  
- Renegotiate offers with candidates
- Track and negotiate offer details

### Adoption Metric
"A business process using the Business Process Type of 'Offer' ran at least once within the last 12 months"

### Product Area
Talent Acquisition (Core recruiting)

### Related Features
- Propose Compensation for Offer subprocess
- Source to Pipeline reporting
- Mass offer task consolidation
- Referral payment plans

---

## 📊 From Customer-Level Data

From the 7,100 customers in the adoption view:
- **"Feature Activated"** column shows number of features each customer has activated
- **"Feature Entitled"** column shows number of features each customer has access to
- **"Avg. Feature Activation Rate"** shows % of entitled features that are activated

**But:** This data is aggregated across ALL features, not broken down by individual feature (like Offer BP).

---

## ✅ How to Get the Trend Data You Need

### Option 1: Use Tableau Dashboard Interactively
1. Go to: https://tableau-aws-prod.workdayinternal.com/#/views/AdoptionInsightsDashboardMVP/FeatureInsightsDashboard
2. Use filters to select "Offer Business Process"
3. View the trend chart
4. Export to Excel if needed

### Option 2: Ask the Product Intelligence Team
Message the team that owns this dashboard:
```
Can you help me get adoption trend data for the "Offer Business Process" feature?

I need:
- Monthly adoption rate (% of customers)
- Trend over last 12-24 months
- Breakdown by region/segment if available

Context: PMF analysis for Talent Acquisition roadmap.
```

### Option 3: Request a Custom Report
If you need this data regularly, request a scheduled extract that includes:
- Feature name dimension
- Date/month dimension  
- Adoption metrics over time

### Option 4: Direct Database Access
If you had access to the underlying data warehouse (Redshift/Snowflake), you could query:
```sql
SELECT 
    date_month,
    feature_name,
    COUNT(DISTINCT customer_id) as adopters,
    COUNT(DISTINCT customer_id) * 100.0 / (SELECT COUNT(*) FROM customers) as adoption_pct
FROM feature_adoption_monthly
WHERE feature_name = 'Offer Business Process'
GROUP BY date_month, feature_name
ORDER BY date_month DESC;
```

---

## 💡 Summary

**What worked:**
- ✅ Found the feature definition and adoption metric
- ✅ Identified related features
- ✅ Confirmed the dashboard exists and has 7,100 customers tracked

**What didn't work:**
- ❌ Cannot get time-series trends via Tableau MCP export
- ❌ Dashboard views require interactive filters

**Best next step:**
Use the Tableau dashboard directly (Option 1) or ask the Product Intelligence team for the data (Option 2).

---

Would you like me to draft a Slack message to the Product Intelligence team requesting this data?
