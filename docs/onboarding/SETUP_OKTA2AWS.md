# Setting Up okta2aws for Redshift MCP

## What You Need to Do

The Redshift MCP needs `okta2aws` to authenticate to AWS through Workday's Okta. Here's how to set it up:

## Step 1: Install okta2aws

### Option A: Using Homebrew (Recommended for Mac)

```bash
brew tap okta/okta
brew install okta2aws
```

### Option B: Using pip

```bash
pip install okta2aws
```

### Option C: Using pipx (isolated installation)

```bash
pipx install okta2aws
```

## Step 2: Configure okta2aws

Run the configuration wizard:

```bash
okta2aws configure
```

You'll be prompted for:

1. **Okta Organization URL**: This is your Workday Okta URL
   - Likely: `https://workday.okta.com` or `https://workday.oktapreview.com`
   - You can find this from your Workday SSO login page

2. **Okta Username**: Your Workday email (e.g., `david.denham@workday.com`)

3. **Okta Application ID**: The AWS application ID in Okta
   - You'll need to get this from Workday IT or your AWS admin
   - It's the ID of the "Amazon Web Services" app in your Okta dashboard

4. **AWS Profile Name**: Use `okta2aws` (this matches our Redshift MCP config)

5. **AWS Region**: Use `us-west-2` (this matches our Redshift MCP config)

## Step 3: Test the Authentication

After configuration, test it works:

```bash
okta2aws login --profile okta2aws
```

You should:
1. See a browser window open for Okta authentication
2. Log in with your Workday credentials + MFA
3. See "Successfully authenticated" in the terminal

Verify it worked:

```bash
AWS_PROFILE=okta2aws aws sts get-caller-identity
```

You should see your AWS account details.

## Step 4: Restart Cursor

Once `okta2aws` is working:

1. Completely quit Cursor (Cmd+Q)
2. Reopen Cursor
3. The Redshift MCP should now connect automatically

## Step 5: Test the Redshift MCP

In Cursor chat, try:

```
List available Redshift clusters
```

If it works, you should see a list of clusters!

## Troubleshooting

### "okta2aws not found"
- Make sure it's installed: `which okta2aws`
- If using pip/pipx, ensure the installation directory is in your PATH

### "Unable to authenticate"
- Double-check your Okta org URL
- Verify your Workday email is correct
- Make sure MFA is working on your account

### "No AWS application found"
- You need the Okta Application ID for AWS
- Ask your AWS admin or check the Workday Okta portal
- Look for "Amazon Web Services" in your Okta dashboard apps

### Credentials expire
- `okta2aws` credentials are temporary (usually 1-12 hours)
- Re-run `okta2aws login --profile okta2aws` when they expire
- The Redshift MCP wrapper should auto-refresh when started

## Alternative: Ask Your Team

If you're stuck, message in Slack:

> "@akash.majumder I'm trying to set up the Redshift MCP to query presales gap data. I've installed the MCP but need help with the okta2aws authentication. Can you point me to internal docs or help with the Okta Application ID?"

Or ask your team lead for the Workday-specific `okta2aws` setup instructions - there might be internal documentation.

---

**Current Status**: You don't have `okta2aws` installed yet. Start with Step 1 above!
