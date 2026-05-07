# Tableau MCP: What Actually Works

## TL;DR

✅ **Works**: CSV exports from published dashboard views (`get-view-data`)  
❌ **Blocked**: Custom VizQL queries against data sources (`query-datasource`)

## The Situation

**VizQL Data Service is disabled** on Workday's Tableau server for load management, which means:

### What You CAN Do

**Export data from published views** using `get-view-data`:
- Get whatever data the dashboard already shows
- Limited to the aggregations/filters built into the view
- Example: "Presales Product Gaps" view shows monthly opportunity counts (which I successfully retrieved)

**Get metadata** about workbooks and views:
- List all workbooks/views
- Get view details, descriptions, tags
- See data source names

### What You CANNOT Do

**Query data sources directly** with custom SQL or filters:
- Can't get row-level opportunity details
- Can't apply custom filters beyond what's in the view
- Can't join across data sources
- Can't create custom aggregations

## Why This Matters for Your Question

You asked for "the latest 3 opportunities" but:
- The dashboard view only shows **aggregated monthly counts** (# of opportunities per month)
- It doesn't expose individual opportunity records
- VizQL being disabled means I can't query the underlying data source for those details

## The Redshift Bypass Solution

This is what **Akash mentioned in Slack** - query the **Tableau public views in Redshift** directly:

### How It Works

1. **Tableau publishes data** → Redshift creates **public views** with the same data
2. **Query Redshift directly** → Bypass Tableau entirely
3. **Get row-level data** → Individual opportunities, not just aggregates

### Current Status

❌ **Redshift MCP not working yet** because:
- It's installed locally (`~/mcp-servers/redshift-mcp-server/`)
- But requires AWS/Okta authentication setup
- Error: "The config profile (okta2aws) could not be found"

### To Get Your 3 Latest Opportunities

**Option 1: Fix Redshift MCP (recommended)**
1. Set up AWS CLI and okta2aws
2. Run `okta2aws --profile okta2aws` to authenticate
3. Restart Cursor
4. Query Redshift for: `SELECT * FROM recruiting_gaps ORDER BY created_date DESC LIMIT 3`

**Option 2: Manual Redshift query**
If you have database access, use DBeaver or psql:
```sql
-- Find the table name first
SELECT tablename FROM pg_tables WHERE schemaname = 'tableau_public';

-- Then query it
SELECT opportunity_id, opportunity_name, gap_description, created_date
FROM tableau_public.presales_product_gaps
ORDER BY created_date DESC
LIMIT 3;
```

**Option 3: Ask the team**
Message **@akash.majumder** in Slack:
> "Can you tell me which Redshift schema/table has the presales product gaps data? I need to query individual opportunity records, not just the monthly aggregates."

## Summary

- **Tableau MCP**: Works for pre-built view exports, blocked for custom queries
- **Redshift MCP**: Needs AWS auth setup, then you can query raw data
- **Your use case**: Needs Redshift (or manual DB access) to get individual opportunity details

---

Let me know if you want help setting up the AWS authentication for the Redshift MCP!
