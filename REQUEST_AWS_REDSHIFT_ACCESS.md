# How to Request AWS and Redshift Access at Workday

## The Problem

You don't have AWS in your Okta portal, which means:
- ❌ No AWS access at all
- ❌ Can't use okta2aws
- ❌ Can't query Redshift directly

## The Solution: Request Access via ServiceNow

According to the Redshift MCP documentation, Workday employees need to:

### Step 1: Request AWS Access

**First**, you need AWS access added to your Okta:

1. Go to your **Okta portal** (where you see all your Workday apps)
2. If "Amazon Web Services" isn't there, you need to request it
3. Contact your manager or IT support to get AWS added to your account
4. Or check if there's a self-service request form in your HR/IT portal

### Step 2: Request Redshift Access

**After** you have AWS access, request Redshift specifically:

**ServiceNow Link**: [Request Redshift Access](https://workday.service-now.com/esc?id=sc_cat_item&sys_id=4fddcbd31be67810ef8355351a4bcbc7&table=sc_cat_item&searchTerm=redshift%20access)

In your request, specify:
- **What you need**: Read access to Tableau public views in Redshift
- **Why**: "Need to query presales product gap data for PMF analysis. Tableau VizQL is disabled, need direct Redshift access to underlying data."
- **Which clusters**: Ask for access to the cluster that has Tableau data
- **Database permissions**: Read-only access to `tableau_public` schema (or similar)

## Who to Ask for Help

Based on the Slack thread you shared, **@akash.majumder** is the expert on this. Message him:

### Suggested Slack Message

```
Hey @akash.majumder,

I'm trying to query presales product gap data from Tableau, but VizQL is disabled. You mentioned using Redshift as a workaround to query the Tableau public views directly.

I don't have AWS access in my Okta portal yet. Can you help me with:

1. How to request AWS access for my role (Product Manager)?
2. Which Redshift cluster has the Tableau presales data?
3. What schema/table name should I request access to?

Context: I need row-level opportunity data (latest 3 opportunities), not just the monthly aggregates that the Tableau dashboard shows.

Thanks!
```

## Alternative: Ask Someone Who Has Access

While you wait for access, you could ask a colleague who already has Redshift access to run the query for you:

**Query to get latest 3 opportunities:**
```sql
-- Find the table first
SELECT tablename 
FROM pg_tables 
WHERE schemaname LIKE '%tableau%' 
  AND tablename LIKE '%presales%gap%'
LIMIT 10;

-- Then query it (adjust table name based on results above)
SELECT 
    opportunity_id,
    opportunity_name,
    gap_description,
    created_date,
    account_name,
    region
FROM tableau_public.presales_product_gaps  -- adjust schema/table name
ORDER BY created_date DESC
LIMIT 3;
```

## What You Can Do Right Now

1. **Message @akash.majumder** with the template above
2. **Check with your manager** if Product Managers typically have AWS access
3. **Ask in your team Slack channel**: "Does anyone have Redshift access and can run a quick query for me?"
4. **Submit the ServiceNow ticket** (if you can find it without AWS access first)

## Expected Timeline

- AWS access request: Usually 1-3 business days
- Redshift access request: Usually 1-5 business days (after AWS access is approved)
- Total: ~1 week

## Immediate Workaround

For your current question ("what are the latest 3 opportunities?"), the fastest path is:

1. **Ask someone with access** to run the query for you
2. Or **ask the Presales team** directly - they likely know the latest gaps
3. Or **check the Tableau dashboard manually** and click into individual records if the dashboard allows drill-down

---

**Bottom line**: You need to request AWS access first before any of the Redshift MCP setup will work. Start with messaging @akash.majumder - he'll know the exact process for your organization.
