# AWS SSO Configuration - Step by Step

## Status: AWS CLI Installed ✅

AWS CLI version: 1.44.77

## Next: Configure AWS SSO

You need to run this command and follow the prompts:

```bash
aws configure sso
```

### What You'll Be Asked:

#### 1. SSO session name
**What to enter**: `workday`

#### 2. SSO start URL
**You need to find this.** Two ways:

**Option A: From AWS Console**
1. In your AWS Console (where you're logged in), look for:
   - Top right corner → Your username (denhamd2)
   - Click it → Look for "SSO" or "Start URL" in the dropdown
   - Or search the page for "SSO" or "start URL"

**Option B: From Your Team**
Message in Slack:
```
Quick question: What's the AWS SSO start URL for Workday?

I'm setting up AWS CLI for Redshift access.
```

**Common formats**:
- `https://workday.awsapps.com/start`
- `https://d-XXXXXXXXXX.awsapps.com/start`
- `https://COMPANY.awsapps.com/start`

#### 3. SSO Region
**What to enter**: `eu-north-1` (since you're in Stockholm)

#### 4. SSO registration scopes
**What to enter**: Just press **Enter** (use default `sso:account:access`)

**Then**: A browser window will open. Click "Allow" to authorize AWS CLI.

#### 5. CLI default client Region
**What to enter**: `us-west-2` (where the Redshift data is)

#### 6. CLI default output format
**What to enter**: `json`

#### 7. CLI profile name
**What to enter**: `okta2aws`

## After Configuration

Test it works:

```bash
export PATH="$HOME/Library/Python/3.13/bin:$PATH"
aws sts get-caller-identity --profile okta2aws
```

You should see your AWS account info.

## If You Get Stuck

**Can't find SSO start URL?**
- Ask your team in Slack
- Or try going to: https://workday.awsapps.com/start

**Browser doesn't open?**
- Copy the URL from terminal and paste in browser manually

**"Access denied" error?**
- You might not have Redshift permissions yet
- Continue anyway - we'll test after

---

## I'll Wait Here

Once you run `aws configure sso` and complete the prompts, come back and tell me:
- ✅ "Done" (if it worked)
- ❌ "Stuck" + error message (if you hit issues)

Then I'll test the Redshift connection for you.
