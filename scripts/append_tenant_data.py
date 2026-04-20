import csv
import json

tenant_usage = {}
with open('/Users/david.denham/product-manager-agent/docs/analytics/data/tenant-agency-types-usage.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        tenant = row['tenant_n']
        date = row['wd_event_date']
        submissions = int(row['submissions'])
        
        if tenant not in tenant_usage:
            tenant_usage[tenant] = {'tenant': tenant, 'mar_18': 0, 'apr_16': 0, 'total': 0}
            
        if date == '2026-03-18':
            tenant_usage[tenant]['mar_18'] += submissions
        elif date == '2026-04-16':
            tenant_usage[tenant]['apr_16'] += submissions
            
        tenant_usage[tenant]['total'] += submissions

final_data = list(tenant_usage.values())
final_data.sort(key=lambda x: x['total'], reverse=True)

ts_code = "\nexport interface TenantUsage {\n  tenant: string;\n  mar_18: number;\n  apr_16: number;\n  total: number;\n}\n\nexport const TENANT_USAGE_DATA: TenantUsage[] = " + json.dumps(final_data, indent=2) + ";\n"

with open('/Users/david.denham/product-manager-agent/design/data-view-dashboard.ts', 'a') as f:
    f.write(ts_code)

print("Successfully appended TENANT_USAGE_DATA to data-view-dashboard.ts")
