# Customers Using Offer Business Process - Data Not Available

## ❌ Problem

The Tableau Adoption Insights Dashboard data I can export **does not include customer-by-feature detail**. 

### What I Found

The dashboard has 3 views:

1. **Adoption Insights Dashboard** (7,100 customers)
   - Shows customer-level aggregates
   - "Feature Activated" = total count of features activated (across ALL features)
   - "Feature Entitled" = total count of features entitled
   - **No breakdown by specific feature**

2. **Feature Insights Dashboard**
   - Returned empty (requires interactive filters)

3. **Metrics Summary View** (4,725 features)
   - Feature definitions only
   - No customer data

### Data Structure

Each row looks like:
```
Account Name: Universitaire Ziekenhuizen Leuven
Region: Belux CB
Industry: Healthcare
Feature Activated: 0
Feature Entitled: 2,266
Avg. Feature Activation Rate: 0%
```

This tells us the customer has access to 2,266 features total, but **not which specific features** (like Offer BP) they've adopted.

---

## 🎯 How to Get Customer List for Offer Business Process

### Option 1: Use Tableau Dashboard Interactively ⭐ (Best)

1. Open: https://tableau-aws-prod.workdayinternal.com/#/views/AdoptionInsightsDashboardMVP/FeatureInsightsDashboard
2. Filter to feature: "Offer Business Process"
3. The dashboard should show a list of customers who have adopted it
4. Export to Excel for the full list

### Option 2: Query the Data Warehouse Directly

If you had Redshift/Snowflake access, query:

```sql
SELECT 
    c.customer_name,
    c.region,
    c.industry,
    c.segment,
    fa.adoption_date,
    fa.usage_count
FROM feature_adoption fa
JOIN customers c ON fa.customer_id = c.customer_id
WHERE fa.feature_name = 'Offer Business Process'
  AND fa.adopted = TRUE
ORDER BY c.customer_name;
```

### Option 3: Ask the Product Intelligence Team

Message them:
```
Can you provide a list of customers who have adopted the "Offer Business Process" feature?

Need: Customer name, region, segment, adoption date (if available)

Context: Analyzing adoption patterns for Talent Acquisition PMF analysis.
```

### Option 4: Check if Salesforce Has This Data

Workday likely tracks feature adoption in Salesforce for account management. Ask your CSM team or RevOps:
```
Do we track feature adoption by customer in Salesforce? 
Specifically looking for which customers use "Offer Business Process".
```

---

## 💡 What I Can Tell You

From the data I have access to:

### Total Customer Base
- **7,100 customers** tracked in the Adoption Insights Dashboard
- Breakdown by:
  - **Account Classification**: Large Enterprise, Mid-Market, etc.
  - **Region**: EMEA, Americas, APAC
  - **Industry**: Healthcare, Business Services, etc.

### Offer Business Process Context
- **Feature Type**: Talent Acquisition core functionality
- **Adoption Metric**: Binary (used in last 12 months or not)
- **Related Features**: Compensation proposals, offer letters, candidate negotiations

### What Typical Adoption Looks Like
Based on the dashboard structure, the Product Intelligence team likely tracks:
- Customer name
- Adoption status (yes/no)
- First adoption date
- Usage frequency
- Region/segment
- Industry vertical

**But this data requires:**
- Interactive dashboard filters (not API export)
- Or direct database access
- Or a custom report from the Product Intelligence team

---

## 📊 Summary

**Question:** Which customers have adopted Offer Business Process?

**Answer:** This data exists in Workday's systems but **cannot be exported via the Tableau MCP API**. The views I can query show aggregated data (total features per customer) not feature-by-feature detail.

**Best next step:** Use the Tableau dashboard directly (Option 1) or ask the Product Intelligence team for a customer list (Option 3).

---

Would you like me to:
1. Draft a Slack message to the Product Intelligence team?
2. Help you analyze the 7,100 customer dataset I have (for regional/industry insights)?
3. Try querying a different dashboard that might have this data?
