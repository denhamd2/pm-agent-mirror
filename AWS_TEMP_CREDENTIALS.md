# Get AWS Credentials from Your Browser Session

## The Problem

You have AWS Console access (web) but not SSO access (CLI). This means you need to manually copy temporary credentials.

## Solution: Copy Credentials from AWS Console

### Step 1: Get Your Credentials

1. In your **AWS Console** (where you're logged in)
2. Click the **dropdown arrow** next to your name in top right: `denhamd2 (5743-9351-2202)`
3. Look for one of these options:
   - **"Command line or programmatic access"**
   - **"Security Credentials"**
   - **"Get AWS CLI credentials"**
   - **"Copy credentials"**

4. You should see something like:

```
Option 1: Set AWS environment variables (for current command line session only)

export AWS_ACCESS_KEY_ID="ASIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_SESSION_TOKEN="..."
```

### Step 2: Save to AWS Credentials File

Copy those three export commands, then run:

```bash
mkdir -p ~/.aws
cat > ~/.aws/credentials << 'EOF'
[okta2aws]
aws_access_key_id = ASIA...YOUR_KEY_HERE...
aws_secret_access_key = ...YOUR_SECRET_HERE...
aws_session_token = ...YOUR_TOKEN_HERE...
EOF
```

(Replace with your actual values - remove the `export` and `=` signs, use the format above)

Also create a config file:

```bash
cat > ~/.aws/config << 'EOF'
[profile okta2aws]
region = us-west-2
output = json
EOF
```

### Step 3: Test It

```bash
export PATH="$HOME/Library/Python/3.13/bin:$PATH"
aws sts get-caller-identity --profile okta2aws
```

---

## Alternative: Screenshot & I'll Help

If you can't find the credentials option:

1. Take a screenshot of your AWS Console
2. Click the dropdown next to your name (`denhamd2`)
3. Show me what options you see

I'll tell you exactly where to find the credentials.

---

## Important Note

These credentials are **temporary** (expire in 1-12 hours). When they expire:
- Get new ones from the Console (same steps)
- Or request permanent SSO access from your AWS admin

For now, let's just get it working so you can query Redshift!

---

## Where Are You?

Let me know:
1. ✅ "Found the credentials option" → Then follow Step 2
2. ❌ "Can't find it" → Share what you see in the dropdown
3. 🆘 "Need help" → Take a screenshot of the Console
